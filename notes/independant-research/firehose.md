# Fire host research notes

This means:
- Firehose can assume this role (via sts:AssumeRole)
- The role grants permissions to:
    - Read from Kinesis Stream (kinesis:DescribeStream, kinesis:GetRecords, etc.)
    - Write to S3 (s3:PutObject, etc.)
    - Write CloudWatch logs (logs:PutLogEvents)

When you create the Firehose delivery stream, you specify this role ARN in S3DestinationConfiguration.RoleARN. Firehose then uses that role to access S3 and Kinesis.

This is standard AWS practice: services assume roles to access other services on your behalf.

__Therefore when creating Firehose you must create role or use pre-created role__


## 1. Destination Type - Multiple Destinations?

Firehose supports multiple destination types (S3, Redshift, Elasticsearch, Splunk, etc.), but each delivery stream has one destination type. To send to multiple destinations:
- Create multiple delivery streams (one per destination)
- Each can read from the same Kinesis Stream source

## 2. Single Source

Yes—each Firehose delivery stream has one source:
- Direct PUT (no source stream)
- Kinesis Stream (what you have)
- MSK (Managed Streaming for Apache Kafka)

## 3. Data Transformation

Optional AWS Lambda transformation that runs before the destination:
- Transform/filter/enrich records
- Compress data
- Add custom processing

Not needed for basic S3 delivery.

## 4. CloudWatch Error Logging

CloudWatch logging is optional, but recommended:
- Free tier eligible (first 10 custom metrics, 5GB logs ingestion)
- Useful for debugging delivery failures
- No cost reason to skip it in a learning project

Should be enabled for debugging.

## 5. Kafka vs Kinesis Stream Source

Yes, swapping requires a different delivery stream:
- Current: `DeliveryStreamType: KinesisStreamAsSource`
- Kafka: `DeliveryStreamType: MSKAsSource` (different configuration)

You can’t swap source types on an existing stream—create a new one with the Kafka source.

Should I enable CloudWatch logging in the template?


### Sources
Firehose supports three source types:
-Direct PUT — applications send data directly to Firehose (no source stream)
    DeliveryStreamType: DirectPut
    Your app calls PutRecord/PutRecordBatch on Firehose directly
-Kinesis Data Streams — what you're using
    DeliveryStreamType: KinesisStreamAsSource
    Firehose reads from a Kinesis Stream
- MSK (Managed Streaming for Apache Kafka)
    DeliveryStreamType: MSKAsSource
    Firehose reads from an MSK cluster


Those are the three source types. Direct PUT is the simplest—no Kinesis Stream needed, but you lose the stream’s buffering and replay capabilities.
Your current setup uses Kinesis Streams as the source, which gives you:
Buffering/durability from the stream
Multiple consumers can read from the same stream
Replay capability
So yes, there are three options, but Direct PUT and MSK require different delivery stream configurations.or


Question: How many sources does Firehouse support, how many destinations.
Question: how many targets does firehose support?

## MSK vs Kinesis Streams - Side-by-Side Comparison

| Feature | Kinesis Streams | MSK (Managed Kafka) |
|---------|------------------|---------------------|
| **Type** | AWS-native service | Managed Apache Kafka |
| **Open Source** | No (AWS proprietary) | Yes (Apache Kafka) |
| **Setup Complexity** | Simple (few clicks) | Moderate (cluster config) |
| **Learning Curve** | Easier | Steeper (Kafka concepts) |
| **Throughput** | High (scales automatically) | Very high (more control) |
| **Retention** | 1-365 days | Configurable (unlimited with storage) |
| **Partitioning** | Automatic (shards) | Manual control (topics/partitions) |
| **Consumers** | Multiple (each tracks position) | Multiple (consumer groups) |
| **Replay** | Yes (within retention) | Yes (offset-based) |
| **Multi-Region** | Limited | Better support |
| **Ecosystem** | AWS-focused | Large (Kafka Connect, Schema Registry, etc.) |
| **Cost** | Pay per shard/hour + data | Pay per broker/hour + storage |
| **Vendor Lock-in** | High (AWS only) | Low (standard Kafka) |
| **Integration** | Native AWS services | Works with AWS + external tools |
| **Scaling** | Auto (on-demand) or manual | Manual (add brokers) |
| **Monitoring** | CloudWatch | CloudWatch + Kafka metrics |

## When to Choose Kinesis Streams:
- AWS-only architecture
- Want simplicity and quick setup
- Need automatic scaling
- Learning AWS services
- Don't need Kafka-specific features
- Prefer fully managed with less operational work

## When to Choose MSK:
- Need standard Kafka (portability, ecosystem)
- Using Kafka Connect, Schema Registry, etc.
- Multi-cloud or hybrid architecture
- Team already knows Kafka
- Need fine-grained control over partitioning
- Want to avoid vendor lock-in
- Integrating with non-AWS Kafka systems

## For Your Learning Project:
Since you need to learn Kafka/MSK:
- MSK gives you Kafka experience
- More complex but teaches real-world Kafka
- Works with Firehose (can swap source later)
- Industry-standard knowledge

Kinesis Streams is simpler, but MSK aligns with your learning goal.