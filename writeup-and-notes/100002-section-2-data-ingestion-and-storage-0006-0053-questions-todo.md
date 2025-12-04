## Section 2 Data Ingestion (TO DO)

Note: These are probably not questions that I have about the subject matter but rather question I thought would be good on a quiz. I will need to look at my notes for the questions about subject matter.

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

### Notes

"partition per topic" I understand what it means but I am surprised it mentioned here _tmc_ I need to understand this service better

> MKS Serverless charges for both ingress and egress, AWS used to charge for only egress on network, verify if that is still trued

> probably want to get a list of ALL file formats and a description of their structure and their origin (where does parquet get used, from where did it come? like xls are Excel)

- D. Lake more common for Machine Learning
- Using both is acceptable - it's a matter of the right tool for the job

> When to use IOPS and when to use Disk Size? or is this a multi-dimension metric?

> What is "hot shard"

### 0026 S3 Event Notification

_tmc_ I need to better understand the point of the conversation. I think it just means that you have to allow access those resources (S3 can access SNS as example), I think

- EventBridge allows **replay** _tmc_ figure out what this means.

Notes say it appears it's either or, EventBridge or one of the other services _tmc_ want to verify this.

### 0028 S3 Performance

> _tmc_ need research, what do they mean "autoscale" for S3

- Up (theoretical Max) for prefix
  -- 3500 req/second PUT/COPY/POST/DELETE (write)
  -- 5500 req/second GET/HEAD (read)
  -- No limit to the number of prefix per buck

-- _tmc_ notes say "if you know the size of the header you can peek to get first header"

> _tmc_ Need to re-review "First byte, size of the header. What does that even mean.

> _tmc_ Need to re-review "First byte, size of the header. What does that even mean.

### 0029 Encryption

- requires header `x-amz-server-side-encryption: "AES256"` _tmc_ says "enabled by default"

> _tmc_ how do we specify which key to use? I think there is a keyId some how?
> _tmc_ notes indicate the this encryption method may require further API calls, which may introduce latency and additional API calls

> _tmc_ notes indicate the this encryption method may require further API calls, which may introduce latency and additional API calls

### 0033 S3 Access Points

> _tmc_ understand how AP can improve/enforce accessibility through VPC/Security configuration. Maybe the VPC has a gateway allowing EC2 to access AP,

### 0035 EBS

> _tmc_ Know EBS pricing dimensions
> _tmc_ Elastic Volume can not decrease size. I wonder if I have gotten EBS and EV confused on this matter

> _tmc_ Elastic Volume can not decrease size. I wonder if I have gotten EBS and EV confused on this matter

### 0038 Elastic File System (EFS)

> _tmc_ Know pricing dimensions

> _tmc_ know performance and burst
> _tmc_ better understand the availability/durability

> _tmc_ better understand the availability/durability

### 0041 FSx (Third Party FileSystem)

> _tmc_ notes aren't clear about scalability of Windows FSx
> (2:37)

### 0045 Amazon Firehose

- collection, firehose can transform using Lambda. **Transforms at receiver**. Hence no batch body call 1 for each input record. The notes are unclear _tmc_ I think this means can not send in batch, in other words will always 'send' one record at a time.
- Batch sends accumulated records to [something] then sends.
- Producers can send (push) and Firehose can read some aws services. Hence a producer can be `push` or `pull`
- Can write failed data to S3 bucket

- _tmc_ not clear but I believe 'others'

  - External Services
    - Splunk
    - Mongo
    - datadog

- **_tmc_ not clear this is 'receive data'? 'Push Data'**
- Input Formats Supported:
  - csv

**EXAM** You will need to know the differences and when to use each (_tmc_)

### 0046 Kinesis Troubleshoot and Tuning

- Shard Level Limits (_tmc_ ??)
- other operations have service limits, 5 or 10 calls per second
- shard partition distribution, send data evenly to shards
- larger producers can be batched
- stream returns 500 or 503, AwsKinesisException > 1%, retry (?? _tmc_ notes aren't clear)

- stream returns 500 or 503, AwsKinesisException > 1%, retry (?? _tmc_ notes aren't clear)
- connection errors Flink -> Kinesis, VPC <-> VPC, Flink lacks resources (_tmc_ notes aren't clear)
- throttling errors

  - check hot shard
  - look for micro spike

- connection errors Flink -> Kinesis, VPC <-> VPC, Flink lacks resources (_tmc_ notes aren't clear)
- throttling errors

  - check hot shard
  - look for micro spike
  - try random[izing] partition key

- adjust failover (_tmc_ notes aren't clear)

  - handle shutdown method / Zombie

- increase returning (notes note clear _tmc_)
  - insufficient resources
  - Monitor wit get records

(04:45) - they mention API call that is too small for me to see _tmc_

### 0049 Kinesis Costs

- schema discovery (_tmc_ what is this)

_TMC_ I need to research costs - my notes are great and probably the video/lecture wasn't great.

### 0050 MSK

- fully managed - MSK creates and manges Kafka Broker and zoo-keep nodes (_tmc_ notes are n't clear here)

  - deploy in your VPC, multi-AZ (up to 3),
  - auto recovery from common failure
  - data stored on EBS
  - supported custom configuration

- authentication (who can access), read/write topic. My notes say "Authentication" not "Authorization (_tmc_)
- Mutual TLS (AuthN) + Kafka ACL (AuthZ) (certificate)
- SASL/SCRAM (AuthN) + Kafka ACL (AuthZ) (password)
- IAM Access Control (AuthN + AuthZ) **BEST**

_tmc_ My notes were really poor here plus it's security. It is worth re-watching the video to get a better understanding of the points made here.

_tmc_ notes are not very clear here, re watch video

- Cloudwatch Metrics
  - basic monitoring, cluster and broker
  - enhanced monitoring, ++ enhanced broker message

#### 0015 (S3 Security)

#### 0019 S3 Replication

- SRR: lag aggregation (_TMC_ what is that), good for prod/dev replication
- ONLY WORKS FOR NEW ITEMS - to retro replicate the older items will need to do batch replace

- Delete marker replication, delete with/version do not replication (avoids malicious activity) \*tmc not sure what trying to be said here.
- No bucket cloning/chaining A->B->C (no) A-> B ^ A-> C (ok)

#### 0021 (S3 Hands on)

_tmc_ I have some note here that I can't make sense, "default delete marker not replicated MUST BE ... ???

_tmc_

#### 0022 S3 Storage Classes

"Availability" depends on storage class, how rapidly available an item is (_tmc_ not sure here)

S3 standard, 4-9 99.99%, or 53 minutes a year. Hence some failure is expected very small. (_tmc_ not sure what is 4-9 and what is 11-9)

- Allows to move between tiers (on demand, _tmc_ this is not clear to me)
- Small moving fee
- No retrieval fee

  - frequent access default
  - infrequent more than 30 days

- archive slower access _tmc_? (90-700 days)
  - deep 180-700+ days
    > _tmc_ - need to understand how to set-up intelligent tiering

> _tmc_ - need to understand how to set-up intelligent tiering
> _ tmc_ - need to look at retrieval times in terms of cost and delay (12 hour delay but only $0.00001/month??), all have minimal storage time?
> _tmc_ - quiz/question should mention/ask cost dimension, gb/retrieve/month what?

> _ tmc_ - need to look at retrieval times in terms of cost and delay (12 hour delay but only $0.00001/month??), all have minimal storage time?
> _tmc_ - quiz/question should mention/ask cost dimension, gb/retrieve/month what?

> _tmc_ - quiz/question should mention/ask cost dimension, gb/retrieve/month what?

### 0026 S3 Event Notification

_tmc_ I need to better understand the point of the conversation. I think it just means that you have to allow access those resources (S3 can access SNS as example), I think

- EventBridge allows **replay** _tmc_ figure out what this means.

Notes say it appears it's either or, EventBridge or one of the other services _tmc_ want to verify this.

### 0028 S3 Performance

> _tmc_ need research, what do they mean "autoscale" for S3

- Up (theoretical Max) for prefix
  -- 3500 req/second PUT/COPY/POST/DELETE (write)
  -- 5500 req/second GET/HEAD (read)
  -- No limit to the number of prefix per buck

-- _tmc_ notes say "if you know the size of the header you can peek to get first header"

> _tmc_ Need to re-review "First byte, size of the header. What does that even mean.

> _tmc_ Need to re-review "First byte, size of the header. What does that even mean.

### 0029 Encryption

- requires header `x-amz-server-side-encryption: "AES256"` _tmc_ says "enabled by default"

> _tmc_ how do we specify which key to use? I think there is a keyId some how?
> _tmc_ notes indicate the this encryption method may require further API calls, which may introduce latency and additional API calls

> _tmc_ notes indicate the this encryption method may require further API calls, which may introduce latency and additional API calls

### 0033 S3 Access Points

> _tmc_ understand how AP can improve/enforce accessibility through VPC/Security configuration. Maybe the VPC has a gateway allowing EC2 to access AP,

### 0035 EBS

> _tmc_ Know EBS pricing dimensions
> _tmc_ Elastic Volume can not decrease size. I wonder if I have gotten EBS and EV confused on this matter

> _tmc_ Elastic Volume can not decrease size. I wonder if I have gotten EBS and EV confused on this matter

### 0038 Elastic File System (EFS)

> _tmc_ Know pricing dimensions

> _tmc_ know performance and burst
> _tmc_ better understand the availability/durability

> _tmc_ better understand the availability/durability

### 0041 FSx (Third Party FileSystem)

> _tmc_ notes aren't clear about scalability of Windows FSx
> (2:37)

### 0045 Amazon Firehose

- collection, firehose can transform using Lambda. **Transforms at receiver**. Hence no batch body call 1 for each input record. The notes are unclear _tmc_ I think this means can not send in batch, in other words will always 'send' one record at a time.
- Batch sends accumulated records to [something] then sends.
- Producers can send (push) and Firehose can read some aws services. Hence a producer can be `push` or `pull`
- Can write failed data to S3 bucket

- _tmc_ not clear but I believe 'others'

  - External Services
    - Splunk
    - Mongo
    - datadog

- **_tmc_ not clear this is 'receive data'? 'Push Data'**
- Input Formats Supported:
  - csv

**EXAM** You will need to know the differences and when to use each (_tmc_)

### 0046 Kinesis Troubleshoot and Tuning

- Shard Level Limits (_tmc_ ??)
- other operations have service limits, 5 or 10 calls per second
- shard partition distribution, send data evenly to shards
- larger producers can be batched
- stream returns 500 or 503, AwsKinesisException > 1%, retry (?? _tmc_ notes aren't clear)

- stream returns 500 or 503, AwsKinesisException > 1%, retry (?? _tmc_ notes aren't clear)
- connection errors Flink -> Kinesis, VPC <-> VPC, Flink lacks resources (_tmc_ notes aren't clear)
- throttling errors

  - check hot shard
  - look for micro spike

- connection errors Flink -> Kinesis, VPC <-> VPC, Flink lacks resources (_tmc_ notes aren't clear)
- throttling errors

  - check hot shard
  - look for micro spike
  - try random[izing] partition key

- adjust failover (_tmc_ notes aren't clear)

  - handle shutdown method / Zombie

- increase returning (notes note clear _tmc_)
  - insufficient resources
  - Monitor wit get records

(04:45) - they mention API call that is too small for me to see _tmc_

### 0049 Kinesis Costs

- schema discovery (_tmc_ what is this)

_TMC_ I need to research costs - my notes are great and probably the video/lecture wasn't great.

### 0050 MSK

- fully managed - MSK creates and manges Kafka Broker and zoo-keep nodes (_tmc_ notes are n't clear here)

  - deploy in your VPC, multi-AZ (up to 3),
  - auto recovery from common failure
  - data stored on EBS
  - supported custom configuration

- authentication (who can access), read/write topic. My notes say "Authentication" not "Authorization (_tmc_)
- Mutual TLS (AuthN) + Kafka ACL (AuthZ) (certificate)
- SASL/SCRAM (AuthN) + Kafka ACL (AuthZ) (password)
- IAM Access Control (AuthN + AuthZ) **BEST**

_tmc_ My notes were really poor here plus it's security. It is worth re-watching the video to get a better understanding of the points made here.

_tmc_ notes are not very clear here, re watch video

- Cloudwatch Metrics
  - basic monitoring, cluster and broker
  - enhanced monitoring, ++ enhanced broker message

#### 0015 (S3 Security)

#### 0019 S3 Replication

- SRR: lag aggregation (_TMC_ what is that), good for prod/dev replication
- ONLY WORKS FOR NEW ITEMS - to retro replicate the older items will need to do batch replace

- Delete marker replication, delete with/version do not replication (avoids malicious activity) \*tmc not sure what trying to be said here.
- No bucket cloning/chaining A->B->C (no) A-> B ^ A-> C (ok)

#### 0021 (S3 Hands on)

_tmc_ I have some note here that I can't make sense, "default delete marker not replicated MUST BE ... ???

_tmc_

#### 0022 S3 Storage Classes

"Availability" depends on storage class, how rapidly available an item is (_tmc_ not sure here)

S3 standard, 4-9 99.99%, or 53 minutes a year. Hence some failure is expected very small. (_tmc_ not sure what is 4-9 and what is 11-9)

- Allows to move between tiers (on demand, _tmc_ this is not clear to me)
- Small moving fee
- No retrieval fee

  - frequent access default
  - infrequent more than 30 days

- archive slower access _tmc_? (90-700 days)
  - deep 180-700+ days
    > _tmc_ - need to understand how to set-up intelligent tiering

> _tmc_ - need to understand how to set-up intelligent tiering
> _ tmc_ - need to look at retrieval times in terms of cost and delay (12 hour delay but only $0.00001/month??), all have minimal storage time?
> _tmc_ - quiz/question should mention/ask cost dimension, gb/retrieve/month what?

> _ tmc_ - need to look at retrieval times in terms of cost and delay (12 hour delay but only $0.00001/month??), all have minimal storage time?
> _tmc_ - quiz/question should mention/ask cost dimension, gb/retrieve/month what?

> _tmc_ - quiz/question should mention/ask cost dimension, gb/retrieve/month what?

## TMC Notes

### 0026 S3 Event Notification

_tmc_ I need to better understand the point of the conversation. I think it just means that you have to allow access those resources (S3 can access SNS as example), I think

- EventBridge allows **replay** _tmc_ figure out what this means.

Notes say it appears it's either or, EventBridge or one of the other services _tmc_ want to verify this.

### 0028 S3 Performance

> _tmc_ need research, what do they mean "autoscale" for S3

-- _tmc_ notes say "if you know the size of the header you can peek to get first header"

> _tmc_ Need to re-review "First byte, size of the header. What does that even mean.

### 0029 Encryption

- requires header `x-amz-server-side-encryption: "AES256"` _tmc_ says "enabled by default"

> _tmc_ how do we specify which key to use? I think there is a keyId some how?

> _tmc_ notes indicate the this encryption method may require further API calls, which may introduce latency and additional API calls

### 0033 S3 Access Points

> _tmc_ understand how AP can improve/enforce accessibility through VPC/Security configuration. Maybe the VPC has a gateway allowing EC2 to access AP,

### 0035 EBS

> _tmc_ Know EBS pricing dimensions

> _tmc_ Elastic Volume can not decrease size. I wonder if I have gotten EBS and EV confused on this matter

### 0038 Elastic File System (EFS)

> _tmc_ Know pricing dimensions

> _tmc_ know performance and burst

> _tmc_ better understand the availability/durability

### 0041 FSx (Third Party FileSystem)

> _tmc_ notes aren't clear about scalability of Windows FSx

### 0045 Amazon Firehose

- collection, firehose can transform using Lambda. **Transforms at receiver**. Hence no batch body call 1 for each input record. The notes are unclear _tmc_ I think this means can not send in batch, in other words will always 'send' one record at a time.

- _tmc_ not clear but I believe 'others'

- **_tmc_ not clear this is 'receive data'? 'Push Data'**

**EXAM** You will need to know the differences and when to use each (_tmc_)

### 0046 Kinesis Troubleshoot and Tuning

- Shard Level Limits (_tmc_ ??)

- stream returns 500 or 503, AwsKinesisException > 1%, retry (?? _tmc_ notes aren't clear)

- connection errors Flink -> Kinesis, VPC <-> VPC, Flink lacks resources (_tmc_ notes aren't clear)

- adjust failover (_tmc_ notes aren't clear)

- increase returning (notes note clear _tmc_)

(04:45) - they mention API call that is too small for me to see _tmc_

### 0049 Kinesis Costs

- schema discovery (_tmc_ what is this)

_TMC_ I need to research costs - my notes are great and probably the video/lecture wasn't great.

### 0050 MSK

- fully managed - MSK creates and manges Kafka Broker and zoo-keep nodes (_tmc_ notes are n't clear here)

- authentication (who can access), read/write topic. My notes say "Authentication" not "Authorization (_tmc_)

_tmc_ My notes were really poor here plus it's security. It is worth re-watching the video to get a better understanding of the points made here.

_tmc_ notes are not very clear here, re watch video

#### 0015 (S3 Security)

#### 0019 S3 Replication

- SRR: lag aggregation (_TMC_ what is that), good for prod/dev replication

- Delete marker replication, delete with/version do not replication (avoids malicious activity) \*tmc not sure what trying to be said here.

#### 0021 (S3 Hands on)

_tmc_ I have some note here that I can't make sense, "default delete marker not replicated MUST BE ... ???

_tmc_

#### 0022 S3 Storage Classes

"Availability" depends on storage class, how rapidly available an item is (_tmc_ not sure here)

S3 standard, 4-9 99.99%, or 53 minutes a year. Hence some failure is expected very small. (_tmc_ not sure what is 4-9 and what is 11-9)

- Allows to move between tiers (on demand, _tmc_ this is not clear to me)

- archive slower access _tmc_? (90-700 days)

> _tmc_ - need to understand how to set-up intelligent tiering

> _ tmc_ - need to look at retrieval times in terms of cost and delay (12 hour delay but only $0.00001/month??), all have minimal storage time?

> _tmc_ - quiz/question should mention/ask cost dimension, gb/retrieve/month what?
