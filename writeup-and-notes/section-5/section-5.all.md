# Section 5: Compute & Load Balancing - Solution Architecture on AWS

**Topic:** 43. Solution Architecture on AWS  
**Duration:** 4min  
**Section:** 5

## Notes

### Compute & Load Balancing

Intro to section

### Solution Architecture on AWS

[Graphic not available]

He goes over the "Overview" of generic architecture, that an app is "layers"

- A request starts as a human interaction (most likely). From there it travels two paths
  - Static content (Web Layer)
  - Dynamic content (CDN Layer)
    - Dynamic layer then goes to a compute layer (CLB, NLB, ALB, API-Gateway)
      - The compute layer may depend on various services
      - Caching Layer (DAX, DynamoDB, ElasticCache (preferred))
      - Database Layer (RDS, Aurora)
      - Storage (EBS, EFS, Instances Store)
      - Decoupling Orchestration Layer (SQS, Step Functions, Kinesis, etc)

Most of these layers are hierarchical, except the static layer, it connects to CDN which connects to the static assets layer (storage)

# Section 5: Compute & Load Balancing - EC2

**Topic:** 44. EC2  
**Duration:** 10min  
**Section:** 5

## Notes

### EC2 Instance Types – Main ones

- R: applications that needs a lot of **[R]AM** – in-memory caches
- C: applications that needs good **[C]PU** – compute / databases
- M: applications that are balanced (think **“medium”**) – general / web app
- I: applications that need good local **I/O** (instance storage) – databases
- G: applications that need a **[G]PU** – video rendering / machine learning
- T2 / T3: **burstable** instances (up to a capacity)
- T2 / T3 - unlimited: **unlimited burst**

- Real-world tip: use https://www.ec2instances.info

**QUESTION**
What are the instance families? What does each mean (7)?
T2/T3, etc.
Hint "P" is an instance type family but not in this exam.
**ANSWER**

- R: applications that needs a lot of **[R]AM** – in-memory caches
- C: applications that needs good **[C]PU** – compute / databases
- M: applications that are balanced (think **“medium”**) – general / web app
- I: applications that need good local **I/O** (instance storage) – databases
- G: applications that need a **[G]PU** – video rendering / machine learning
- T2 / T3: **burstable** instances (up to a capacity)
- T2 / T3 - unlimited: **unlimited burst**

**QUESTION_END**

### EC2 - Placement Groups

- Control the EC2 Instance placement strategy using placement groups
- Group Strategies:
  - Cluster—clusters instances into a low-latency group in a single Availability Zone
  - Spread—spreads instances across underlying hardware (max 7 instances per group per
    AZ) – critical applications
  - Partition—spreads instances across many different partitions (which rely on different sets
    of racks) within an AZ. Scales to 100s of EC2 instances per group (Hadoop, Cassandra,
    Kafka)
- You can move an instance into or out of a placement group
  - Your first need to stop it
  - You then need to use the CLI (modify-instance-placement)
  - You can then start your instance

**QUESTION**
What are the three EC2 placement strategies? What advantages?
**ANSWER**

- Group Strategies:
  - Cluster—clusters instances into a low-latency group in a single Availability Zone
  - Spread—spreads instances across underlying hardware (max 7 instances per group per
    AZ) – critical applications
  - Partition—spreads instances across many different partitions (which rely on different sets
    of racks) within an AZ. Scales to 100s of EC2 instances per group (Hadoop, Cassandra,
    Kafka)

**QUESTION_END**

**QUESTION**
**EXAM** how to move an instance from one placement group to another?
**ANSWER**

- You can move an instance into or out of a placement group
  - Your first need to stop it
  - You then need to use the CLI (modify-instance-placement)
  - You can then start your instance

**QUESTION_END**

### Placement Groups Cluster (3:25)

> Same Rack, Same AZ, All the eggs in the same basket

- **Pros**: Great network (10 Gbps bandwidth between instances with Enhanced Networking enabled - recommended)
- **Cons**: If the rack fails, all instances fails at the same time
- Use case:
  - Big Data job that needs to complete fast
  - Application that needs extremely low latency and high network throughput

### Placement Groups Spread (4:18)

- **Pros**:
  - Can span across Availability Zones (AZ)
  - Reduced risk is simultaneous failure
  - EC2 Instances are on different physical hardware
- **Cons**:
  - Limited to 7 instances per AZ per placement group
- **Use case**:
  - Application that needs to maximize high availability
  - Critical Applications where each instance must be isolated from failure from each other

> Safest deployment/placement strategy

### Placements Groups Partition

- Up to 7 partitions per AZ
- Up to 100s of EC2 instances
- The instances in a partition do not share racks with the instances in the other partitions
- A partition failure can affect many EC2 but won’t affect other partitions
- EC2 instances get access to the partition information as metadata
- Use cases: HDFS, HBase, Cassandra, Kafka

### EC2 Instance Launch Types

- **On Demand** Instances: short workload, predictable pricing, reliable
- **Spot Instances**: short workloads, for cheap, can lose instances (not reliable)
- **Reserved**: (MINIMUM 1 year)
  - Reserved Instances: long workloads
  - Convertible Reserved Instances: long workloads with flexible instances
  - Highest to lowest discount: All Upfront payment, Partial Upfront payment, no Upfront
- **Dedicated Instances**: no other customers will share your hardware
- **Dedicated Hosts**: book an entire physical server, control instance placement
  - Great for software licenses that operate at the core, or CPU socket level
  - Can define host affinity so that instance reboots are kept on the same host

**TODO** He says repeated "Up to 7 per AZ" where does this limit come from

**QUESTION**
What are the various "Launch Types"(5)? What are the advantages of each?
**ANSWER**

- **On Demand** Instances: short workload, predictable pricing, reliable
- **Spot Instances**: short workloads, for cheap, can lose instances (not reliable)
- **Reserved**: (MINIMUM 1 year)
  - Reserved Instances: long workloads
  - **Convertible Reserved Instances**: long workloads with flexible instances
  - Highest to lowest discount: All Upfront payment, Partial Upfront payment, no Upfront
- **Dedicated Instances**: no other customers will share your hardware
- **Dedicated Hosts**: book an entire physical server, control instance placement
  - Great for software licenses that operate at the core, or CPU socket level
  - Can define host affinity so that instance reboots are kept on the same host

**QUESTION_END**

### EC2 Graviton (7:14)

- AWS Graviton Processors deliver the best price performance
- Supports many Linux OS, Amazon Linux 2, RedHat, SUSE, Ubuntu
- **Not available for Windows instances**
- `Graviton2` – 40% better price performance over comparable 5th
  generation x86-based instances
- `Graviton3` – Up to 3x better performance compared to Graviton2
- Use cases: app servers, microservices, HPC, CPU-based ML, video
  encoding, gaming, in-memory caches,

### EC2 included metrics (8:04)

- `CPU`: CPU Utilization + Credit Usage / Balance
- `Network`: Network In / Out
- `Status Check`:
  - Instance status = check the EC2 VM
  - System status = check the underlying hardware
- `Disk`: Read / Write for Ops / Bytes (only for instance store)

- RAM is NOT included in the AWS EC2 metrics (**EXAM**)

**QUESTION**
What are the EC2 Metrics (4)? What is one thing that is not a metric that you would expect? One metric is valid only for Instance Store instances?
**ANSWER**

- `CPU`: CPU Utilization + Credit Usage / Balance
- `Network`: Network In / Out
- `Status Check`:
  - Instance status = check the EC2 VM
  - System status = check the underlying hardware
- `Disk`: Read / Write for Ops / Bytes (**only for instance store** otherwise you get these metrics directly)

- RAM is NOT included in the AWS EC2 metrics (**EXAM**)

**QUESTION_END**

### EC2 Instance Recovery (8:40)

- Status Check:
  - Instance status = check the EC2 VM
  - System status = check the underlying hardware

- Recovery: Same Private, Public, Elastic IP, metadata, placement group

**QUESTION**
With instance recovery, what instance properties are restored?
**ANSWER**

- Recovery: Same Private, Public, Elastic IP, metadata, placement group

> I think AMI is missing from this list

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 5: Compute & Load Balancing - High Performance Computing (HPC)

**Topic:** 45. High Performance Computing (HPC)  
**Duration:** 6min  
**Section:** 5

## Notes

### High Performance Computing (HPC)

- The cloud is the perfect place to perform HPC
- You can create a very high number of resources in no time
- You can speed up time to results by adding more resources
- You can pay only for the systems you have used

Use-cases:

- Perform genomics, computational chemistry, financial risk modeling,
  weather prediction, machine learning, deep learning, autonomous driving

- Which services help perform HPC?

### Data Management & Transfer

- AWS Direct Connect:
- Move GB/s of data to the cloud, over a private secure network
- Snowball
- Move PB of data to the cloud
- AWS DataSync
- Move large amount of data between on-premise and S3, EFS, FSx for Windows

### Data Management & Transfer (1:09)

- AWS Direct Connect:
  - Move GB/s of data to the cloud, over a private secure network
- Snowball
  - Move PB of data to the cloud (through physical link)
- AWS DataSync
  - Move large amount of data between on-premise and S3, EFS, FSx for Window

### Compute and Networking (1:45)

- EC2 Instances:
  - CPU optimized, GPU optimized
  - Spot Instances / Spot Fleets for cost savings + Auto Scaling
- EC2 **Placement Groups**: Cluster for good network performance

**TODO** I thought placement group was a logical grouping. This the slide suggest that they are physically near "Placement Group Cluster, low latency, same rack, same az" (2:14)

### Compute and Networking (2:37)

**EXAM** How to get Enhanced Networking, working

- **EC2 Enhanced Networking (SR-IOV)**
  - Higher bandwidth, higher PPS (packet per second), lower latency
  - Option 1: Elastic Network Adapter (ENA) up to 100 Gbps (**EXAM**)
  - Option 2: Intel 82599 VF up to 10 Gbps – LEGACY

**EXAM** You should know this

- **Elastic Fabric Adapter (EFA)**
  - Improved ENA for HPC, only works for Linux
  - Great for inter-node communications, tightly coupled workloads
  - Leverages Message Passing Interface (MPI) standard
  - Bypasses the underlying Linux OS to provide low-latency, reliable transport

**TODO** He makes the claim that "Bypasses the underlying Linux OS to provide low-latency" Learn more about this

### Storage (4:28)

- Instance-attached storage:
  - EBS: scale up to 256,000 IOPS with io2 Block Express
  - Instance Store: scale to millions of IOPS, linked to EC2 instance, low latency
- Network storage:
  - Amazon S3: large blob, not a file system
  - Amazon EFS: scale IOPS based on total size, or use provisioned IOPS
  - Amazon FSx for Lustre:
    - HPC optimized distributed file system, millions of IOPS
    - Backed by S3

**TODO** Know this, This was suppose to be HPC related but they're throwing in 'general' options 'EBS', is that really "high performance"?, Not also, I thought a limitation of FSx for Lustre - was bound to single AZ.

**TODO** Get a better appreciation of GB/s vs IOPS. I think we shouldn't intermingle. I get GB/s (or rate), but IOPS is a little fuzzy why it would be used in similar context.

### Automation and Orchestration (5:28)

- AWS Batch
  - AWS Batch supports multi-node parallel jobs, which enables you to run single jobs that span multiple EC2 instances.
  - Easily schedule jobs and launch EC2 instances accordingly

- AWS ParallelCluster
  - Open source cluster management tool to deploy HPC on AWS
  - Configure with text files
  - Automate creation of VPC, Subnet, cluster type and instance types

**EXAM** So I think the take away in this slide is there is the generic way, and there are HPC options. I should know what those options are, how they are a benefit, what they would replace

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 5: Compute & Load Balancing - Auto Scaling

**Topic:** 46. Auto Scaling  
**Duration:** 8min  
**Section:** 5

## Notes

### Auto Scaling Groups – Dynamic Scaling Policies

> **"Dynamic"** is the key here

- **Target Tracking Scaling**
  - Most simple and easy to set-up
  - Example: I want the average ASG CPU to stay at around 40%
- **Simple / Step Scaling**
  - When a CloudWatch alarm is triggered (example CPU > 70%), then add 2 units
  - When a CloudWatch alarm is triggered (example CPU < 30%), then remove 1
- **Scheduled Actions**
  - Anticipate a scaling based on known usage patterns
  - Example: increase the min capacity to 10 at 5 pm on Fridays

### Auto Scaling Groups – Predictive Scaling

- Predictive scaling: continuously forecast load and schedule scaling ahead

![predictive-scaling](https://docs.aws.amazon.com/images/autoscaling/plans/userguide/images/predictive-scaling.png "predictive-scaling")

### Good metrics to scale on (1:55)

- **CPUUtilization**: Average CPU utilization across your instances
- **RequestCountPerTarget**: to make sure the number of requests per EC2 instances is stable
- **Average Network In / Out** (if you’re application is network bound)
- **Any custom metric (that you push using CloudWatch)**

**QUESTION**
What are good metrics to scale on (4)?
**ANSWER**

- **CPUUtilization**: Average CPU utilization across your instances
- **RequestCountPerTarget**: to make sure the number of requests per EC2 instances is stable
- **Average Network In / Out** (if you’re application is network bound)
- **Any custom metric (that you push using CloudWatch)**

**QUESTION_END**

### Auto Scaling – Good to know (2:51)

- Spot Fleet support (mix on Spot and On-Demand instances)
- Lifecycle Hooks:
  - Perform actions before an instance is in service, or before it is terminated
  - Examples: cleanup, log extraction, special health checks
- To upgrade an AMI, must update the launch configuration / template
  - Then terminate instances manually (CloudFormation can help)
  - Or use EC2 Instance Refresh for Auto Scaling

**TODO** Spot vs On Demand - Is there a ratio? How bad of an idea to mix 50% spot/demand?

**QUESTION**
Good to know about Auto Scaling, 3 facts?

**ANSWER**

- Spot Fleet support (mix on Spot and On-Demand instances)
- Lifecycle Hooks:
  - Perform actions before an instance is in service, or before it is terminated
  - Examples: cleanup, log extraction, special health checks
- To upgrade an AMI, must update the launch configuration / template
  - Then terminate instances manually (CloudFormation can help)
  - Or use EC2 Instance Refresh for Auto Scaling

**QUESTION_END**

### Auto Scaling – Instance Refresh (3:41)

- Goal: update launch template and then re-creating all EC2 instances
- For this we can use the native feature of Instance Refresh
- Setting of minimum healthy percentage
- Specify warm-up time (how long until the instance is ready to use)

**QUESTION**
What is the clever way to Refresh Instances (using their updated launch configuration)?
**ANSWER**

- Goal: update launch template and then re-creating all EC2 instances
- For this we can use the native feature of Instance Refresh
- Setting of minimum healthy percentage
- Specify warm-up time (how long until the instance is ready to use)

**QUESTION_END**

### Auto Scaling – Scaling Processes (4:35)

- **Launch**: Add a new EC2 to the group, increasing the capacity
- **Terminate**: Removes an EC2 instance from the group, decreasing its capacity.
- **HealthCheck**: Checks the health of the instances
- **ReplaceUnhealthy**: Terminate unhealthy instances and re-create them
- **AZRebalance**: Balancer the number of EC2 instances across AZ
- **AlarmNotification**: Accept notification from CloudWatch
- **ScheduledActions**: Performs scheduled actions that you create.
- **AddToLoadBalancer**: Adds instances to the load balancer or target group
- **InstanceRefresh**: Perform an instance refresh
- **We can suspend these processes!**

**QUESTION**
What are the Auto Scaling Processes (9)?
**ANSWER**

- **Launch**: Add a new EC2 to the group, increasing the capacity
- **Terminate**: Removes an EC2 instance from the group, decreasing its capacity.
- **HealthCheck**: Checks the health of the instances
- **ReplaceUnhealthy**: Terminate unhealthy instances and re-create them
- **AZRebalance**: Balancer the number of EC2 instances across AZ
- **AlarmNotification**: Accept notification from CloudWatch
- **ScheduledActions**: Performs scheduled actions that you create.
- **AddToLoadBalancer**: Adds instances to the load balancer or target group
- **InstanceRefresh**: Perform an instance refresh

- **We can suspend these processes!**

**QUESTION_END**

### Auto Scaling – Health Checks

- Health checks available:
  - EC2 Status Checks
  - ELB Health Checks (HTTP)
  - Custom Health Checks – send instance’s health to an ASG using AWS CLI or AWS SDK (set-instance-health)

- ASG will launch a new instance after terminating an unhealthy one
- Make sure the health check is simple and checks the correct thing

**QUESTION**
What is a bad health check? What happens if you have a poorly planned health check?
**ANSWER**
One that has to do a lot of work. It should be a simple thing that returns simple status.

If the health check is overly complicated and takes time to respond it may cause the Load Balancer to determine the instance is unhealthy and cause it to replace the instance. Since all instances use the same health check, they'll likely all get replaced, over-and-over.
**QUESTION_END**

**QUESTION**
What are the available Health Checks (3)?
**ANSWER**

- Health checks available:
  - EC2 Status Checks
  - ELB Health Checks (HTTP)
  - Custom Health Checks – send instance’s health to an ASG using AWS CLI or AWS SDK (set-instance-health)

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 5: Compute & Load Balancing - Auto Scaling Update Strategies

**Topic:** 47. Auto Scaling Update Strategies  
**Duration:** 5min  
**Section:** 5

## Notes

### Auto Scaling – Updating an application

#### Same "Target Group".

He goes on to explain the basic structure of 'an application', where client interact with ALB and ALB Interacts with 'Scaling Group'. We want to update the scaling group with a new launch template.

### Auto Scaling – Solution Architecture (1:02) (I)

[diagram not available]

Updating the launch template, will create new instances with the new template. The scaling group will have inconsistent instance (v1 and v2).

May have to increase capacity to cause new machines to get built.

#### New Target Group (II)

In this scenario, we keep the original group, and create a second group.

We send a "small amount of traffic" to the new Target Group, to test. I assume that is a configuration on the ALB.

If we find the new Target Group works as expected, then we migrate traffic over, slowly or in organized fashion.

> The ALB remains the same in both scenarios, meaning the client doesn't see the changes nor does it need to be changed

#### (III)

Multi ALB, - new ALB - new Target Group

We have to introduce Route 53 + CNAME record to hide the fact that we're using a new/different ALB. We use R53 to divide traffic (C-Record weights).

This requires well behave clients that query DNS (not cache), respect TTL. We must migrate slowly.

The advantage of this method, is that we can test the new ALB/Target Group at the ALB, instead of introducing into production and testing (small traffic).

**QUESTION**
What are the three "update scaling group" methods? What are the pros/cons?
**EXAM**
**ANSWER**

1. Simple
   - How to:
     - Increase capacity (I assume)
     - Update launch configuration
       - At this point one launch group one alb, inconsistent config
   - Pros:
     - It's easy
   - Cons:
     - Increase capacity a little (could be pro or con)
     - inconsistent config state

2. Two Target Groups
   - How to:
     - Create second scaling group
     - configure ALB to send "small amount of traffic"
   - Pros
     - Less infrastructure configuration (no R53)
   - Cons
     - Probably extra capacity
     - inconsistent instance configuration (launch template 1 / launch template 2)

3. Two ALB
   - How To:
     - Set-up second ALB and second Scaling Group
     - Use Route53 + CNAME record weights to divide traffic between old/new
     - Before engaging R53 changes, you can test the new group at the second ALB
   - Pros:
     - Not sure the "pros" perhaps a better UX experience it is "all or none"
   - Cons:
     - More infrastructure. During the two-systems you'll likely require twice the bandwidth
     - Due to lack of consistency in clients and the requirement that clients are "well behaved", **migration is slow**

**TODO** Maybe better understand the pro/cons all options a little better. Specifically, what is so bad about the first option, slight increase in capacity, update launch config?

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 5: Compute & Load Balancing - Spot Instances & Spot Fleet

**Topic:** 48. Spot Instances & Spot Fleet  
**Duration:** 5min  
**Section:** 5

## Notes

### EC2 Spot Instances

- Can get a discount of up to 90% compared to On-Demand
- Define max spot price and get the instance **while current spot price < max**
  - The hourly spot price varies based on offer and capacity
  - If the current spot price > your max price you can choose to stop or terminate your instance with a 2 minutes grace period.

- Used for batch jobs, data analysis, or workloads that are resilient to failures.
- **Not great for critical jobs or databases**

**QUESTION**
How does AWS determine who gets 'spot' instances
**ANSWER**

- Define max spot price and get the instance **while current spot price < max**
  - The hourly spot price varies based on offer and capacity
  - If the current spot price > your max price you can choose to stop or terminate your instance with a 2 minutes grace period.

**QUESTION_END**

> The issue is loss of instance with a 2 minute grace period. If you have a long-running transaction and the plug gets pulled, you'll never get the db->commit. Hence, when architecting, consider using spot-instances and their possibility of 'failure' or unplugged

### Spot Fleets (2:20)

- Spot Fleets = set of Spot Instances + (optional) On-Demand Instances
- The Spot Fleet will try to meet the target capacity with price constraints
  - Define possible launch pools: instance type (m5.large), OS, Availability Zone
  - Can have multiple launch pools, so that the fleet can choose
  - Spot Fleet stops launching instances when reaching capacity or max cost
- **Strategies to allocate Spot Instances**:
  - lowestPrice: from the pool with the lowest price (cost optimization, short workload)
  - diversified: distributed across all pools (great for availability, long workloads)
  - capacityOptimized: pool with the optimal capacity for the number of instances
  - priceCapacityOptimized (recommended): pools with highest capacity available, then select the pool with the lowest price (best choice for most workloads)

- Spot Fleets allow us to automatically request Spot Instances with the lowest price

**QUESTION**
Spot Instance Flee / Spot Fleet.
What are the strategies for determine the 'next instance', how does it choose between spot/on-demand?
**ANSWER**

- **Strategies to allocate Spot Instances**:
  - lowestPrice: from the pool with the lowest price (cost optimization, short workload)
  - diversified: distributed across all pools (great for availability, long workloads)
  - capacityOptimized: pool with the optimal capacity for the number of instances
  - priceCapacityOptimized (recommended): pools with highest capacity available, then select the pool with the lowest price (best choice for most workloads)

**QUESTION_END**

**QUESTION**

What are the dis/advantages of spot fleets?
**ANSWER**

**TODO** What are the dis/advantages of spot fleets?

**QUESTION_END**

**TODO** Look at setting up a spot fleet. It can be deployed across multiple AZ and uses a combo of on-demand and spot. Look at how to set-up the whole system in terms of Forms.

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 5: Compute & Load Balancing - Amazon ECS - Elastic Container Service

**Topic:** 49. Amazon ECS - Elastic Container Service  
**Duration:** 11min  
**Section:** 5

## Notes

### What is Docker?

- Docker is a software development platform to deploy apps
- Apps are packaged in containers that can be run on any OS
- Apps run the same, regardless of where they’re run
  - Any machine (no compatibility issues, predictable behavior)
  - Less work
  - Easier to maintain and deploy
  - Works with any language, any OS, any technology
- Control how much memory / CPU is allocated to your container
- Scale containers up and down very quickly (seconds)
- **More efficient than Virtual machines**

### Docker Containers Management on AWS (1:05)

- To manage containers, we need a container management platform
- Amazon Elastic Container Service (Amazon **ECS**)
  - Amazon’s own container platform
- Amazon Elastic Kubernetes Service (Amazon **EKS**)
  - Amazon’s managed Kubernetes (open source)
- AWS **Fargate**
  - Amazon’s own Serverless container platform
  - Works with ECS and with EKS

### Amazon ECS – Use cases

- Run Microservices
  - Run multiple Docker containers on the same machine
  - Easy Service Discovery features to enhance communication
  - Direct integration with Application Load Balancer and Network Load Balancer
  - Auto Scaling capability
- Run Batch Processing / Scheduled Tasks
  - Schedule ECS tasks to run on On-demand / Reserved / Spot instances
- Migrate Applications to the Cloud
  - Dockerize legacy applications running on-premises
  - Move Docker containers to run on Amazon ECS

**TODO** What is "Easy Service Discovery features to enhance communication"

### Amazon ECS – Concepts (2:05)

- **ECS Cluster** – logical grouping of EC2 instances
- **ECS Service** – defines how many tasks should run and how they should
  be run
- **Task Definitions** – metadata in JSON form to tell ECS how to run a
  Docker container (image name, CPU, RAM, …)
- **ECS Task** – an instance of a Task Definition, a running Docker container(s)
- **ECS IAM Roles**
  - EC2 Instance Profile – used by the EC2 instance (e.g., make API calls to ECS, send logs, …)
  - ECS Task IAM Role – allow each task to have a specific role (e.g., make API calls to S3, DynamoDB, …)

**QUESTION**
What are the main concepts/terms of ECS(5)?

**ANSWER**

- **ECS Cluster** – logical grouping of EC2 instances
- **ECS Service** – defines how many tasks should run and how they should
  be run
- **Task Definitions** – metadata in JSON form to tell ECS how to run a
  Docker container (image name, CPU, RAM, …)
- **ECS Task** – an instance of a Task Definition, a running Docker container(s)
- **ECS IAM Roles**
  - EC2 Instance Profile – used by the EC2 instance (e.g., make API calls to ECS, send logs, …)
  - ECS Task IAM Role – allow each task to have a specific role (e.g., make

**QUESTION_END**
[Diagram not available]

### Amazon ECS – ALB Integration (4:30)

- We get Dynamic Port Mapping
- Allows you to run multiple instances of the same application on the same EC2 instance
- The ALB finds the right port on your EC2 Instances
- Use cases:
  - Increased resiliency even if running on one EC2 instance
  - Maximize utilization of CPU / cores
  - Ability to perform rolling upgrades without impacting app uptime

**TODO** Setup ECS and ALB, with a couple of tasks

### AWS Fargate (6:10)

> He said something about we had to provide instances for ECS tasks?? I think that was suppose to introduce the use-case for AWS Fargate.

- Launch Docker containers on AWS
- **You do not provision the infrastructure (no EC2 instances to manage)**
- It’s all serverless!
- You create task definitions
- AWS runs containers for you based on the CPU / RAM you need
- To scale, just increase the number of tasks. Simple! No more EC2 instances

**TODO** Setup fargate with the same couple of tasks from ECS

### Amazon ECS – Security & Networking (6:50)

- You can inject secrets and configurations as Environment Variables into running Docker containers
- Integration with SSM Parameter Store and Secrets Manager

- ECS Tasks Networking
- **none** – no network connectivity, no port mappings
- **bridge** – uses Docker’s virtual container-based network
- **host** – bypass Docker’s network, uses the underlying host network interface
- **awsvpc**
  - Every tasks launched on the instance gets its own ENI and a private IP address
  - Simplified networking, enhanced security, Security Groups, monitoring, VPC Flow Logs
  - Default mode for Fargate tasks

**QUESTION**
What are the different networking types for ECS Tasks (4)?

**ANSWER**

- **none** – no network connectivity, no port mappings
- **bridge** – uses Docker’s virtual container-based network
- **host** – bypass Docker’s network, uses the underlying host network interface
- **awsvpc**
  - Every tasks launched on the instance gets its own ENI and a private IP address
  - Simplified networking, enhanced security, Security Groups, monitoring, VPC Flow Logs
  - Default mode for Fargate tasks

**QUESTION_END**

- Automatically increase/decrease the desired number of tasks
- Amazon ECS leverages AWS Application Auto Scaling
- CPU and RAM is tracked in CloudWatch at the ECS Service level
- Target Tracking – scale based on target value for a specific CloudWatch metric
- Step Scaling – scale based on a specified CloudWatch Alarm
- Scheduled Scaling – scale based on a specified date/time (predictable changes)
- ECS Service Auto Scaling (task level) ≠ EC2 Auto Scaling (EC2 instance level)
- Fargate Auto Scaling is much easier to setup (because Serverless)

### Amazon ECS – Service Auto Scaling (7:56)

- Automatically increase/decrease the desired number of tasks
- Amazon ECS leverages AWS Application Auto Scaling
- CPU and RAM is tracked in CloudWatch at the ECS Service level
- Target Tracking – scale based on target value for a specific CloudWatch metric
- Step Scaling – scale based on a specified CloudWatch Alarm
- Scheduled Scaling – scale based on a specified date/time (predictable changes)

**TODO** What is the point here. I am not sure I understand. We must increase capacity, manually? Why does "serverless" make it easier?

- ECS Service Auto Scaling (task level) ≠ EC2 Auto Scaling (EC2 instance level)
- Fargate Auto Scaling is much easier to setup (because Serverless)

### Amazon ECS – Spot Instances (8:56)

- ECS Classic (EC2 Launch Type)
  - Can have the underlying EC2 instances as Spot Instances (managed by an ASG)
  - Instances may go into draining mode to remove running tasks
  - Good for cost savings, but will impact reliability

- AWS Fargate
  - Specify minimum of tasks for on-demand baseline workload
  - Add tasks running on FARGATE_SPOT for cost-savings (can be reclaimed by AWS)
  - Regardless of On-demand or Spot, Fargate scales well based on load

**QUESTION**
How to use Spot Instances with ECS or Fargate? What are the pros and cons?
**ANSWER**

**TODO** Answer that question
**QUESTION_END**

**QUESTION**
What are the different Container Services offered by AWS? What are the pros/cons?
**ANSWER**
**TODO** Answer that question.
I think there are three services but it's unclear why/when a person would use one or the other.

**QUESTION_END**

### Amazon ECR - Elastic Container Registry (9:00)

> I think this is in the wrong section, I think it should go in the 100050 file

- Store and manage Docker images on AWS
- Private and Public repository (Amazon ECR Public Gallery https://gallery.ecr.aws)
- Fully integrated with ECS
- Access is controlled through IAM (permission errors => check policy)
- Supports image vulnerability scanning, versioning, image tags, image lifecycle,

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 5: Compute & Load Balancing - Amazon ECR - Elastic Container Registry

**Topic:** 50. Amazon ECR - Elastic Container Registry  
**Duration:** 3min  
**Section:** 5

## Notes

### Amazon ECR - Elastic Container Registry

- Store and manage Docker images on AWS
- Private and Public repository (Amazon ECR Public Gallery https://gallery.ecr.aws)
- Fully integrated with ECS
- Access is controlled through IAM (permission errors => check policy)
- Supports image vulnerability scanning, versioning, image tags, image lifecycle,

### Amazon ECR – Cross Region Replication

- ECR private registry supports both cross-Region and cross-account
  replication

![X-region Replication](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6vvE7FTvJ7eNbybSWS3mW48T0XX-tR1y5ZQ&s "X-region Replication")

> In short, with replication set-up. When you push an image it gets copied to the other regions. (eg, its not the same in each region, its a copy)

### Amazon ECR – Image Scanning (1:38)

- Manual Scan or Scan on Push
- Basic Scanning – Common CVE
- Enhanced Scanning – Leverages Amazon Inspector (OS & Programming
  Language vulnerabilities)
- Scan results can be retrieved from within the AWS console

**QUESTION**
Regarding ECR Image Scanning. What are the two option, what are the pros/cons
**ANSWER**

- Manual Scan or Scan on Push
- Basic Scanning – Common CVE
- Enhanced Scanning – Leverages Amazon Inspector (OS & Programming
  Language vulnerabilities)
- Scan results can be retrieved from within the AWS console

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 5: Compute & Load Balancing - Amazon EKS - Elastic Kubernetes Service

**Topic:** 51. Amazon EKS - Elastic Kubernetes Service  
**Duration:** 4min  
**Section:** 5

## Notes

### Amazon EKS Overview (Managed K8S)

- Amazon EKS = Amazon Elastic Kubernetes Service
- It is a way to launch **managed Kubernetes clusters on AWS**
- Kubernetes is an open-source system for automatic deployment, scaling and
  management of containerized (usually Docker) application
- It’s an alternative to ECS, similar goal but different API
- EKS supports EC2 if you want to deploy worker nodes or Fargate to deploy
  serverless containers
- **Use case**: if your company is **already using Kubernetes on-premises or in another cloud**, and wants to migrate to AWS using Kubernetes
- Kubernetes is cloud-agnostic (can be used in any cloud – Azure, GCP…)
- For multiple regions, deploy one EKS cluster per region
- Collect logs and metrics using CloudWatch Container Insights

### Amazon EKS - Diagram (1:52)

[Diagram not available]

**AS I UNDERSTAND IT**

- Pod - collection of nodes
- node - EC2 instance (maybe others)
- Autoscaling spans AZs, group adds/removes ec2 nodes

**TODO** better understand the underlying architecture

### Amazon EKS – Node Types (2:22)

- Managed Node Groups
  - Creates and manages Nodes (EC2 instances) for you
  - Nodes are part of an ASG managed by EKS
  - Supports On-Demand or Spot Instances
- Self-Managed Nodes
  - Nodes created by you and registered to the EKS cluster and managed by an ASG
  - You can use prebuilt AMI - Amazon EKS Optimized AMI
  - Supports On-Demand or Spot Instances
- AWS Fargate
  - No maintenance required; no nodes managed

**QUESTION**
For EKS What are the the three Node Types, what is the differences?
**ANSWER**

- Managed Node Groups
  - Creates and manages Nodes (EC2 instances) for you
  - Nodes are part of an ASG managed by EKS
  - Supports On-Demand or Spot Instances
- Self-Managed Nodes
  - Nodes created by you and registered to the EKS cluster and managed by an ASG
  - You can use prebuilt AMI - Amazon EKS Optimized AMI
  - Supports On-Demand or Spot Instances
- AWS Fargate
  - No maintenance required; no nodes managed

**QUESTION_END**

**TODO** Set-up EKS at least one time.

### Amazon EKS – Data Volumes

- Need to specify **StorageClass** manifest on your EKS cluster
- Leverages a **Container Storage Interface (CSI)** compliant driver

- Support for…
- Amazon EBS
- Amazon EFS (works with Fargate)
- Amazon FSx for Lustre
- Amazon FSx for NetApp ONTAP

**QUESTION**
How to attache Data Volumes to EKS, what volume types are support (only one works for Fargate)

**ANSWER**

- Need to specify **StorageClass** manifest on your EKS cluster
- Leverages a **Container Storage Interface (CSI)** compliant driver

- Support for…
- Amazon EBS
- Amazon EFS (works with Fargate)
- Amazon FSx for Lustre
- Amazon FSx for NetApp ONTAP

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 5: Compute & Load Balancing - AWS App Runner

**Topic:** 52. AWS App Runner  
**Duration:** 3min  
**Section:** 5

## Notes

- Fully managed service that makes it easy to deploy web
  applications and APIs at scale
- No infrastructure experience required
- Start with your source code or container image
- Automatically builds and deploy the web app
- Automatic scaling, highly available, load balancer, encryption
- VPC access support
- Connect to database, cache, and message queue services

- Use cases: web apps, APIs, microservices, rapid production
  deployments

**QUESTION**
What is app runner? What are the use cases and advantages?
**ANSWER**

- Fully managed service that makes it easy to deploy web
  applications and APIs at scale
- No infrastructure experience required
- Start with your source code or container image
- Automatically builds and deploy the web app
- Automatic scaling, highly available, load balancer, encryption
- VPC access support
- Connect to database, cache, and message queue services

- Use cases: web apps, APIs, microservices, rapid production
  deployments

**QUESTION_END**

### Solution Architecture App Runner Multi-Region Architecture (1:50)

[]
https://aws.amazon.com/blogs/containers/architecting-for-resiliency-on-aws-app-runner/

![App Runner Multi-Region Architecture](https://aws.amazon.com/blogs/containers/architecting-for-resiliency-on-aws-app-runner/ "App Runner Multi-Region Architecture")

**RESEARCH** Simply look at how r53 is used to create the multi-region App Runner. Specifically, there is a DNS record of type "latency" that routes traffic, what is that all about

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - ECS Anywhere & EKS Anywhere

**Topic:** 53. ECS Anywhere & EKS Anywhere  
**Duration:** 4min  
**Section:** 5

## Notes

### Amazon ECS Anywhere

> He says Container Service between AWS on On-Prem

- Easily run containers on Customer-managed infrastructure (on-premises, VMs, …)
- Allows customers to deploy native Amazon ECS tasks in any environment
- Fully-managed Amazon ECS Control Plane
- ECS Container Agent and SSM Agent needs to be installed
- “EXTERNAL” Launch Type
- Must have a stable connection to the AWS Region
- Use cases:
  - Meet compliance, regulatory, and latency requirements
  - Run apps outside AWS Regions and closer to their other services
  - On-premises ML, video processing, data processing, …

**QUESTION**
Using AWS ECS how to launch a task on premise?
**ANSWER**

- Easily run containers on Customer-managed infrastructure (on-premises, VMs, …)
- Allows customers to deploy native Amazon ECS tasks in any environment
- Fully-managed Amazon ECS Control Plane
- ECS Container Agent and SSM Agent needs to be installed
- **“EXTERNAL”** Launch Type
- **Must have a stable connection to the AWS Region**
- Use cases:
  - Meet compliance, regulatory, and latency requirements
  - Run apps outside AWS Regions and closer to their other services
  - On-premises ML, video processing, data processing, …

**QUESTION_END**

### Amazon EKS Anywhere (1:49)

- Create and operate Kubernetes clusters created\ outside AWS
- Leverage the Amazon EKS Distro (AWS’ bundled release of Kubernetes)
- Reduce support costs and avoid maintaing redundant 3rd party tools
- Install using the EKS Anywhere Installer
- Optionally use the **EKS Connector** to connect the EKS Anywhere clusters to AWS
- **Fully Connected & Partially Disconnected**: you can connect to Amazon EKS Anywhere clusters to AWS, and leverage the EKS console
- **Fully Disconnected**: must install the EKS Distro and leverage open-source tools to manage your clusters

**QUESTION**
What is the difference between "EKS Anywhere" and "ECS Anywhere".

What are the connection requirements?
**ANSWER**

**RESEARCH** What is the difference between "EKS Anywhere" and "ECS Anywhere"

I think key is running task on premise within AWS vs running task in AWS in OnPrem

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - AWS Lambda - Part 1

**Topic:** 54. AWS Lambda - Part 1  
**Duration:** 7min  
**Section:** 5

## Notes

### AWS Lambda Integrations Main ones

- API Gateway
- Kinesis
- DynamoDB
- Amazon EventBridge
- CloudWatch Logs
- AWS SNS
- AWS S3
- AWS Cognito
- AWS IoT
- Internet of Things

### Example: Serverless Thumbnail creation (0:51)

Demonstrates the Image with a thumbnail and storing meta data in Dynamo.

### Example: Serverless CRON Job (1:13)

Use EventBridge to act as a cron job to fire a lambda every hour

### AWS Lambda Language Support (runtimes)

- Node.js (JavaScript)
- Python
- Java
- C# (.NET Core) / Powershell
- Ruby
- Custom Runtime API (community supported, example Rust or Golang)

- Lambda Container Image
  - The container image must implement the Lambda Runtime API
  - ECS / Fargate is preferred for running arbitrary Docker images

**EXAM** If exam offers options Lambda with container Lambda Runtime or ECS/Fargate, Choose Fargate - AWS preferred.

### Lambda – Limits to know (2:19)

- RAM – 128 MB to 10,240 MB (10 GB)
- CPU – is linked to RAM (cannot be set manually)
  - 2 vCPUs are allocated at 1,769 MB of RAM
  - 6 vCPUs are allocated at 10,240 MB of RAM
- Timeout – up to 15 minutes
- /tmp Storage – 10,240 MB
- Deployment Package – 50 MB (zipped) , 250 MB (unzipped) including layers
- Concurrent Executions – 1000 (soft limit that can be increased)
- Container Image Size – 10 GB
- Invocation Payload (request/response) – 6 MB (sync), 256 KB (async)

**QUESTION**
What are the Lambda limitations (10)?
**ANSWER**

- RAM – 128 MB to 10,240 MB (10 GB)
- CPU – is linked to RAM (cannot be set manually)
  - 2 vCPUs are allocated at 1,769 MB of RAM
  - 6 vCPUs are allocated at 10,240 MB of RAM
- Timeout – up to 15 minutes
- /tmp Storage – 10,240 MB
- Deployment Package – 50 MB (zipped) , 250 MB (unzipped) including layers
- Concurrent Executions – 1000 (soft limit that can be increased)
- Container Image Size – 10 GB
- Invocation Payload (request/response) – 6 MB (sync), 256 KB (async)

**QUESTION_END**

**RESEARCH** CPU is linked to RAM. RAM limit 10GB. How do we adjust RAM we need?

### Lambda Concurrency and Throttling (3:10)

- Concurrency limit: up to 1000 concurrent executions

- Can set a “reserved concurrency” at the function level (=limit)
- Each invocation over the concurrency limit will trigger a “Throttle”
- Can request a quota increase in AWS Service Quotas

**QUESTION**
What are concurrency limit? How to set a limit, what happens when limit is exceeded?
**ANSWER**

- Concurrency limit: up to 1000 concurrent executions

- Can set a “reserved concurrency” at the function level (=limit)
- Each invocation over the concurrency limit will trigger a “Throttle”
- Can request a quota increase in AWS Service Quotas

**RESEARCH** What is the effect of "Reserved Concurrency", kinda a throttle?

**QUESTION_END**

### Lambda Concurrency Issue (3:54)

- If you don’t reserve (=limit) concurrency, the following can happen:

He explains that given so many application vectors (API Gateway, Application Load Balancer, SDK). If all of them are calling Lambda there is a risk of exceeding limits. However, each app will use a small portion of the total quota.

**RESEARCH** Lambda concurrency Limit, is it for account? How would you allocation so much quota to certain Lambda but not others.

### Lambda & CodeDeploy (4:41)

- CodeDeploy can help you automate traffic shift for Lambda aliases
- Feature is integrated within the SAM framework

- Linear: grow traffic every N minutes until 100%
  - Linear10PercentEvery3Minutes
  - Linear10PercentEvery10Minutes

- Canary: try X percent then 100%
  - Canary10Percent5Minutes
  - Canary10Percent30Minutes
- AllAtOnce: immediate
- Can create Pre & Post Traffic hooks to check the health of the Lambda function

**QUESTION**
What is the advantage of using CodeDeploy to deploy Lambda
**ANSWER**

- CodeDeploy can help you automate traffic shift for Lambda aliases
- Feature is integrated within the SAM framework

- Linear: grow traffic every N minutes until 100%
  - Linear10PercentEvery3Minutes
  - Linear10PercentEvery10Minutes

- Canary: try X percent then 100%
  - Canary10Percent5Minutes
  - Canary10Percent30Minutes
- AllAtOnce: immediate
- Can create Pre & Post Traffic hooks to check the health of the Lambda function

**QUESTION_END**

### AWS Lambda Logging, Monitoring and Tracing (6:08)

- CloudWatch:
  - AWS Lambda execution logs are stored in AWS CloudWatch Logs
  - AWS Lambda metrics are displayed in AWS CloudWatch Metrics (successful invocations, error rates, latency, timeouts, etc…)
  - Make sure your AWS Lambda function has an execution role with an IAM policy that authorizes writes to CloudWatch Logs
- X-Ray:
  - It’s possible to trace Lambda with X-Ray
  - Enable in Lambda configuration (runs the X-Ray daemon for you)
  - Use AWS SDK in Code
  - Ensure Lambda Function has correct IAM Execution Role

**QUESTION**
What tools are used to for monitoring/observability?
**ANSWER**

Cloudwatch Monitor

XRay for Observability

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - AWS Lambda - Part 2

**Topic:** 55. AWS Lambda - Part 2  
**Duration:** 7min  
**Section:** 5

## Notes

### Lambda in a VPC

[Diagram not available]

Lambda utilizing default deployed are deployed in AWS's public space. If you have resources in vpc/private-subnet you will not be able to reach them from the default deployed Lambda.

Deploying Lambda in a private network Lambda will get a security group and will have access to internal/private resources, but wont have access to the internet.

You would leverage NAT/IGW in the private network to get access to internet

**RESEARCH** He goes on to say that lambda deployed in with the default settings will not have access to the internet, the only way to do that is with NAT/IGW.

**TODO** Set-up lambda - use it to access internal resources and internet. Look at deployment strategies and various pros/cons.

### Lambda – Fixed Public IP for external comms (1:47)

[Diagram not available]

By default Lambda get random external IP. Those who monitory the API it may call, will see a random IP. If you want tight security (lock down API to accept from known IP), you have put the Lambda in a VPC

**TODO** Make a lambda with fixed IP

**RESEARCH** He goes on to say how to configure a Lambda/Network to use NAT/IGW to get static IP. Is it possible to create one (few) IP NAT/IGW configurations so all calls from VPC use the same IPs, HOW?

### Lambda – Synchronous Invocations (3:15)

- Synchronous: CLI, SDK, API Gateway
  - Results is returned right away
  - Error handling must happen client side (retries, exponential backoff, etc…)

> Point is that we fire and wait for response

### Lambda – Asynchronous Invocation (3:53)

- S3, SNS, Amazon EventBridge…
- Lambda attempts to retry on errors **(3 tries total)**
- Make sure the processing is **idempotent** (in case of retries)
- Can define a DLQ (dead-letter queue) – SNS or SQS – for failed processing

**QUESTION**
When and Why is Idempotent matter for Lambda.
**ANSWER**
Async Lambda calls will need to be idempotent. Lambda will retry 3 times on failure.

**RESEARCH** Does that mean they SHOULD NOT have any side effects? I think that is impossible?

**QUESTION_END**

### Lambda – Architecture Discussion (4:40)

- Starts immediately Parallel executions
- Batched Execution Delay

**QUESTION**
If SQS is in the mixed, is the Lambda Batch or Parallel?
**ANSWER**
Because SQS has some delay (Batch)? We can say it's Batched
**QUESTION_END**

**RESEARCH** Utilizing Batch/Parallel Lambdas what are the pros and cons. It think he suggested that batch will be more robust.

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - Elastic Load Balancers - Part 1

**Topic:** 56. Elastic Load Balancers - Part 1  
**Duration:** 9min  
**Section:** 5

## Notes

### Types of load balancer on AWS

- AWS has 4 kinds of managed Load Balancers
- Classic Load Balancer (v1 - old generation) – 2009 – CLB
  - HTTP, HTTPS, TCP, SSL (secure TCP)
- Application Load Balancer (v2 - new generation) – 2016 – ALB
  - HTTP, HTTPS, WebSocket
- Network Load Balancer (v2 - new generation) – 2017 – NLB
  - TCP, TLS (secure TCP), UDP
- Gateway Load Balancer – 2020 – GWLB
  - Operates at layer 3 (Network layer) – IP Protocol

- Overall, it is recommended to use the newer generation load balancers as they provide more features

- Some load balancers can be setup as internal (private) or external (public) ELBs

**QUESTION**
What are the 4 Load Balancer Types?
Dis/Advantages?
**ANSWER**

- AWS has 4 kinds of managed Load Balancers
- Classic Load Balancer (v1 - old generation) – 2009 – CLB
  - HTTP, HTTPS, TCP, SSL (secure TCP)
- Application Load Balancer (v2 - new generation) – 2016 – ALB
  - HTTP, HTTPS, WebSocket
- Network Load Balancer (v2 - new generation) – 2017 – NLB
  - TCP, TLS (secure TCP), UDP
- Gateway Load Balancer – 2020 – GWLB
  - Operates at layer 3 (Network layer) – IP Protocol

- Overall, it is recommended to use the newer generation load balancers as they provide more features

**QUESTION_END**

**RESEARCH** What is Gateway Load Balancer (GWLB). Why is it better than NLB?

### Classic Load Balancers (v1)

- Health Checks can be HTTP (L7) or TCP (L4) based including with SSL
- Supports only one SSL certificate
  - The SSL certificate can have many SAN (Subject Alternate Name), but the SSL certificate must be changed anytime a SAN is added / edited / removed
  - Better to use ALB with SNI (Server Name
    Indication) if possible
  - Can use multiple CLB if you want distinct SSL certificates
- TCP => TCP passes all the traffic to the EC2 instance
  - Only way to use 2-way SSL authentication

**RESEARCH** He mentions that CLB supports only one certificate. That the only way to do two-way verification is traffic passes through CLB directly to the instance. This seems strange, what will be the point of the CLB in that case? Can we configure multiple EC2 instances to use same certificate?

**QUESTION**
Why use ALB over CLB and visa/versa
**ANSWER**

**RESEARCH** Why you might choose CLB over ALB?

You will want ALB in most cases because it uses SNI, to direct traffic to the right certificate.

**QUESTION_END**

### Application Load Balancer (v2) (2:08)

- Application load balancers is Layer 7 (HTTP)
- Load balancing to multiple HTTP applications across machines (target groups)
- Load balancing to multiple applications on the same machine (ex: containers) – great fit with ECS, has dynamic port mapping
- Support for HTTP/2 and WebSocket
- Support redirects (from HTTP to HTTPS for example)
- Routing Rules for path, headers, query string

**TODO** VERY IMPORTANT Set-up ALB with websocket. Also see multiple certificate in play

### Application Load Balancer (v2) Target Groups (3:09)

- EC2 instances (can be managed by an Auto Scaling Group) – HTTP
- ECS tasks (managed by ECS itself) – HTTP
- Lambda functions – HTTP request is translated into a JSON event
- IP Addresses – must be private IPs
- ALB can route to multiple target groups
- Health checks are at the target group level

**QUESTION**
What are the target Groups of ALB (5)?
**ANSWER**

- EC2 instances (can be managed by an Auto Scaling Group) – HTTP
- ECS tasks (managed by ECS itself) – HTTP
- Lambda functions – HTTP request is translated into a JSON event
- IP Addresses – must be private IPs
- ALB can route to multiple target groups

**QUESTION_END**

### Network Load Balancer (v2) (3:50)

- Network load balancers (Layer 4) allow to:
  - Forward TCP & UDP traffic to your instances
  - Handle millions of request per seconds
  - Less latency ~100 ms (vs 400 ms for ALB)
- NLB has one static IP per AZ, and supports assigning Elastic IP
  (helpful for whitelisting specific IP)

- **NLB are used for extreme performance, TCP or UDP traffic**
- Not included in the AWS free tier

**QUESTION**
Why would you choose NLB over ALB
**ANSWER**
**NLB are used for extreme performance, TCP or UDP traffic**

- Forward TCP/UDP to instances

- Less latency ~100 ms (vs 400 ms for ALB)

**QUESTION_END**

### Network Load Balancer – Target Groups (4:30)

- EC2 instances
- IP Addresses – must be private IPs
- Application Load Balancer

**QUESTION**
What are the target groups of NLB?
**ANSWER**

- EC2 instances
- IP Addresses – must be private IPs (usually something like 10.x.x.x)
- Application Load Balancer

**QUESTION_END**

**RESEARCH** What does it mean when an IP is the target (within target group)? Is that some sort of "anything goes"

**RESEARCH** Why would you use ALB as a target for NLB?

### Network Load Balancer – Zonal DNS Name (6:00)

- Resolving Regional NLB DNS name returns the IP addresses for all NLB nodes in all enabled AZs
  - my-nlb-1234567890abcdef.elb.us-east-1.amazon.aws.com

- Zonal DNS Name
  - NLB has DNS names for each of its nodes
  - Use to determine the IP address of each node
  - us-east-1a.my-nlb-1234567890abcdef.elb.us-east-1.amazon.aws.com
  - Used to minimize latency and data transfer costs
  - You need to implement app specific logic

**QUESTION**
Discuss name resolution when using NLB? Because it maps to several instances different IP, it will resolve to to all IPs, but what if you want just a regional IP (AZ).
**ANSWER**

**RESEARCH** How/Why this is important

This is related to routing traffic back to local AZ, costs/latency.

**QUESTION_END**

### Gateway Load Balancer (7:14)

- Deploy, scale, and manage a fleet of 3rd party network virtual appliances in AWS
- Example: Firewalls, Intrusion Detection and Prevention Systems, Deep Packet Inspection Systems, payload manipulation, …
- Operates at Layer 3 (Network Layer) – IP Packets
- Combines the following functions:
  - Transparent Network Gateway – single entry/exit for all traffic
  - Load Balancer – distributes traffic to your virtual appliances

- Uses the GENEVE protocol on port 6081

**QUESTION**
What is the purpose of Gateway Load Balancer (GLB)?
**ANSWER**
It operations on Level 3, can inspect packets. Used for sending traffic to 3rd party security services.

You would configure GLB to sit in front of your app and send packets to the GLB for security inspection.

If all is good, it forwards the packets back to the application.
**QUESTION_END**

### Gateway Load Balancer – Target Groups (8:44)

- EC2 instances
- IP Addresses – must be private IPs (10.x.x.x)

**QUESTION**
What targets does GLB support?
**ANSWER**

- EC2 instances
- IP Addresses – must be private IPs (10.x.x.x)

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - Elastic Load Balancers - Part 2

**Topic:** 57. Elastic Load Balancers - Part 2  
**Duration:** 7min  
**Section:** 5

## Notes

### Cross-Zone Load Balancing

[diagram not available]

You have two behaviors **With Cross Zone Load Balancing** and **Without Cross Zone Load Balancing**.

The diagram shows two AZs each with a load balancer. Client sends requests to each 50/50. With cross zone LB, each LB distributes request to all clients within all AZ. 10 clients each gets 10%.

Without Cross Zone LB, the client still sends 50% to each AZ, each load balancer distributes traffic to each node **WITHIN ITS OWN AZ**.

Hence, with zone LB you get better distribution, better utilization.

### Cross-Zone Load Balancing (3:00)

- Classic Load Balancer
  - Disabled by default
  - No charges for inter AZ data if enabled
- Application Load Balancer
  - Always on (can’t be disabled)
  - No charges for inter AZ data
- Network Load Balancer
  - Disabled by default
  - You pay charges ($) for inter AZ data if enabled
- Gateway Load Balancer
  - Disabled by default
  - You pay charges ($) for inter AZ data if enabled

**QUESTION**
Which of the four Load Balancers is Cross-Zone distribution enabled?
Which ones charge?

**ANSWER**

- Classic Load Balancer
  - Disabled by default
  - No charges for inter AZ data if enabled
- Application Load Balancer
  - Always on (can’t be disabled)
  - No charges for inter AZ data
- Network Load Balancer
  - Disabled by default
  - You pay charges ($) for inter AZ data if enabled
- Gateway Load Balancer
  - Disabled by default
  - You pay charges ($) for inter AZ data if enabled

**QUESTION_END**

### Sticky Sessions (Session Affinity)

- It is possible to implement stickiness so that the same client is always redirected to the same instance behind a load balancer
- This works for Classic Load Balancers & Application Load Balancers
- The “cookie” used for stickiness has an expiration date you control
- Use case: make sure the user doesn’t lose his session data
- Enabling stickiness may bring imbalance to the load over the backend EC2 instances

**QUESTION**
Which LB support 'sticky'? Why would you not want to use it?
**ANSWER**

- It is possible to implement stickiness so that the same client is always redirected to the same instance behind a load balancer
- This works for Classic Load Balancers & Application Load Balancers
- The “cookie” used for stickiness has an expiration date you control
- Use case: make sure the user doesn’t lose his session data
- Enabling stickiness may bring imbalance to the load over the backend EC2 instances

**QUESTION_END**

### Request Routing Algorithms – Least Outstanding Requests (4:53)

- The next instance to receive the request is the instance that has the lowest number of pending/unfinished requests
- Works with Application Load Balancer and Classic Load Balancer (HTTP/HTTPS)

### Request Routing Algorithms – Round Robin (5:54)

- Equally choose the targets from the target group
- Works with Application Load Balancer and Classic Load Balancer (TCP)

### Request Routing Algorithms – Flow Hash

- Selects a target based on the protocol, source/destination IP address,
  source/destination port, and TCP sequence number
- Each TCP/UDP connection is routed to a single target for the life of the connection
- Works with **Network Load Balancer**
  > Acts 'Sticky' so long as the TCP connection is open.

**RESEARCH** Acts 'Sticky' so long as the TCP connection is open. NLB

**QUESTION**
What are the three request routing routines, which apply to which LB
**ANSWER**

`Least Outstanding` - ALB, CLB. Instances with the least outstanding requests (better "work" distribution)

`Round Robin` - ALB, CLB

`Flow Hash` - Belongs with NLB, has kinda sticky effect

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - API Gateway

**Topic:** 58. API Gateway  
**Duration:** 13min  
**Section:** 5

## Notes

### API Gateway – Overview

- Helps expose Lambda, HTTP & AWS Services as an API
- API versioning, authorization, traffic management (API keys, throttles), huge scale, serverless, req/resp transformations, OpenAPI spec, CORS
- Limits to know:
  - 29 seconds timeout
  - 10 MB max payload size

**QUESTION**
API Gateway limits to know (2)?

What are some of the advantages (8)?
**ANSWER**

- Limits to know: **EXAM**
  - 29 seconds timeout
  - 10 MB max payload size

- Advantages:
  - API versioning,
  - authorization,
  - traffic management (API keys, throttles),
  - huge scale,
  - serverless,
  - req/resp transformations,
  - OpenAPI spec,
  - CORS

**QUESTION_END**

### API Gateway – Deployment Stages (2:43)

- API changes are deployed to “Stages” (as many as you want)
- Use the naming you like for stages (dev, test, prod)
- Stages can be rolled back as a history of deployments is kept

**QUESTION**
Three points about API Gateway Deployments
**ANSWER**

- API changes are deployed to “Stages” (as many as you want)
- Use the naming you like for stages (dev, test, prod)
- Stages can be rolled back as a history of deployments is kept

**QUESTION_END**

**RESEARCH** What are the 'stages' named environment? But in the slide it shows diverting 5% of traffic from Prod to Test, but he doesn't cover the distribution mechanism. Figure out how to divert traffic from one stage to another with API-G

### API Gateway – Integrations (3:20)

- HTTP
  - Expose HTTP endpoints in the backend
  - Example: internal HTTP API on premise, Application Load Balancer…
  - Why? Add rate limiting, caching, user authentications, API keys, etc…
- Lambda Function
  - Invoke Lambda function
  - Easy way to expose REST API backed by AWS Lambda
- AWS Service
  - Expose any AWS API through the API Gateway?
  - Example: start an AWS Step Function workflow, post a message to SQS
  - Why? Add authentication, deploy publicly, rate control…

**QUESTION**
What are the three API-G Integrations?
**ANSWER**

- HTTP
  - Expose HTTP endpoints in the backend
  - Example: internal HTTP API on premise, Application Load Balancer…
  - Why? Add rate limiting, caching, user authentications, API keys, etc…
- Lambda Function
  - Invoke Lambda function
  - Easy way to expose REST API backed by AWS Lambda
- AWS Service
  - Expose any AWS API through the API Gateway?
  - Example: start an AWS Step Function workflow, post a message to SQS
  - Why? Add authentication, deploy publicly, rate control…

**QUESTION_END**

### Solution Architecture Discussion: API Gateway in front of S3 (4:35)

> How to deal with requests that are bigger than 10MB

[diagram not available, but the trick is same as FS does, use pre-sign UPload URL]
**QUESTION**
If implementing a solution with API-G and S3. What is one of the S3 concerns? How to get around it.
**ANSWER**

10MB API-G Limit is a concern. You can set-up a "pre-request" to get a pre-signed upload URL, and directly upload to S3.

Lambda generates the Pre-sign URL

**QUESTION_END**

**RESEARCH** With this configuration, does the client "follow" the redirect URL? Does it make two requests, pre-request and actual upload request?

### API Gateway - Endpoint Types (6:29)

- Edge-Optimized (default): For global clients
  - Requests are routed through the CloudFront Edge locations (improves latency)
  - The API Gateway still lives in only one region
- Regional:
  - For clients within the same region
  - Could manually combine with CloudFront (more control over the caching strategies and the distribution)
- Private:
  - Can only be accessed from your VPC using an interface VPC endpoint (ENI)
  - Use a resource policy to define access

**QUESTION**
What are the 3 types of API-G Endpoints? When to use which?

**ANSWER**

- Edge-Optimized (default): For global clients
  - Requests are routed through the CloudFront Edge locations (improves latency)
  - The API Gateway still lives in only one region
- Regional:
  - For clients within the same region
  - Could manually combine with CloudFront (more control over the caching strategies and the distribution)
- Private:
  - Can only be accessed from your VPC using an interface VPC endpoint (ENI)
  - Use a resource policy to define access

**QUESTION_END**

**RESEARCH** It looks like there is only one endpoint type that is most common (Edge Optimized). I don't understand the use-case for regional vs private? Also, what if we don't want Edge Optimized, is it a choice or these are the 3 options?

### Caching API responses (7:30)

- Caching reduces the number of calls made to the backend
- Default TTL (time to live) is 300 seconds (min: 0s, max: 3600s)
- Caches are defined per stage
- Possible to override cache settings per method
- Clients can invalidate the cache with header: Cache-Control: max-age=0 (with proper IAM authorization)
- Able to flush the entire cache (invalidate it) immediately
- Cache encryption option
- Cache capacity between 0.5GB to 237GB

**QUESTION**
Eight points about API-G Caching?
**ANSWER**

- Caching reduces the number of calls made to the backend
- Default TTL (time to live) is 300 seconds (min: 0s, max: 3600s)
- Caches are defined per stage
- Possible to override cache settings per method
- Clients can invalidate the cache with header: Cache-Control: max-age=0 (with proper IAM authorization)
- Able to flush the entire cache (invalidate it) immediately
- Cache encryption option
- Cache capacity between 0.5GB to 237GB

**QUESTION_END**

### API Gateway - Errors (8:53)

- 4xx means Client errors
  - 400: Bad Request
  - 403: Access Denied, WAF filtered
  - 429: Quota exceeded, Throttle
- 5xx means Server errors
  - 502: Bad Gateway Exception, usually for an incompatible output returned from a Lambda proxy integration backend and occasionally for out-of-order invocations due to heavy loads.
  - 503: Service Unavailable Exception
  - 504: Integration Failure – ex Endpoint Request Timed-out Exception API Gateway requests time out after 29 second maximum

**QUESTION**
What are the 3 5xx errors and their meaning mentioned in the lecture?
**ANSWER**

- 5xx means Server errors
  - 502: Bad Gateway Exception, usually for an incompatible output returned from a Lambda proxy integration backend and occasionally for out-of-order invocations due to heavy loads.
  - 503: Service Unavailable Exception
  - 504: Integration Failure – ex Endpoint Request Timed-out Exception API Gateway requests time out after 29 second maximum

**QUESTION_END**

### API Gateway – Security (9:54)

- Load SSL certificates and use Route53 to define a CNAME
- Resource Policy (~S3 Bucket Policy):
  - control who can access the API
  - Users from AWS accounts, IP or CIDR blocks, VPC or VPC Endpoints
- IAM Execution Roles for API Gateway at the API level
  - To invoke a Lambda Function, an AWS service…
- CORS (Cross-origin resource sharing):
  - Browser based security
  - Control which domains can call your API

**QUESTION**
Four points of security for API-G?
**ANSWER**

- Load SSL certificates and use Route53 to define a CNAME
- Resource Policy (~S3 Bucket Policy):
  - control who can access the API
  - Users from AWS accounts, IP or CIDR blocks, VPC or VPC Endpoints
- IAM Execution Roles for API Gateway at the API level
  - To invoke a Lambda Function, an AWS service…
- CORS (Cross-origin resource sharing):
  - Browser based security
  - Control which domains can call your API

**QUESTION_END**

### API Gateway – Authentication (10:30)

- IAM based access (AWS_IAM)
  - Good for providing access within your infrastructure
  - Pass IAM credentials in headers through Sig V4
- Lambda Authorizer (formerly Custom Authorizer)
  - Use Lambda to verify a custom OAuth / SAML / 3rd party authentication

- Cognito User Pools
  - Client authenticates with Cognito
  - Client passes the token to API Gateway
  - API Gateway knows out-of-the-box how to verify to token

**TODO\*** Set-up API-G with authentications

**QUESTION**
What are the three main Authorization Techniques used by API-G?
**ANSWER**

- IAM based access (AWS_IAM)
  - Good for providing access within your infrastructure
  - Pass IAM credentials in headers through Sig V4
- Lambda Authorizer (formerly Custom Authorizer)
  - Use Lambda to verify a custom OAuth / SAML / 3rd party authentication

- Cognito User Pools
  - Client authenticates with Cognito
  - Client passes the token to API Gateway
  - API Gateway knows out-of-the-box how to verify to token

**QUESTION_END**

### API Gateway – Logging, Monitoring, Tracing (11:46)

- CloudWatch Logs:
  - Enable CloudWatch logging at the Stage level (with Log Level – ERROR, INFO)
  - Can log full requests / responses data
  - Can send API Gateway Access Logs (customizable)
  - Can send logs directly into Kinesis Data Firehose (as an alternative to CW logs)
- CloudWatch Metrics:
  - Metrics are by stage, possibility to enable detailed metrics
  - IntegrationLatency, Latency, CacheHitCount, CacheMissCount
- X-Ray:
  - Enable tracing to get extra information about requests in API Gateway
  - X-Ray API Gateway + AWS Lambda gives you the full picture

**QUESTION**
What are the 3 logging methods? Something special about some/most of them?
**ANSWER**

- CloudWatch Logs:
  - Enable CloudWatch logging at the Stage level (with Log Level – ERROR, INFO)
  - Can log full requests / responses data
  - Can send API Gateway Access Logs (customizable)
  - Can send logs directly into Kinesis Data Firehose (as an alternative to CW logs)
- CloudWatch Metrics:
  - Metrics are by stage, possibility to enable detailed metrics
  - IntegrationLatency, Latency, CacheHitCount, CacheMissCount
- X-Ray:
  - Enable tracing to get extra information about requests in API Gateway
  - X-Ray API Gateway + AWS Lambda gives you the full picture

> The "per stage" sounds pretty special and worth remembering

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - API Gateway - Part 2

**Topic:** 59. API Gateway - Part 2  
**Duration:** 5min  
**Section:** 5

## Notes

### API Gateway – Usage Plans & API Keys

- If you want to make an API available as an offering ($) to your customers
- Usage Plan:
  - who can access one or more deployed API stages and methods
  - how much and how fast they can access them
  - uses API keys to identify API clients and meter access
  - configure throttling limits and quota limits that are enforced on individual client
- API Keys:
  - alphanumeric string values to distribute to your customers
  - Ex: WBjHxNtoAb4WPKBC7cGm64CBibIb24b4jt8jJHo9
  - Can use with usage plans to control access
  - Throttling limits are applied to the API keys
  - Quotas limits is the overall number of maximum requests
- 429 Too Many Requests:
  - Account level throttling across all APIs in a region
  - Clients must implement retry mechanisms

**TODO** Set-up API-G to use API Keys

### API Gateway – WebSocket API – Overview (1:23)

- What’s WebSocket?
- Two-way interactive communication between a user’s browser and a server
- Server can push information to the client
- This enables stateful application use cases

- WebSocket APIs are often used in real- time applications such as chat applications, collaboration platforms, multiplayer games, and financial trading platforms.

- Works with AWS Services (Lambda, DynamoDB) or HTTP endpoints

### Server to Client Messaging @connections used for replies to clients (2:30)

WebSocket URL wss://abcdef.execute-api.us-west-1.amazonaws.com/dev

[diagram not available]
**RESEARCH** He seem to make a point that response data is special somehow. Something weird about sending messages `@something`. It didn't make sense to me but I probably want to know better what he is talking about.

### API Gateway – Private APIs (3:28)

- Can only be accessed from your VPC by using an VPC Interface Endpoint
- Each VPC Interface Endpoint can be used to access multiple Private APIs

- API Gateway Resource Policy
- Allow or deny access to API from selected VPCs and VPC Endpoints, including across AWS accounts
- aws:SourceVpc and aws:SourceVpce

> He makes the point that you can make the API private. He talks about "Endpoint Policy" and "Interface Endpoint" which wouldn't apply if you rely only on resource policy **RESEARCH** How to make API-G private

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - AWS AppSync

**Topic:** 60. AWS AppSync  
**Duration:** 3min  
**Section:** 5

## Notes

### AWS AppSync - Overview

- AppSync is a managed service that uses GraphQL
- GraphQL makes it easy for applications to get exactly the data they
  need.
- This includes combining data from one or more sources
  - NoSQL data stores, Relational databases, HTTP APIs…
  - Integrates with DynamoDB, Aurora, Elasticsearch & others
  - Custom sources with AWS Lambda
- Retrieve data in real-time with WebSocket or MQTT on WebSocket
- For mobile apps: local data access & data synchronization
- It all starts with uploading one GraphQL schema

**RESEARCH** What is AppSync. The GraphQL part makes sense but I think there is more to it than that... The "combined data sources" part has me a little confused.

### AppSync Diagram

[diagram not available]

**TODO** Setup AppSync

**EXAM** AppSync is going to be used when ever you see GraphQL or real-time data

### AppSync – Cognito Integration (1:39)

- Perform authorization on Cognito users based on the groups they belong to
- In the GraphQL schema, you can specify the security for Cognito groups

> He explains the authentication process. Client goes to Cogito to get jwt token, gives that to appSync, which will look at group permissions and GraphQL resolvers permissions to determine Allow/Deny

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - Route 53 - Part 1

**Topic:** 61. Route 53 - Part 1  
**Duration:** 12min  
**Section:** 5

## Notes

### Route 53 – Record Types

- A – maps a hostname to **IPv4**
- AAAA – maps a hostname to **IPv6**
- CNAME – maps a hostname to another hostname
- The target is a domain name which must have an A or AAAA record
  - Can’t create a CNAME record for the top node of a DNS namespace (Zone
    Apex)
  - Example: you can’t create for example.com, but you can create for
    www.example.com
- NS – Name Servers for the Hosted Zone
  - Control how traffic is routed for a domain

**QUESTION**
What are the 4 DNS records discussed in the lectures?
**ANSWER**

- A – maps a hostname to **IPv4**
- AAAA – maps a hostname to **IPv6**
- CNAME – maps a hostname to another hostname
- The target is a domain name which must have an A or AAAA record
  - Can’t create a CNAME record for the top node of a DNS namespace (Zone
    Apex)
  - Example: you can’t create for example.com, but you can create for
    www.example.com
- NS – Name Servers for the Hosted Zone
  - Control how traffic is routed for a domain

> Remember which ones for IPv6 vs IPv4

**QUESTION_END**

### Route 53 – Diagram for A record

[diagram how IP resolution works for A records]

### Route 53 – CNAME vs. Alias (1:16)

- AWS Resources (Load Balancer, CloudFront...) expose an AWS hostname:
  - lb1-1234.us-east-2.elb.amazonaws.com and you want myapp.mydomain.com
- CNAME:
  - Points a hostname to any other hostname. (app.mydomain.com => blabla anything.com)
  - ONLY FOR NON ROOT DOMAIN (aka. something.mydomain.com)
- Alias:
  - Points a hostname to an AWS Resource (app.mydomain.com => blabla.amazonaws.com)
  - Works for ROOT DOMAIN and NON ROOT DOMAIN (aka mydomain.com)
  - Free of charge
  - Native health check

**RESEARCH** What is the difference between "Alias" and "CNAME" records? He explains you can map alias to root of DNS (example.com) but not CNAME?

### Route 53 – Alias Records Targets (2:28)

- Elastic Load Balancers
- CloudFront Distributions
- API Gateway
- Elastic Beanstalk environments
- S3 Websites
- VPC Interface Endpoints
- Global Accelerator accelerator
- Route 53 record in the same hosted zone

- **You cannot set an ALIAS record for an EC2 DNS name**

**QUESTION**
What is the services/resources you CAN NOT set alias to?
**ANSWER**
EC2 DNS names
**QUESTION_END**

### Route 53 – Records TTL (Time To Live) (2:50)

- High TTL – e.g., 24 hr
  - Less traffic on Route 53
  - Possibly outdated records

- Low TTL – e.g., 60 sec.
  - More traffic on Route 53 ($$)
  - Records are outdated for less time
  - Easy to change records

- Except for Alias records, TTL is mandatory for each DNS record

**QUESTION**
Which DNS records do not have TTL.

What is the benefit/cost of long/short TTL
**ANSWER**
ALIAS records are they only DNS records that do not require TTL

When longer TTL fewer looks ups, less money spent on R53.
Shorter TTL more look ups more R53 money.

Long TTL can be a pain when trying to update names

**QUESTION_END**

### Routing Policies – Simple (4:10)

- Typically, route traffic to a single resource
- Can’t be associated with Health Checks
- Can specify multiple values in the same record
- If multiple values are returned, a random one is chosen by the client

**QUESTION**
Four points about simple DNS routing.
**ANSWER**

- Typically, route traffic to a single resource
- Can’t be associated with Health Checks
- Can specify multiple values in the same record
- If multiple values are returned, a random one is chosen by the client

**QUESTION_END**

### Routing Policies – Weighted (4:53)

- Control the % of the requests that go to each specific resource
- Can be associated with Health Checks
- Use cases: load balancing between regions, testing new application versions…

### Routing Policies – Latency-based (5:22)

- Redirect to the resource that has the least latency close to us
- Super helpful when latency for users is a priority
- Latency is based on traffic between users and AWS Regions
- Germany users may be directed to the US (if that’s the lowest latency)
- Can be associated with Health Checks (has a failover capability)
  **QUESTION**
  With "Lowest Latency" routing. How is latency determined?
  **ANSWER**

Latency is based on traffic between users and AWS Regions

Hence, it makes sense if a user is in Germany, and the APP is in Asia, that the user is routed through US.

**QUESTION_END**

### Routing Policies – Failover (Active-Passive) (6:08)

The trick here is R53 does the health check. R53 is configured with two DNS records. If the instance fails health check, the other DNS records is returned.

### Routing Policies – Geolocation (6:36)

- Different from Latency-based!
- This routing is based on user location
- Specify location by Continent, Country or by US State (if there’s overlapping, most precise location selected)
- Should create a “Default” record (in case there’s no match on location)
- Use cases: website localization, restrict content distribution, load balancing, …
- Can be associated with Health Checks

**QUESTION**
What is the use-case for geolocation over latency based routing?
**ANSWER**
Geolocation can be used to restrict access within geoloaction (compliance). To assure users within a certain area access certain resource

**QUESTION_END**

### Routing Policies – Geoproximity (7:14)

- Route traffic to your resources based on the geographic location of users and resources
- Ability to shift more traffic to resources based on the defined bias
- To change the size of the geographic region, specify bias values:
- To expand (1 to 99) – more traffic to the resource
- To shrink (-1 to -99) – less traffic to the resource
- Resources can be:
- AWS resources (specify AWS region)
- Non-AWS resources (specify Latitude and Longitude)
- You must use Route 53 Traffic Flow to use this feature

**RESEARCH** Understand why this is useful? What is the use-case

**QUESTION**
What are the 6 traffic routing methods? What are the use-cases pros and cons?
**ANSWER**

### Routing Policies – Simple (4:10)

### Routing Policies – Weighted (4:53)

### Routing Policies – Latency-based (5:22)

### Routing Policies – Failover (Active-Passive) (6:08)

### Routing Policies – Geolocation (6:36)

### Routing Policies – Geoproximity (7:14)

### Routing Policies – IP-based Routing (9:51)

**QUESTION_END**

### Route 53 – Traffic flow (8:42)

- Simplify the process of creating and maintaining records in large and complex configurations
- Visual editor to manage complex routing decision trees
- Configurations can be saved as Traffic Flow Policy
- Can be applied to different Route 53 Hosted Zones (different domain names)
- Supports versioning

**TODO** Look at "Traffic Flow" I think it's just a visual tool.

### Routing Policies – Multi-Value

- Use when routing traffic to multiple resources
- Route 53 return multiple values/resources
- Can be associated with Health Checks (return only values for healthy resources)
- Up to 8 healthy records are returned for each Multi-Value query
- Multi-Value is not a substitute for having an ELB

**RESEARCH** He said something about only returning records for healthy resources?

**RESEARCH** What is the big-deal about health checks and Route 53. It seems to be a point about when records can be used for health check and not. Understand the 'why'

### Routing Policies – IP-based Routing (9:51)

- Routing is based on clients’ IP addresses
- You provide a list of CIDRs for your clients and the corresponding endpoints/locations (user-IP-to-endpoint mappings)
- Use cases: Optimize performance, reduce network costs…
- Example: route end users from a particular ISP to a specific endpoint

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - Route 53 - Part 2

**Topic:** 62. Route 53 - Part 2  
**Duration:** 6min  
**Section:** 5

## Notes

### Route 53 – Hosted Zones

- A container for records that define how to route traffic to a domain and
  its subdomains
- Public Hosted Zones – contains records that specify how to route traffic on the Internet (public domain names) application1.mypublicdomain.com
- Private Hosted Zones – contain records that specify how you route traffic within one or more VPCs (private domain names)

**QUESTION**
R53 Zones, how many? What are they?
**ANSWER**

- Public Hosted Zones – contains records that specify how to route traffic on the Internet (public domain names) application1.mypublicdomain.com
- Private Hosted Zones – contain records that specify how you route traffic within one or more VPCs (private domain names)

**QUESTION_END**

### Route 53 – Public vs. Private Hosted Zones

![Public vs. Private Hosted Zones](https://media2.dev.to/dynamic/image/width=800%2Cheight=%2Cfit=scale-down%2Cgravity=auto%2Cformat=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Flhjpawd5t1909labg7me.png "Public vs. Private Hosted Zones")

### Route 53 – Good to Know (0:51)

- For internal private DNS (Private Hosted Zone), you must enable the VPC settings enableDnsHostnames and enableDnsSupport
- DNS Security Extensions (DNSSEC)
  - A protocol for securing DNS traffic, verifies DNS data integrity and origin
  - Protects against Man in the Middle (MITM) attacks
  - Route 53 supports both DNSSEC for Domain Registeration and DNSSEC Signing
  - Works only with Public Hosted Zones
- Route 53 with 3rd Registrar
  - You can buy the domain out of AWS and use Route 53 as the DNS provider
  - Update the NS records on the 3rd party Registrar

**QUESTION**
Three "good to know" R53 points ?
**ANSWER**

- For internal private DNS (Private Hosted Zone), you must enable the VPC settings enableDnsHostnames and enableDnsSupport
- DNS Security Extensions (DNSSEC)
  - A protocol for securing DNS traffic, verifies DNS data integrity and origin
  - Protects against Man in the Middle (MITM) attacks
  - Route 53 supports both DNSSEC for Domain Registeration and DNSSEC Signing
  - Works only with Public Hosted Zones
- Route 53 with 3rd Registrar
  - You can buy the domain out of AWS and use Route 53 as the DNS provider
  - Update the NS records on the 3rd party Registrar

**QUESTION_END**

### Route 53 – Health Checks

- HTTP Health Checks are only for public resources
- Health Check => Automated DNS Failover:
  1. Health checks that monitor an endpoint (application, server, other AWS resource)
  2. Health checks that monitor other health checks (Calculated Health Checks)
  3. Health checks that monitor CloudWatch Alarms (full control !!) – e.g., throttles of DynamoDB, alarms on RDS, custom metrics,
     … (helpful for private resources)
- Health Checks are integrated with CW
  metrics

**QUESTION**
How to establish failover with R53/health checks
**ANSWER**
**RESEARCH** I think the deal is that you create one DNS that points to two ALB, R53 will do health checks on both before. If one is failing it will return only the working record
**QUESTION_END**

### Route 53 – Calculated Health Checks

- Combine the results of multiple Health Checks into a single Health Check
- You can use OR, AND, or NOT
- Can monitor up to 256 Child Health Checks
- Specify how many of the health checks need to pass to make the parent pass
- Usage: perform maintenance to your website without causing all health checks to fail

**TODO** Look at "calculated health checks"

### Health Checks – Monitor an Endpoint

- About 15 global health checkers will check
  the endpoint health
- Health Checks pass only when the
  endpoint responds with the 2xx and 3xx
  status codes
- Health Checks can be setup to pass / fail based on the text in the first 5120 bytes of the response **EXAM** **RESEARCH** Want to see this in action, its pass/fail, not on status code but content?

### Health Checks – Private Hosted Zones

- Route 53 health checkers are outside the VPC
- They can’t access private endpoints (private VPC or on-premises resource)
- You can create a CloudWatch Metric and associate a CloudWatch Alarm, then create a Health Check that checks the alarm itself

> He says "Health Checkers" both in private and public. I think the 'health checkers' is a service or similar, **RESEARCH**

**QUESTION**
How to implement Health Check on Private Hosted Zone
**ANSWER**

- You can create a CloudWatch Metric and associate a CloudWatch Alarm, then create a Health Check that checks the alarm itself

**RESEARCH** This is a health check on a DNS record or server?

**QUESTION_END**

### Health Checks Solution Architecture RDS multi-region failover (4:37)

[diagram not available]
**RESEARCH** You want to know how to do this
**TODO** Create a "Multi Region fail over strategy for RDS"

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - Route 53 - Resolvers & Hybrid DNS

**Topic:** 63. Route 53 - Resolvers & Hybrid DNS  
**Duration:** 7min  
**Section:** 5

## Notes

### Route 53 – Hybrid DNS

- By default, Route 53 Resolver
  automatically answers DNS queries for: - Local domain names for EC2 instances - Records in Private Hosted Zones - Records in public Name Servers
- Hybrid DNS – resolving DNS queries between VPC (Route 53 Resolver) and your networks (other DNS Resolvers)
- Networks can be:
  - VPC itself / Peered VPC
  - On-premises Network (connected through Direct Connect or AWS VPN)
    **QUESTION**
    What is R53 - Hybrid DNS?
    **ANSWER**
- Hybrid DNS – resolving DNS queries between VPC (Route 53 Resolver) and your networks (other DNS Resolvers)

> I think when you have a resolver for one network that includes private resources (IPs), and you want dns look-up into other private networks (on prem as example)

**QUESTION_END**

### Route 53 – Resolver Endpoints

- Inbound Endpoint
  - DNS Resolvers on your network can forward DNS queries to Route 53 Resolver
  - Allows your DNS Resolvers to resolve domain names for AWS resources (e.g., EC2 instances) and records in Route 53 Private Hosted Zones
- Outbound Endpoint
  - Route 53 Resolver conditionally forwards DNS queries to your DNS Resolvers
  - Use Resolver Rules to forward DNS queries to your DNS Resolvers
- Associated with one or more VPCs in the same AWS Region
- Create in two AZs for high availability
- Each Endpoint supports 10,000 queries per second per IP address

### Route 53 – Resolver Inbound Endpoints (2:25)

[diagram not available]

Discuses using R53 resolvers, inbound/outbound, forwarding requests.
It's a bit complicated but I think the gist of it is the resolvers are configured in a manor to forward requests to other network (resolver) and it will do the lookup. It doe so by looking at the domain name and associated resolvers (aws.private) maybe in cloud network

### Route 53 – Resolver Outbound Endpoints (4:24)

[diagram not available]

**RESEARCH** What are the points of Inbound/Outbound Resolvers. I think its a simple matter.

### Route 53 – Resolver Rules

- Control which DNS queries are forwarded to DNS Resolvers on your network
- **Conditional** Forwarding Rules (Forwarding Rules)
  - Forward DNS queries for a specified domain and all its subdomains to target IP addresses
- **System Rules**
  - Selectively overriding the behavior defined in Forwarding Rules (e.g., don’t forward DNS queries for a subdomain acme.example.com)
- **Auto-defined System Rules**
  - Defines how DNS queries for selected domains are resolved (e.g., AWS internal domain names, Privated Hosted Zones)
- If multiple rules matched, Route 53 Resolver chooses the most specific match
- **Resolver Rules can be shared across accounts using AWS RAM**
  - Manage them centrally in one account
  - Send DNS queries from multiple VPC to the target IP defined in the rule

**EXAM** He said the exam would ask about R53 for sure, and resolver rules. I think you really just need to know inbound/outbound resolvers, the various rule types and what happens when two rules conflict?

**QUESTION**
What are the 3 R53 Resolver rule types?
**ANSWER**

- Control which DNS queries are forwarded to DNS Resolvers on your network
- **Conditional** Forwarding Rules (Forwarding Rules)
  - Forward DNS queries for a specified domain and all its subdomains to target IP addresses
- **System Rules**
  - Selectively overriding the behavior defined in Forwarding Rules (e.g., don’t forward DNS queries for a subdomain acme.example.com)
- **Auto-defined System Rules**
  - Defines how DNS queries for selected domains are resolved (e.g., AWS internal domain names, Privated Hosted Zones)
- If multiple rules matched, Route 53 Resolver chooses the most specific match
- **Resolver Rules can be shared across accounts using AWS RAM**
  - Manage them centrally in one account
  - Send DNS queries from multiple VPC to the target IP defined in the rule

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - AWS Global Accelerator

**Topic:** 64. AWS Global Accelerator  
**Duration:** 3min  
**Section:** 5

## Notes

### AWS Global Accelerator

- Leverage the AWS internal network to route to your application
- 2 Anycast IP are created for your application
- The Anycast IP send traffic directly to Edge Locations
- The Edge locations send the traffic to your application

**QUESTION**
What is "Anycast IP"?
**ANSWER**

**RESEARCH** This is unclear. When using global accelerator - 2 Anycast IP and they are used to route traffic? These are standard IPs that are used in DNS resolution?

**QUESTION_END**

### AWS Global Accelerator (1:00)

- Works with Elastic IP, EC2 instances, ALB, NLB, public or private
- Supports Client IP Address Preservation **except EIPs endpoints**
- Consistent Performance
  - Intelligent routing to lowest latency and fast regional failover
  - No issue with client cache (because the IP doesn’t change)
  - Internal AWS network
- Health Checks
  - Global Accelerator performs a health check of your applications
  - Helps make your application global (failover less than 1 minute for unhealthy)
  - Great for disaster recovery (thanks to the health checks)
- Security
  - only 2 external IP need to be whitelisted
  - DDoS protection thanks to AWS Shield

**QUESTION**
What are the advantages of Global Accelerator and one limitation?
**ANSWER**

- Works with Elastic IP, EC2 instances, ALB, NLB, public or private
- Supports Client IP Address Preservation **except EIPs endpoints**
- Consistent Performance
  - Intelligent routing to lowest latency and fast regional failover
  - No issue with client cache (because the IP doesn’t change)
  - Internal AWS network
- Health Checks
  - Global Accelerator performs a health check of your applications
  - Helps make your application global (failover less than 1 minute for unhealthy)
  - Great for disaster recovery (thanks to the health checks)
- Security
  - only 2 external IP need to be whitelisted
  - DDoS protection thanks to AWS Shield

**QUESTION_END**

### AWS Global Accelerator vs CloudFront (2:02)

- They both use the AWS global network and its edge locations around the world
- Both services integrate with AWS Shield for DDoS protection.
- CloudFront
  - Improves performance for both cacheable content (such as images and videos)
  - Dynamic content (such as API acceleration and dynamic site delivery)
  - Content is served at the edge
- Global Accelerator
  - Improves performance for a wide range of applications over TCP or UDP
  - Proxying packets at the edge to applications running in one or more AWS Regions.
  - Good fit for non-HTTP use cases, such as gaming (UDP), IoT (MQTT), or Voice over IP
  - Good for HTTP use cases that require static IP addresses
  - Good for HTTP use cases that required deterministic, fast regional failover

**QUESTION**
What protocols does Global Accelerator support?
**ANSWER**
TCP and UDP, which means, good fit for non-http use case, UDP, MQTT (IoT), VOIP. Also good for HTTP.
**QUESTION_END**

**RESEARCH** When to choose Accelerator vs Cloud Front

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - Comparison of Solutions Architecture

**Topic:** 65. Comparison of Solutions Architecture  
**Duration:** 11min  
**Section:** 5

## Notes

### Solution Architecture Comparisons

- EC2 on its own with Elastic IP
- EC2 with Route53
- ALB + ASG
- ALB + ECS on EC2
- ALB + ECS on Fargate
- ALB + Lambda
- API Gateway + Lambda
- API Gateway + AWS Service
- API Gateway + HTTP backend (ex: ALB)

**QUESTION**
What are the 9 basic architecture for the application/web layer?
EC2/ALB/API-G,etc configurations?
**ANSWER**

- EC2 on its own with Elastic IP
- EC2 with Route53
- ALB + ASG
- ALB + ECS on EC2
- ALB + ECS on Fargate
- ALB + Lambda
- API Gateway + Lambda
- API Gateway + AWS Service
- API Gateway + HTTP backend (ex: ALB)

**QUESTION_END**

### EC2 with Elastic IP (0:40)

- Quick failover
- The client should not see the change happen
- Helpful if the client needs to resolve by static Public IP address
- **Does not scale**
- **Cheap**
  **QUESTION**
  Dis(2)/Advantages(3) of using "EC2 with Elastic IP" architecture
  **ANSWER**
- Quick failover
- The client should not see the change happen
- Helpful if the client needs to resolve by static Public IP address
- **Does not scale**
- **Cheap**

**QUESTION_END**

**QUESTION**
When to use CloudFront vs Accelerator
**ANSWER**

**RESEARCH** These serve different purposes. Can/do they work together? What problem is each solving?
**QUESTION_END**

### Stateless web app - scaling horizontally (1:36)

[Diagram not available]

- “DNS-based load balancing”
- Ability to use multiple instances
- Route53 TTL implies client may get outdated information
- Clients must have logic to deal with hostname resolution failures
- Adding an instance may not receive full traffic right away due to DNS
  TTL

**QUESTION**
Dis/advantages of "Stateless web app - scaling horizontally"?
**ANSWER**
Advantage:

- “DNS-based load balancing”
- Ability to use multiple instances
  Disadvantage
- Route53 TTL implies client may get outdated information
- Clients must have logic to deal with hostname resolution failures
- Adding an instance may not receive full traffic right away due to DNS
  TTL

> I don't think this is a real architecture plan but rather an example of how it "could be" done.
> **QUESTION_END**

### ALB + ASG (3:17)

- Scales well, classic architecture
- New instances are in service right away.
- Users are not sent to instances that are out-of-service
- Time to scale is slow (EC2 instance startup + bootstrap) – AMI can help
- ALB is elastic but can’t handle sudden, huge peaIf you want k of demand (pre-warm)
- Could lose a few requests if instances are overloaded
- CloudWatch used for scaling
- Cross-Zone balancing for even traffic distribution

- Target utilization should be between
  40% and 70%

**QUESTION**
Dis/advantage of "ALB + ASG". Also hint/best-practice regarding utilization.
**ANSWER**

There isn't necessary "Dis/advantages" but rather points to consider

- Scales well, classic architecture
- New instances are in service right away.
- Users are not sent to instances that are out-of-service
- Time to scale is slow (EC2 instance startup + bootstrap) – AMI can help
- ALB is elastic but can’t handle sudden, huge peak of demand (pre-warm)
- Could lose a few requests if instances are overloaded
- CloudWatch used for scaling
- Cross-Zone balancing for even traffic distribution

- Target utilization should be between
  40% and 70%

**QUESTION_END**

### ALB + ECS on EC2 (backed by ASG) (5:03)

- Same properties as ALB + ASG
- Application is run on Docker
- ASG + ECS allows to have dynamic port mappings
- Tough to orchestrate ECS service auto-scaling + ASG auto-scaling

**QUESTION**
Dis/advantage of "ALB + ECS on EC2 (backed by ASG)". Also, need to be able to compare/contrast to "ALB + ASG". How to over come the limitations?

**ANSWER**

- Same properties as ALB + ASG
- Application is run on Docker
- **ASG + ECS allows to have dynamic port mappings**
- Tough to orchestrate ECS service auto-scaling + ASG auto-scaling

To overcome limitations use Fargate...
**QUESTION_END**

### ALB + ECS on Fargate (6:08)

- Application is run on Docker
- Service Auto Scaling is easy
- Time to be in-service is quick (no need to launch an EC2 instance in advance)
- Still limited by the ALB in case of sudden peaks
- “serverless” application tier
- “managed” load balancer

**QUESTION**
Dis/advantages of "ALB + ECS on Fargate"?
Mostly it's just one disadvantage.
**ANSWER**

- Application is run on Docker
- Service Auto Scaling is easy
- Time to be in-service is quick (no need to launch an EC2 instance in advance)
- Still limited by the ALB in case of sudden peaks
- “serverless” application tier
- “managed” load balancer

**QUESTION_END**

### ALB + Lambda (7:02)

- Limited to Lambda’s runtimes
- Seamless scaling thanks to Lambda
- Simple way to expose Lambda functions as HTTP/S without all the features from API Gateway
- Can combine with WAF (Web Application Firewall)
- Good for hybrid microservices
- Example: use ECS for some requests, use Lambda for others

> He mentions that can use custom docker/image if using docker strongly recommended to use ECS run time.

**RESEARCH** Using ECS run time for lambda vs custom runtime?

**QUESTION**
Dis/advantages of "ALB + Lambda"?
**ANSWER**

- Limited to Lambda’s runtimes
- Seamless scaling thanks to Lambda
- Simple way to expose Lambda functions as HTTP/S **without all the features from API Gateway**
- Can combine with WAF (Web Application Firewall)
- Good for hybrid microservices
- Example: use ECS for some requests, use Lambda for others

> He mentions that can use custom docker/image if using docker strongly recommended to use ECS run time.

> He said it's a very useful and under appreciated?
> **QUESTION_END**

### API Gateway + Lambda (8:15)

- Pay per request, seamless scaling, fully serverless
- Soft limits: 10000/s API Gateway, 1000 concurrent Lambda
- API Gateway features: authentication, rate limiting, caching, etc…
- Lambda Cold Start time may increase latency for some requests
- Fully integrated with X-Ray

**QUESTION**
Dis/advantages of using "API Gateway + Lambda"
**ANSWER**

- Pay per request, seamless scaling, fully serverless
- Soft limits: 10000/s API Gateway, 1000 concurrent Lambda
- API Gateway features: authentication, rate limiting, caching, etc…
- Lambda Cold Start time may increase latency for some requests
- Fully integrated with X-Ray

**QUESTION_END**

### API Gateway + AWS Service (as a proxy) (9:02)

- Lower latency, cheaper
- Not using Lambda concurrent capacity, no custom code
- Expose AWS APIs securely through API Gateway
- SQS, SNS, Step Functions…
- Remember API Gateway has a payload limit of 10 MB (can be
  a problem for S3 proxy)

**QUESTION**
Dis/advantages of using "API Gateway + AWS Service"?
**ANSWER**

- Lower latency, cheaper
- Not using Lambda concurrent capacity, no custom code
- Expose AWS APIs securely through API Gateway
- SQS, SNS, Step Functions…
- Remember API Gateway has a payload limit of 10 MB (can be
  a problem for S3 proxy)

> Really the point seems API-G + Lamaba + AWS service doesn't make much sense if you can skip the Lambda

**QUESTION_END**

### API Gateway + HTTP backend (ex: ALB) (9:55)

- Use API Gateway features on top of custom HTTP backend (authentication, rate control, API keys, caching…)

- Can connect to…
- on-premises service
- Application Load Balancer
- 3rd party HTTP service

**QUESTION**
Dis/advantages of "API Gateway + HTTP backend"?
(something about onprem)
**ANSWER**

- Can connect to…
- on-premises service
- Application Load Balancer
- 3rd party HTTP service

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - AWS Outposts

**Topic:** 66. AWS Outposts  
**Duration:** 4min  
**Section:** 5

## Notes

### AWS Outposts

Hybrid Cloud: businesses that keep an on- premises infrastructure alongside a cloud infrastructure

- Therefore, two ways of dealing with IT systems:
  - One for the AWS cloud (using the AWS console, CLI, and AWS APIs)
  - One for their on-premises infrastructure
- AWS Outposts are “server racks” that offers the same AWS infrastructure, services, APIs & tools to build your own applications on-premises just as in the cloud
- AWS will setup and manage “Outposts Racks” within your on-premises infrastructure and you can start leveraging AWS services on-premises

- You are responsible for the Outposts Rack
  physical security

**QUESTION**
What is AWS Outpost
**ANSWER**
System to deal with on-prem infrastructure. AWS Gives it a cute name "Outpost" and logically represent your "rack".

You can run EC2 instances on both. I am sure there are further service integrations.
**QUESTION_END**

### AWS Outposts (2:05)

- Benefits:
- Low-latency access to on-premises systems
- Local data processing
- Data residency
- Easier migration from on-premises to the cloud
- Fully managed service
- Some services that work on Outposts: (the usual suspects, EBS, EC2, S3, etc)

### S3 on AWS Outposts (2:42)

- Use S3 APIs to store and retrieve data locally on AWS Outposts
- Keeping data close to on-premises applications
- Reduce data transfers to AWS Regions
- S3 Storage Class named S3 Outposts
- Default encryption using SSE-S3

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - AWS Wavelength

**Topic:** 67. AWS Wavelength  
**Duration:** 2min  
**Section:** 5

## Notes

### AWS WaveLength

- WaveLength Zones are infrastructure deployments
  embedded within the telecommunications providers’
  datacenters at the edge of the 5G networks
- Brings AWS services to the edge of the 5G networks
- Example: EC2, EBS, VPC…
- Ultra-low latency applications through 5G networks
- Traffic doesn’t leave the Communication Service
  Provider’s (CSP) network
- High-bandwidth and secure connection to the parent
  AWS Region
- No additional charges or service agreements
- Use cases: Smart Cities, ML-assisted diagnostics,
  Connected Vehicles, Interactive Live Video Streams, AR/VR,
  Real-time Gaming, …

**QUESTION**
What is AWS WaveLength?
**ANSWER**
Deploy resources on 5G networks (the telecommunications networks). From what I understand physically located in the telecom. The idea is that this is the nearest you can get to mobile users hence lowest letency. Can put several AWS services: ECS, EBS, VPC? etc

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 5: Compute & Load Balancing - AWS Local Zones

**Topic:** 68. AWS Local Zones  
**Duration:** 4min  
**Section:** 5

## Notes

### AWS Local Zones

- Places AWS compute, storage, database, and other selected AWS services closer to end users to run latency-sensitive
  applications
- Extend your VPC to more locations – “Extension of an AWS Region”
- Compatible with EC2, RDS, ECS, EBS, ElastiCache, Direct Connect …
- Example:
- AWS Region: N. Virginia (us-east-1)
- AWS Local Zones: Boston, Chicago, Dallas, Houston, Miami, …

**EXAM**
**QUESTION**
What are "Local Zone"
**ANSWER**

Local Available Zones, as in Denver, Chicago, Los Angeles. Basically, you are extending a zone that is more local for lower latency. It appears it fits into the VPC as an regular AZ

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**
