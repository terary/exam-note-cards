
__data mesh__ Concept, not a real thing

It's a term to understand and not a topology. __Individual Tenant own their own data (within a domain)__. The tenant manages the data, collection, transformation, augmentation, whatever.

The tenant may allow access to the data 'data as a service'. Also, think Government data pools(?or not?).


__common data formats__
- csv
- json
- avro
- parquet
- recordIO

### S3
- block public access to avoid data leaks
- Replication 2 flavors
    - Cross Region Replication (CRR)
    - Same Region Replication (SRR)
        - Delete markers do not replication
        - Can not daisy chain (a->b->c) but can fan-out (a-> b, a-> c)
- Storage Class
    - Standard (GP - general purpose)
        - 99.99 available
        - Tolerant of two AZ Failures
        - use cases:
            - Big Data Analysis
            - Reliable "gaming"
            - content distribution
    - Infrequent Access (IA)
        - 99.9 Available
        - Cost on retrieval
        - Supports Rapid Access
    - 1 Zone Infrequent Access (1ZIA or S3-1Z)        
        - 99.5 Availability
        - 1 AZ, if something happens in that AZ, all is lost

    - Glacier
        - Instant Retrieval
        - __Minimal Storage time - 90 days__

    - Glacier Flex Retrieval
        - Expedited Retrieval 1 - 5 minutes
        - Standard Retrieval 3-5 hours
        - Bulk Retrieval 5-12 hours
        - __Minimal Storage time - 90 days__

    - Glacier Deep Freeze
        - Standard Retrieval 12 hours
        - Bulk retrieval 48 hours
        - __min storage 180 days__

* Glacier starts the minimum time in storage        

### S3 Intelligent Tiering 
- Small moving fee
- No retrieval Fee
- Retrieval times:
    - frequent access default
    - infrequent more than 30 days
    - archive instant access (90 days)
    - archive slower access tmc? (90-700 days)
    - deep 180-700+ days

### S3 Life Cycle Rules
Two rule types/actions
    - Expiration Action
    - Transition Action

__S3 Analytics is how to gauge good rules for life time__


### S3 Event Notification
- `S3:ObjectCreated`
- `S3:ObjectRemoved`
- `S3:ObjectRestored`
- `S3:ObjectReplicated`

Can send events to 
    - SQS 
    - SNS
    - Lambda (no queue require)
    - *EventBridge
Many services not supported (streams, firehose, etc).
__EventBridge__ EventBridge integration must be enabled at the bucket level (it sends __all__ events to EventBridge)
EventBridge provides
- Routing to 18 other services
- Advanced Filtering (meta data like size, content type, etc)
- Allows __Replay__



You can do `S3 → EventBridge → Kinesis Data Stream → Firehose → S3 (analytics bucket)`

__Have to create policy to allow S3 to write to the services, Take away, define resource access on target service (SNS, SQS, etc) VERY IMPORTANT__


*S3 Performance is not measure by bucket but by prefix

### S3 Optimizations
- use multiple prefixes
- S3 Transfer acceleration, push to edge, edge push to target (supports multi part)
- Optimize Read "Byte Range Fetch" -- parallelize read -- higher fault tolerance -- Can be used for first byte only  

* tmc notes say "if you know the size of the header you can peek to get first header"


### S3 Encryptions
- SSE-S3 -> Standard AWS Management (encrypted but no key specified, managed wholly on AWS) 
    - requires header `x-amz-server-side-encryption: "AES256"`
- SSE-KMS -> AWS Key Management (Uses AWS Key Manager, client code specifies which key to use)
    - __de/encrypt can be logged in CloudTrail__
    - header `x-amz-server-side-encryption: "aws:kms"`
    - Can configure default key or specify key at upload (override default key - maybe not a good idea)
- SSE-C -> Customer Provided Key
- SSE Client Side -> client de/encrypt on there side and send/recv encrypted object


Bucket Policy is evaluated before encryption policy. EXAM (probably)
### Access Points

- AP Policy look the same as S3 policy
- An S3 Access Point cannot grant more access than the underlying bucket policy allows. (Think of it as `AND`, not `OR`, Any `deny` rule applies)
- Each Access Point -- it's own DNS Name -> unique internet name
- S3 is independent of VPC.  However, access points can be configured to only honor request from specific VPC.. S3 can also probably do this through other means (specific IP internet-gateway, as example)



### EBS
- Mostly single instance (advanced usage can allow more, out of scope for us)
- Bound to single AZ
- Can be de-attached/re-attached, data will persist
- Default Behavior: -- root drive (drv0) will auto delete, others do not (drv1). THIS IS DEFAULT AND CAN BE OVERWRITTEN, EXAM How to preserve root with EBS?


### Elastic Volume
- It's a configuration on EBS (or its a service) to allow you to change the volume on the fly, IOPS or volume type, can not shrink

### Elastic File System
- multiple EC2
- Multiple AZ
- More expensive (3 times the cost of GP2/EBS)
- Pay per use/access
- __NFSv4.1 Protocol__
- Not windows compatible
- Supports SG to control access
- KMS for encryption (we see KMS come up frequently)
- POSIX file system, eg standard api, `ls`, `rm`, etc
- Automatically Scale, __careful of cost__
- Can grow to __petabytes__ 


Ok so here is how it works.  EFS pretends to be a "volume"/"disk" and we write to it as we normally would.  However, it is only pretending.  In reality its a collection of storage devices, each of these can support different "storage class".  So files on an EFS can have different storage classes.   This is how/why we get cost savings by implementing transitions (intelligent tiering).

- Storage Tiers:
    - Standard - (frequent use)
    - infrequent access - cost to retrieve lower price to start
    - archive - rarely access - few times a year, 50% cheaper
    - implement life cycle policy to move files from tier to tier

### FSx
Supports
- Windows
    - NACLS
    - SMB/NTFS
    - NTFS
    - Quotas/Windows Permissions
- Luster
    - Parallel File System (large, very large)/ Optimize for Machine Learning
    - Video Processing, Financial Models, Electrical Design Automation
    - _High Performance Compute (HPC)_
    - Scales 100's GB/s, Millions IOPS, __sub ms latency__
    - Can use on-premise volume using VPN/DirectConnect
    - Two deploy options
        - Scratch (temp), no restore on fail (no replication), single AZ
        - Persistent, durable, replaces failed instances (replication), Multiple AZ
- NetApp/OnTapp
    - Move running workloads
    - Broad compatibility: Mac, Windows, Linux,VMWare etc, EC2, EKS, etc
    - Autoscale shrink/grow
    - __Point in time clones (workload transfers)__
- OpenZFS
    - OpenSource originally from Sun MicroSystems
    - Considered more simple to implement
    - Not the same thing as NetApp/OnTap, but solves similar problems


### Kinesis Data Streams

- 365 Retention
- Can replay
- __Data can not be deled, must be expired__
- Order Guaranteed
- 1mb payload (before b64 encoding)
- Capacity Modes
    - __Provisioned Mode__:
        - any number of shards
        - each shard inbound 1mb/s or 1000 records per second
        - each shard outbound 2mb/s (didn't give limit in number of records poor notes or not applicable, not sure which).
        - Scale Manually, increase/decrease any number of shards capacity is measured in shards
Cost per Shard provisioned
    - __On Demand Mode__:
        - provisioned automatically (autoscaled)
        - Default capacity 4. 4MB/s (4000 records per second)
        - Scales automatically based on observed throughput over past 30 days
        - __Pay per stream per hour and data in and out__

### Firehose
- Think Javascript watermark
- Near real time (because of the 'buffering' it does)
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

### Kafka (MSK)
- Producers send data into Kafka __topic__, it will get replicated across few/all brokers. Consumers poll broker/__topic__ for messages.

- Security - WILL BE ON EXAM
    - Everything in-flight TLS, at rest EBS encryption
    - Network (security groups)
    - authentication (who can access), read/write __topic__. My notes say "Authentication" not "Authorization (tmc)
    - Mutual TLS (AuthN) + Kafka ACL (AuthZ) (certificate)
    - SASL/SCRAM (AuthN) + Kafka ACL (AuthZ) (password)
    - IAM Access Control (AuthN + AuthZ) __BEST__

__EXAM__ Kafka Security, Kafka ACL are managed from within the instance making it a poor choice. It is worth re-watching the video to get a better understanding of the points made here.

Monitoring __EXAM__ tmc notes are not very clear here, re watch video
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