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

  #############################################################333

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

#### Notes

- D. Lake more common for Machine Learning
- Using both is acceptable - it's a matter of the right tool for the job

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
