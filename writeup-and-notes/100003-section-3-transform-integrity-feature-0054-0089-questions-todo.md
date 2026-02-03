

#### QUESTION X
What is Elastic MapReduce (EMR)?
#### ANSWER X
- Elastic MapReduce
- Managed Hadoop framework on EC2 instances
- Includes Spark, HBase, Presto, Flink, Have and more
- EMR Notebooks
- Several integration points with AWS
#### END QUESTION

#### QUESTION X

The follow describes which AWS product/service?

- Managed Hadoop framework on EC2 instances
- Includes Spark, HBase, Presto, Flink, Have and more
- EMR Notebooks
- Several integration points with AWS

#### ANSWER X
Elastic MapReduce (EMR)

#### END QUESTION
#### QUESTION X
What are the two types of EMR Cluster and when to use each?
#### ANSWER X
EMR Usage

- Transient vs Long-Running Clusters
    - Can spin up task nodes using Spot instances for temporary capacity
    - can use reserved instances for long-running clusters to save money
- Connect directly to master to run jobs
- Submit ordered steps via the console

If you have a known set of steps/tasks to run. You can run a transient cluster and reserved instances.

If you have long running queries or if you need to interact with the app(s), you can run a long running cluster and terminate by hand when done
#### END QUESTION

#### QUESTION X

Which AWS Services does the EMR cluster use to interact with (7)?

#### ANSWER X
- EC2 for instances that comprise nodes in the cluster
- VPC to configure the virtual network in which you launch instances
- S3 to store input/output data (alternative to Hadoop)
- CloudWatch to monitor cluster performance and configure alarms
- IAM to configure permissions
- CloudTrail to audit requests to service
- Data PipeLine to schedule and start your clusters
#### END QUESTION


#### QUESTION X
What are the EMR storage options (3)?
Which is default? What are the pros and cons of the default FS? What is the best alternative?
#### ANSWER X
- HDFS (default)
- EMRFS: access S3 as if it were HDFS
    - EMRFS Consistent View - optional for S3 consistency
    - Uses DynamoDB to track consistency
- Local File system
- EBS for HDFS

Con to HDFS is it's temporary. Once the cluster is gone so is the filesystem (your data).

Pro to HDFS probably fastest (high performance)

> Key point is that you can use S3 in place of HDFS (EMRFS) 

#### END QUESTION

#### QUESTION X
What are the EMR Promises (contract)? (4) 
#### ANSWER X
- EMR Charges by the hour
    - plus ECS charges
- Provisions new nodes if a core node fails
- Can add and remove task nodes on the fly
- Can resize a running cluster's core nodes    

#### END QUESTION

#### QUESTION X
Describe briefly what is EMR Serverless?
Is it really serverless? 

#### ANSWER X
- Choose an EMR Release and Runtime (Spark, Hive, Presto)
- submit query / scripts via `job run requests` (instead of logging into master node directory), Then the serverless aspect will figure out how much capacity you actually need
- EMR Manages underlying capacity
    - But you can specify default worker sizes and pre-initialized capacity
    - EMR computes resources needed for your jbo & schedules workers accordingly
    - All within one region (multi AZ)

> If you want to 'think' about the capacity you can.  This may be a good idea.  Regardless of your suggestions, it will compute as necessary and add more as necessary

- Why is this a big deal
    - You no longer have to estimate how many workers are needed for your workloads - they are provisioned as needed, automatically

- Serverless? Really?
    - TBH you still need to think about worker nodes and how they are configured


> If you are thinking about `(Spark, Hive, Presto)` then you are already thinking about the underlying configuration

> __ONLY CLI is supported at this time__, no SDK no web console. 
#### END QUESTION
#### QUESTION X
Because EMR is serverless, its easy to think AWS will do everything automatically. However, there is a very import step that MUST be done for each application. 

Also, what is the EMR Lifecycle? 
#### ANSWER X
- Create
- Created
- Starting
- Started
- Stopping
- Stopped
- Terminate

__EACH HAS TO BE MANUALLY__  Hence, you __MUST__ terminate!! You will be billed otherwise.

#### END QUESTION

#### QUESTION X
When creating a EMR Serverless application and it uses Spark.  There is something important we must consider in capacity planning (yes even for serverless)
#### ANSWER X

- Spark adds 10% overhead to memory requested for drivers and executors
- Be sure initial capacity is at least 10% more than requested by the job

#### END QUESTION

#### QUESTION X
What is the advantage of running EMR (serverless) on EKS?
#### ANSWER X
You can share application resources with your other apps that may also be running in EKS. 
#### END QUESTION

#### QUESTION X
At it's core, MapReduce is a stack of 3 modules.  Discuss the three components
#### ANSWER X
These are the main modules
[MapReduce]
[YARN]
[HDFS]

> They presented a diagram with a stack

`HDFS` - Hadoop file system. It is temporary but super fast for caching intermediate results (less compute time)

`YARN` - Yet Another Resource Negotiator
`MapReduce` - __Framework to create Application that processes vasts amount of data in parallel__


Basically you write Map functions and Reduce functions

> A map function maps data to sets of key value paris called 'intermediate results' and map functions (transform, extract)

> A reduce function combines intermediate results and maybe transform for final output

> Generally Mapper transfer/prepare  Reduce Distill/aggregate


#### END QUESTION

#### QUESTION X
Spark is highly versatile and can support much of the Machine Learning activity.. However, it is not good at something particular, what is it?
#### ANSWER X
#### END QUESTION
- Highly versatile but __not used for batch__, more for transforming data as it comes in

#### Apache Spark

#### QUESTION X
MapReduced had 3 main modules, Spark has 4.  What is the 'module stack' compared to MapReduce? 
#### ANSWER X
[MapReduce] [Spark]
[----- YARN ------]
[----- HDFS ------]

> Spark has largely replaced MapReduce and is faster

- Highly versatile but __not used for batch__, more for transforming data as it comes in
#### END QUESTION

#### QUESTION X
What languages does Spark support(4)?
#### ANSWER X
Spark has APIs for Java, Scala, Python and R
#### END QUESTION

#### QUESTION X
Spark MLLib offers several algorithms which have alternative. What makes the Spark edition different? 

What are the algorithms?
#### ANSWER X
- Classification: logistic regression, naive Bayes
- Regression
- Decision trees
- Recommendation engine (ALS)
- Clustering (K-Means)
- LDS (topic modeling)
- ML Workflow utilities (pipelines, feature transformation, persistence)
- SVD, PCA, Statistics

> What is important here is all of these are offered in a way that they are distributed and scalable, not all ML algorithms are scalable/distributed. These will run on Cluster where as alternative may not be able to.
#### END QUESTION

#### QUESTION X
What is Spark + Zeppelin?

#### ANSWER X
- Can run Spark code interactively (like you can Spark shell) 
  - This speeds up or development cycle
  - And allows easy experimentation and exploration of your big data
- Can execute SQL queries directly against SparkSQL
- Query results may be visualized in charts and graphs
- Makes Spark feel more like a data science tool

#### END QUESTION




#### QUESTION X
What is the curse of dimensionality?  More specifically, discuss how/why dimensional space grows causing sparse data.
#### ANSWER X
> When we add a feature we add dimensional space.  When a model represents a single feature, say 'age'.  That is graphed along a single axis.  When we add a second feature, height - this adds a second axis, adds second dimensional space.  Dimensional space increases.. In school, with graphing on paper, we always used 2 or 3 axis.. Are universe was limited to 2 or 3 dimensions.. Machine learning we add axis (dimensional space) ... hence we add space/universe for each dimension.  With too many dimensions are data becomes sparse.



> It is best to limit the dimensions to relevant features.. This is true for accuracy of the model, but also performance (real money)
 
#### END QUESTION

#### QUESTION X
Explain TF-IDF, TF and DF. 

Need to understand the terms but also the formula.
#### ANSWER X

TF-IDF

- Stands for "Term Frequency and Inverse Document Frequency"
- Important data for search - figures out what terms are most relevant for a document



- _Term Frequency_ just measures how often a word occurs in a document
  - A word that occurs frequently is probably important to that document's meaning

- _Document Frequency_ is how often a word occurs in a entire set of documents, ie, all of wikipedia or every web page
  - This tells us about common words that just appear everywhere no matter what topic like "a", "the", "and", etc, _how common the word is for all documents_


__TF-IDF Explained (01:36)__


- So a measure of the relevancy of a word to a document might be:
  (Term Frequency)/(Document Frequency)

  Or: Term Frequency * (Document Frequency)^-1

  That is, take how often the word appears in a document, over how often it just appears everywhere.  That give you a measure of how important and unique this word is for a this document.
#### END QUESTION

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
What is unbalanced data?
Give example of why it matters.
#### ANSWER X

- Large discrepancy between "positive" and "negative" cases
  - ie fraud detection. Fraud is rare and most rows will not be fraud
  - don't let the terminology confuse you; "positive" doesn't mean "good"
    - it means the thing you're testing for is what happened
    - if your machine learning model is made to detect fraud, then fraud is the positive case

- Mainly a problem with neural networks

> Model sees in training data 99.9% of the case are negative for fraud so the model will start assuming everything is fraud and will be accurate 99.9% of the time.

#### END QUESTION

#### QUESTION X
What are common technique of dealing with `unbalanced data` (4)? 
#### ANSWER X
1. Oversampling
- Duplicate samples from minority class
- Can be done at random

2. under-sampling
- Instead of create more positive samples, remove negative samples
- Throwing data away is __usually not the right answer__
  - Unless you are specifically trying to avoid "big data" scaling issues

3. SMOTE
- Synthetic Minority Over-sampling TEchnique
- Artificially generate new samples of the minority class using nearest neighbors
  - Run K-nearest-neighbors of each sample of the minority class
  - Create a new sample from the KNN result (mean of the neighbors)
- Both generate new samples and under-samples majority class
- Generally better than just over-sampling

4. Adjusting Thresholds

- When making predictions about classification (fraud / not fraud), you have some sort of threshold of probability at which point you'll flag something as the positive case (fraud)
- If you have too many false positive, one way to fix that is to simply increase that threshold
  - Guarantee to reduce false positive
  - But, could result in more false negative

> He goes on to say many models will provide a probability of fraud / not fraud, this is the threshold he talking about.

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
Explain 'binning' and mention qunatile binning.
#### ANSWER X

- Bucket observations together based on range values
- Example: estimate ages of people
  - put all 20-something in one classification, 30-something in another, etc
- Quntile binning categorizes data by their place in the data distribution
  - Ensures even sizes of bing
- Transforms numeric data to ordinal data
- Especially useful when there is uncertainty in the measurements


> Binning think 'index box'

> Binning is good for categorizing imprecise data, age 20.3 or 30 20-somethings

> Binning will throw out of data so do it if you need categorization or your data has errors 

> Qunatile binning means that there are the same number samples for each bin (instead of creating bins on categorize, we categorize data and create the bins) __Will have evan sizes in each bin__


#### END QUESTION
 



#### QUESTION X
Explain what it is to transform data.
#### ANSWER X
- Applying some function to a feature to make it better suited for training
- Feature data with an exponential trend may benefit from logarithmic transform
- Example: YouTube recommendation
  - A numeric feature X mis also represented by X^2, sqrt(X)
  - This allows learning of super and sub-linear functions


> Youtube, for each numeric feature they also look at X^2 and sqrt(X), to look for other patterns that may not be present with the linear X


> He makes the point that transformation doesn't necessarily mean change a feature, you can derive other features for a value (youtube)
#### END QUESTION




#### QUESTION X
Discuss briefly "Scaling and Normalizing Data".  Why do we do it?
#### ANSWER X
- __Some models prefer feature data to be normally distributed around 0 (most neural nets)__
- Most models require feature data to at least to be scaled to comparable values
  - Otherwise features with larger magnitudes will have more weight than the should
  - Example: modeling age and income as features - incomes will be much higher values than age
- `Scikit_learn` has a preprocessor module that helps(`MinMaxScaler`, etc)
- Remember to scale your result back up (if you scaled them down)

#### END QUESTION


#### QUESTION X
Discuss "Shuffling" what is it? Why do we do it?
#### ANSWER X
- Many algorithms benefit from shuffling their training data
- Otherwise they may learn from residual signals in the training data resulting from the order which they were collected

#### END QUESTION


#### QUESTION X
How to configure SM Domain to use one VPC
#### ANSWER X
In the domain set-up/creation process, there should be an option to 'vpc only' which will indicate to SM, not to create the secondary Domain.

#### END QUESTION
#### QUESTION X
Describe briefly what is a SageMaker domain. What are created under the domain? What is the option about VPCs?
#### ANSWER X


Before you get started you need a SM domain.  Everything you do is under the umbrella of SM Domain.

- Domains organize users, apps, resources
  - __Single EFS shared__
  - User Profiles with personal apps
    - SM Studio Instances
    - Private EFS directory (from shared volume)
    - Shared resources across other users
  - Shared Spaces
    - Shared EFS Directory
    - Communal IDE App    

#### VPC's for SageMaker AI Domains (01:56)
> Notice how domains are associated with VPC


> SM Domain by default a domain has two VPCs
  - One for Internet Access
    - Manged by SM AI
  - And your own
    - Encrypted traffic to your EFS volume
    - You specify the VPC, it's subnets, and Security Groups

You must bring your own VPC, SM will create an additional.

- You can change this
  - Send all traffic to your own VPC
    - Select "VPC Only" when creating the domain.

#### END QUESTION

#### QUESTION X
What is SM Ground Truth?
#### ANSWER X
Ground Truth is a service that lets you farm-out your image labeling work (maybe other work?).  It will create a model to attempt to label images itself (save money), and only images that have low confidence score will get labled by Humans.
#### END QUESTION

#### QUESTION X
Ground Truth leverages actual Humans.  Who are the Humans? Where do they come from?
#### ANSWER X
- Mechanical Turk
- Your own internal team
- Professional Labeling companies


#### END QUESTION

#### QUESTION X
What is Ground Truth Plus?
#### ANSWER X
Same purpose as Ground Truth except Amazon does all the work for you.

- Turkey solution
- "Our team of EWS Experts" manages the workflow and team of labelers
  - You fill out an intake form
  - They contact you and discuss pricing

- You tran progress via the Ground Truth Plus Project Portal
- Get labeled data from S3 when done
#### END QUESTION
#### QUESTION X
What is Mechanical Turk?
#### ANSWER X
- Crowd-sourcing marketplace to perform simple human tasks
- Distributed virtual workforce

- Example
  - You have a data set of 10,000,000 images and you want to labels these images
  - You distribute the task on Mechanical Turk and humans will tag those images
  - You set the reward per image (example $0.10/image)
  - > Up to you to determine the cost of the task

- Use cases: image classification, data collection, business processing  

- Integrate with Amazon A2I, SageMaker Ground Truth....

#### END QUESTION


#### QUESTION X
What is SM Data Wrangler - Quick Model
#### ANSWER X
"Quick Model" to train your model with your data and measure its results

#### END QUESTION


#### QUESTION X
__TODO__ Do a hands on with DataWrangler  - you may not necessarily need to accomplish something but you do want to click around.
0071 / 03:30

I __think__ the output of Data Wrangler is a Notebook..
#### ANSWER X
__TODO__ 0071 / 03:30

 
#### END QUESTION

#### QUESTION X
__TODO__ ⭐0073 Demo SageMaker Studio Canvas and Data Wrangler (24:20)
__COSTS BIG MONEY__ The hands on could be expensive also the UI changes frequently so the test will not actually include UI questions.

However, I should have familiarity so I should click around
#### ANSWER X
__TODO__ ⭐0073 Demo SageMaker Studio Canvas and Data Wrangler (24:20)
Hands On, Lab.. They recommend DO NOT FOLLOW ALONG due to costs. 

Still worth watching and x2 speed.

#### END QUESTION




#### QUESTION X
Describe SageMaker Model Monitor (9 points)

#### ANSWER X
> Get alerts on quality deviations on your deployed models (via CloudWatch)

- Visualize data drift
  - Example: loan model starts given people more credit due ot drift in missing input features


- Detect anomalies & outliers
- Detect new features
- No Code Needed

- Data is stored in S3 and secured
- Monitoring jobs are scheduled via a Monitoring Schedule
- Metrics are emitted to CloudWatch
  - CloudWatch notification can be used to trigger alarms
  - You'd then take corrective action (retrain the model, audit the data)
- Integrates with Tensorboard, QuickSight, Tableau
  - Or just visualize within SageMaker Studio  


#### END QUESTION

#### QUESTION X
What is the advantage of using Clarify with Model Monitor?
#### ANSWER X
- SageMaker Clarify detects potential bias
- ie imbalance across different groups/ages/income brackets
- With Model Monitor you can monitor for bias and be alerted to new potential bias via CloudWatch
-SageMaker Clarify also helps explain model behavior
  - understand which features contribute the most to your predictions
#### END QUESTION

#### QUESTION X
What are the monitor types (drift types), of Model Monitor (4)?
#### ANSWER X
- Monitoring Types
  - Drift in __data__ quality
    - Relative to baseline you create
    - Quality is just statistical properties of the feature
  - Drift in __model__ quality
    - Works the same way with a model quality baseline
    - Can integrate with Ground Truth Labels
  - Bias Drift
  - Feature attribution drift
    - base on normalized discounted cumulative Gain (NDCG) score
    - This compares feature ranking of training vs live data
    
#### END QUESTION

#### QUESTION X
What are Shapley, SHAP, and Async Shapley Values?
#### ANSWER X


> Shapley Drop individual features and see what effect that has on your model

> SHAP is a way of approximating so we don't have to do the brute force technique for models with many features.

> Asymmetric Shapley Values are across time which can add some complication

- Shapley values are the algorithm used to determine the contribution of each feature towards a mode's predictions.
  - Originated in the __game theory__, adapted to ML
  - Basically measures the impact of dropping individual features
  - Gets complicated with lots of features
    - SageMaker Clarify uses Shapley Additive exPlanations (SHAP) as an approximation technique.

- Asymmetric Shapley Values:
  - For Time Series
  - The algorithm used to determine the contribution of input features at each time step toward forecasted predictions 


#### END QUESTION



#### QUESTION X

Describe SM Feature Store

#### ANSWER X

SageMaker Feature Store

- A "feature" is just a property used to train a machine learning model
  - Like, you might predict someone's political party based on "features" such as their address, income, age, etc.
- Machine Learning models require fast, secure access to feature data for training
- It's also a challenge to keep it organized and share features across different models

> Features could come from anywhere, any source.  There is a slide that makes it clear that AWS's services are well integrated with the Feature Store

- How SageMaker Feature Store Organizes your Data (01:56)
> Feature's power is that it allows you to organize your features


----------------------------------------------
|                 Feature Store              |
| |---Feature Group---|  |---Feature Group---|
    recordId
    feature Name
    event Time  


- How does it all work (2:10)
Data Ingestion (streaming or batch)

Feature Store has two modes/type
- Online (real time/Streaming)
- Offline (Batch)

- Online
  - Stream data into Feature Store with `PutRecord` / `GetRecord`

- Offline
 - Batch access via the offline S3 store (use with anything hits S3)

- Security Feature Store Security
    - Encrypted at rest and in transit
    - Works with KMS customer Master Keys
    - Fine-grained access control with IAM
    - May also be secured with AWS PrivateLink
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

#### END QUESTION
> Table definition and __ETL__

> There is not a lot to Glue but it is important to internalize it and fully understand how it fits into the grander scheme of things.

> The purpose of Glue is to extract structure from unstructured data. 

> The other thing Glue does is Custom ETL jobs. Uses Apache Spark under the hood

__EXAM__ Glue is HUGE

#### QUESTION X
Describe GLUE in a nut-shell (two main purpose).
#### ANSWER X
- Serverless discovery and definition of table definitions and schema
  - S3 - "data lakes"
  - RDS
  - Redshift
  - Most other SQL database

- Custom ETL Jobs
  - Trigger-driven, on schedule or on demand
  - Fully managed

#### END QUESTION

#### QUESTION X
What is Glue Crawler?
Describe what data goes where and how do we view/use it?
#### ANSWER X


- Glue crawler scans dat in S3, creates a schema
- Can run periodically
- Populates Glue Data Catalog
  - Store only table definitions go
  - Original data stays in S3
- Once cataloged, you can treat your unstructured data like its structured
  - Redshift Spectrum
  - Athena
  - EMR
  - QuickSight


__TODO__ Put all my notes (unstructured) in S3 And let Glue do its thing


[Diagram https://d2908q01vomqb2.cloudfront.net/b6692ea5df920cad691c20319a6fffd7a4a766b8/2020/01/23/S3SpendwithGlueRedshift2-788x630.png]


#### END QUESTION

#### QUESTION X
For Glue, what is the best way to partition (organize) your buckets?
#### ANSWER X
- Glue crawler will extract partitions based on how your S3 data is organized
- Think up front about how you will be querying your data lake in S3
- Example: devices send sensor data every how
- Do you query primarily by time ranges?
  - if so, organize your buckets as yyyy/mm/dd/device
- Do you query primary by device?
  - If so organize your buckets as device/yyyy/mm/dd

> Think carefully about 'domain', 'subdomain', and 'sub-subdomain' the greatest to the least. 

> How to partition your S3 buckets for Glue?
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

#### END QUESTION





- Can organize users/teams/apps workloads into Workgroups
- Can control query access and track costs by workgroup
- Integrate with __IAM, CloudWatch, SNS__
- Each workgroup can have its own:
  - Query History
    - Data Limits (you can limit how much data queries my scan by workgroup)
    - IAM policies
    - Encryption Settings

> Can limit the data scanned (costs) by work-group
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
What is Athena's cost model?
How to save 90%?
#### ANSWER X
- Pay as you go
  - $5 per TB scanned
  - Successful or cancelled queries count, __failed queries do not__
  - No charge for DDL (CREATE/ALTER/DROP)
- __Save LOTS of money by using columnar formats__
  - ORC, Parquet
  - Save 30-90% and get better performance
  - > Because columnar format is more about only what you use (not read the whole record)
- Glue and S3 Have their own charges

> Partitioning your data in S3 can also help to reduce costs

#### END QUESTION
#### QUESTION X
Describe Athena Security (4)
#### ANSWER X
- Access Control
  - IAM, ACLs, S3 Bucket Policies
  - `AmazonAthenaFullAccess` / `AWSQuicksightAthenaAccess`
- Encrypt results at rest in S3 staging directory
  - Server-side encryption with S3-manged key (SSE-S3)
  - Server-side encryption KMS Key (SSE-KMS)
  - CLient-side encryption with KMS Key (CSE-KMS)
- Cross account access in S3 bucket policy, possible
- Transport Layer Security (TLS), encrypts in-transit (between Athena and S3)
#### END QUESTION

#### QUESTION X
What are the two Athena Anti-patterns?
#### ANSWER X
- Highly formatted reports / visualization
  - That is what Quicksight is for
- ETL
  - use Glue instead  
#### END QUESTION

#### QUESTION X
Using Athena, what is a quick, down and dirty way to covert data from one type to another?
#### ANSWER X
`CREATE TABLE AS SELECT`

> Because you can redefine the structure 'SELECT some_num as String` (not athena code but you get the idea)

- You might see this in the context of Amazon Athena
  - But it exists in other databases as well
- Create new table for query results (CTAS)
- Can bue sued to create new table that's a subset of another
- __Can ALSO be used to convert data into a new underlying format__
  - So this is a track to get Athena to covert data stored in S3

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
What two AWS big-data services Support ACID transaction? 
#### ANSWER X
Lake house or Athena
(Lake Formation?)
#### END QUESTION

#### QUESTION X
7 Points about Athena ACID transactions
#### ANSWER X
- Powered by Apache Iceberg
  - Just add `table_type = 'ICEBERG'` in your `CREATE TABLE` command
- Concurrent users can safely make __row-level__ modification
- Removes need for custom record locking [removes need for roll your own code]
- Time Travel operations
  - Recover data recently deleted with by using a select statement
- Remember governed tables in Lake Formation, This is another way of getting ACID features in Athena
- Benefit from period compaction to preserve performance

#### END QUESTION

#### QUESTION X
Requirement to get Athena to use ACID transactions?

#### ANSWER X
Athena is Powered by Apache Iceberg
  - Just add `table_type = 'ICEBERG'` in your `CREATE TABLE` command

#### END QUESTION


##########

#### QUESTION X
#### ANSWER X
#### END QUESTION
