# Section 9: Machine Learning Operations (MLOps) Questions Todo

0198

#### QUESTION X

What is Deployment Guardrail?

#### ANSWER X

A service/method to deploy models in controlled manor to avoid deployement issues. Failed deployment or bad instance. Can compare new deploy to existing deploy to verify it performs as good or better.

#### END QUESTION

#### QUESTION X

What is Shadow Test (shadow variant)?

#### ANSWER X

There are two 'deployment guardrail', controlled deployment (blue/green), or shadow deployment.
As far as I can tell the key difference is you deploye a single instance/model to review performance (IN SAGEMAKER). Where as controlled deployments deploy to a few instance. T

#### END QUESTION

#### QUESTION X

With Deployment Guardrails, what are the 3 strategy for determine 'ok' status? (canary, all(?), linear)

#### ANSWER X

- Controls shifting traffic to new models
  - "Blue/Green Deployments" **EXAM**
    - All at once shift everything, monitor, terminate blue fleet
    - Canary: shift a small portion of traffic and monitor
    - Linear: Shift traffic in linearly spaces steps

#### END QUESTION

#### QUESTION X

Which of the "Deployment Safeguards" has auto roll back and why

#### ANSWER X

Controlled release (blue/green or controlled release). Auto rollback only really applies to this option. Shadow Variant wouldn't need rollback.

#### END QUESTION

## 0199

## 0200

#### QUESTION X

What is Horovod? How is it used? What is it used for?

#### ANSWER X

To distribute tensorflow across several instances, because

- Pre-built Tensorflow, MXNet, Chainer, PyTorch
  - Distributed training via Horovod, or Paremeter Servers **EXAM**, tensorflow does not distribute across all machines, use these to overcome that obstacle.

#### END QUESTION

#### QUESTION X

How to test/compare new model to existing model - realtime? ("Production Variants")

#### ANSWER X

- You can test out multiple models on live traffic using Production Variants
  - Variant weights tell SageMaker how to distribute traffic among them
  - So, you could roll out a new iteration of your model at say 10% variant weight
- This lets you do A/B tests, and to validate performance in real world settings
  - Offline validation is always useful

#### END QUESTION

#### QUESTION X

What is the purpose of Neo?

#### ANSWER X

Compile once - run anywhere, specifically on edge devices.

- **Train Once, Run anywhere**
  - Edge devices:
    - ARM, Intel, Nvidia processors (Support Local Processors on various devices)
    - Embedded in whatever - your car?
- Optimize code for specific devices
  - Tensorflow, MXNet, PyTorch, ONNX, XGBoost, DarkNet, Keras **(Any code that can go into these, can be compiled by Neo)**
- Consists of a **compiler** and a **runtime**

> Neo is the way to compile your inference code to edge devices

> Neo - Compile once, run anywhere

> Best for **Minimal Latency**, if a smart car needs a signal to break, we can't wait for internet delays (need ms response time)

> **XGBoost** (the hottest algorithm for machine learning) **EXAM** Need to know XGBoost inside-and-out.

#### END QUESTION

#### QUESTION X

How to build/deploy models with minimal latency.

#### ANSWER X

One method is to deploy the model on to the device using the model (car, phone, house, IoT, etc, etc).
The idea is to run the model locally with local data, therefore minimal latency. Millisecond Latency

#### END QUESTION

#### QUESTION X

How is GreenGrass and Neo Related?

#### ANSWER X

Without greengrass we use Neo to compile to the various chip architecture (P2, C5, etc). With Greengrass we deploy it.

- Neo-compiled models can be deployed to an HTTPS endpoint
  - Hosted on **C5, M5, M4, P3, or P2** instances
  - Must be same instance type used for compilation (**think machine code**)
  - > This kinda defeats the purpose of Neo, so ... deploy greengrass
- OR! You can deploy to IoT Greengrass
  - This is how you get models to actual edge devices
  - Inference at the edge with local data, using model trained in the cloud
  - Uses Lambda Inference Application

#### END QUESTION

#### QUESTION X

Without knowing anything about the algorithms running. What is the rule of thumb for choosing your instance (processor) types?

#### ANSWER X

## ML Exam Cheat Sheet (Memorize This)

| Letter  | Meaning         | ML Usage                 |
| ------- | --------------- | ------------------------ |
| **C**   | Compute         | CPU ML, preprocessing    |
| **M**   | Mixed           | Dev, small ML            |
| **R**   | RAM             | Large datasets           |
| **P**   | GPU (Training)  | Deep learning training   |
| **G**   | GPU (Inference) | DL inference             |
| **Inf** | Inferentia      | Cost-optimized inference |
| **Trn** | Trainium        | Cost-optimized training  |

---

## SageMaker Mapping (Exam Gold)

- **Training jobs** → `P*` or `Trn*`
- **Inference endpoints** → `G*` or `Inf*`
- **Processing jobs** → `C*` or `M*`

#### END QUESTION

#### QUESTION X

How are GPU more cost effective if they are more costly?

#### ANSWER X

A single GPU may be more costly than a single CPU but they are more effecient (for deep learning) so GPU will take less time.

Hence, it may be better to run one machine with several GPU than run with sevearl CPU

#### END QUESTION

#### QUESTION X

How to save up to 90% over on-demand instances, on training processing?

#### ANSWER X

Spot Instances can save up to 90%. However, they are subject to stop without warning so Checkpoints-to-S3 must be used so you don't have to start over.

Additionally, you may have to wait until spot capacity becomes available.

> Comes at the expense of complexity (checkpoints) and time (wait for spot)

#### END QUESTION

#### QUESTION X

What do you need at least two Subnets in a VPC when using SM AutoScaling? (if you're using custom VPC)

#### ANSWER X

SM will try to distribute instances across AZs. You'll need multiple instances for this to work.

#### END QUESTION

#### QUESTION X

Discuss brefiely SM AutoScaling

#### ANSWER X

#### Automatic Scaling (0:03)

- You set up scaling policy to define target metrics, min/max capacity, cool-down periods
- Works with CloudWatch
- Dynamically adjust number of instances for **production variant**
- Load test your configuration before using it **BEST PRACTICE**

> Adds or removes Inference Node as needed

> Want to make sure your Scaling Policy is working good before going to production

#### SM and AZs (1:24)

- SM automatically attempts to distribute instances across AZs
- **But you need more than one instance for this to work**
- Deploy multiple instances for each production endpoint
- **Configure VPCs with at least two subnets, each in different AZs**

#### END QUESTION

#### QUESTION X

From easiest to most complex - the five semi-automated deployment methds?
Go into detail about simplicity-to-complexity?  
Which is more complex and why? When to use which (think, no answer provided)?

#### ANSWER X

JumpStart, ModelBuilder, CloudFormation

- Sagemaker **JumpStart**
- Deploying pre-trained models to pre-configured endpoints **EASIEST**
- > gives notebook
- > "Hey I have a model that needs to do inference - deploy for me"
- ModelBuilder from the SageMaker Python SDK
  - Configure deployment **settings from code**
  - > If you want more control of the deployment
- AWS CloudFormation
  - For advanced users who need consistent and repeatable deployments
    - Maybe part of CI/CD
    - **Repeatable deployments**
    - `AWS:SageMaker::model` resources create a model to host at an endpoint.

#### END QUESTION

#### QUESTION X

Deploying models with CloudFormation, what is the "resource" we use(Think `AWS::?::?::?`?

#### ANSWER X

`AWS::SageMaker::Model`

#### END QUESTION

#### QUESTION X

What are the 5 deploy methods supported by AWS? (you could do it differently in AWS but their 'services' to support deployment)? What are dis/advantages?

This is a general question. Think in terms, if we are doing inference, how are we doing it? What technical consideration have we made (3 deploy methods, 2 build methods = 5 total)

#### ANSWER X

1.  SageMaker JumpStart,
2.  SageMaker Serverless,
3.  Async Inference (copy the section text ),
4.  Autoscaling (not really deply is it?),
5.  SM Neo (for different chips, Inferentia as example)

#### END QUESTION

#### QUESTION X

How to find "What kind of instances to use for your inference endpoints" and the two mode?

#### ANSWER X

SM Recommender and the two modes are: "Instance Recommendation" and "Endpoint Recommendation".

#### END QUESTION

#### QUESTION X

SM Recommender has two modes. contrast compare, pros and cons (copy text)

#### ANSWER X

- Instance Recommendations
  - Runs load tests on recommended instance types
  - **Takes about 45 minutes**
- Endpoint Recommendation (custom load types)
  - Custom Load tests
  - You specify instances, traffic patterns, latency requirements, throughput requirements
  - **Takes 2 hours**
  - > Tailor to your SLAs

#### END QUESTION

#### QUESTION X

What is SM Recommmender?

#### ANSWER X

> New AWS feature since 2022

- Introduce in 2022
- Specify your container, memory requirements, concurrency requirements
- Underlying capacity is automatically provisioned and scaled
- Great when infrequent or unpredictable traffic; will scale to zero when there are no requests
- Charged on usage, more use the more expensive, less used, less expensive
- Can monitory in CloudWatch with metrics:
  - `ModelSetupType`, `Invocation`, `MemoryUtilization`

#### Amazon SageMaker Inference Recommender

> Not to be confused with "Recommendation Service", it is only making recommendations about instance types and configuration of your model
> **TODO** Try this - this is huge

- Recommends best instance type (chip) and configuration for your models
- Automate load testing, model tuning
- Deploys to optimal inference endpoint
- How it works:
  - Register your model in the model registry
  - Benchmark different endpoint configuration
  - Collect and Visually metrics to decide instance types
  - Existing models from zoos may have benchmark already
- Instance Recommendations
  - Runs load tests on recommended instance types
  - **Takes about 45 minutes**
- Endpoint Recommendation (custom load types)
  - Custom Load tests
  - You specify instances, traffic patterns, latency requirements, throughput requirements
  - **Takes 2 hours**
  - > Tailor to your SLAs

> It may have some of the work done already when working with familiar models

#### END QUESTION

#### QUESTION X

What is "Inference Pipeline"?

#### ANSWER X

> If this is, what I understand it to be, it is **HUGE** that you take one inference request and run it through several machines. Take NL request, convert to intent, send intent to machines A, R, Q (or whatever), Send results to machine Z (final) for 'polish' or similar "pipeline" activities

> for **EXAM** need to know what it is, what it does, Section is 1:39 - not much detail required

- Linear sequence of 2-15 containers
- Any combination of pre-trained built-in algorithm or your own algorithms in Docker containers
- Combine pre-processing, predictions, post-processing
- Spark ML and scikit-learn containers OK
  - Spark ML can be run with `Glue` or `EMR`
  - Serialized into `MLeap format` (side note, said 'MLeap' format not really important for our consideration)
- Can handle both real-time inference and batch transforms

> Basically, a method of stringing together bunches (2-15) of containers to establish an inference pipeline.

> If this is, what I understand it to be, it is **HUGE** that you take one inference request and run it through several machines. Take NL request, convert to intent, send intent to machines A, R, Q (or whatever), Send results to machine Z (final) for 'polish' or similar "pipeline" activities

#### END QUESTION

#### QUESTION X

Give a breif description of "Inference Pipeline", with use-case.

#### ANSWER X

> If this is, what I understand it to be, it is **HUGE** that you take one inference request and run it through several machines. Take NL request, convert to intent, send intent to machines A, R, Q (or whatever), Send results to machine Z (final) for 'polish' or similar "pipeline" activities

> for **EXAM** need to know what it is, what it does, Section is 1:39 - not much detail required

- Linear sequence of 2-15 containers
- Any combination of pre-trained built-in algorithm or your own algorithms in Docker containers
- Combine pre-processing, predictions, post-processing
- Spark ML and scikit-learn containers OK
  - Spark ML can be run with `Glue` or `EMR`
  - Serialized into `MLeap format` (side note, said 'MLeap' format not really important for our consideration)
- Can handle both real-time inference and batch transforms

> Basically, a method of stringing together bunches (2-15) of containers to establish an inference pipeline.

> If this is, what I understand it to be, it is **HUGE** that you take one inference request and run it through several machines. Take NL request, convert to intent, send intent to machines A, R, Q (or whatever), Send results to machine Z (final) for 'polish' or similar "pipeline" activities

#### END QUESTION

#### QUESTION X

What are the 4 types of Drift we can detect with SageMaker Model Monitor? Discuss what each means

#### ANSWER X

- Data quality drift
- Model quality drift (think it requires/compares human response)
- Bias drift
- Feature attribution drift

#### END QUESTION

#### QUESTION X

What is SM Model Monitory? (drift sets in)

#### ANSWER X

> Newer feature but expect to be on the exam, some.

> Get alerts about quality

> Bias creeps in

- Get alerts on quality deviations on your deployed models (via CloudWatch)
- Visualize data drift
  - Example: loan model starts giving people more credit due to drifting or missing input features
- **Detect anomalies & and outliers**
- **Detect new feature** (new feature, or replacement feature)
- No Code Needed

> As the data changes from the trained data, it is called data-drift

- Data is stored in S3 and secured (normal S3 security measures)
- Monitoring jobs are scheduled via Monitor Schedule
- Metrics are emitted to CloudWatch
  - CloudWatch notifications can be used to trigger alarms
  - You'd then take corrective actions (retrain the model, audit the data)
- Integrates with Tensorboard, QuickSight, Tableau
  - Or just visualize with `SageMaker Studio`

#### END QUESTION

#### QUESTION X

What is the Advantage/purpose of SM Model Monitor + Clairify

#### ANSWER X

- Integrates with Clarify
  - SageMaker Clarify detects potential bias
  - i.e. imbalances across different groups/ages/income brackets
  - With ModelMonitor you can monitor for bias and be alerted to new potential bias via CloudWatch
  - SageMaker Clarify also helps explain model behavior
    - Understand which features contribute the most to your prediction

> Clarify is meant to detect bias

> What changed to affect your predictions

#### END QUESTION

#### QUESTION X

What is 'Model Monitor Data Capture'? Where and how does it store data?

#### ANSWER X

Used to capture data into/out-of inference endpoints, delivered to S3, can be configured to be encrytped, JSON formated

#### END QUESTION

#### QUESTION X

Give 3 uses of the data from SM-MM-Data Capture: further training (feedback loop), debug, monitoring.

#### ANSWER X

It can be used for: - Further training (feedback loop) - Debugging - Monitoring

#### END QUESTION

#### QUESTION X

Describe SageMaker Model Monitor Data Capture (sm-MM data capture)

#### ANSWER X

> Logs all the data into and out of your inference endpoints

- Logs inputs to your endpoints and inference outputs
  - Data is delivered to S3 as JSON
- This can be used for:
  - Further training (feedback loop)
  - Debugging
  - Monitoring
- Automatically compare data metrics to your baseline
- Supported for both real-time and batch monitor modes
- Supported or Python (Boto) and SageMaker Python SDK
- Data can be encrypted

#### END QUESTION

#### QUESTION X

What is 'SM Operators for K8S'

#### ANSWER X

MLOps is basically 'How do I managed building deploying some of my larger pipelines'

#### END QUESTION

#### QUESTION X

How to integrate on-prem ML pipeline?
Or "how do we integrate with existing pipelines"

#### ANSWER X

MLOps with SageMaker and K8S.

Basically this will allow K8S to kick-off SM jobs from within K8S
(not sure this is a good question or good answer)

#### END QUESTION

#### QUESTION X

What are the components available in the SM compoents for Kubeflow Pipeline (4)?

#### ANSWER X

- Components for Kubeflow
  - Processing (Spark container)
  - Hyperparameter tuning
  - Training
  - Inference (actually hosting model)

#### END QUESTION

#### QUESTION X

What is "SM Projects"?

#### ANSWER X

The way to do MLOps without K8S

#### END QUESTION

#### QUESTION X

What is MLOps?

#### ANSWER X

MLOps is the set of AWS services and practices—primarily built around Amazon SageMaker—that automate and manage the end-to-end machine learning lifecycle, from data preparation and training to deployment, monitoring, and retraining. It enables teams to reliably scale, version, and operate ML models in production using CI/CD-style workflows.

#### END QUESTION

#### QUESTION X

Things you can do with SageMaker Studio (6)?

#### ANSWER X

- SageMaker Studio's native MLOps solutions with CI/CD

  - Build images
  - Prep data, feature engineering
  - Train models
  - Evaluate Models
  - Deploy models
  - Monitor and Update Models

#### END QUESTION

#### QUESTION X

How to do MLOps without K8S?

#### ANSWER X

"SM Projects"

#### END QUESTION

#### QUESTION X

What is "SM Projects"?

#### ANSWER X

How to do MLOps without K8S!

#### END QUESTION

#### QUESTION X

What is SM Pipelines?

#### ANSWER X

A way to chain different MLOps steps together?

#### END QUESTION

#### QUESTION X

What is s way to chain different MLOps steps together?

#### ANSWER X

SM Pipelines!

#### END QUESTION

#### QUESTION X

What is the use case for Docker in AWS, in general?
Not likely exam question, good head space question

#### ANSWER X

"Use cases: Microservices, lift-and-shift apps from on-prem to aws cloud"

#### END QUESTION

#### QUESTION X

What is "ECR Public Gallery"?

#### ANSWER X

Public ECR repo where as these are usually private and offer security from public.

#### END QUESTION

#### QUESTION X

Basic steps of Docker File to running docker container (4)?

#### ANSWER X

1. Write Dockerfile
2. Dockerfile becomes docker image
3. `Push` image to repo (docker hub or other) or ECR
4. `pull` and run image. Running image is a container

(remember 'image' is class and 'container' is instnace)

#### END QUESTION

#### QUESTION X

What is the difference between VM and Docker Container (this probably not exam, good headspace question)

#### ANSWER X

Virtual Machine:
[guest Vm1][guest vm2][guest vm3]
[guest os1][guest os2][guest os3]
[--------- Hypervisor-----------]
[----------- Host OS -----------]
[-------- infrastructure -------]

Docker
[Container1][Containe2][Container3]
[Cont4][Cont5][Cont6][Cont7][Cont8]
[Cont9][Cont10][Cont11][ContainerN]
[--------- docker daemon ---------]
[-------- Host OS EC2 Inst. ------]
[--------- infrastructure --------]

> Docker is less secure as a virtual machine but allows you to run machines that can run more containers on a single server

#### END QUESTION

#### QUESTION X

What are EKS, ECS, ECR, Fargate and what the Key differences between them?

#### ANSWER X

What is ECR - Elastic Container Registery - stores images
What is ECS? - Amazon Elastic Container Service - Amazon's own container platform
What is EKS? - Elastic Kubernetes Service - Amazon's managed Kubernetes (Open Source project)
What is Fargate? - Amazons own Serverless container platform, works with ECS and EKS

#### END QUESTION

Why do we use EFS File System?

#### QUESTION X

What is the difference between ECS Launch Types: EC2 and Fargate

#### ANSWER X

Launch Types: EC2 - builds EKS Cluster of EC2 - non serverless, must provision capacity

Launch Types: Farget - builds EKS Fargeet Cluster - Serverless, capacity is managed by Fargate (I believe the number/type of 'tasks' determine what is used).

#### END QUESTION

#### QUESTION X

Which is serverless, ECS-launch-type-farget or EC2-launch-type-ec2

#### ANSWER X

ECS-launch-type-farget

#### END QUESTION

#### QUESTION X

Which requires provisioned capacity, ECS-launch-type-farget or EC2-launch-type-ec2

#### ANSWER X

EC2-launch-type-ec2 requires provisioned capacity.

Fargate is serverless

#### END QUESTION

#### QUESTION X

How to scale ECS-launch-type-farget and EC2-launch-type-ec2

#### ANSWER X

Not sure about EC2 cluster, capacity gets provisioned.

Fargate you simply create a task.

#### END QUESTION

#### QUESTION X

What is the difference between 'EC2 Instance Role' and 'ECS Task Role'.

#### ANSWER X

- Create a EC2 instances Profile (EC2 Launch type only) [The agent will]
  - Used by the ECS agent
  - Make API calls to ECS service
  - Send container logs to CloudWatch
  - Pull Docker Image from **ECR**
  - Reference sensitive data in Secrets Manager or SSM Parameter Store

> Our ECS Tasks are going to get **ECS Task Roles**

- ECS Task Role: (Fargate and EC2)
  - Allows each task to have specific role (task A gets Role A, task B gets role by)
  - Use different roles for the different ECS Services you run
  - **Task Role is defined in the task definition service**

> Remember 'EC2 Instance Role' and 'ECS Task Role' **EXAM**

#### END QUESTION

#### QUESTION X

What are the load balancer options (3)? - what is recommended?

#### ANSWER X

- `Application Load Balancer` supported and works for most use cases (this is the best general purpose option)
  '
- `Network Load Balancer` recommended only for high throughput / high performance (**very High**) use case, or to pair with `AWS Private Link`

- `Classic Load Balance` supported but not recommend (no advance features)

#### END QUESTION

#### QUESTION X

What is the Recommended File System do to use for ECS?

#### ANSWER X

We use EFS because it is a network file system

- Mount EFS file system ECS tasks
- Works for both EC2 and Fargate launch types
- Tasks running in any AZ will share the same data in the EFS
- **Fargate + EFS = Serverless** (the goal)
- Use cases: \_\_persistent multi-AZ shared storage for your containers

- Note:
  - **Amazon S3 cannot be mounted as a file system (for ECS tasks)**

#### END QUESTION

#### QUESTION X

Why do we use EFS File System?

#### ANSWER X

We use EFS because it is a network file system

- Mount EFS file system ECS tasks
- Works for both EC2 and Fargate launch types
- Tasks running in any AZ will share the same data in the EFS
- **Fargate + EFS = Serverless** (the goal)
- Use cases: \_\_persistent multi-AZ shared storage for your containers

- Note:
  - **Amazon S3 cannot be mounted as a file system (for ECS tasks)**

#### END QUESTION

#### QUESTION X

Describe/explain what is ECR?

#### ANSWER X

- ECR - Elastic Container Registry
- Store and manage docker images on AWS
- Two storage options
  - Private (your own AWS accounts)
  - Public Gallery (https://gallery.ecr.aws)
- Fulling integrated with ECS, backed by Amazon S3
- Instance gets IAM role that allows it to `pull` the image
- Access is controlled through IAM (permission errors => policy)
- ECR is awesome because it is fully integrated with ECS but also
  - Supports image vulnerability scanning,
  - versioning
  - image tags
  - image life-cycle

> Overall think ECR when talking about storing images on **EXAM** (1:35)

#### END QUESTION

#### QUESTION X

**TODO** Get a better understanding of what he is talking about. Is there an AWS Kubernetes that is different that EKS? It's not clear to me why we are doing this twice. The demonstration shows EKS cluster, but he keeps talking about Kubernetes as if they're trying to promote it as a different service, perhaps to encourage people to change to AWS?.

His says "pod" not 'task'

#### ANSWER X

**TODO** Get a better understanding of what he is talking about. Is there an AWS Kubernetes that is different that EKS? It's not clear to me why we are doing this twice. The demonstration shows EKS cluster, but he keeps talking about Kubernetes as if they're trying to promote it as a different service, perhaps to encourage people to change to AWS?.

His says "pod" not 'task'

#### END QUESTION

#### QUESTION X

What is the difference between Batch and Glue?

#### ANSWER X

**TODO** Not sure about Glue but Batch is:

> Need to know at a high level

- Run batch jobs as Docker images
- Dynamic provisioning of the instances (EC2 & Spot)
- Optimal quantity and type based on volume and requirements
- No need to manage clusters - fully **serverless**
- You just **pay** for the underlying EC2 instances

- Schedule batch jobs using **CloudWatch** events
- Orchestrate Batch Jobs using **AWS Step Functions**

> What is the difference between Batch and Glue?

- Glue:
  - Glue ETL - Run Apache Spark code, scala, or Python based, focus on the **ETL**
  - Glue ETL - Do not worry about configuring or managing the resources
  - Data Catalog to make the data available to **Athena** or **Redshift Spectrum**
- Batch:
  - For any computing job, regardless of the job (Must provide Docker image)
  - Resources are created in your account, managed by Batch
  - for **any non-ETL** related work, batch is probably better

> Glue - if you have ETL then Glue is probably the correct option, if you have non-ETL (anything except ETL) then probably Batch is the right choice

#### END QUESTION

#### QUESTION X

When to use Glue? When to use Batch?

#### ANSWER X

**TODO** Not sure about Glue but Batch is:

> Need to know at a high level

- Run batch jobs as Docker images
- Dynamic provisioning of the instances (EC2 & Spot)
- Optimal quantity and type based on volume and requirements
- No need to manage clusters - fully **serverless**
- You just **pay** for the underlying EC2 instances

- Schedule batch jobs using **CloudWatch** events
- Orchestrate Batch Jobs using **AWS Step Functions**

> What is the difference between Batch and Glue?

- Glue:
  - Glue ETL - Run Apache Spark code, scala, or Python based, focus on the **ETL**
  - Glue ETL - Do not worry about configuring or managing the resources
  - Data Catalog to make the data available to **Athena** or **Redshift Spectrum**
- Batch:
  - For any computing job, regardless of the job (Must provide Docker image)
  - Resources are created in your account, managed by Batch
  - for **any non-ETL** related work, batch is probably better

> Glue - if you have ETL then Glue is probably the correct option, if you have non-ETL (anything except ETL) then probably Batch is the right choice

#### END QUESTION

#### QUESTION X

What is the tool/service we use for infrastructure as code?

#### ANSWER X

CloudFormation

#### END QUESTION

#### QUESTION X

What is is the tool/service we use when we need to duplicate/clone resources in other regions or possibly account?

#### ANSWER X

CloudFormation

#### END QUESTION

#### QUESTION X

Brief overviw of CloudFormation?

#### ANSWER X

> Deploying and Managing Infrastructure at Scale

#### What is CloudFormation

- CloudFormation is a declarative way of outlining your AWS infrastructure, for any resource (most of them are supported)
- For example, within a CloudFormation template, you say:
  - Security Group
  - two (2) EC2 Instances using this SG
  - S3 Bucket
  - ELB in front of these machines
- Then CloudFormation creates those for you, in the **right order**, with the **exact configuration** you specify

#### Benefits of CloudFormation (1/2)

- Infrastructure as Code

  - No resources are manually created, which is excellent for control
  - Changes to the infrastructure are reviewed through code

- Cost
  - Each resource within the stack is tagged with an identifier so you can easily see how much a stack costs you
  - You can estimate cost of your resources using CloudFormation template
  - **Saving strategy**: in Dev, you could automation deletion of template at 5 PM and recreated at 8 AM, safely

#### Benefits of CloudFormation (2/2)

- Productivity
  - Ability to destroy and re-creation an infrastructure on the cloud on the fly
  - Automated generation of Diagrams for your template
  - Declarative programming (no need to figure out ordering or orchestration)
- Don't re-invent the wheel

  - Leveraging existing templates on the web! (eg, many stacks have been built and available)
  - Leverage the documentation

- Support (almost) all AWS resources
  - Everything we'll see in the course is supported
  - You can use "Custom Resources" for resources that are not supported

#### CloudFormation + Infrastructure Composer (new)

- Example: Wordpress CloudFormation Stack

- We can see all the resources
- We can see the relations between components

> I think **Infrastructure Composer** is new to me and offers advance diagrams (better the CF's original diagrams?)

> **EXAM** CF will be used when we need to repeat Infrastructure in other region or other accounts or when we have Infrastructure As Code

#### END QUESTION

#### QUESTION X

When CDK code is compiled - what is the by product or output?

#### ANSWER X

CloudFromation YAML template file.
`template` means 'stack template'

#### END QUESTION

#### QUESTION X

CDK Compile and Error Detection. What advantage does CDK offer over CF?

#### ANSWER X

The 'compile layer' provides some error detection before trying to create the stack (time consuming).

"If it compiles, it is assumed the Infrastructure is sound, if the infrastructure is not sound, it is assumed there will be compile errors"

#### END QUESTION

#### QUESTION X

CDK doesn't 'compile' into YAML - what is the process called?

#### ANSWER X

synthesis (`synth`)

#### END QUESTION

#### QUESTION X

What is the difference between SAM and CDK

#### ANSWER X

- SAM:
  - **Serverless focused**
  - Write your template declaratively in JSON or YAML
  - Great for quickly getting started with Lambda
  - Leverages CF
- CDK:
  - All AWS Services (mostly)
  - Write infrastructure in a familiar programming language (Javascript, .NET, TS, etc)
  - Leverages CF

#### END QUESTION

#### QUESTION X

How can I use SAM locally to run CDK YML template?

#### ANSWER X

First synth/compile CDK into YAML then use SAM on the YAML

> This sounds like it was a lecture that was added after the course was creating, as if maybe there may be an **exam** question here

> There is a way to combine SAM and CDK

- You can use SAM CLI to locally test your CDK apps
- You must first run `cdk synth` to get CF YAML
- Use the CF Yaml for SAM to invoke lambda?

#### END QUESTION

#### QUESTION X

What is CodeDeploy used for?

#### ANSWER X

> CodeDeploy is a way for us to deploy our Application automatically

- We want to deploy our application automatically
  > Little more permissive
- Works with EC2 instance
- Works with On-Premise
- **Hybrid** Service

- Must provision capacity in advance, servers/instances and configured with **CodeDeploy Agent**
- It is an event service so it can not be demo'd

**EXAM** Remember CodeDeploy allows you to upgrade your servers (EC2 or onPrem) from v1 to v2 automatically from a single interface.

#### END QUESTION

#### QUESTION X

What is CodeBuild and what are some of the benifits

#### ANSWER X

- Code building service in the cloud
- Compiles source code, run tests, produces packages that are ready to be deployed (by CodeDeploy for example)

[diagram] codeCommit->CodeBuild->[ready to deploy]

Benefits

- Fully managed serverless
- Continuously scalable and highly available
- secure
- Pay as you go pricing (you only pay for when your code is being built)

#### END QUESTION

#### QUESTION X

What is CodePipeline? What are some of the benefits

#### ANSWER X

- Orchestrate the different steps to have the code automatically pushed to production
  - Code => Build => Test => Provision => Deploy [given pipeline]
  - Basis for CI/CD

[Diagram, pipeline is the house, and CodeCommit, CodeBuild, CodeDeploy, Beanstalk are within the house]

- Benefits:
  - Fulling managed, compatible with cCommmit, cBuild, cDeploy, Elastic Beanstalk,... custom plugin
  - Fast Delivery & rapid update

**EXAM** Orchestration of pipeline (code pipeline), think AWS CodePipeLine

#### END QUESTION

#### QUESTION X

Most popular git commands?

#### ANSWER X

We have `remote` and `local` repos.

- `clone` to get a copy of the repo
- `pull` to suck recent change
- `add` commit to branch
- `merge` from other branch
- `git init` - set-up
- `git config` - set-up git env variables
- `git status` - get status of the changes on the working directory (branch)
- `git add` add files to the `staging area`
- `git commit` commit the staged changes with a message
- `git log` view commit logs (**didn't know this** were only commit logs, or logs of commit)

#### Branching

> The way to work on things in parallel

- `git branch` - gives list of all local branches
- `git checkout` - change to current branch
- `git merge` - merge changes from a branch
- `git branch -d [branch name]` to delete branch

#### Remote Repos (3:22)

- `git remote add` - add a repo to a server somewhere (**didn't know this**)
- `git remote` list all remote repos
- `git push` pushes the local branch on to the remote
- `git pull` - pulls remote branch into current local branch

#### Undoing changes

- `get reset` resets your staging area to match the most recent commit, without affecting working directory
- `get reset --hard` reset the staging area and the working directory to mach the most recent commit (same as check, I believe).
- `get revert <commit>` - create a new commit that undoes all he changes from a previous commit
- `git stash [push]`
  - git stash pop to restore
- `git rebase <branch>` reapply changes from one branch onto another, often used to integrate changes from one branch into another.
- `git cherry-pick <commit>` apply changes from a specific commit to the current branch
- `git blame <file>` to see who made changes and when
- `git diff` changes between commit
- `git fetch` fetches changes from one remote repo without merging them
- `git fsck` check the database for errors **EXAM** not likely to be on the exam
- `git gc` garbage collection, optimization I didn't know this
- `git reflog` record when refs were updated in the local repo, useful for recovering lost commits.

#### END QUESTION

#### QUESTION X

What is github flow, git flow? What is the advantage and what is the evnironment requirement?

#### ANSWER X

They talk about setting up the repo with several branches - and trying to keep track of everything

- [main] - production code
- [develop] - changes since last release
- [feature] - branches from develop for new feature
- [release] - merge changes with dev
- [hotfix] - branch off of main for quick fix

"Git Flow" is supposed to help with the mess. It has two branches. Main and any feature(s) branch. feature-xyz, feature-pqr, etc

- Requires ability to release quickly.
  - Automated tests and deployment
  - Maybe release multiple times per day

> Github flow only works if you have the ability to release frequently and quickly (true CI/CD)

#### END QUESTION

#### QUESTION X

Just a few sentences about what is the Event Bridge

#### ANSWER X

Allows you to 'send' or 'capture' events from various AWS services and then send them to other AWS services using fitlers.
Basically allows you to react to events within the AWS ecosystem, with exception that you can allow external parterners and you can define custom buses

#### END QUESTION

#### QUESTION X

What are the 3 main event buses and what are their purposes? AWS/Default, Partner, Custom

#### ANSWER X

- Default Buss (AWS Events, AWS Services)
- Partner Bus (DataDog, Zendesk, etc)
- Custom Event bus - for your own app.

It's not clear to me if 'Zendesk' or other partners gets their own event bus?
I am pretty sure we can define more than one custom event bus

#### END QUESTION

#### QUESTION X

How to replay events?

#### ANSWER X

You can replay Archive Events

#### END QUESTION

#### QUESTION X

What is the Event Bridge Schema Registry ?

#### ANSWER X

Need to figure out how this works.

#### END QUESTION

#### QUESTION X

Event Bridge - How are Resource Based Policies used

#### ANSWER X

For one, they allow you to allow other to send events to your bus?
Its not clear if these are also used for the filter?

** NEED TO FIGURE THAT OUT**

#### END QUESTION

#### QUESTION X

How to schedule event to fire according to a schedule?

#### ANSWER X

Event bridge offers an option to set-up a schedule to send specific events every so often.

#### END QUESTION

#### QUESTION X

What is the EventBridge Bus, how is it used? Be sure to mention rule

#### ANSWER X

The bus is a logic construct to allow setting various attributes for certain event types (encrypts, archive, etc). The 'bus' has 'rules' to include events.

#### END QUESTION

#### QUESTION X

What is an Event Bridge Rule?

#### ANSWER X

Rules are what events belong to a Event Bridgue Bus

#### END QUESTION

#### QUESTION X

What are step functions used for?

#### ANSWER X

Step functions are Lambda that run in 'steps'. You can create workflows using 'step' functions.

Steps are defined using json based Amazon States Language (ASL)

#### END QUESTION

#### QUESTION X

Using a single lambda, how to build a workflow?

#### ANSWER X

Step functions are Lambda that run in 'steps'. You can create workflows using 'step' functions.

Steps are defined using json based Amazon States Language (ASL)

#### END QUESTION

#### QUESTION X

What is the max execution time of a step-function

#### ANSWER X

1 year

#### END QUESTION

#### QUESTION X

Step function overview - the basics

#### ANSWER X

- **used to design workflows**
- Easy visualization
- Advanced Error handling and Retry mechanism outside of code (hence you don't have to code this part, so much)
- Audit of the history of workflows
- Ability to 'wait' for an arbitrary amount of time
- Max execution time of **state machine** is **1 year**

- Amazon States Language (ASL)
  **EXAM** will need to know what Step functions are, and how they can be used. You will not likely need to know how to set-up or any of the lower details (no need to know what ASL is, as example)

- He goes on to explain that Step Functions can be used

  - to build 'model training' workflow
  - to tune a model
  - Manage batch job

- Sometimes a step function may be only one step

#### END QUESTION

#### QUESTION X

For state machines - what are the valid states?

#### ANSWER X

- However there are many types of `state`
  - `Task` - does something with Lambda, other AWS Services, or third party API
  - `Choice` - Adds conditional logic via `Choice Rules`
  - `Wait` - delays state machine for a specific period
  - `Parallel` - Add separate branches of execution
  - `Map` - run a set of steps for each item in a dataset **in parallel**
    - This is most relevant to data engineers! Works with JSON, S3 Object, csv files, etc
  - `Pass`, `Success`, `Fail` (terminal states, I assume)

#### END QUESTION

#### QUESTION X

Brief overview of MWAA

#### ANSWER X

- Your DAGs (python code) are uploaded into S3
  - May also zip it together with required plugins and requirements
- Amazon MWAA picks it up, and orchestrates and schedules the pipeline defined by each DAG
- Runs within a VPC
  - At least two AZs recommended
- Private or Public endpoints
  - IAM managed
  - (Access to airflow Web Server) (this may have it's own permissions)
- Automatic Scaling
  - Airflow Workers autoscale up to the limits you define

#### MWAA Integration (integrating with other services) (3:36)

- Leverages open-source integrations
  - Athena, Batch, CloudWatch, DynamoDB, DataSync
  - EMR, Fargate, EKS, and on and on and on
  - Security Services (AWS Secrets Manager, etc)
- **Schedules and Workers are AWS Fargate Containers**
  [diagram - two VPCs but I don't think its important for exam, its a fucking complicated diagram, I am not going to bother it].

> If AirFlow webserver is not on a public VPC there is no way to access the management interface

#### END QUESTION

#### QUESTION X

What does MWAA require (benefit from) - public VPC

#### ANSWER X

> If AirFlow webserver is not on a public VPC there is no way to access the management interface

#### END QUESTION

#### QUESTION X

Data Lake Formation

- what is it?
- What does it do?
- how to set-up?
- How to troubleshoot?

#### ANSWER X

- "Makes it easy to set-up a secure data lake in days"
- Loading data and monitoring data flows
- Setting up partitions
- Encryption and managing keys
- Defining transformation jobs and monitoring them
- Access Control
- Auditing
- Built on top of **GLUE**

> You can do almost everything, clean data, reformat data etc

> Mostly its to guide you through building your data lake in a secure fashion

[Diagram, demonstrates, AWS services and others can be source of data, there is middle ware/manager, and Athena, Redshift, EMR can be target of cleaned data]

> Anything Glue can do, Lake Formation can do it also

> EMR is new to Data lake formation

- No cost for Lake Formation, itself
- But there are costs for underlying services
  - Glue
  - S3
  - EMR
  - Athena
  - Redshift

#### Process of building a Lake (3:02)

> its not overly simple, this is why it takes 'days' and not minutes

[Diagram demonstrating all the steps 8+]

- 1. Create IAM user for Data Analyst
- 2. Create **AWS Glue** connection to your data source(s)
- 3. Create S3 bucket to store lake
- 4. Register Path to S3 in Lake Formation
- 5. Create database within Formation for data catalog, grant permissions
- 6. Use blueprint for a workflow (ie database snapshots)
- 7. Run the workflow
- 8. Grant SELECT permissions to whoever needs to read it (Athena, Redshift Spectrum, EMR, etc)

He goes on, but says the above is pretty much all the exam expects us to know

#### Troubleshooting (4:25)

- Cross account access can be tricky
  - **Recipient must be set up as data lake administrator**
  - Can use **AWS Resource Access Manager** for accounts external to your organization
  - IAM permissions for x-account access
  - IAM permissions on the KMS encryption key are needed for encrypting data catalogs in Lake Formation
  - IAM permission needed to create blueprints and workflows

#### END QUESTION

#### QUESTION X

Brief overview of what "Lake Formation, Filters" are, how are they used

#### ANSWER X

> Data Filters, another way to implement security restrictions

- Column, row, or cell-level security
- Applied when granting SELECT permission on tables
- Row Level Security: "Allow columns" + row filter = row-level security
- Column Level Security: "Allow all rows" + specific columns = Column-level security
- Cell level security: Specify columns + specific rows = cell-level security
- Create filters use the web-console or via `CreateDataCellFilter` API

#### END QUESTION

#### QUESTION X

How to implement: row, column, cell level access restrictions?

#### ANSWER X

- Row Level Security: "Allow columns" + row filter = row-level security
- Column Level Security: "Allow all rows" + specific columns = Column-level security
- Cell level security: Specify columns + specific rows = cell-level security
- Create filters use the web-console or via `CreateDataCellFilter` API

#### END QUESTION

---

#### QUESTION X

#### ANSWER X

#### END QUESTION
