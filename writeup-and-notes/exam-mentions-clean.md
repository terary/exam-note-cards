#### QUESTION X
Explain, "unigram", "bi-gram", "tri-gram".
#### ANSWER X
- An extension of TF-IDF is to not only compute relevancy for individual words (terms) but also for bi-grams or more generally, n-grams
- "I love certification exams"
  - Unigram: "I", "love", "certification", "exams"
  - Bi-grams: "I love", "love certification", "certification exam"
  - Tri-grams: "I love certification", "love certification exam"

__EXAM__ You may have a question on exam that will ask you to break a sentences into unigram, bi-grams. It's not clear to me if we are suppose to give the number of occurence of each bi-gram, tri-gram etc or if we were supposed to break but the sentences into bigram.  __trick__ in the end we are counting popularity... not actual bigram/trigram

#### END QUESTION


#### QUESTION X
When imputing missing data what is the least recommended method (2)?
What is the most recommend method, numeric data, categorical data?

#### ANSWER X
Least recommended
- Dropping rows with missing data
- Using mean value or median value

More recommended

Use machine learning!

- KNN: find K "nearest" (most similar) rows and average their values
  - Assumes numerical data, not categorical
  - There are ways to handle categorical data (Hamming distance), but categorical data is probably better served by...

- Deep Learning (best)
  - Build machine learning model to impute data for your machine learning model
  - Works well for categorical data.  Really Well. But it's complicated

- Regression
  - Find linear or non-linear relationships between the missing feature and other features
  - Most advanced technique: MICE (Multiple Imputation by Chained Equations)

__EXAM__ probably not on the exam, MICE is newer, but if it is an option than it is probably the best option


__EXAM__ The best option over 'imputing' is to get more data
#### END QUESTION


#### QUESTION X
Outliers, what are they? how do we deal with them (3).
#### ANSWER X

Three recommendations for dealing with outlier
1. throw out (be responsible)
2. Standard deviation threshold (only data within one STD)
3. Random Cut Forest (most likely answer on the exam) 


> He demonstrates with diagrams/graphs how outliers can cause the data to zoom out, missing the relationships of most of the data.  When we remove the outliers the graph zooms-in so we have a more detailed view of the data/graph

Outliers are datapoints that don't necessarily fit within the 'norm' or the dat we are modelling.  Marathon participants may have outliers... Occasionally a 95 year person will run a marathon. The true mean age may be skewed, so we may want to throw out that outlier. 

#### END QUESTION

#### QUESTION X
Describe is SageMaker Canvas.
#### ANSWER X

__No-Code machine learning for business analysts__
> Also a user friendly application for building Generative AI, via bedrock

- No-Code machine learning for business analysts
- Upload csv data (csv only for now), select a column to predict, build it, and make predictions
- Can join datasets
- Classification or regression
- Automatic data cleaning
  - Missing values
  - Outliers
  - Duplicates
- Share models and datasets with SageMaker Studio  
- Also has generative AI support via Bedrock or JumpStart foundation models 
  - Many are fine-tunable within Canvas

> Table definition and __ETL__

> There is not a lot to Glue but it is important to internalize it and fully understand how it fits into the grander scheme of things.

> The purpose of Glue is to extract structure from unstructured data. 

> The other thing Glue does is Custom ETL jobs. Uses Apache Spark under the hood

__EXAM__ Glue is HUGE

#### END QUESTION
#### QUESTION X
What is Glue Studio? 8 points, and has an alternative name.
#### ANSWER X

- Visual interface for ETL workflows
- Visual Job Editor
  - Create DAGS for complex workflow
  - Sources include S3, Kinesis, Kafka, JDBC
  - Transform / sample/join data
  - Target to S3 or Glue Data Catalog
  - Support partitioning
- Visual job dashboard

__TODO__ What to look at the DAG editor, Observe also how it can create Schema

__EXAM__ he said GLUE Studio is kinda new and not expected to be on the exam too much... However, he may not know.


#### END QUESTION
#### QUESTION X
What is Glue DataBrew?
#### ANSWER X
__EXAM__ Probably big on the Exam

> Visual Tool, for the T in ETL

- Visual data prep tool
  - UI for Pre-processing large data sets
  - Input form S3, data warehouse, or database
  - Output to S3

- Over 250 read-made transformations
- you create "recipe" of transformations that can be saved as jobs within a larger project
- May define quality rules
- May create datasets with custom SQL from Redshift or Snowflake
- Security
  - Can integrate with KMS (with customer master key only)
  - SSL in transit
  - IAM can restrict who can do what
  - CloudWatch & CloudTrain

__TODO__ Look at the '250 read made transformations'


__- __Output many formats... Hence it may be a good tool for converting from one file format to another__

- Run jobs immediately or Schedule for later use

Session $1.00, + $0.48/per node-hour (need to verify with AWS)

#### END QUESTION
#### QUESTION X
Glue DataBrew, what are the PII important transformations (8 total)?
#### ANSWER X
- Substitutions (`REPLACE_WITH_RANDOM`)
- Shuffle (`SHUFFLE_ROWS`)
- Deterministic encryption (`DETERMINISTIC_ENCRYPT`)
- Probabilistic Encryptions (`ENCRYPT`, "Probabilistic" encryption routine may be more than one result, not sure about this)
- Decrypt (`DECRYPT`)
- Nulling out or deleting (`DELETE`)
- Masking out (`MASK_CUSTOM`, `_DATE`, `_DELIMITER`, `_RANGE`) (maybe cc ending or similar, mask first ... characters)
- Hashing (`CRYPTOGRAPHIC_HASH`)

#### END QUESTION
#### QUESTION X
 In general, what are the most common File Formats in ML (5 and compressions)?
#### ANSWER X
  - CSV, TSV (human readable)
  - JSON  (human readable)
  - ORC (columnar, splittable)
  - Parguet (columnar, splittable)
  - Avro (Splittable)
  - Snappy, Zlib, LZO, Gzip Compressions (this may not be "formats")

Why does "splittable" matter?

__EXAM__ all the formats and their advantages. 

Avro is only splittable.

Splittable is good for parallelizing your data/jobs

Data can be structure, semi-structured, or structured.. Athena doesn't care
#### QUESTION X
What are Athena Work-groups (4)?
#### ANSWER X
- Can organize users/teams/apps workloads into Workgroups
- Can control query access and track costs by workgroup
- Integrate with __IAM, CloudWatch, SNS__
- Each workgroup can have its own:
  - Query History
    - Data Limits (you can limit how much data queries my scan by workgroup)
    - IAM policies
    - Encryption Settings

> Can limit the data scanned (costs) by work-group
#### END QUESTION

#### QUESTION X
For Athena, What are performance best practices (3 + 1)? 
#### ANSWER X
- Use columnar data (ORC or Parquet)
- Small number of large files performs better than a large number of small files
- Use partitions
  - If added partitions after the face, use `MSCK REPAIR TABLE` command

Also, if using ACID (iceberg tables), doing 
```
OPTIMIZE REWRITE DATA USING BIN_PACK WHERE CATALOG=`c1`
```
Will help to reduce overhead created by ACID.
__EXAM__ may ask something like "What to do if your Athena is getting slower over time

#### END QUESTION


#### QUESTION X
Discuss S3 versioning. 
#### ANSWER X
___ 0017 (S3 Versioning)

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

#### END QUESTION


#### QUESTION X
Discuss EBS
#### ANSWER X
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


#### END QUESTION
#### QUESTION X
Discuss Kinesis Data Streams.
- Retention?
- Replay?
- Realtime?
- Capacity Modes?
#### ANSWER X
___ 0043 Kinesis Data Stream **EXAM**

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

#### END QUESTION


#### QUESTION X
Discuss Firehose.
**EXAM** You will need to know the differences between streams and firehose and when to use each (_tmc_)

- Retention?
- Replay?
- Managed? Serverless?
- Input Formats?
- Transformers?

#### ANSWER X
___ 0045 Amazon Firehose

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

#### END QUESTION
#### QUESTION X
Discus Kinesis Costs
#### ANSWER X
___ 0049 Kinesis Costs

- Serverless
  - Kinesis Process Unit (KPU) := 1kpu = 1vCPU + 4GB
  - IAM Permissions
  - schema discovery (_tmc_ what is this)

_TMC_ I need to research costs - my notes are great and probably the video/lecture wasn't great.

_EXAM_ Have to know billing/costs of Kinesis

#### END QUESTION

#### QUESTION X
When doing spark capacity planning, there is something that you need to account for?
#### ANSWER X
__EXAM__
- Spark adds 10% overhead to memory requested for drivers and executors
- Be sure initial capacity is at least 10% more than requested by the job

#### END QUESTION
#### QUESTION X
How to break strings into n-gram, uni-gram, bi-gram, tri-gram

#### ANSWER X

- An extension of TF-IDF is to not only compute relevancy for individual words (terms) but also for bi-grams or more generally, n-grams

- "I love certification exams"
  - Unigram: "I", "love", "certification", "exams"
  - Bi-grams: "I love", "love certification", "certification exam"
  - Tri-grams: "I love certification", "love certification exam"

__EXAM__ You may have a question on exam that will ask you to break a sentences into unigram, bi-grams. It's not clear to me if we are suppose to give the number of occurence of each bi-gram, tri-gram etc or if we were supposed to break but the sentences into bigram.  __trick__ in the end we are counting popularity... not actual bigram/trigram
#### END QUESTION

#### QUESTION X
if the question gives the option to use RCF for outlier detection, ?
#### ANSWER X


__It's probably the correct answer__


____ Dealing with Outliers II
- Our old friend standard deviation provides a principled way to classify outliers
- Find data points more than some multiple of stand deviation in our training data.
- What multiple? Just have to use common sense
- Remember AWS __Random Cut Forest__ algorithm creeps into may of it's services - it is made for outlier detection
  - Found within QuickSight, Kinesis Analytics, SageMaker and more

__EXAM__ if the question gives the option to use RCF for outlier detection, it is probably the correct answer


#### END QUESTION


#### QUESTION X
What is One Hot Encoding?
#### ANSWER X
____ Encoding

- Transforming dat into some new representation required by the model
- One-hot encoding
  - Create "buckets" for every category
  - The bucket for your category has a 1, all others have a 0
  - Very common in dep learning, where categories are represented by individual output "neurons"

__EXAM__ Understand how "One-Hot Encoding" works, it reminds me of categorizing the numbers 0 and 5.  We take each image 'is this a 0' 

> This is done because a neuron is generally represented as `1` or `0`, so we're boiling to down to binary

#### END QUESTION
#### QUESTION X
What is Glue?
#### ANSWER X


__TODO__ Need more information about glue

> Table definition and __ETL__

> There is not a lot to Glue but it is important to internalize it and fully understand how it fits into the grander scheme of things.

> The purpose of Glue is to extract structure from unstructured data. 

> The other thing Glue does is Custom ETL jobs. Uses Apache Spark under the hood

__EXAM__ Glue is HUGE

____ What is Glue
- Serverless discovery and definition of table definitions and schema
  - S3 - "data lakes"
  - RDS
  - Redshift
  - Most other SQL database

- Custom ETL Jobs
  - Trigger-driven, on schedule or on demand
  - Fully managed


__OpenAi__ Definition of Glue
**AWS Glue** is basically Amazon’s fully managed **ETL** service — which stands for *Extract, Transform, Load*. In normal human terms: it’s the thing you use when you’ve got messy data sitting all over the place and you want to clean it up and move it somewhere useful for analytics or machine learning.

Let’s say your data is living in:

* CSV files in S3
* Logs from apps
* A relational database
* Maybe even streaming data

Glue will:

1. **Extract** → grab the data from wherever it lives
2. **Transform** → clean it, join it, reformat it, remove junk, standardize fields
3. **Load** → put it into a data warehouse or data lake (like for BI dashboards or ML models)

---

### The actually cool parts:

🕷️ **Glue Crawlers**
These automatically scan your data sources and figure out the schema (like column names, types, etc.) so you don’t have to define it manually.

🗂️ **Data Catalog**
Glue stores metadata about all your datasets in a central catalog — kind of like a table of contents for your company’s data.

⚙️ **ETL Jobs**
You write transformation logic in Python or Scala (Spark under the hood), and Glue runs it serverlessly — meaning:

* no infrastructure to manage
* auto-scaling
* pay only when it runs

📈 **Works well with analytics & ML**
Teams often use Glue to prep data before sending it to things like:

* Amazon Athena for SQL queries on S3
* Amazon Redshift for warehousing
* Amazon SageMaker for ML (you were asking about Clarify earlier — Glue is often what feeds SageMaker clean data)

---

### When would *you* use Glue?

* Building a data lake
* Cleaning logs before analysis
* Joining multiple data sources
* Feature engineering pipelines for ML
* Scheduling recurring data prep jobs

If you want, I can explain how Glue compares to something like Apache Spark on EMR — that’s usually where people get stuck deciding.

#### END QUESTION

#### QUESTION X
What is Glue Studio?

He said it is not expected to be on the exam, but he couldn't be certain.


#### ANSWER X
**AWS Glue Studio** is the **visual UI** for building and managing your Glue ETL jobs — so instead of writing a bunch of PySpark by hand, you can drag-and-drop your data pipeline together.

Think of it as:

> “Glue… but with a canvas instead of code.”

---

### What you do inside Glue Studio:

You can visually design a pipeline that looks like:

```
S3 → Clean → Join → Filter → Aggregate → Load into Redshift
```

Each of those steps is a box (called a **node**) that you connect together.

So you might:

* Pull in CSVs from S3
* Drop null values
* Join with another dataset
* Rename fields
* Convert timestamps
* Output parquet into a data lake
* Send the cleaned version to **Amazon Redshift**

All without touching Spark code if you don’t want to.

---

### Under the hood (important):

Even though you're using a GUI:

* Glue Studio is still generating **Apache Spark jobs**
* It auto-writes the PySpark for you
* You can open the script at any time and tweak it manually

So it’s beginner-friendly *and* engineer-friendly.

---

### Built-in goodies:

✨ **Schema preview** – see your columns before running the job
🧪 **Data sampling** – test transformations on a subset
⏱️ **Job scheduling** – run hourly/daily pipelines
🔁 **Reusable transforms** – save common steps
📊 **Integrated with Data Catalog** – auto-pull schemas from crawlers

---

### Why teams use it:

* Faster pipeline prototyping
* Less Spark boilerplate
* Easier handoff between data engineers & analysts
* Great for prepping data before sending to
  **Amazon SageMaker** (like for Clarify bias checks you asked about earlier)

---

Rule of thumb:

* Want full control & custom logic? → Glue Jobs (code-first)
* Want speed & visibility? → Glue Studio (visual-first)

If you’re building ML feature pipelines, Glue Studio is honestly a nice middle ground before going full custom Spark.

#### END QUESTION


#### QUESTION X
What is Glue DataBrew?
#### ANSWER X
> Visual Tool, for the T in ETL

______ ⭐0081 Glue DataBrew (2:58)
__EXAM__ Probably big on the Exam

> Visual Tool, for the T in ETL

- Visual data prep tool
  - UI for Pre-processing large data sets
  - Input form S3, data warehouse, or database
  - Output to S3

- Over 250 read-made transformations
- you create "recipe" of transformations that can be saved as jobs within a larger project
- May define quality rules
- May create datasets with custom SQL from Redshift or Snowflake
- Security
  - Can integrate with KMS (with customer master key only)
  - SSL in transit
  - IAM can restrict who can do what
  - CloudWatch & CloudTrain

__TODO__ Look at the '250 read made transformations'
#### END QUESTION


#### QUESTION X
What is Athena Work Groups? What do you manage? How to control costs?
#### ANSWER X
____ Athena Work Groups (01:33) __EXAM__

- Can organize users/teams/apps workloads into Workgroups
- Can control query access and track costs by workgroup
- Integrate with __IAM, CloudWatch, SNS__
- Each workgroup can have its own:
  - Query History
    - Data Limits (you can limit how much data queries my scan by workgroup)
    - IAM policies
    - Encryption Settings

> Can limit the data scanned (costs) by work-group

#### END QUESTION
#### QUESTION X
Two Athena anti-pattern?
#### ANSWER X
______ Athena Anti-Pattern (__EXAM__)
- Highly formatted reports / visualization
  - That is what Quicksight is for
- ETL
  - use Glue instead  

#### END QUESTION
#### QUESTION X
Athena Optimizations (3)? What is required for ACID?

#### ANSWER X
- Use columnar data (ORC or Parquet)
- Small number of large files performs better than a large number of small files
- Use partitions
  - If added partitions after the face, use `MSCK REPAIR TABLE` command

__EXAM__ may ask)

Also, if using ACID (iceberg tables), doing 
```
OPTIMIZE REWRITE DATA USING BIN_PACK WHERE CATALOG=`c1`
```
Will help to reduce overhead created by ACID

#### END QUESTION

