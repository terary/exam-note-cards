# Section 9: Machine Learning Operations (MLOps) with AWS

### ⭐0197 MLOps (intro 0:38)

> MLOps in more depth
> Incorporating your own images
> Resources for Training and Inference
> AWS Services to support (EKS, Step Function etc)

**EXAM** He said this will be important on the exam.

### ⭐0198 Deployment Guardrails and Shadow Test (2:07)

#### Deployment safeguards

> Newer feature Deployment safeguards - bad things don't happen, or if they do, we catch them quickly

#### Deployment Safeguards (0:09)

- Deployment Guardrails
  - For asynchronous or real-time inference endpoints
  - Controls shifting traffic to new models
    - "Blue/Green Deployments" **EXAM**
      - All at once shift everything, monitor, terminate blue fleet
      - Canary: shift a small portion of traffic and monitor
      - Linear: Shift traffic in linearly spaces steps
    - Auto-rollbacks
- Shadow Tests
  - Compare performance of a shadow variant to production
  - You monitor in SageMaker console and decide when to promote

> Shadow variant takes a small portion of the traffic
> Green fleet (new arrival), Blue Fleet - existing to be replaced

### ⭐0199 SageMaker inner details and production variants (10:55)

> The final domain of the exam
> Talk about how SageMaker interacts with Docker Containers
> (Can we create our own model and host in SM?)

#### ML Implementation and Operations (SageMaker + Docker)

- All models in SageMaker are hosted in Docker containers (**NEEDS TO BE HOSTED IN CONTAINER**)
  - Pre-built deep learning
  - Pre-built scikit-learn and Spark ML
  - Pre-built Tensorflow, MXNet, Chainer, PyTorch
    - Distributed training via Horovod, or Paremeter Servers **EXAM**, tensorflow does not distribute across all machines, use these to overcome that obstacle.
  - You own training and inference code! **or extend pre-built image**
- This allows you to use any script or algorithm within SageMaker, regardless of runtime or language
  - Containers are isolated, and contain all dependencies and resources needed to run

**NOTE** Tensorflow does not get distributed across machines automatically (use Horovod).

> As long as it is in a docker container - it can run in SageMaker (Hence, any technology you want, as long as it can be containerized)

#### Using Docker (2:48)

- Docker Containers are created from Images
- Images are built from `Dockerfile`
- Images are saved in a `repository` - Amazon Elastic Container registry
  [Diagram showing ECR+S3+Training+Artifacts+Endpoints] - it is what you would expect, but maybe not a bad idea to re-review.

#### Structure of a training container (4:08) **EXAM**

```
/opt/ml
---- input
      -- config
         -- hyperparameters.json
         -- resourceConfig.json
      -- data
         -- <channel_name>
              -- <input data>
---- model
      -- <model files>
---- code
      -- <script files>
---- output
      -- failure
```

**EXAM** you will likely want to memorize some/most/all of that scaffolding.

EVERYTHING goes under `/opt/ml`

#### Structure of Docker Image (higher level)

```
[WORKDIR]
    - nginx.conf
    - predictor.py
    - serve/
    - train/
    - wsgi.py
```

- `nginx.conf` - webserver configuration
- `predictory.py` - implements flask webserver (to make predictions at run-time)
- `serve/` - launches g-unicorn server that launches several Flask Servers
- `train/` - Invoke the training program. Training code files go here
- `wsgi.py` - wrapper for flask, help marshal results (he said "just a"... so I think not a big deal).

#### Assembling it all in a DockerFile (6:51)

```docker
FROM tensorflow/tensorflow:2.0.0a0

RUN pip install sagemaker-training

#copies the training code inside the container
COPY train.py /opt/ml/code/train.py

# define train.py as script entrypoint
ENV SAGEMAKER_PROGRAM train.py

```

\*2023 - `sagemaker-container` was replaced with `sagemaker-training`.

`SAGEMAKER_PROGRAM` REQUIRED env variable

Options env variables

- `SAGEMAKER_TRAINING_MODULE`
- `SAGEMAKER_SERVICE_MODULE`
- `SM_MODEL_DIR`
- `SM_CHANNELS` / `SM_CHANNEL_*`
- `SM_HPS` / `SM_HP_*`
- `SM_USER_ARGS`
  ... many more \* HPS - short for "hyperparameters"

#### Production Variants

- You can test out multiple models on live traffic using Production Variants
  - Variant weights tell SageMaker how to distribute traffic among them
  - So, you could roll out a new iteration of your model at say 10% variant weight
- This lets you do A/B tests, and to validate performance in real world settings
  - Offline validation is always useful

### ⭐0200 - SageMaker on the Edge, Neo and IoT greengrass (4:18)

> Deploy Models up to Edge devices

#### SageMaker Neo

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

#### Neo + AWS IoT Greengrass (2:41)

**EXAM**

- Neo-compiled models can be deployed to an HTTPS endpoint
  - Hosted on **C5, M5, M4, P3, or P2** instances
  - Must be same instance type used for compilation (**think machine code**)
  - > This kinda defeats the purpose of Neo, so ... deploy greengrass
- OR! You can deploy to IoT Greengrass
  - This is how you get models to actual edge devices
  - Inference at the edge with local data, using model trained in the cloud
  - Uses Lambda Inference Application

### ⭐0201 SageMaker Resource Management, Instance Type and Spot Instances (2:55)

> Making sure you're using just the right amount of compute for your algorithms

#### Choosing your instance types (0:08)

- We cover this under "modeling" even though it's an operations concern
- **In general, algorithms that rely on deep learning will benefit from GPU instances (P3, g4dn) for training**, **EXAM**
- **Inference is usually less demanding and you can often get away with compute instances (C5)**
- GPU Instances can be pricey

> We talked about most of this in the Algorithms section because the algorithm/instance types are tightly coupled. We talk about it again because it's an operational concern.

> An algorithm that is not **deep learning** general purpose "M" class instances are a good fit

> GPU may cost more, but it may be less expensive to run a machine with multiple GPU than run more CPUs. Got to do the math.

#### Managed Spot Training (1:38)

- Can use EC2 Spot instances for training
  - Save up to 90% over on-demand instances
- Spot instances can be interrupted!
  - Use checkpoints to S3 so training can resume
- Can increase training time as you need to wait for spot instances

> Comes at the expense of complexity (checkpoints) and time (wait for spot)

### ⭐0202 SageMaker Resource Management AutoScaling (2:16)

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

### ⭐0203 SageMaker Deploying models for Inference (5:03)

#### Deploy Models for Inference

> Need to get the model listening on inference endpoints

> Model is not good until it goes into production

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

#### Deploying Models for Inference

**EXAM** Different types of inference

- Real-type Inference
  - For **interactive workloads** with **\_low latency requirements**
  - > I have this one thing that needs inference real-fast. (Single Shot)
- Amazon SageMaker Serverless Inference
  - No management of infrastructure
  - Ideal if workload has **idle periods** and **uneven traffic over time**, and can **tolerate cold starts**
  - > Can save you some money
  - > Poor choice if latency is a concern
- Asynchronous Inference:
  - Queues requests and processes them async
  - Examples: Large payload sizes (Up to 1GB) with long processing times, but **near-real-time latency requirements**
  - > We say near real-time because be can provide data rapidly and we can get data back rapidly. **HOWEVER**, you still have significant delay from start to finish
  - > They claim appropriate for interactive, but you still have to deal with delay(batch job)
- Autoscaling
  - Dynamically adjust compute resources for endpoint based on traffic
- SageMaker New
  - Optimize models for AWS Inferentia chips (for example)

### ⭐0204 SageMaker Serverless Inference and Inference Recommender (4:16)

#### Serverless Inference

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

Recommender - two modes: "Instance Recommendations" and "Endpoint Recommendations"

### ⭐0205 SM Inference Pipelines (1:39)

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

### ⭐0206 SageMaker Model Monitory (5:13)

#### SageMaker Model Monitor

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

#### SageMaker Model Monitory + Clarify

- Integrates with Clarify
  - SageMaker Clarify detects potential bias
  - i.e. imbalances across different groups/ages/income brackets
  - With ModelMonitor you can monitor for bias and be alerted to new potential bias via CloudWatch
  - SageMaker Clarify also helps explain model behavior
    - Understand which features contribute the most to your prediction

> Clarify is meant to detect bias

> What changed to affect your predictions

#### SageMaker Model Monitor (more details)

- Data is stored in S3 and secured (normal S3 security measures)
- Monitoring jobs are scheduled via Monitor Schedule
- Metrics are emitted to CloudWatch
  - CloudWatch notifications can be used to trigger alarms
  - You'd then take corrective actions (retrain the model, audit the data)
- Integrates with Tensorboard, QuickSight, Tableau
  - Or just visualize with `SageMaker Studio`

#### SageMaker Model Monitor (Things it can monitor specifically - "drift")

- Monitor Types

  - Drift data quality
    - Relative to a baseline you create
    - "Quality" is just statistical properties of the feature
  - Drift in model quality (accuracy et)
    - Works the same way with model quality baseline
    - Can integrate with `Ground Truth` labels
  - Bias Drift
  - Feature attribution drift
    - Based on Normalized Discounted Cumulative Gain (NDCG) score
    - This compares feature rankings of training vs live data

- Data quality drift
- Model quality drift (think it requires/compares human response)
- Bias drift
- Feature attribution drift

### ⭐0207 Model Monitor - Data Capture (1:37)

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

### ⭐0208 K8S, SM Projects, SM Pipelines (5:55)

> MLOps started to take off after the exam, however. It is expected the exam will cover some MLOPs "exam will catch up soon"

> MLOps is basically 'How do I managed building deploying some of my larger pipelines'

> How do we integrate with existing pipelines

#### MLOps with SageMaker and K8S

> One of those pipelines might be Kubernetes-based

- Integrates SM with Kubernetes-based ML infrastructure
- Amazon `SM Operators for K8S`
- Components for Kuberflow Pipelines ( I think training, deploy, monitor, blah blah)
- Enables hybrid ML workflow (on-prem + cloud)
- Enables integration of existing ML platform built on K8S or Kubeflow

[diagram https://d1.awsstatic.com/SageMaker/SageMaker%20reInvent%202020/K8/Amazon%20SageMaker%20Operators%20for%20Kubernetes.e2852ce0148e84e9c135dd155adda07eff6124e7.png]

            Amazon EKS
        (K8S control plane)
        /               \
       /                 \
    EC2 Node            SM Operator
    (Kublet)                 /
        \                   /
            (stack K8S env)
            K8S app
            ML Instance

- Kubernetes kicks off SM jobs

> All this is, is a way to kick-off SM jobs within K8S env, using SM APIs

#### SageMaker Components for Kubeflow Pipelines (2:45)

[Diagram https://d1.awsstatic.com/SageMaker/SageMaker%20reInvent%202020/K8/Amazon%20SageMaker%20Components%20for%20Kubeflow%20Pipelines.457ed1b488de6fe25a0b51951b6ba59f92cc0e38.png]

> Just integrating SM with Kubeflow

- Components for Kubeflow
  - Processing (Spark container)
  - Hyperparameter tuning
  - Training
  - Inference (actually hosting model)

#### SageMaker Projects

> What if you don't want to use K8S or Kubeflow?

> Obviously there is a way to do MLOps without K8S, this is 'SM Projects'

- SageMaker Studio's native MLOps solutions with CI/CD

  - Build images
  - Prep data, feature engineering
  - Train models
  - Evaluate Models
  - Deploy models
  - Monitor and Update Models

- Uses code repositories for building and deploying ML solutions
- Uses SM Pipeline defining steps

> Gives diagram to demonstrate we use repo and SM Pipeline defining steps

Know `SageMaker Projects` (MLOps without K8S )

4:37 - Diagram demonstrating flow
Use event bridge, code build, pipeline, blah blah blah- point is, the thing can get Hugely complicated and you can do everything and anything

### ⭐0209 What is Docker (5:10)

> We'll be talking about Docker ECS EKS

#### What is Docker

- Docker is a software development platform to deploy apps
- Apps are packaged in **containers** that can run on any OS
- Apps run the same, regardless of where they're run
  - Any machine
  - No compatibility issues
  - Predictable behavior
  - Less Work
  - Easier to maintain and deploy
  - works with any language, any OS, any technology
- Use cases: Microservices, lift-and-shift apps from on-prem to aws cloud

#### Docker on an OS

- run docker agent
- agent agent runs different docker app (node, java, mysql)

#### Where do you store docker images?

- Docker images are stored in Docker Repositories

Couple of Docker Repo options:

- Docker Hub (hub.docker.com)
  - Public repo
  - Find base images for many technologies or OS (eg Ubuntu, MySQL, etc)
- Amazon Elastic Container Registry (ECR)
  - Private (protected) Repository
  - Public Repo option called (ECR Public Gallery)

#### Docker vs Virtual Machines? (2:11)

- Docker is "sort of" a virtualization technology, but not exactly
  - Resources are shared with the host (many container on one server)

> EC2 is actually a VM run on a hypervisor

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

#### Getting Started with Docker (3:36)

1. Write Dockerfile
2. Dockerfile becomes docker image
3. `Push` image to repo (docker hub or other) or ECR
4. `pull` and run image. Running image is a container

#### Docker Container Management on AWS

- Amazon Elastic Container Service (Amazon ECS)
  - Amazon's own container platform
- Amazon Elastic Kubernetes Service (Amazon EKS)
  - Amazon's managed Kubernetes (Open Source project)
- AWS Fargate
  - Amazons own Serverless container platform
  - Works wih ECS and EKS
- Amazon ECR
  - Store container images

### ⭐0210 Amazon ECS - **EC2 Launch Type** (6:43)

> **ECS** **EC2 Launch Type**

- ECS - Elastic Container Service
- Launch Docker containers on AWS = Launch **ECS Tasks** on ECS Clusters
- EC2 Launch Type: **you must provision & maintain the infrastructure** (the EC2 instances)
- Each EC2 instance must run the EC2 Agent to register the in the ECS Cluster
- AWS Takes care of starting/stopping containers

> ECS Clusters are comprised as 'things' and with **EC2 Launch Type**, these things are EC2 Instances

> If you create ECS Cluster with EC2 Launch Type, you must provision and maintain the infrastructure yourself ???

> That we provision in advance

**TODO** This isn't clear to me. AWS will start/stop, but we must provision? Does that mean we provision x capacity and AWS will launch no more than that? And we tell it start/stop?

#### Amazon ECS - **Fargate Launch Type** (1:35)

- Launch Docker containers on AWS
- you **DO NOT NOT provision the infrastructure (no EC2 instances to manage)**
- All serverless
- You just create the task
- AWS just runs ECS tasks for you based on the CPU/RAM you need
- To scale, just increase the number of tasks - no more EC2 instances

**EXAM** will have fargate questions, probably not too in-depth but know the general idea of how to do it

**TODO** Create Fargate

#### IAM Roles for ECS (2:45)

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

#### ECS - Load Balancer Integrations (4:17)

> Each of the ECS tasks can be a http endpoint. Therefore we may want to put a Load Balancer in front of it.

**TODO** better understand ECS load balancing and Load Balancer. I thought ECS provided this functionality so we wouldn't use LB? But apparently we do

- `Application Load Balancer` supported and works for most use cases (this is the best general purpose option)
  '
- `Network Load Balancer` recommended only for high throughput / high performance (**very High**) use case, or to pair with `AWS Private Link`

- `Classic Load Balance` supported but not recommend (no advance features)

#### Data Volumes - EFS (5:21)

We use EFS because it is a network file system

- Mount EFS file system ECS tasks
- Works for both EC2 and Fargate launch types
- Tasks running in any AZ will share the same data in the EFS
- **Fargate + EFS = Serverless** (the goal)
- Use cases: \_\_persistent multi-AZ shared storage for your containers

- Note:
  - **Amazon S3 cannot be mounted as a file system (for ECS tasks)**

### ⭐0211 Hands On - Create Cluster (5:02)

**TODO** probably want to do this hands on

- Enable "New ECS experience" top right
- Three 3, Infrastructure options
  - Fargate (serverless)
  - EC2
  - External Instances Anywhere

> Fargate (serverless), AWS will provide the compute where we don't even see it
> EC2 To provide the compute for our instances to run on

**THESE ARE NOT MUTUALLY EXCLUSIVE** in the demonstration, these are check boxes, to allow more than one

- EC2 Capacity is Max/Min option not exact quantity

- Whe configuring EC2, have to also adjust/change/ok `network settings` Subnet, SG,VPC, blah blah

- I didn't notice ASG being configured but AWS does create one
- Apparently there is an 'desired capacity' which can be set to zero (0), for no capacity (good for learning)

- Apparently when creating cluster using both Fargate and EC2, you can launch task as either EC2 or Fargate -

What is "Capacity Provider" in ECS

### ⭐0212 Hands On Create Service (9:45)

- Create task definition
  - Name nginx demo - hello (docker image, on docker hub - hello world)
  - Infrastructure Fargate or EC2
  - OS type (linux fine)
  - Task Size (instance size)
  - Task Role (IAM)

> If we want to make a call to AWS services, we need Task Role. I assume if we do not want to make calls to AWS, then we don't need that role? or task-role that is highly restrictive

#### Launch as service (and scaling)

-With cluster running, go to "services", create services - Create a service - Task Def family - service name - some other things - Choose compute

**TODO** want to actually do this

To scale Fargate - increase the number of tasks

With Fargate, we can have several of the same tasks, can we have many of different? 5 http, 3 db, etc?

What is the cost for ECS fargate/EC2?

### ⭐0213 Amazon ECR (1:38)

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

### ⭐0214 - EKS Overview (Kubernetes- I think) (3:58)

- Amazon EKS = Amazon Elastic Kubernetes Service
- Its a way to launch **managed kubernetes** clusters on AWS
- Kubernetes is open-source system for automatic deployment, scaling and management of containerized (usually Docker) applications
- Its an alternative to ECS, similar but different API
- EKS supports **ECS** if you want to deploy worker nodes or **Fargate** deploy serverless containers
- Use case: if your company already using K8S on-premise or in another cloud, and want to migrate to AWS using Kubernetes
- K8S is Cloud-agnostic (can be used on any cloud, Azure, GCP, etc)

[diagram https://www.devopsschool.com/blog/wp-content/uploads/2021/03/Amazon-Elastic-Kubernetes-Service-EKS-Explained-Diagram-1.png] (1:42)

- `EKS Pods` are similar to tasks `Pods` relates to Amazon Kubernetes (not EKS)

So I think he is saying aws-Kubernetes vs EKS?
Pods <=> tasks

#### Node Types (2:21)

- Managed node groups
  - Creates and manages nodes (EC2 Instances) for you
  - Nodes are part of ASG managed by EKS
  - Supports on-demand or Spot
- Self Managed Nodes
  - Nodes created by you and registered to the EKS cluster managed by an ASG
  - You can use prebuilt AMI - Amazon `EKS optimized AMI`
  - Supports on-demand or Spot
- AWS Fargate (no nodes)
  - No node configuration

#### Amazon EKS - data volume

- Need to specify `StorageClass` manifest on your EKS cluster **EXAM**
- Leverages a `Container Storage Interface (CSI)` compliant driver **EXAM**

Support for: - EBS - EFS (only one to work with Fargate) - FSx for Luster - FSx for NetApp ONTAPP

### ⭐0215 EKS _Hands On_ (6:15)

> Outside of free tier can be very costly to follow along.

**TODO** set-up, it may be costly but you may not need to do the whole thing and you can likely limit to something not so expensive

**TODO** Get a better understanding of what he is talking about. Is there an AWS Kubernetes that is different that EKS?

`AmazonEKSWorkerNodePolicy`, `AmazonEKSRegistryReadOnly` - IAM for

`Manged Node Group`

\_\_I think the point is that you have to use a specific image to have access to EFS, specific with the CSI driver - not entirely sure.

### ⭐0216 AWS Batch (1:51)

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

### ⭐0217 CloudFormation (3:31)

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

### ⭐0218 CloudFormation **HANDS ON** (8:32)

**Application Composer** may be the same thing as **Infrastructure Composer**?
In the video the tab say Application Composer. Either way, its the same visualizer/interactive-diagram, tool as before- just beautified

**AMI's are Region specific**

Really nothing unexpected. When working with CF, you should do not provisioning manually all should be done through stacks/CF

### ⭐0219 AWS Cloud Development Kit (CDK) (4:51)

Allows you to define infrastructure in code - familiar to you (js, java, typescript, .net, etc), instead of YAML

- Define your cloud infrastructure using a familiar language
  - Javascript/Typescript, Python, Java, .NET
- If it compiles, it is assumed the Infrastructure is sound, if the infrastructure is not sound, it is assumed there will be compile errors
- The code is "compiled" into CloudFormation YAML
- You can therefore deploy infrastructure and application code together

  - **Great for Lambda functions**
  - **Great for ECS or EKS**

- `Construct` high level components (not sure if that is 'stack' or the components that make the stack, I **think** the components that make the stack)
- With YAML we don't know about errors until we try to deploy the stack. With CDK we have a layer of error detection with the compile aspect.

[diagram] (2:37)

#### Difference between CDK and SAM (3:01)

- SAM:
  - **Serverless focused**
  - Write your template declaratively in JSON or YAML
  - Great for quickly getting started with Lambda
  - Leverages CF
- CDK:
  - All AWS Services (mostly)
  - Write infrastructure in a familiar programming language (Javascript, .NET, TS, etc)
  - Leverages CF

#### CDK + SAM (4:10)

> This sounds like it was a lecture that was added after the course was creating, as if maybe there may be an **exam** question here

> There is a way to combine SAM and CDK

- You can use SAM CLI to locally test your CDK apps
- You must first run `cdk synth` to get CF YAML
- Use the CF Yaml for SAM to invoke lambda?

### ⭐0220 CDK Hands On (11:33)

- install cdk (he is working in the AWS console)
- init project
- `cdk ls` lists the stack
- the script imports libraries, then defines the stack
- stack **parameters** using CDK is slick

**TODO** This maybe part of the course material. It maybe be interesting to at least look at the cdk/code files.

**Todo** I think the `cdk bootstrap` creates the cdk-toolkit stack, which is black-boxed, we don't need to concern with it. Maybe want to verify that

### ⭐0221 AWS Code Deploy (1:40)

> CodeDeploy is a way for us to deploy our Application automatically

- We want to deploy our application automatically
  > Little more permissive
- Works with EC2 instance
- Works with On-Premise
- **Hybrid** Service

- Must provision capacity in advance, servers/instances and configured with **CodeDeploy Agent**
- It is an event service so it can not be demo'd

**EXAM** Remember CodeDeploy allows you to upgrade your servers (EC2 or onPrem) from v1 to v2 automatically from a single interface.

### ⭐0222 CodeBuild (1:07)

- Code building service in the cloud
- Compiles source code, run tests, produces packages that are ready to be deployed (by CodeDeploy for example)

[diagram] codeCommit->CodeBuild->[ready to deploy]

Benefits

- Fully managed serverless
- Continuously scalable and highly available
- secure
- Pay as you go pricing (you only pay for when your code is being built)

### ⭐0223 CodePipeline (1:37)

- Orchestrate the different steps to have the code automatically pushed to production
  - Code => Build => Test => Provision => Deploy [given pipeline]
  - Basis for CI/CD

[Diagram, pipeline is the house, and CodeCommit, CodeBuild, CodeDeploy, Beanstalk are within the house]

- Benefits:
  - Fulling managed, compatible with cCommmit, cBuild, cDeploy, Elastic Beanstalk,... custom plugin
  - Fast Delivery & rapid update

**EXAM** Orchestration of pipeline (code pipeline), think AWS CodePipeLine

### ⭐0224 Git Review: Architecture and Commands (6:11)

> **EXAM** may have some git questions

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

### ⭐0225 Git-flow Github Flow (3:00)

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

### ⭐0226 EventBridge (7:00)

> Formally known as "CloudWatch Events"

Things you can do

- Schedule cron jobs
- React Event pattern, Event rules to react to a service doing something
  - Example: IAM Root user sign-in event, send to SNS in-turn sends email
- Different event targets (triggers): Lambda, SQS, SNS

#### Event Bridge Rules (1:13)

[diagram] demonstrate EventBridge can accept many/most service's event (the services can send?), we create 'event filter', and the event bridge creates a json document (event) to the target. The target can be bunches of thing: lambda, aws batch, sqs/sns, blah blah. (Possibilities are endless)

EventBridge + CloudTrain = can capture any API call

#### Event Bridge - Default Event Bus(03:14)

- **AWS Sends service message to the default bus** message from CloudTrail go on the **default bus**
- Partner Event Bus - AWS Integrates with 'partners' likely SaSS companies (Zendesk, Datadog, etc), they will send their event directly into the partner event bus. So you can react to events happening outside of your account.
- Custom Event Bus. Your own application can send events into its own event bus

- Event buses can be access by other AWS accounts using Resource-based policies
- You can archive events (all/filter) sent to an event bus (indefinitely or set-period)
- Archived events gives you the ability to **replay** events

#### Schema Registry (5:00)

- EventBridge can analyze the events in your bus and **infer** the schema
- The Schema Registry allows you to generate code for your application, that will know in advance how data is structured in the event bus.
- Schema can be versioned

#### Resource Based Policy

- Manage permissions for a specific Event Bus
- Example Allow/Deny events from another AWS account or AWS region
- Use case: aggregate all event from your AWS **Organization** in a single AWS **account** or AWS **region**

This allows you to allow other organizations (or other entity) to send events to your bus

### ⭐0227 Event Bridge **HANDS ON** (6:52)

**PAY ATTENTION YOU ARE NO SO STRONG WITH EVENT BRIDGE IT WILL BE GOOD FOR YOU TO HAVE A BETTER UNDERSTANDING**
Want to pay extra attention to how the schema registry works

> Rules are ways for you to react to events in your account

- Event source can be:

  - AWS Events or EventBridge Partner Events
  - Other
  - All Events

- Event Pattern:
  - Use Schema
  - Use pattern from template provided by EventBridge
  - Use custom pattern (json editor)

Choosing 'Patter from template' other options become available:

- `Event Source` (AWS Services - selected)
- `AWS Service` becomes available (S3, EC2, etc etc)
- `Event Type` (state changed, shutdown - started, 'events' for the given service).

Summary thus far, Event Bridge will guide user to create events EventBridge monitors for AWS Services - you can be pretty much clueless as it provides 'select one' options (dropdowns)

Rule has

- event (type)
- target (like 'listen to' configuration, target has select one menu make it easy for the user).

#### Rule for listening to services (Event Buses)

In creating the EventBridge-rule, we choose to 'listen' for specific events that may surface from anywhere (meaning any ec2 instance or any other service instance) - but we clearly define which service(s) will receive the topic. We have to have an SNS topic already set-up, and the event will go to that specific topic

#### Rule for cron (Event Scheduler)

- crate rule to run 'every hour'

**TODO** Not entirely clear to me the role a 'bus' should take. Is it single event or class of events? Do we set-up a 'bus' for all of our system events (EC2, Database errors, security breach, etc)? Or do we create a single bus for each rule (doubtful).

Each bus appears to have its own properties (encryption), logs, KMS keys, archive rule, etc.

Event bus will have it's own security policies. I suppose then 'bus' is "separation of concerns", as determined by use-case, as determined by each AWS account/organization

#### Replay

> He said "you can replay events if you want to" - that was the end of the presentation.

He then goes into 'partner' (third party providers) - I think we see this on the exam as a 'you can also integrate-deeply with 3rd-party service providers' - and less about how to use Event Bridge

#### Event Schema Registry

- You can view the schema for all the known events for each service (see all EC2 events as example)

**Can download 'code bindings'** for any of the major languages (java, python, typescript, etc) - making building clients super easy

**Exam** know rules and schedule

### ⭐0228 AWS Step Functions (4:00)

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

### ⭐0229 Step Functions, State Machines, and states (3:19)

**EXAM** He goes on to say this is extremely useful tool for data engineering and expect a lot of questions.. I am skeptical 'lot' of questions as the exam is only 100 questions -

- Your workflow is call `state machine`
- Each step is called `state`
- However there are many types of `state`
  - `Task` - does something with Lambda, other AWS Services, or third party API
  - `Choice` - Adds conditional logic via `Choice Rules`
  - `Wait` - delays state machine for a specific period
  - `Parallel` - Add separate branches of execution
  - `Map` - run a set of steps for each item in a dataset **in parallel**
    - This is most relevant to data engineers! Works with JSON, S3 Object, csv files, etc
  - `Pass`, `Success`, `Fail` (terminal states, I assume)

> Task state, Choice Stat, Wait State, etc

**EXAM**
**if you can remember only one state - "Map State" is the most important, second would be task**

### ⭐0230 - Amazon Manged Workflows for Apache Airflow (MWAA) (4:51)

> Managed hosted environment for Apache Airflow

- Apache Airflow is a batch-oriented workflow tool
- Develop, schedule, and monitor your workflows
- Workflows are defined as Python code that creates **Directed Acyclic Graph (DAG)**
- Amazon MWAA provides managed service for Apache Airflow so you don't have to deal with install or maintaining it.

> Kinda the same way Apache Spark works (regarding DAG)

> Wonder what kinda of DAG libraries are used?

- Use Cases:
  - Complex workflows
  - ETL Coordination
  - Preparing ML data

**EXAM**

> You create DAGs using Python for Airflow

#### Airflow + MWAA (2:22)

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

### ⭐0231 AWS Lake Formation (9:07)

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

### ⭐0232 Data Filters in Lake Formation (1:30)

> Data Filters, another way to implement security restrictions

- Column, row, or cell-level security
- Applied when granting SELECT permission on tables
- Row Level Security: "Allow columns" + row filter = row-level security
- Column Level Security: "Allow all rows" + specific columns = Column-level security
- Cell level security: Specify columns + specific rows = cell-level security
- Create filters use the web-console or via `CreateDataCellFilter` API
