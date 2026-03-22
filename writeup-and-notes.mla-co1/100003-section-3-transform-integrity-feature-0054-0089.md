
# Section 3 transform, integrity, feature engineering 0054-0089


### ⭐0054 Intro Data Transformation, Integrity and Feature Engineering (01:17)
He will talk about SM and Glue plus labs

__Warning__ we'll be working with big data means be expense

__recommendation__ set up a billing alarm


### ⭐0055 MapReduce (EMR) and Hadoop Overview (07:14)

What is EMR?
- Elastic MapReduce
- Managed Hadoop framework on EC2 instances
- Includes Spark, HBase, Presto, Flink, Have and more
- EMR Notebooks
- Several integration points with AWS

#### An EMR Cluster (01:12)
[diagram https://miro.medium.com/v2/resize:fit:1220/1*BCh7Y5Jy3ZlDCSLJip4Wxw.png]

- `Master node` manges the cluster
    - Single EC2 instance
- `Code node`: Hosts HDFS data and runs tasks
    - can be scaled up/down, but with some __risk__
- `Task node`: Runs tasks, does not host data
    - no risk of data loss when removing
    - good use of __spot instances__


EC2 Instance == Node

Task instances are 'necessary' but useful and used only for computation.

#### EMR Usage (02:51)

EMR Usage

- Transient vs Long-Running Clusters
    - Can spin up task nodes using Spot instances for temporary capacity
    - can use reserved instances for long-running clusters to save money
- Connect directly to master to run jobs
- Submit ordered steps via the console

If you have a known set of steps/tasks to run. You can run a transient cluster and reserved instances.

If you have long running queries or if you need to interact with the app(s), you can run a long running cluster and terminate by hand when done

#### EMR / AWS Integration

- EC2 for instances that comprise nodes in the cluster
- VPC to configure the virtual network in which you launch instances
- S3 to store input/output data (alternative to Hadoop)
- CloudWatch to monitor cluster performance and configure alarms
- IAM to configure permissions
- CloudTrail to audit requests to service
- Data PipeLine to schedule and start your clusters

#### EMR Storage

- HDFS (default)
- EMRFS: access S3 as if it were HDFS
    - EMRFS Consistent View - optional for S3 consistency
    - Uses DynamoDB to track consistency
- Local File system
- EBS for HDFS

Con to HDFS is it's temporary. Once the cluster is gone so is the filesystem (your data).

Pro to HDFS probably fastest (high performance)

> Key point is that you can use S3 in place of HDFS (EMRFS) 

#### EMR Promises (06:44)

- EMR Charges by the hour
    - plus ECS charges
- Provisions new nodes if a core node fails
- Can add and remove task nodes on the fly
- Can resize a running cluster's core nodes

### ⭐0056 EMR Serverless (11:57)

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


#### Using EMR Serverless

__ONLY CLI is supported at this time__, no SDK no web console. 

[Diagram]

The Diagram seems to be kinda to demonstrate a point, in general, how EMR works.  Looking on google I can see there are several different configuration


#### EMR Serverless Application Lifecycle
- Create
- Created
- Starting
- Started
- Stopping
- Stopped
- Terminate

__EACH HAS TO BE MANUALLY__  Hence, you __MUST__ terminate!! You will be billed otherwise.

#### Pre-initialized Capacity

__EXAM__
- Spark adds 10% overhead to memory requested for drivers and executors
- Be sure initial capacity is at least 10% more than requested by the job

```
AWSTemplateFormatVersion: "2010-09-09"
Description: EMR Serverless Application (Spark)

Resources:
  EMRServerlessApplication:
    Type: AWS::EMRServerless::Application
    Properties:
      Name: sample-emr-serverless-spark
      ReleaseLabel: emr-6.12.0
      Type: SPARK
      InitialCapacity:
        Driver:
          WorkerCount: 1
          WorkerConfiguration:
            Cpu: "2 vCPU"
            Memory: "4 GB"
        Executor:
          WorkerCount: 2
          WorkerConfiguration:
            Cpu: "4 vCPU"
            Memory: "8 GB"
      MaximumCapacity:
        Cpu: "16 vCPU"
        Memory: "64 GB"
      AutoStartConfiguration:
        Enabled: true
      AutoStopConfiguration:
        Enabled: true
        IdleTimeoutMinutes: 15
      NetworkConfiguration:
        SubnetIds:
          - subnet-xxxxxxxx
        SecurityGroupIds:
          - sg-xxxxxxxx
      Tags:
        Project: Learning
        Service: EMRServerless

Outputs:
  ApplicationId:
    Description: EMR Serverless Application ID
    Value: !Ref EMRServerlessApplication
```

#### EMR serverless security

- Basically the same as EMR
- EMRFS
    - S3 Encrypting (SSE or CSE) at rest
    - TLS in transit between EMR nodes and S3
- S3
    - SSE-S3, SSE-KMS
- Local disk encryption
- Spark communication between drivers and executors is encrypted
- Have communication between Glue Metastore and EMR uses TLS
- Force HTTPS (TLS) on S3 Policies with `aws:SecureTransport`        


#### EMR on EKS
> `spark` in particular. 

- Allows submitting Spark job on Elastic Kubernetes Service without provisioning clusters

- Fully managed
- Share resource between SPark and other Apps on kubernetes

### ⭐0057 Apache Spark on EMR (09:59)

#### So... What is Hadoop?

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

#### Apache Spark

[MapReduce] [Spark]
[----- YARN ------]
[----- HDFS ------]

> Spark has largely replaced MapReduce and is faster

- Highly versatile but __not used for batch__, more for transforming data as it comes in

#### How Spark Works

[diagram https://spark.apache.org/docs/latest/img/cluster-overview.png]


[Driver Program / spark context] -> [Cluster manager] [executor, cache, task]

#### Spark Components (04:27)

[Spark Streaming][Spark SQL][MLLib][GraphX]
[-------------- Spark Core ---------------]

Spark has APIs for Java, Scala, Python and R


#### Spark MLLib
- Classification: logistic regression, naive Bayes
- Regression
- Decision trees
- Recommendation engine (ALS)
- Clustering (K-Means)
- LDS (topic modeling)
- ML Workflow utilities (pipelines, feature transformation, persistence)
- SVD, PCA, Statistics

> What is important here is all of these are offered in a way that they are distributed and scalable, not all ML algorithms are scalable/distributed. These will run on Cluster where as alternative may not be able to.


#### Spark Structured Streaming
[Diagram]

I think the point is that Spark uses tables.. When used with streaming it creates a table and simple appends events/messages to the end of the table.  Then the 'stream' can be treated as a table


#### Spark + Kinesis
Can have Kinesis producer publish data to a kinesis data stream.

#### Zeppelin + Spark

- Can run Spark code interactively (like you can Spark shell) 
  - This speeds up or development cycle
  - And allows easy experimentation and exploration of your big data
- Can execute SQL queries directly against SparkSQL
- Query results may be visualized in charts and graphs
- Makes Spark feel more like a data science tool

### ⭐0058 Feature Engineering and the Curse of Dimensionality (06:34)
What is Feature engineering

- Applying your knowledge of the data - and th emodel you're using - to create better features to train your model with.
  - Which features should I use?
  - Do I need to transform these features in some way?
  - How do I handle missing data?
  - Should I create new features from the existing ones

- You can't just throw in raw data and expect good results
- This is the art of Machine Learning; where expertise is applied
- "Applied machine learning is basically feature engineering" - Andrew Ng

> We want to determine the income of a person by looking at their 'features', their sex, age, years in school, etc.. (those are features).

> Which features are important to what I am trying to predict, and choosing those features wisely.  Hight of a person probably has little impact on their income.. probably

> Sometimes 'feature' needs to be transformed

> sometimes you will have missing data

> sometimes you want new feature

> Sometimes you want to combine or augment feature

> Not a simple process... Simply throwing data at the model will not result in a good model


## The cure of dimensionality

Why is feature engineering important?

- Too many features can be a problem
- Every feature engineering is selecting the feature most relevant to the problem at hand
  - This often is where domain knowledge comes into play
- Unsupervised dimensionality reduction techniques can also be employed to distill many features into fewer features
  - PCA
  - K-Means  

> Too many feature can be a problem, can lead to sparse data.

> When we add a feature we add dimensional space.  When a model represents a single feature, say 'age'.  That is graphed along a single axis.  When we add a second feature, height - this adds a second axis, adds second dimensional space.  Dimensional space increases.. In school, with graphing on paper, we always used 2 or 3 axis.. Are universe was limited to 2 or 3 dimensions.. Machine learning we add axis (dimensional space) ... hence we add space/universe for each dimension.  With too many dimensions are data becomes sparse.


> It is best to limit the dimensions to relevant features.. This is true for accuracy of the model, but also performance (real money)


### ⭐0059 Lab Preparing Data for TF-IDF with Spark and EMR studio (06:18) 

TF-IDF

- Stands for "Term Frequency and Inverse Document Frequency"
- Important data for search - figures out what terms are most relevant for a document


TF
- _Term Frequency_ just measures how often a word occurs in a document
  - A word that occurs frequently is probably important to that document's meaning

- _Document Frequency_ is how often a word occurs in a entire set of documents, ie, all of wikipedia or every web page
  - This tells us about common words that just appear everywhere no matter what topic like "a", "the", "and", etc, _how common the word is for all documents_


#### TF-IDF Explained (01:36)


- So a measure of the relevancy of a word to a document might be:
  (Term Frequency)/(Document Frequency)

  Or: Term Frequency * (Document Frequency)^-1

  That is, take how often the word appears in a document, over how often it just appears everywhere.  That give you a measure of how important and unique this word is for a this document.

  #### TF-IDF In Practice

- We actually use the log of IDF, since word frequencies are distributed exponentially.  That gis us better weighting of a words overall popularity

- TF-IDF assumes a document is just a "bag of words"
  - Parsing documents into bags of words can be most of the work
  - Words can be represented as hash value (number) for efficiency
  - What about synonyms? Various tenses? Abbreviations? Capitalizations? Misspellings?
- Doing this at scale is the hard part
  - That is where Spark comes in

#### Unigrams, bigrams, etc.

- An extension of TF-IDF is to not only compute relevancy for individual words (terms) but also for bi-grams or more generally, n-grams

- "I love certification exams"
  - Unigram: "I", "love", "certification", "exams"
  - Bi-grams: "I love", "love certification", "certification exam"
  - Tri-grams: "I love certification", "love certification exam"

__EXAM__ You may have a question on exam that will ask you to break a sentences into unigram, bi-grams. It's not clear to me if we are suppose to give the number of occurence of each bi-gram, tri-gram etc or if we were supposed to break but the sentences into bigram.  __trick__ in the end we are counting popularity... not actual bigram/trigram


#### Using TF-IDF

- A very simple search algorithm could be:
  - Compute TF-IDF for every word in a corpus
  - For a given search word, sort the documents by their TF-IDF score for that word
  - Display results


### ⭐0060 - *HANDS_ON* TF-IDF with Apache Spark and EMR Studio (20:06)

Load data
tokenize, 
hashingTF

Watched the whole video 2x speed.  It was what you would expect
__VERY IMPORTANT - THE VERY END SHOWS HOW TO CLEAN UP - VERY IMPORTANT__



### ⭐0061 Imputing missing data (08:04)

#### Imputing missing data: Mean Replacement

- Replace missing values with the mean value from the rest of the column (columns, not rows! A column represents a single feature; it only makes sense to take the mean from other samples of the same feature)
- Fast & and east, won't affect mean or sample size of the overall data set
- Median may be a better choice than mean when outliers are present
- But it's generally pretty terrible
  - Only works on column level, misses correlations between features
  - Can't use categorical features (imputing with most frequent value can work in this case though)
  - Not very accurate

> This is kinda of the 'lazy' approach, quick and easy.

__EXAM__ this is likely never the correct answer


#### Imputing missing Data: dropping 

- If not many rows contain missing data...
  - ... and dropping those rows doesn't bias your data...
  - ... and you don't have a lot of time...
  - ... maybe its a reasonable thing to do

- But, it's never going to be the right answer for the 'best' approach
- Almost anything is better.  Can you substitute another similar field perhaps? (ie review summary vs full text)

__EXAM__ this is likely never the correct answer

#### Imputing Missing Data: Machine Learning

- KNN: find K "nearest" (most similar) rows and average their values
  - Assumes numerical data, not categorical
  - There are ways to handle categorical data (Hamming distance), but categorical data is probably better served by...

- Deep Learning (best)
  - Build machine learning model to impute data for your machine learning model
  - Works well for categorical data.  Really Well. But it's complicated

- Regression
  - Find linear or non-linear relationships between the missing feature and other features
  - Most advanced technique: MICE (Multiple Imputation by Chained Equations)


#### Imputing Missing Data: Just get more data

- What's better than imputing data? Getting more real data!
- Sometimes just have to try harder or collect more data


### ⭐0062 Dealing with unbalanced data (5:35)

#### What is unbalanced data?
What is unbalanced data?
- Large discrepancy between "positive" and "negative" cases
  - ie fraud detection. Fraud is rare and most rows will not be fraud
  - don't let the terminology confuse you; "positive" doesn't mean "good"
    - it means the thing you're testing for is what happened
    - if your machine learning model is made to detect fraud, then fraud is the positive case

- Mainly a problem with neural networks

> Model sees in training data 99.9% of the case are negative for fraud so the model will start assuming everything is fraud and will be accurate 99.9% of the time.

#### Oversampling
- Duplicate samples from minority class
- Can be done at random

#### under-sampling
- Instead of create more positive samples, remove negative samples
- Throwing data away is __usually not the right answer__
  - Unless you are specifically trying to avoid "big data" scaling issues

#### SMOTE
- Synthetic Minority Over-sampling TEchnique
- Artificially generate new samples of the minority class using nearest neighbors
  - Run K-nearest-neighbors of each sample of the minority class
  - Create a new sample from the KNN result (mean of the neighbors)
- Both generate new samples and under-samples majority class
- Generally better than just over-sampling

#### Adjusting Thresholds

- When making predictions about classification (fraud / not fraud), you have some sort of threshold of probability at which point you'll flag something as the positive case (fraud)
- If you have too many false positive, one way to fix that is to simply increase that threshold
  - Guarantee to reduce false positive
  - But, could result in more false negative

> He goes on to say many models will provide a probability of fraud / not fraud, this is the threshold he talking about.

### ⭐0063 Handling Outliers (08:30)

#### Variance

Variance measures how "spread-out" the data is
`Sigma Squared (σ)` 

- Variance (σ^2) is simple the average of the square differences from the mean.
- Example: what is the variance of the data set (1, 4, 5, 4, 8)?
-  First find the mean (1 + 4 + 5  + 4 + 8) / 5 = 4.4
- Now find the differences from the mean (-3.4, -0.4, 0.6, -0.4, 3.6)
- Find the square difference: (11.65, 0.16, 0.36, 0.16, 12.96)
- Find the average of the squared differences:
  (σ^2) = (11.56 + 0.16 + 0.36 + 0.16 + 12.96) / 5 = 5.04


#### Standard Deviation σ is just the square root of the variance

- σ^2 =  5.04
- σ = sqrt(5.04) = 2.24
- So the standard deviation of (1, 4, 5, 4,8) is 2.24
- This is usually used as a way to identify outliers. __Data points that lie more than one standard deviation from the mean can be considered unusual__

- You can talk about how extreme a data point is by talking about "how many sigma" away from the mean it is.

#### Dealing with Outliers I

- Sometimes it' s appropriate to remove outliers from your training data
- Do this responsibly! Understand why you are doing this.
- For example: in collaboration filtering, a single user who rates thousands of movies could have a big effect on everyone else's ratings.  That may not be desirable
- Another example: in web log data, outliers may represent bots or other agents that should be discarded
- But if someone really wants the mean income of the US citizens for example, don't toss out billionaires just because you want to

> Use common sense when using 'throw out' method of dealing with outliers.

#### Dealing with Outliers II
- Our old friend standard deviation provides a principled way to classify outliers
- Find data points more than some multiple of stand deviation in our training data.
- What multiple? Just have to use common sense
- Remember AWS __Random Cut Forest__ algorithm creeps into may of it's services - it is made for outlier detection
  - Found within QuickSight, Kinesis Analytics, SageMaker and more

__EXAM__ if the question gives the option to use RCF for outlier detection, it is probably the correct answer

#### Example
No notes - he demonstrates with diagrams/graphs how outliers can cause the data to zoom out, missing the relationships of most of the data.  When we remove the outliers the graph zooms-in so we have a more detailed view of the data/graph


### ⭐0064 Binning, Transforming, Encoding, Scaling and Shuffling (7:59)

#### Binning 
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


#### Transforming

- Applying some function to a feature to make it better suited for training
- Feature data with an exponential trend may benefit from logarithmic transform
- Example: YouTube recommendation
  - A numeric feature X mis also represented by X^2, sqrt(X)
  - This allows learning of super and sub-linear functions


> Youtube, for each numeric feature they also look at X^2 and sqrt(X), to look for other patterns that may not be present with the linear X

> He makes the point that transformation doesn't necessarily mean change a feature, you can derive other features for a value (youtube)

#### Encoding

- Transforming dat into some new representation required by the model
- One-hot encoding
  - Create "buckets" for every category
  - The bucket for your category has a 1, all others have a 0
  - Very common in dep learning, where categories are represented by individual output "neurons"

__EXAM__ Understand how "One-Hot Encoding" works, it reminds me of categorizing the numbers 0 and 5.  We take each image 'is this a 0' 

> This is done because a neuron is generally represented as `1` or `0`, so we're boiling to down to binary


#### Scaling and Normalizing Data

- __Some models prefer feature data to be normally distributed around 0 (most neural nets)__
- Most models require feature data to at least to be scaled to comparable values
  - Otherwise features with larger magnitudes will have more weight than the should
  - Example: modeling age and income as features - incomes will be much higher values than age
- `Scikit_learn` has a preprocessor module that helps(`MinMaxScaler`, etc)
- Remember to scale your result back up (if you scaled them down)

#### Shuffling
- Many algorithms benefit from shuffling their training data
- Otherwise they may learn from residual signals in the training data resulting from the order which they were collected


### ⭐0065 - Course update/note
Slide, no presentation.  AWS Rebrand "SageMaker" to "SageMake AI".


### ⭐0066 SageMaker AI Overview (3:43)

> SageMaker is more than Generative AI.  It could do G.AI, but it does much more. SM is about the whole process of ML.  Fetch, clean, prep data -> train and evaluate a model -> Deploy Model evaluate results -> repeat

[diagram 0:55]

Diagram demonstrates flow between raw data -> training -> model -> inference -> evaluate -> retrain -> repeat

#### SageMaker notebooks can direct the process (2:10)

- Notebook Instances on EC2 or spun up from the console
  - S3 data access
  - scikit_learn, Spark, Tensorflow
  - Wide variety of built-in models
  - Ability to spin up training instance
  - Ability to deploy trained models for making predictions at scale

> Just a Jupyter Notebook, spun-up on an EC2 Instance for you.

> You can orchestrate the entire process writing python code, in notebook, in sage maker. Giving you access S3, instances, etc, everything

> It sounds like to me similar to CDK but for Python/Machine Learning instead of CDK and Cloudformation/Infrastructure.
#### You can also use the console (03:18)

You can also build training job from the console (point is it is point and click).

> You do not have to write Python to use SageMaker (though SM probably does use Python)

### ⭐0067 SM Domains 0067 (03:11)

#### SageMaker AI Domains
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


### ⭐0068 Data prep on SageMaker (5:35)

Data prep on SageMaker
- Ideal format varies with algorithm - often is RecordIO / protobuf

- Can also ingest fromAthena, EMR, Redshift, and Amazon Keyspaces DB 

- Apache Spark integrates with SageMaker

- Scikit_learn, numpy, pandas all at your disposal with a notebook

> Luster is an option

#### SageMaker Processing

Processing Jobs
- Copy data from S3
- Spin up a processing container
  - SageMaker built-in or user provided
- Output processed data to S3


#### Training on SageMaker
Create a training job
  - URL of S3 bucket with training data
  - ML compute resources
  - URL of S3 bucket for output
  - ECR path to training code

Training Options
- built-in training algorithms
- Spark MLLib
- Custom Python Tensorflow / MXNet
- PyTorch, Scikit-learn, RLEstimator
- XGBoost, hugging face, chainer
- your own docker image
- Algorithm purchased form AWS Market place


#### Deploying Trained Models

Save your trained model to S3
- Persistent endpoint for making individual prediction on demand
- SageMaker Batch Transform to get predictions fro an entire dataset

Lots of cool options
- INference Pipe-lines for more complex processing
- SM Neo for deploying edge devices
- Elastic INference for accelerating deep learning models
- Automatic Scaling (Increase # of endpoints as needed)
- Show Testing evaluate new models against currently deployed models to catch errors

### ⭐0069 Ground Truth and Label Generation (5:35)

- Sometimes you don't have training data at all, and it needs to be generated by human first
- Example: Training an image classification model.  Somebody needs to tag a bung of images with what they are images of before training a neural network
- __Ground Truth manages humans who will label your data for training purposes__.

> Ground Truth allows you to farm out work to humans to do that work for you.  He specifically mentions image labels

#### But it's more than that
- Ground Truth creates its own model as images are labeled by people
- As this model learns, only images the model isn't sure about are sent to human labelers
- This can reduce cost of labelling jobs by 70%

> And only the ambiguous cases are sent to human (over time the model gets better)

#### Who are those people

- Mechanical Turk
- Your own internal team
- Professional Labeling companies


#### Other ways to generate training labels
- Rekognition
  - AWS service for image recognition
  - Automatically classify images
- Comprehend
  - AWS Service for text analysis and topic modeling
  - Automatically classify text by topics, sentiment
- Any pre-trained model for unsupervised technique that may be helpful

#### Ground Truth Plus (4:32)

- Turkey solution
- "Our team of EWS Experts" manages the workflow and team of labelers
  - You fill out an intake form
  - They contact you and discuss pricing

- You tran progress via the Ground Truth Plus Project Portal
- Get labeled data from S3 when done

### ⭐0070 Mechanical Turk (2:28)

- Crowd-sourcing marketplace to perform simple human tasks
- Distributed virtual workforce

- Example
  - You have a data set of 10,000,000 images and you want to labels these images
  - You distribute the task on Mechanical Turk and humans will tag those images
  - You set the reward per image (example $0.10/image)
  - > Up to you to determine the cost of the task

- Use cases: image classification, data collection, business processing  

- Integrate with Amazon A2I, SageMaker Ground Truth....

### ⭐0071 SM Data Wrangler (06:54)
> Probably the most applicable SM technology to AI.

#### SageMaker Data Wrangler

> A lot in common with Glue Studio 

- Visual interface (In SM Studio) to prepare data for ML.
- Import Data
- Visualize Data
- Transform Data (300+ transformations to choose from)
  - Or integrate your own custom xforms with pandas, PySpark, PySpark SQL
- "Quick Model" to train your model with your data and measure its results

#### Data Wrangler source (01:29)

[Diagram] depicts several AWS data sources (s3, Lake Formation, etc, etc) pipes into SM Data Wrangler, which Pipes into SM pipeline, process, feature store


#### Data Wrangler Import Data (02:28)

Demonstrates Data Wrangler (Hands On)

#### Data Wrangler Quick Model Demo (04:58)

Just a hands on, demonstrate


#### Data Wrangler Troubleshooting

- Make sure your Studio have user has appropriate IAM roles
- Make sure permissions on your data sources allow Data Wrangler access
  - Add `AmazonSageMakerFullAccess` policy

- EC2 instance limit
  - If you get "the following instance type not available" errors
  - May need to request quota limit increase
  - Service Quota/Amazon SageMaker / Studio KernelGateway apps running on ml.m5.4xlarge instances

### ⭐0072 Notice about Data Wrangler getting more integrated with __SM Canvas__

#### Notice Data Wrangler is harder to find

  AWS is moving SageMaker Data Wrangler functionality under SageMaker Canvas in the new Unified Studio UI, per this documentation:

https://docs.aws.amazon.com/sagemaker/latest/dg/canvas-data-prep.html

The SageMaker Data Wrangler user interface is only available under the "Classic" SageMaker Studio UI, not the Unified Studio. You can still get to it if you create a domain under "Amazon SageMaker AI" (you have to explicitly search for that in the console,) and then under SageMaker Canvas you should still find SageMaker Data Wrangler. But, the ability to get to the "classic" SageMaker Studio seems to be in flux.

For the time being, I recommend just watching the following demo for Data Wrangler without following along. This also protects you from SageMaker's pricing, which can be higher than you expect - especially if you mistakenly leave something running.

Data Wrangler is mentioned in the exam guide, so I do think you need to know about it. But I get the feeling its days may be numbered. We'll keep an eye on the actual exam, and update the course as appropriate as the situation evolves.


### ⭐0073 Demo SageMaker Studio Canvas and Data Wrangler (24:20)

Hands On, Lab.. They recommend DO NOT FOLLOW ALONG due to costs. 

Still worth watching and x2 speed.


### ⭐0074 SM Model Monitor and SM Clarify (04:40)
> Get alerts on quality deviations on your deployed models (via CloudWatch)

- Visualize data drift
  - Example: loan model starts given people more credit due ot drift in missing input features


- Detect anomalies & outliers
- Detect new features
- No Code Needed


#### SM Model Monitor + Clarify (1:23)

- SageMaker Clarify detects potential bias
- ie imbalance across different groups/ages/income brackets
- With Model Monitor you can monitor for bias and be alerted to new potential bias via CloudWatch
-SageMaker Clarify also helps explain model behavior
  - understand which features contribute the most to your predictions


#### Pre-training Bias in Metrics in Clarify

- Class Imbalance
  - One facet (demographic group) has fewer training values than another

- Difference in Proportions of Labels (DPL)
  - Imbalance of positive outcomes between facet values

- Kullback-Leiber Divergence (KL), Jensen-Shannon Divergence (JS)
  - How much outcome distribution of facets diverge

- LP-Norm
  - P-norm difference between distributions of outcome from facets

- Total Variation Distance (TVD)
  - L1-Norm difference between distribution of outcomes and facets    

- Kolmogorov-Smirnov (KS)
  - Maximum divergence between outcomes of distributions from facets

 - Conditional Demographic Disparity (CDD)
  - Disparity of outcomes between facets as a whole and a by subgroups

> He said probably not on the exam but good to know these exist.


#### More about Model Monitor (2:31)

- Data is stored in S3 and secured
- Monitoring jobs are scheduled via a Monitoring Schedule
- Metrics are emitted to CloudWatch
  - CloudWatch notification can be used to trigger alarms
  - You'd then take corrective action (retrain the model, audit the data)
- Integrates with Tensorboard, QuickSight, Tableau
  - Or just visualize within SageMaker Studio  

#### Model Monitor, Monitor Types (03:26)

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

### ⭐0075 Partial Dependency Plots (PDPs), Sharply Values and SHAP (3:04)
> Something you can produce with Clarify

- Shows dependence of predicted target response on a set of input features

- Plots can show you how features values influence the prediction
  - In the example, higher values result in the same prediction

- you can also get back data distributions for each bucket of values

[the Graph of `age` indicates a drop at age 50, suggesting there something wrong with the data.. The point of clarify]


#### Shapley Values (01:38)

- Shapley values are the algorithm used to determine the contribution of each feature towards a mode's predictions.
  - Originated in the __game theory__, adapted to ML
  - Basically measures the impact of dropping individual features
  - Gets complicated with lots of features
    - SageMaker Clarify uses Shapley Additive exPlanations (SHAP) as an approximation technique.

- Asymmetric Shapley Values:
  - For Time Series
  - The algorithm used to determine the contribution of input features at each time step toward forecasted predictions 


> Shapley Drop individual features and see what effect that has on your model

> SHAP is a way of approximating so we don't have to do the brute force technique for models with many features.

> Asymmetric Shapley Values are across time which can add some complication

### ⭐0076 SM Feature Store (3:44)

#### SageMaker Feature Store
- A "feature" is just a property used to train a machine learning model
  - Like, you might predict someone's political party based on "features" such as their address, income, age, etc.
- Machine Learning models require fast, secure access to feature data for training
- It's also a challenge to keep it organized and share features across different models

> Features could come from anywhere, any source.  There is a slide that makes it clear that AWS's services are well integrated with the Feature Store

#### How SageMaker Feature Store Organizes your Data (01:56)
> Feature's power is that it allows you to organize your features


----------------------------------------------
|                 Feature Store              |
| |---Feature Group---|  |---Feature Group---|
    recordId
    feature Name
    event Time  


#### How does it all work (2:10)
Data Ingestion (streaming or batch)

Feature Store has two modes/type
- Online (real time/Streaming)
- Offline (Batch)

- Online
  - Stream data into Feature Store with `PutRecord` / `GetRecord`

- Offline
 - Batch access via the offline S3 store (use with anything hits S3)

#### Security Feature Store Security

- Encrypted at rest and in transit
- Works with KMS customer Master Keys
- Fine-grained access control with IAM
- May also be secured with AWS PrivateLink

### ⭐0077 SageMaker Canvas (01:48)
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


### ⭐0078 AWS Glue (6:03)
> Table definition and __ETL__

> There is not a lot to Glue but it is important to internalize it and fully understand how it fits into the grander scheme of things.

> The purpose of Glue is to extract structure from unstructured data. 

> The other thing Glue does is Custom ETL jobs. Uses Apache Spark under the hood

__EXAM__ Glue is HUGE

#### What is Glue
- Serverless discovery and definition of table definitions and schema
  - S3 - "data lakes"
  - RDS
  - Redshift
  - Most other SQL database

- Custom ETL Jobs
  - Trigger-driven, on schedule or on demand
  - Fully managed

#### Glue Crawler / Data Catalog
- Glue crawler scans dat in S3, creates a schema
- Can run periodically
- Populates Glue Data Catalog
  - Store only table definitions
  - Original data stays in S3
- Once cataloged, you can treat your unstructured data like its structured
  - Redshift Spectrum
  - Athena
  - EMR
  - QuickSight


__TODO__ Put all my notes (unstructured) in S3 And let Glue do its thing


[Diagram https://d2908q01vomqb2.cloudfront.net/b6692ea5df920cad691c20319a6fffd7a4a766b8/2020/01/23/S3SpendwithGlueRedshift2-788x630.png]

#### Glue and S3 Partitions (4:04)
- Glue crawler will extract partitions based on how your S3 data is organized
- Think up front about how you will be querying your data lake in S3
- Example: devices send sensor data every how
- Do you query primarily by time ranges?
  - if so, organize your buckets as yyyy/mm/dd/device
- Do you query primary by device?
  - If so organize your buckets as device/yyyy/mm/dd

> Think carefully about 'domain', 'subdomain', and 'sub-subdomain' the greatest to the least. 

### ⭐0079 Glue Studio (5:19)
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

#### Hands On (1:32)
> Sometimes it's called Glue Studio, sometimes ETL Studio

- Sources are ever increasing, now includes the usual suspects, S3, Kinesis,... Also, Salesforce, LinkedIN, etc

> He suggested Data Wrangler could be an alternative to Glue Studio
__TODO__ compare Glue Studio to Data Wrangler


### ⭐0080 Glue Data Quality (2:28)
> You can inject Glue Data  Quality as a step in Studio

- Data Quality rules may be created manually or recommended automatically
- Integrates into Glue jobs
- Uses Data Quality Definition Language
- Results can be used to __fail the entire job, or just be reported to cloudwatch__

#### Data Quality (graphic) (01:29)

[Diagram demonstrating Rules]


### ⭐0081 Glue DataBrew (2:58)
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


### ⭐0082 Demo Glue DataBrew (6:41)

** Hands On **

__TODO__ Try to find a exercise to allow you to use DataBrew without too much charge.. it may be $1.00 to create a project AND cost for resources... If you cant find watch the demo a again.

- You can impute missing values
- Scale numeric values (good for normalizing, for NN)
- Many many other transformation

- Output many formats... Hence it may be a good tool for converting from one file format to another

Session $1.00, + $0.48/per node-hour (need to verify with AWS)


### ⭐0083 Handle PII in DataBrew Transformations (1:59)

- Substitutions (`REPLACE_WITH_RANDOM`)
- Shuffle (`SHUFFLE_ROWS`)
- Deterministic encryption (`DETERMINISTIC_ENCRYPT`)
- Probabilistic Encryptions (`ENCRYPT`, "Probabilistic" encryption routine may be more than one result, not sure about this)
- Decrypt (`DECRYPT`)
- Nulling out or deleting (`DELETE`)
- Masking out (`MASK_CUSTOM`, `_DATE`, `_DELIMITER`, `_RANGE`) (maybe cc ending or similar, mask first ... characters)
- Hashing (`CRYPTOGRAPHIC_HASH`)

### ⭐0084 Intro to Amazon Athena (04:19)
> Serverless Interactive queries of S3 data

#### What is Athena?
- Interactive query service for (SQL)
  - No need to "load data", it says in S3

- Presto under the hood, but not on the EXAM and it has been 'adapted' so Presto is probably not so relevant

- Serverless.. No capacity planning

- Supports many data formats
  - CSV, TSV (human readable)
  - JSON  (human readable)
  - ORC (columnar, splittable)
  - Parguet (columnar, splittable)
  - Avro (Splittable)
  - Snappy, Zlib, LZO, Gzip Compressions

> Data can be structure, semi-structured, or structured.. Athena doesn't care

#### Example Usages
- Ad-hoc queries of web logs
- Query staging dat before loading into RedShift
- Analyze CloudTrail / CloudFront / VPC/ ELS etc logs in S3
- Integration with Jupyter, Zeppelin, RStudio, notebooks
- Integration with QuickSite
- Integration visa ODBC/ JDBC with other visualization tools

__TODO__ do this "- Analyze CloudTrail / CloudFront / VPC/ ELS etc logs in S3"


What is cost compared to Elastic Search?  He mentioned Athena is preferred over Elastic Search, I may have misunderstood.



### ⭐0085 Athena and Glue (7:45)

Diagram:
[S3] -> [Glue] -> [Athena] -> [Quicksight]

> Athena will see the schema in the Glue catalog automatically

> Glue catalog is visible by many of the AWS analytics services (Redshift, redshift, spectrum, EMR).. Can be used as Apache Hive Meta store.

#### Athena Work Groups (01:33) __EXAM__

- Can organize users/teams/apps workloads into Workgroups
- Can control query access and track costs by workgroup
- Integrate with __IAM, CloudWatch, SNS__
- Each workgroup can have its own:
  - Query History
    - Data Limits (you can limit how much data queries my scan by workgroup)
    - IAM policies
    - Encryption Settings

> Can limit the data scanned (costs) by work-group


#### Athena Cost Model
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

#### Athena Security (05:22)

- Access Control
  - IAM, ACLs, S3 Bucket Policies
  - `AmazonAthenaFullAccess` / `AWSQuicksightAthenaAccess`
- Encrypt results at rest in S3 staging directory
  - Server-side encryption with S3-manged key (SSE-S3)
  - Server-side encryption KMS Key (SSE-KMS)
  - CLient-side encryption with KMS Key (CSE-KMS)
- Cross account access in S3 bucket policy, possible
- Transport Layer Security (TLS), encrypts in-transit (between Athena and S3)


#### Athena Anti-Pattern (__EXAM__)
- Highly formatted reports / visualization
  - That is what Quicksight is for
- ETL
  - use Glue instead  

### ⭐0086 CREATE TABLE AS SELECT (demo) (02:32)

- You might see this in the context of Amazon Athena
  - But it exists in other databases as well
- Create new table for query results (CTAS)
- Can bue sued to create new table that's a subset of another
- __Can ALSO be used to convert data into a new underlying format__
  - So this is a track to get Athena to covert data stored in S3



### ⭐0087 Athena: Optimizing performance (1:52)
- Use columnar data (ORC or Parquet)
- Small number of large files performs better than a large number of small files
- Use partitions
  - If added partitions after the face, use `MSCK REPAIR TABLE` command

__EXAM__ may ask

Also, if using ACID (iceberg tables), doing 
```
OPTIMIZE REWRITE DATA USING BIN_PACK WHERE CATALOG=`c1`
```
Will help to reduce overhead created by ACID


### ⭐0088 Athena ACID transactions (2:58)

> Strict guarantees about transactions

- Powered by Apache Iceberg
  - Just add `table_type = 'ICEBERG'` in your `CREATE TABLE` command
- Concurrent users can safely make __row-level__ modification
- Removes need for custom record locking [removes need for roll your own code]
- Time Travel operations
  - Recover data recently deleted with by using a select statement
- Remember governed tables in Lake Formation, This is another way of getting ACID features in Athena
- Benefit from period compaction to preserve performance

### ⭐0089 Athena Fine Grained Access to AWS Glue Data Catalog (2:09)
> Athena doesn't have the granular control Lake Formation has, it doesn't do column, row, field level.. It is more about the actions that can be performed


- IAM-based Database and table level security
  - Broader than data filters in Lake Formation
  - Can not restrict to specific table versions
- At a minimum
 you must have a policy that grants access to your database and Glue Data Catalog in each region

#### But there is more (00:54) (Things you can lock down)
- You might have policies restrict access to 
  - ALTER or CREATE DATABASE
  - CREATE TABLE
  - DROP DATABASE or DROP TABLE
  - MSCK REPAIR TABLE
  - SHOW DATABASES or SHOW TABLES

- Just need to map these operations to their IAM actions

- However, mapping the action to IAM role can be tricky. AWS provides a table of permission requirements.. Dropping a table, as example, may require several other permissions.