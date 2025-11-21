# Section 2: Data Ingestion and Storage

### 0006

Intro

### 0007

3 Types of data formats (? not sure the word)

- Structure (database or similar)
  -- CSV
  -- SQL Table
  -- spreadsheet

- Unstructured, (text documents etc)
  **hint** will require preprocessing
  -- text
  -- video/audio
  -- image
  -- emails

- Semi Structured (JSON, others)
**hint** structure but structure may be inconsistent, maybe including a schema makes it structure
-- json
-- xml
-- yaml
-- log files **hint**
-- email header records **hint**
<!-- tmc

Need more examples of different format, where does csv fall? semi/structured? unstructured
-->

### 0008 Properties of Data

- Velocity
- Volume
- Variety

- Volume
  Size or amount. How do we store it? How do we access it? GB? TB? PB? What are the "preprocess" concerns? Or concerned about preprocessing.

- Velocity
  How fast? Batch Process? Realtime? Near Realtime?
  Examples: IoT, sensor data, high frequency trades

- Variety
  Structured/Unstructured. Source: API, Stream, Human input, electronic devices (maybe mobile devices)

### 0009 Data-warehouse vs Data-Lake

#### Warehouse

- Is considered legacy
- Designed for complete query
- Uses "Star" or "Snowflake" structured
- Optimized to read Headers
- Examples:
  -- Redshift
  -- Google Big Data Query
  -- Azure SQL Data warehouse

#### Data-lake

- Holds vast amounts of data (can't read my hand writing)
- No preprocess
- Support: batch, real-time, stream, etc
- Can be queried for transform or explore purposes
- Examples:
  -- S3
  -- Azure data-load store (can't read hand writing)
  -- Hadoop

  \*\* Applied structure happens AFTER the fact **hint** (Athena, Glue)
  \*\* Stored as is, raw data
  ###################################################3

#### Schema

- Data warehouse -> Schema on write. We transform the data to meet the schema requirements **ETL**

- Data Lake -> Schema on Read, Extract then transform **ELT**

#### Data Type

- D. Warehouse for structured data
- D. Lake for un/structured and semi structure

#### Agility

- D. Warehouse less Agile (strict, predefined schema)
- D. Lake more agile

#### Processing

- D. Warehouse -> ETL
- D. Lake -> ELT

#### Costs

- D. Warehouse -> more expensive
- D. Lake ->less expensive

#### D. Lake house (9:34)

Best of both worlds. Also it can support ACID

### 0010 Data Mesh

It's a term to understand and not a topology. Individual Tenant own their own data (within a domain). The tenant manages the data, collection, transformation, augmentation, whatever.

The tenant may allow access to the data 'data as a service'. Also, think Government data pools(?or not?).

Data is managed/govern by "domain", aka: domain based data management, with centralized standards.

Federated governance with centralized standards

Self service tooling and infrastructure (Glue)

Data-mesh paradigm, manage data, secure, allow federated access, who owns it?

**THIS IS A CONCEPT** not a real thing

### 0011 ETL

Extract, Transform, Load

Extract:

- fetch (API, disk, etc)
- data integrity
- velocity: real-time, streaming, batch

Transform:

- Convert from source to target
- Clean, enrich, aggregate, calculation
- Encoding/Decoding
- missing data

Load:

- move to target
- velocity effects load strategy(batch, realtime, streaming)
- Integrity, error detection (data format/error detection)

#### Pipeline Management

- Must be reliable - use Glue _EXAM_ maybe
- Orchestration Services
  -- Event Bridge
  -- Step Functions
  -- Glue Workflow
  -- AWS Managed Workflow / Apache Airflow (MWAA)

### 0012 Common Data Sources

- JDBC
  -- java data connectivity
  -- Platform Independent
  -- Language Dependant (I assume Java)

- ODBC
- Open Database connectivity
- Platform Dependent (drivers written in/for many languages)
- Language Independent

- Raw Logs
  -- Api
  -- Stream

#### Common Data Formats

- CSV, tabular delimited, human readable
- JSON, semi/structured, human readable, flexible structure, **Mongo**
- AVRO, Binary, stores data with schema, appears data and schema are flexible. When to use: big data, real time data, schema evolution, efficient serialization. systems: Kafka, Spark, Flink, Hadoop
- Parquet, Colum storage format optimized for analysis. Efficient de/compression. When to use Analyzing Large dataset. Reading column instead of record, storing on distributed systems where IO optimized (???), Systems Hadoop, Spark, Hive, Impala, Redshift Spectrum

#############################################################

### 0013 S3

Uses include:

- Backup
- Recovery
- Storage
- Static website
- Archive
- Hybrid Storage (OnPrem and S3)
- App Hosting
- Media Hosting
- Big Data and Analytics

- "Bucket" Main container, "Item" the things (files) in the container.
- Bucket MUST BE globally unique
- Buckets are defined regionally but it appears like a global service
- "Object Key" - full path, example s3://the-bucket-name/the/path/to/item.ext
- "/the/path/to/" is referred to as "prefix"
- Same as before, there are no directories but the UI allows "magic" to appear like they're are folder
- "Object Key" is prefix + object name, "/the/path/to/item.ext"
- "Object Value" is the contents of the file.
- MAX FILE SIZE = 5TB
- Files greater than 5GB must use multi-part uploads
- meta-data, key=value pairs can be set by system or user (_cool_)
- tags up to 10 only supported universally (not sure what that means)
- version / versionId, indicates version enabled buckets (item)

#### 0014 (S3 Hands on)

- Two types of buckets, "general purpose" and "directory". Directories are out of scope for exam _note_ Not sure what 'directory' is, but I don't think its the same as folder. May not be on exam but good idea to have an idea of the differences
- _note_ I am not sure but probably want to figure out. If buckets are global resources defined in regionally, when we look at the bucket list - do we need to change the regional settings (need to figure this out, not exam but a something everybody should know)
- _note_ I would like to know why we are able to create directories. I think I played with this and a directory is a non-item, how do we create it? What can we do with it? _todo_

#### 0015 (S3 Security)

- User based (IAM)
- Resource Based (new) - cross account and other _note_ my notes say new but I don't think it is new. Maybe want to understand better what is 'new'?
- Object ACL - can be disabled
- Bucket ACL - can be disabled - _todo_ want to verify ACL are applicable to both Bucket and Object
- This age-old question. "IAM principle" can access IFF:= (IAM permission allow) OR (Resource permission allow) AND there are no deny. "Principle" user (maybe also service), I ask "not owner". _todo_ want to understand the differences here. Owner can always access bucket? or owner can always assign permissions? What is 'principle' User/Service? What is "public" (still non-owner, and there can be only one owner? can group own? and therefore anybody in group can access without 'public')

- Encryption of an object
-- How do we enforce this? _note_, I think it is a "resource" policy?
<!-- tmc 
We want the actual policy in json inserted here to see itd

-->

- Resource Police include elements: `resource`, `effect`, `action`
- Resource policies can be used to enforce encryption, cross-account access, etc.

```
We want to be very clear what is the difference between resource policy and use policy.
I believe 'user' policy will have resource and resource policy will have principle.
- user policy
- resource policy
- role (service) policies

What are the difference?
```

- Service Policy - role policy
- `x-account` policy for users of different account. Does not go into detail `probably want to see in action`
- "Block Public Access" to prevent data leaks. As I recall AWS used to say this was legacy but it now sounds like it has been revitalized as data leak prevention. _when 'on'_ it will never be public (what is public again?), This serves as a 'master override'.

### 0016 (Hands on)

- uncheck public access
- setting resource 'use /_' or 'prefix/_' of bucket policy to assume list of items

### 0017 (S3 Versioning)

- It is enabled at the bucket level _exam_
- Two of the same key will overwrite but will also increment version (_note_ is this a number? my notes say 'increment' but I think that may not be accurate)
- is consider "Best Practices"
  -- prevents unintentional overwrite
  -- Easy to role-back

- versionId
  -- when null bucket as has versioning enabled but the item was likely created before the policy was set

```
  - What is versionId number or hash?
  - When 'updating' an item to we include the versionId or rely on overwrite?
  - When deleting item do we delete all version? is there an option to set to indicates versionId:*,
  - Is it even called `versionId`

```

#### 0018 (hands on)

I don't have any notes other to indicate that it was watched

#### 0019 S3 Replication

Two flavors

- Cross Region Replication (CRR) (x-region)
- Same Region Replication (SRR)

Tidbits:

- Replication is Async
- Requires versioning _note_
- Can be cross account (x-account)
- Buckets must have proper IAM

Use Cases:

- CRR: compliance, lower latency, x-account, replication
- SRR: lag aggregation (_TMC_ what is that), good for prod/dev replication

- ONLY WORKS FOR NEW ITEMS - to retro replicate the older items will need to do batch replace

More tidbits:

- Delete marker replication, delete with/version do not replication (avoids malicious activity) \*tmc not sure what trying to be said here.

- No bucket cloning/chaining A->B->C (no) A-> B ^ A-> C (ok)

#### 0021 (S3 Hands on)

_tmc_ I have some note here that I can't make sense, "default delete marker not replicated MUST BE ... ???
Need to research what happens delete markers and replication
_tmc_

#### 0022 S3 Storage Classes

Storage Classes:

- Standard - General Purpose (GP)
- Standard Infrequent Access - (IF)
- OneZone - infrequent Access - (1ZIF)
- Glacier Instant Retrieval (GIR)
- Glacier Flexible Retrieval (GFR)
- Glacier Deep Archive (G-Arch)

Can move objects through different classes manually or using Life Cycle Configuration

"Durability" probability of loss. 11-9's is the best. **Same for all classes**

"Availability" depends on storage class, how rapidly available an item is (_tmc_ not sure here)

S3 standard, 4-9 99.99%, or 53 minutes a year. Hence some failure is expected very small. (_tmc_ not sure what is 4-9 and what is 11-9)

<u>Standard (GP) (99.99)</u>

- 99.99 availability
- used for frequent access
- low latency
- tolerant of 2 concurrent failures. (Facility Failure at AWS)
- Use cases:
  - big data analysis
  - reliable "gaming"
  - low latency
  - content distribution

<u>Infrequent Access (S3-IA, 99.9)</u>

- For less frequent access (supports rapid access)
- low cost
- Cost on retrieve
- 99.9% Availability
- Best for backup/restore

<u>1 Zone Infrequent Access (S3-1Z, 99.95)</u>

- High durability **in a single AZ**, if something happens to the AZ all data is lost
- Availability 99.5
- Best for secondary backup or content that can be easily created

<u>Glacier</u>

- Low cost best for Archive and Backup
- pricing: storage + retrieval
- Instant Retrieval (milliseconds)
- minimal storage time is 90 days

**I think** retrieval time is depending on storage class and that is determined by spend (they're all related, I think)

<u>Glacier Flex Retrieval</u>

- Expedited Retrieval (1-5 minutes)
- Standard retrieval (3-5 hours)
- Bulk retrieval (5-12 hours)
- min storage - 90 days

<u>Glacier Deep freeze</u>

- standard retrieval (12 hours)
- bulk 48 hours
- min storage 180 day

#### Intelligent Tiering

- Allows to move between tiers (on demand, _tmc_ this is not clear to me)
- Small moving fee
- No retrieval fee
  - frequent access default
  - infrequent more than 30 days
  - archive instant access (90 days)
  - archive slower access _tmc_? (90-700 days)
  - deep 180-700+ days

> _tmc_ - need to understand how to set-up intelligent tiering

> _ tmc_ - need to look at retrieval times in terms of cost and delay (12 hour delay but only $0.00001/month??), all have minimal storage time?

> _tmc_ - quiz/question should mention/ask cost dimension, gb/retrieve/month what?

### 0023 Storage Tier Hands on

> no notes from lecture but I think I had questions

- can move from standard to intelligent tiering
- cost of retrieval, all tiers and intelligent tiering

### 0024 Life Cycle Rules

Object can be moved from Tier to Tier manually or with **Life Cycle Rules**.

**Transition Action**

- example: Move from tier to tier after 60 days
- example: after 6 months move to glacier

**Expiration Action**

- example: delete log after 365 days
- delete old version
- clean-up multi-part upload after 2 weeks (incomplete uploads)

**Rules** can be created for prefix or tags

S3 Analytics is how to gauge good rules for life time

### 0026 S3 Event Notification

S3:ObjectCreated, S3:ObjectRemoved, S3:ObjectRestored, S3:ObjectReplicated (probably many more).

Event triggers and can be sent to SNS, SQS, Can fan send EventBridge, Lambda

IAM Policy SQS Or Lambda Resource Policy, SNS Resource Policy

**Have to create policy to allow S3 to write to the services**

_tmc_ I need to better understand the point of the conversation. I think it just means that you have to allow access those resources (S3 can access SNS as example), I think

Take away, define resource access on target service (SNS, SQS, etc) **VERY IMPORTANT**

Event notification Target

- SNS, SQS, Lambda
- EventBridge -> 18 other services

Event Bridge

- Advanced filtering match meta data like: object size, file name, etc..
- EventBridge allows **replay** _tmc_ figure out what this means.

Notes say it appears it's either or, EventBridge or one of the other services _tmc_ want to verify this.
**ChatGPT** says there can be only one event per configuration but you can send the events to multiple services - I think through some band-aid.

### 0027 Events Notification (Hands On)

- send service (SNS, SQS, Lambda) or Event Bridge
- Can choose, PUT, POST, COPY, Multi-part, etc several events
- Assign resource policy on Service (SNS, EventBridge)

### 0028 S3 Performance

- Autoscale, latency 100-200ms for "first byte"
  > _tmc_ need research, what do they mean "autoscale" for S3
- Up (theoretical Max) for prefix
  -- 3500 req/second PUT/COPY/POST/DELETE (write)
  -- 5500 req/second GET/HEAD (read)
  -- No limit to the number of prefix per buck

  \*S3 Performance is not measure by bucket but by prefix

Recall prefix s3/bucket-name/the/prefix/the-file.ext, the prefix is "the/prefix", Hence you can double throughput by using multiple prefix.

#### Optimizations (3:45)

- use multiple prefixes
- S3 Transfer acceleration, push to edge, edge push to target (supports multi part)
- Optimize Read "Byte Range Fetch"
  -- parallelize read
  -- higher fault tolerance
  -- Can be used for first byte only
  -- _tmc_ notes say "if you know the size of the header you can peek to get first header"

> _tmc_ Need to re-review "First byte, size of the header. What does that even mean.

### 0029 Encryption

- SSE-S3 -> Standard AWS Management (encrypted but no key specified, managed wholly on AWS)
- SSE-KMS -> AWS Key Management (Uses AWS Key Manager, client code specifies which key to use)
- SSE-C -> Customer Provided Key
- SSE Client Side -> client de/encrypt on there side and send/recv encrypted object

**SSE-S3**

- requires header `x-amz-server-side-encryption: "AES256"` _tmc_ says "enabled by default"

**SSE-KMS**

- Usage can be logged **cloudtrail** (good for audit/compliance)
- Requires header: `x-amz-server-side-encryption: "aws:kms"`

> _tmc_ how do we specify which key to use? I think there is a keyId some how?
> _tmc_ notes indicate the this encryption method may require further API calls, which may introduce latency and additional API calls

**SSE-C**

- Client manages key
- Key is sent in header with every request. AWS does not store this key
- **https only**
- Client provides same key for get/fetch

**Client Side Encryption**

- Client is responsible for de/encryption and sends/recv object encrypted.

**Inflight/in-transit\***

- SSL/TLS
- HTTP(S)
- aws recommends a bucket policy that requires. `aws:SecureTransport`

### 0030 - Encryption Hands on

- No notes taken

### 0031/0032 (tidbits?)

- SSE-S3 is default encryption. Can be forced with bucket policy
- **Bucket Policy** is evaluated before encryption policy. **EXAM** (probably)

### 0033 S3 Access Points

- Access Points serve as alias for bucket prefix (recall: bucket-name/the/prefix/file.ext)
- AP Policy look the same as S3 policy
- AP Can server as a level of different security **EXAM**, hence s3-> less restrictive s3.ap->more restrictive
  -- AP Security Policy can mean different security settings for different users/groups
- Each Access Point
  -- it's own DNS Name -> unique internet name
  -- its own policy
  -- Manages Security at scale (not sure what that means)

Notes has a diagram of two separate boxes as VPC or similar and indicates that EC2 instance may be able access the S3 bucket through network configuration.

S3 is not a VPC thing so I am not sure why we show that

> _tmc_ understand how AP can improve/enforce accessibility through VPC/Security configuration. Maybe the VPC has a gateway allowing EC2 to access AP,

### 0034 S3 Object Lambda

- Sits between Bucket and AP and acts as transformation layer. Hence you can have several AP (maybe) calling different lambda to transform data differently. Origin data remains unchanged but provides different "views".

### 0035 EBS

(Elastic Block Storage)

- EBS Volume - Network Volume. Data persists after instances are terminated
- Mostly One instance at a time (1:1), However, there are there are advanced technique to allow multiple instances, out of scope for this cours
- **Bound to one AZ**, can make snapshot and transport to other AZ
- Can be de/attached to instances, fault tolerance (instance goes down, data persists)
- Allocated in Size and/or IOPS (?), and **billed** for allocated, not used.
- **I think** size can be increased not decreased (relevant also for billing)
- _EXAM_ Delete on termination (think its a config option). It's common to pair EBS and instance such that once the instance is not longer needed, neither is the EBS
- Default Behavior:
  -- root drive (drv0) will auto delete, others do not (drv1). **THIS IS DEFAULT AND CAN BE OVERWRITTEN**, **EXAM** How to preserve root with EBS?

> _tmc_ Know EBS pricing dimensions

> _tmc_ Elastic Volume can not decrease size. I wonder if I have gotten EBS and EV confused on this matter

### 0036 EBS Hands One

- No notes

### 0037 Elastic Volume

- Can changes attributes **on the fly**, IOPS, volume type
- Can not decrease size

### 0038 Elastic File System (EFS)

"Managed Network File System"

- multiple EC2 Instance
- Multiple AZs
- Highly Available Highly scalable
- x3 times the cost of GP2
- Pay Per use/access - not allocated
- Use case include: Wordpress, Webserver, Data share
- **NFSv4.1 Protocol**
- not windows compatible (AMI), not sure what that means. I think only that is is not using windows readable format, but not clear why my notes say AMI
- Uses Security Groups (SG) to control Access
- KMS for encryption at rest
- POSIX file system, eg standard api, `ls`, `rm`, etc
- Automatically Scale, careful of cost. Charge by GP (not sure about pricing)
- 1000's of clients 10 GB+/s throughput
- Can grow to petabyte

> _tmc_ Know pricing dimensions

#### EFS Performance

- performance mode set at config time
- bust 1TB ~= 50MiB/s + busrt of 100MB/s
- Not sure 'provision set throughput re...' (notes not clear)
- Elastic - autoscale increase/decrease (for unpredictable workloads)
- Up to 3 GB/s write

#### EFS Storage Classes

Storage Tiers:

- Standard - (frequent use)
- infrequent access - cost to retrieve lower price to start
- archive - rarely access - few times a year, 50% cheaper
- implement life cycle policy to move files from tier to tier

Availability/Durability standard multi AZ, supports 1Z for dev work.

> Note, can use Life Cycle Policy on EFS

> _tmc_ know performance and burst

> _tmc_ better understand the availability/durability

### 0039 EFS Hands On

notes are not clear, something about see todo. Maybe watch again

### 0040 EFS vs Amazon EBS

#### EBS:

- 1 instance (exceptions out of scope for this course)
- attached to one AZ
- gp2 - IO Increase as does size increase (as IO allocation increase so does disk size allocation), `I am not sure what they  mean`
- gp3 - IO can increase independently of Disk Size
- To mitigate single AZ, can snapshot and transport to other AZ
- EBS backup uses IO - don't run backups during Peak Usage
- root filesystem is lost when instance is lost, can be configured differently

#### EFS

- mount 100's of AZs
- POSIX filesystem
- EFS cost more but can leverage Life Cycle events for tiered storage

> Remember EFS vs EBS vs Instance Storage

### 0041 FSx (Third Party FileSystem)

Supports:

- Windows
- Luster
- NetApp
- OpenZFS
  **EXAM** Know those four

#### Windows

- Fully managed Windows Share **EXAM**
- Supports NTFS and SMB
- Can move with EC2 (I think different EC2 can connect)
- ACLs
- User Quotas
- Support for Microsoft's Distributed File System (DFS)
- Scale up IOs of ??? 10's GB/s, Millions of IOPS, 1000's of Petabytes
- Storage Options: SDD/HDD
- Support Multiple AZ
- Use S3 for backups
- Can connect visa DirectConnect (aws thing) or VPN

> _tmc_ notes aren't clear about scalability of Windows FSx
> (2:37)

#### Luster

Linux + Cluster = Luster

- Parallel File System (large, very large)
- **Optimized for Machine Learning**
- Video Processing, Financial Models, Electrical Design Automation
- **High Performance Compute (HPC)**
- Scales 100's GB/s, Millions IOPS, **sub ms latency**
- SDD or HDD
- Seamless S3 Integration, can treat S3 as part of its own FS?
- On Premise or VPN/DirectConnect

Deploy Options:

- "Scratch":
  - temporary data not replicated
  - no backup
  - high performance, 6x faster, 200 MB/s per TB
  - \_\_Used for short term storage, temp file system
- "Persistent"
  - **Long term storage**
  - Replicated across AZ (I think this is performance reason more so than availability)
  - Replace failed file system within minutes

#### NetApp OnTap

"Managed ONTAP on AWS"
Features:

- Move running workloads
- compatible with:
  - Mac
  - Linux
  - VMWare
  - VMWare OnTAP
  - Windows
  - AWS EC2/EKS/ECS
  - **Broad Compatibility**
- Auto scale shrink/grow
- Snapshot low cost compression
- **Point In Time Clones for workload transfers**

**EXAM** may want to know 'when' to use this... "Suppose xyz, which is the best fit FX file system"

According to OpenAI

```
What ONTAP Is

ONTAP (originally “Operating System Technology for Advanced Performance”) is a unified storage OS that supports both file and block storage using:

NFS and SMB/CIFS (file protocols)

iSCSI, FCP, NVMe-oF (block protocols)

It’s used heavily in enterprise environments for high performance, scalability, and strong data protection.
```

#### OpenZFS

I don't fully understand. My notes say this uses same OS as NetApp/OnTAP, and this is common configuration

- Scales upt 1Million IOPS, **0.5ms Latency**
- Point in Time Clone
- Same OS as NetApp/OnTap

### 0042 FSx Hands ON

- Not notes other to say "windows authentication" - not sure maybe an example of using Windows NTFS

### 0043 Kinesis Data Stream **EXAM**

"Real Time"
There are data "producers" and "Consumers" and Kinesis Supports their interactions.
Pretty sure it's a one way relationship

```
| Real Time Data   |       |Producers |    |Consumers
===================        |==========|    |==========
| IoT              |       | App      |    | Application
| Click Stream     |  -->  | Kinesis  | -->| Lambda,  Firehose, etc
| Metrics          |       |
| Logs             |       |
```

**Producers** -> **Kinesis Streams** -> **Consumers**

- 365 days retention on stream
- Can be **replayed**
- **Data can not be deleted it MUST expire** _exam_
- up to 1MB message size but smaller payload is the standard
- **Order is Guaranteed** for data using **partitionId**
- **Encryption**: inflight https/ssl, at rest KMS
  > Not sure KMS, does that mean a key (keyId) must be provided?

SDK Libraries:

- **KPL** - Kinesis Producer Library
- **KCL** - Kinesis Client Library
- both optimized for standard operations (I imagine messages can be managed through API or similar but client libraries are best)

(2:39)

#### Capacity Modes:

**Provisioned Mode**:

- any number of shards
- each shard **inbound** 1mb/s or **1000 records per second**
- each shard **outbound** 2mb/s (didn't give limit in number of records poor notes or not applicable, not sure which).
- Scale Manually, increase/decrease any number of shards **capacity is measured in shards**
- **Cost per Shard provisioned**

**On Demand Mode**:

- provisioned automatically (autoscaled)
- Default capacity 4. 4MB/s (4000 records per second)
- Scales automatically based on observed throughput over past 30 days
- **Pay per stream per hour** and **data in and out**

> My notes say there is not mention of egress capacity

### 0044 Kinesis Hands On

> my notes say I need to practice but there are no other notes

### 0045 Amazon Firehose

- Collects data from producers and/or batches. **Then flushes batch/queue every so often**.
- Producers can be anything AND aws services
- collection, firehose can transform using Lambda. **Transforms at receiver**. Hence no batch body call 1 for each input record. The notes are unclear _tmc_ I think this means can not send in batch, in other words will always 'send' one record at a time.
- Batch sends accumulated records to [something] then sends.

- Producers can send (push) and Firehose can read some aws services. Hence a producer can be `push` or `pull`
- Can write failed data to S3 bucket

> Think Javascript watermark

```
See notes or other for Firehouse diagram involving elements
Producers
Aws services (many)
write-out consumers
```

- used to be called "Kinesis Firehose"
- Fully managed Service
  - Autoscale
  - Serverless
  - Pay what you use
- Near real time (because of the 'buffering' it does)
- Supports:

  - AWS Services:
    - Redshift
    - S3
    - OpenSearch
    - _tmc_ not clear but I believe 'others'
  - External Services
    - Splunk
    - Mongo
    - datadog
    - New Relic
    - Custom http
  - Custom HTTPS
  - **_tmc_ not clear this is 'receive data'? 'Push Data'**

- Input Formats Supported:

  - csv
  - json
  - parquet
  - avro
  - text
  - bin

- Output Format Supported:

  - parquet/ORC
  - compression gzip
  - snappy

- Custom transformers - use Lambda

|                     Kinesis                      |                   Fire Hose                   |
| :----------------------------------------------: | :-------------------------------------------: |
|              Stream Data Collection              | Loads streamed data to go to many destination |
| Produces and Consumers (probably have to write ) |                    &nbsp;                     |
|               Provision On Demand                |         Fully Managed (Auto Scaling)          |
|              Stored up to 365 days               |                  No Storage                   |
|                  Replay capable                  |                   no replay                   |
|                      &nbsp;                      |                Near Real time                 |

- Not clear to me the Kinesis is "Real Time" or "Near Real Time"

**EXAM** You will need to know the differences and when to use each (_tmc_)

### 0046 Kinesis Troubleshoot and Tuning

- Service Limits, throughput **exception**, different services have different limits. Different services can be **throttled**
- Shard Level Limits (_tmc_ ??)
- other operations have service limits, 5 or 10 calls per second
- shard partition distribution, send data evenly to shards
- larger producers can be batched
- stream returns 500 or 503, AwsKinesisException > 1%, retry (?? _tmc_ notes aren't clear)
- connection errors Flink -> Kinesis, VPC <-> VPC, Flink lacks resources (_tmc_ notes aren't clear)
- throttling errors
  - check hot shard
  - look for micro spike
  - try random[izing] partition key
  - exponential back-off
  - rate limit

#### Producer

- skipping records -> unhandled exception
- record same shard handled by more than one process
  - failover on processor
  - adjust failover (_tmc_ notes aren't clear)
  - handle shutdown method / Zombie

#### Consumer

(04:45)

- Read too slow,
  - Increase number of shards
  - MaxRecordPerCall may be too low
  - code is too slow
- getRecords() returns empty
  - normal and expected, try again
- Shard Iterator expired unexpectedly
  - more capacity on the underlying DynamoDB
- Record processor falling behind
  - increase returning (notes note clear _tmc_)
  - insufficient resources
  - Monitor wit get records

(04:45) - they mention API call that is too small for me to see _tmc_

### 0047 Kinesis/Analytics/Managed Service/Flink

Flink replaces something leaner, Kinesis + SQL (MSAF)
Flink is Managed/Serverless

### 0048 MSAF Hands On

No notes, but I mention it is not free. AWS has a lab that may be used.

### 0049 Kinesis Costs

- Serverless
  - Kinesis Process Unit (KPU) := 1kpu = 1vCPU + 4GB
  - IAM Permissions
  - schema discovery (_tmc_ what is this)

_TMC_ I need to research costs - my notes are great and probably the video/lecture wasn't great.

_EXAM_ Have to know billing/costs of Kinesis

### 0050 MSK

- AWS Managed Streaming for Kafka
  **EXAM** expect to know when to use: Kinesis vs Kafka MSK

- Kafka is expected to replace Kinesis
- MSK

  - fully managed - MSK creates and manges Kafka Broker and zoo-keep nodes (_tmc_ notes are n't clear here)
  - deploy in your VPC, multi-AZ (up to 3),
  - auto recovery from common failure
  - data stored on EBS
  - supported custom configuration
  - can support up to 10MB message (Kinesis only 1mb)

- Producers send data into Kafka **topic**, it will get replicated across few/all brokers. Consumers poll broker/topic for messages

- Can retain data indefinitely, (Kinesis only 365)

There is a diagram.

Configuration

- Choose vpc/subnet
- Choose number AZ (3 recommended)
- Choose number of brokers per AZ
- Choose disk size (1GB - 16TB)

Security - **WILL BE ON EXAM**

- Everything in-flight TLS, at rest EBS encryption
- Network (security groups)
- authentication (who can access), read/write topic. My notes say "Authentication" not "Authorization (_tmc_)
- Mutual TLS (AuthN) + Kafka ACL (AuthZ) (certificate)
- SASL/SCRAM (AuthN) + Kafka ACL (AuthZ) (password)
- IAM Access Control (AuthN + AuthZ) **BEST**

**EXAM** Kafka Security, Kafka ACL are managed from within the instance making it a poor choice.
_tmc_ My notes were really poor here plus it's security. It is worth re-watching the video to get a better understanding of the points made here.

Monitoring **EXAM**
_tmc_ notes are not very clear here, re watch video

- Cloudwatch Metrics
  - basic monitoring, cluster and broker
  - enhanced monitoring, ++ enhanced broker message
  - Topic Level metric
- Prometheus (Open Source Monitoring)
  - open port on cluster and broker and topic
  - set-up JMX export metrics on node exporter (cpu and disk metrics)
- Broker log delivery to
  - cloudwatch
  - s3
  - kinesis

**MSK Security On Exam**

### 0051 MSK Connect

- $0.11 per worker/hour
- deploy Kafka Connect to MSK via Plug-in
- Moves data from Kafka to wherever (S3, probably other aws services)
- AutoScale no infrastructure cents per hour per worker

### 0052 MSK Serverless

- hands free configuration
- define topics, number of partition per topic
- security is IAM access control
- Example pricing:
  - $0.75 per cluster hour ($558/month cluster)
  - $0.0015 partition hour ($1.08 per month per partition)
  - $0.10 GB Storage per month
  - $0.10 Ingress GB
  - $0.05 Egress GB

### 0053 Kinesis vs MSK

| Kinesis | MSK |
| :===: | :===: |
| c1 | C2 |

| Kinesis             |         MSK          |
| :------------------ | :------------------: |
| 1 mb message size   |  10 mb, 1mb default  |
| data stream /shard  |   topic/partition    |
| TLS Inflight        |  plain text or TLS   |
| IAM for AuthN/AuthZ | Mutual TLS, pwd, IAM |

\*both use KMS for at-rest

### Notes

"partition per topic" I understand what it means but I am surprised it mentioned here _tmc_ I need to understand this service better

> MKS Serverless charges for both ingress and egress, AWS used to charge for only egress on network, verify if that is still trued

> probably want to get a list of ALL file formats and a description of their structure and their origin (where does parquet get used, from where did it come? like xls are Excel)

- D. Lake more common for Machine Learning
- Using both is acceptable - it's a matter of the right tool for the job

> When to use IOPS and when to use Disk Size? or is this a multi-dimension metric?

> What is "hot shard"

## Key Terms

## Links

#### Q/A

Q: ELT Is for Data-lake or Data-warehouse and why?
A: ELT is Data warehouse, because it's Schema on write. Eg: Write data to meet Schema requirements

Q. ELT Is for Data-lake or Data-warehouse and why?
A: ELT is for Data-lake because its schema-on-read. We transform the data on read (not write)

Q. Which is more expensive/less expensive Data-Lake or Data-warehouse?
A. Warehouse more expensive/Lake less expensive, in general terms. Certainly we can goof it up.

Q. What is best if you had to pick one. D. Lake, D. warehouse, D. Lake house Why?
A. D. Lake house is best of both worlds. Also it can support ACID (I am not sure about this, need to read/review further)

Q. What are the main ETL/ELT Pipeline Orchestration Services?
A: Event Bridge, Step Functions, Glue Workflow, AWS Managed Workflow / Apache Airflow (MWAA)

**EXAM** expect to know when to use: Kinesis vs Kafka MSK (_tmc_)

Kafka - topic? Kinesis Shard? (_tmc_)
