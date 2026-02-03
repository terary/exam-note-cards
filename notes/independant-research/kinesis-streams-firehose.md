## Research Kinesis Streams Firehose


### Odd Tidbits
To understand the record size restrictions (1mb/s, 4mb/s, 10mb/s - whatever).  Need to look at when will something more than 1MB record cause a problem.  Most services can handle 1mb record size, only some can handle larger record size.

Envision:
- if you have data 1mb record .... x number of records per second - will that work for everything?
    - Will the record size be too big for the service
- if you have 4mb/s what services can handle it?    


### More tidbits

Great question — and your intuition is correct.

Kinesis Firehose is **not** an “event reaction” system. It is an **event collection and landing** system.

When people say “Log & Event Ingestion” for Firehose, they really mean:

> *Ingest events for storage and analytics, not for immediate behavioral reaction.*

Because of buffering (by time and size), Firehose is optimized for:

* Throughput
* Cost efficiency
* Reliable delivery
* Format conversion (JSON → Parquet, compression, partitioning)

—not for low-latency response.

So there are two very different meanings of “event”:

### 1. Reactive Events (Operational / Behavioral)

Examples:

* User clicks “Buy”
* Fraud signal
* Sensor crosses a threshold
* “User needs new page now”

These require:

* Millisecond to sub-second latency
* Fan-out to multiple consumers
* Exactly-once or ordered processing
* Immediate side effects

**Firehose is wrong for this.**
You would use:

* Kinesis Streams
* Kafka / MSK
* SNS + SQS
* EventBridge

### 2. Analytical Events (Observational / Historical)

Examples:

* Clickstream
* API access logs
* UI interaction traces
* Model inference logs
* IoT telemetry for trend analysis

These are:

* High volume
* Append-only
* Rarely reacted to individually
* Queried in aggregate
* Used for ML training, dashboards, audits

Here “event” means:

> “A fact that happened,” not “a trigger that must cause action.”

For this class, **1–60 seconds of buffering is completely acceptable**, because:

* You are not changing system behavior in response
* You are building datasets
* You are doing observability, analytics, ML, forensics

So when AWS says:

> “Log & Event Ingestion with Firehose”

They really mean:

> “Continuously land time-ordered facts into storage and analytics systems.”

### Where your earlier architecture fits

You described:

> One large backend listener, fabric-driven, AI-powered, reacting to user intent.

That is a **reactive event system**.

So the correct split is:

```
User Action
   |
   v
Kinesis Streams / Kafka   ---> real-time processing, AI, state changes
   |
   v
Firehose                 ---> durable landing in S3 / Redshift / OpenSearch
```

Streams = nervous system
Firehose = bloodstream + liver (bulk transport + storage)

Firehose is never the brain, and never the reflex.


What are the starting points of Firehose? - `Trim Horizon`, `at sequence number`, `after sequence number`, `at timestamp`
`trim horizon` means what? - The first (earliest) event within the stream/log.