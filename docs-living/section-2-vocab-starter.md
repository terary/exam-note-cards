- Data Velocity
- Data Volume
- Data Variety

#### Warehouse

#### Data-lake

### 0010 Data Mesh

#### D. Lake house (9:34)

- JDBC
- ODBC
- Bucket
- S3 Object Key
- S3 Object Value
- S3 meta-data, key=value pairs can be set by system or user (_cool_)
- tags up to 10 only supported universally (not sure what that means)
- version / versionId, (is it version or versionId, is it a hash or int)

what is meant by

- Cross Region Replication (CRR) (x-region)
- Same Region Replication (SRR)

Each of the abbreviations (GP, GIR) make sure prefix S3 (S3-GIR)

- Standard - General Purpose (GP)
- Standard Infrequent Access - (IF)
- OneZone - infrequent Access - (1ZIF)
- Glacier Instant Retrieval (GIR)
- Glacier Flexible Retrieval (GFR)
- Glacier Deep Archive (G-Arch)

S3 x-account header (is this a header)

What is meant by this (how many days)

- frequent access default
- infrequent more than 30 days
- archive instant access (90 days)
- archive slower access _tmc_? (90-700 days)
- deep 180-700+ days

**Transition Action**
**Expiration Action**
**Rules** can be created for prefix or tags (s3 transition rules I suppose)
**SSE-S3**
**SSE-KMS**
**SSE-C**

### 0034 S3 Object Lambda

### 0035 EBS

### 0037 Elastic Volume

#### EFS:

"FSx"

#### EFS Storage Classes (several listed, will need to do like S3, prefix EFS-Standard, EFS-infrequent access)

#### Luster

"Kinesis Producer"
"Kinesis Consumer"

### 0050 MSK

### 0051 MSK Connect

### 0052 MSK Serverless
