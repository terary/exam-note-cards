# Section 5 — extracted questions

## Question 001

__QUESTION__

What are the instance families? What does each mean (7)?
T2/T3, etc.
Hint "P" is an instance type family but not in this exam.

__ANSWER__

- R: applications that needs a lot of **[R]AM** – in-memory caches
- C: applications that needs good **[C]PU** – compute / databases
- M: applications that are balanced (think **“medium”**) – general / web app
- I: applications that need good local **I/O** (instance storage) – databases
- G: applications that need a **[G]PU** – video rendering / machine learning
- T2 / T3: **burstable** instances (up to a capacity)
- T2 / T3 - unlimited: **unlimited burst**

__QUESTION_END__

## Question 002

__QUESTION__

What are the three EC2 placement strategies? What advantages?

__ANSWER__

- Group Strategies:
  - Cluster—clusters instances into a low-latency group in a single Availability Zone
  - Spread—spreads instances across underlying hardware (max 7 instances per group per
    AZ) – critical applications
  - Partition—spreads instances across many different partitions (which rely on different sets
    of racks) within an AZ. Scales to 100s of EC2 instances per group (Hadoop, Cassandra,
    Kafka)

__QUESTION_END__

## Question 003

__QUESTION__

**EXAM** how to move an instance from one placement group to another?

__ANSWER__

- You can move an instance into or out of a placement group
  - Your first need to stop it
  - You then need to use the CLI (modify-instance-placement)
  - You can then start your instance

__QUESTION_END__

## Question 004

__QUESTION__

What are the various "Launch Types"(5)? What are the advantages of each?

__ANSWER__

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

__QUESTION_END__

## Question 005

__QUESTION__

What are the EC2 Metrics (4)? What is one thing that is not a metric that you would expect? One metric is valid only for Instance Store instances?

__ANSWER__

- `CPU`: CPU Utilization + Credit Usage / Balance
- `Network`: Network In / Out
- `Status Check`:
  - Instance status = check the EC2 VM
  - System status = check the underlying hardware
- `Disk`: Read / Write for Ops / Bytes (**only for instance store** otherwise you get these metrics directly)

- RAM is NOT included in the AWS EC2 metrics (**EXAM**)

__QUESTION_END__

## Question 006

__QUESTION__

With instance recovery, what instance properties are restored?

__ANSWER__

- Recovery: Same Private, Public, Elastic IP, metadata, placement group

> I think AMI is missing from this list

__QUESTION_END__

## Question 007

__QUESTION__

What are good metrics to scale on (4)?

__ANSWER__

- **CPUUtilization**: Average CPU utilization across your instances
- **RequestCountPerTarget**: to make sure the number of requests per EC2 instances is stable
- **Average Network In / Out** (if you’re application is network bound)
- **Any custom metric (that you push using CloudWatch)**

__QUESTION_END__

## Question 008

__QUESTION__

Good to know about Auto Scaling, 3 facts?

__ANSWER__

- Spot Fleet support (mix on Spot and On-Demand instances)
- Lifecycle Hooks:
  - Perform actions before an instance is in service, or before it is terminated
  - Examples: cleanup, log extraction, special health checks
- To upgrade an AMI, must update the launch configuration / template
  - Then terminate instances manually (CloudFormation can help)
  - Or use EC2 Instance Refresh for Auto Scaling

__QUESTION_END__

## Question 009

__QUESTION__

What is the clever way to Refresh Instances (using their updated launch configuration)?

__ANSWER__

- Goal: update launch template and then re-creating all EC2 instances
- For this we can use the native feature of Instance Refresh
- Setting of minimum healthy percentage
- Specify warm-up time (how long until the instance is ready to use)

__QUESTION_END__

## Question 010

__QUESTION__

What are the Auto Scaling Processes (9)?

__ANSWER__

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

__QUESTION_END__

## Question 011

__QUESTION__

What is a bad health check? What happens if you have a poorly planned health check?

__ANSWER__

One that has to do a lot of work. It should be a simple thing that returns simple status.

If the health check is overly complicated and takes time to respond it may cause the Load Balancer to determine the instance is unhealthy and cause it to replace the instance. Since all instances use the same health check, they'll likely all get replaced, over-and-over.

__QUESTION_END__

## Question 012

__QUESTION__

What are the available Health Checks (3)?

__ANSWER__

- Health checks available:
  - EC2 Status Checks
  - ELB Health Checks (HTTP)
  - Custom Health Checks – send instance’s health to an ASG using AWS CLI or AWS SDK (set-instance-health)

__QUESTION_END__

## Question 013

__QUESTION__

What are the three "update scaling group" methods? What are the pros/cons?
**EXAM**

__ANSWER__

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

__QUESTION_END__

## Question 014

__QUESTION__

How does AWS determine who gets 'spot' instances

__ANSWER__

- Define max spot price and get the instance **while current spot price < max**
  - The hourly spot price varies based on offer and capacity
  - If the current spot price > your max price you can choose to stop or terminate your instance with a 2 minutes grace period.

__QUESTION_END__

## Question 015

__QUESTION__

Spot Instance Flee / Spot Fleet.
What are the strategies for determine the 'next instance', how does it choose between spot/on-demand?

__ANSWER__

- **Strategies to allocate Spot Instances**:
  - lowestPrice: from the pool with the lowest price (cost optimization, short workload)
  - diversified: distributed across all pools (great for availability, long workloads)
  - capacityOptimized: pool with the optimal capacity for the number of instances
  - priceCapacityOptimized (recommended): pools with highest capacity available, then select the pool with the lowest price (best choice for most workloads)

__QUESTION_END__

## Question 016

__QUESTION__

What are the dis/advantages of spot fleets?

__ANSWER__

**TODO** What are the dis/advantages of spot fleets?

__QUESTION_END__

## Question 017

__QUESTION__

What are the main concepts/terms of ECS(5)?

__ANSWER__

- **ECS Cluster** – logical grouping of EC2 instances
- **ECS Service** – defines how many tasks should run and how they should
  be run
- **Task Definitions** – metadata in JSON form to tell ECS how to run a
  Docker container (image name, CPU, RAM, …)
- **ECS Task** – an instance of a Task Definition, a running Docker container(s)
- **ECS IAM Roles**
  - EC2 Instance Profile – used by the EC2 instance (e.g., make API calls to ECS, send logs, …)
  - ECS Task IAM Role – allow each task to have a specific role (e.g., make

__QUESTION_END__

## Question 018

__QUESTION__

What are the different networking types for ECS Tasks (4)?

__ANSWER__

- **none** – no network connectivity, no port mappings
- **bridge** – uses Docker’s virtual container-based network
- **host** – bypass Docker’s network, uses the underlying host network interface
- **awsvpc**
  - Every tasks launched on the instance gets its own ENI and a private IP address
  - Simplified networking, enhanced security, Security Groups, monitoring, VPC Flow Logs
  - Default mode for Fargate tasks

__QUESTION_END__

## Question 019

__QUESTION__

How to use Spot Instances with ECS or Fargate? What are the pros and cons?

__ANSWER__

**TODO** Answer that question

__QUESTION_END__

## Question 020

__QUESTION__

What are the different Container Services offered by AWS? What are the pros/cons?

__ANSWER__

**TODO** Answer that question.
I think there are three services but it's unclear why/when a person would use one or the other.

__QUESTION_END__

## Question 021

__QUESTION__

Regarding ECR Image Scanning. What are the two option, what are the pros/cons

__ANSWER__

- Manual Scan or Scan on Push
- Basic Scanning – Common CVE
- Enhanced Scanning – Leverages Amazon Inspector (OS & Programming
  Language vulnerabilities)
- Scan results can be retrieved from within the AWS console

__QUESTION_END__

## Question 022

__QUESTION__

For EKS What are the the three Node Types, what is the differences?

__ANSWER__

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

__QUESTION_END__

## Question 023

__QUESTION__

How to attache Data Volumes to EKS, what volume types are support (only one works for Fargate)

__ANSWER__

- Need to specify **StorageClass** manifest on your EKS cluster
- Leverages a **Container Storage Interface (CSI)** compliant driver

- Support for…
- Amazon EBS
- Amazon EFS (works with Fargate)
- Amazon FSx for Lustre
- Amazon FSx for NetApp ONTAP

__QUESTION_END__

## Question 024

__QUESTION__

What is app runner? What are the use cases and advantages?

__ANSWER__

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

__QUESTION_END__

## Question 025

__QUESTION__

Using AWS ECS how to launch a task on premise?

__ANSWER__

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

__QUESTION_END__

## Question 026

__QUESTION__

What is the difference between "EKS Anywhere" and "ECS Anywhere".

What are the connection requirements?

__ANSWER__

**RESEARCH** What is the difference between "EKS Anywhere" and "ECS Anywhere"

I think key is running task on premise within AWS vs running task in AWS in OnPrem

__QUESTION_END__

## Question 027

__QUESTION__

What are the Lambda limitations (10)?

__ANSWER__

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

__QUESTION_END__

## Question 028

__QUESTION__

What are concurrency limit? How to set a limit, what happens when limit is exceeded?

__ANSWER__

- Concurrency limit: up to 1000 concurrent executions

- Can set a “reserved concurrency” at the function level (=limit)
- Each invocation over the concurrency limit will trigger a “Throttle”
- Can request a quota increase in AWS Service Quotas

**RESEARCH** What is the effect of "Reserved Concurrency", kinda a throttle?

__QUESTION_END__

## Question 029

__QUESTION__

What is the advantage of using CodeDeploy to deploy Lambda

__ANSWER__

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

__QUESTION_END__

## Question 030

__QUESTION__

What tools are used to for monitoring/observability?

__ANSWER__

Cloudwatch Monitor

XRay for Observability

__QUESTION_END__

## Question 031

__QUESTION__

When and Why is Idempotent matter for Lambda.

__ANSWER__

Async Lambda calls will need to be idempotent. Lambda will retry 3 times on failure.

**RESEARCH** Does that mean they SHOULD NOT have any side effects? I think that is impossible?

__QUESTION_END__

## Question 032

__QUESTION__

If SQS is in the mixed, is the Lambda Batch or Parallel?

__ANSWER__

Because SQS has some delay (Batch)? We can say it's Batched

__QUESTION_END__

## Question 033

__QUESTION__

What are the 4 Load Balancer Types?
Dis/Advantages?

__ANSWER__

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

__QUESTION_END__

## Question 034

__QUESTION__

Why use ALB over CLB and visa/versa

__ANSWER__

**RESEARCH** Why you might choose CLB over ALB?

You will want ALB in most cases because it uses SNI, to direct traffic to the right certificate.

__QUESTION_END__

## Question 035

__QUESTION__

What are the target Groups of ALB (5)?

__ANSWER__

- EC2 instances (can be managed by an Auto Scaling Group) – HTTP
- ECS tasks (managed by ECS itself) – HTTP
- Lambda functions – HTTP request is translated into a JSON event
- IP Addresses – must be private IPs
- ALB can route to multiple target groups

__QUESTION_END__

## Question 036

__QUESTION__

Why would you choose NLB over ALB

__ANSWER__

**NLB are used for extreme performance, TCP or UDP traffic**

- Forward TCP/UDP to instances

- Less latency ~100 ms (vs 400 ms for ALB)

__QUESTION_END__

## Question 037

__QUESTION__

What are the target groups of NLB?

__ANSWER__

- EC2 instances
- IP Addresses – must be private IPs (usually something like 10.x.x.x)
- Application Load Balancer

__QUESTION_END__

## Question 038

__QUESTION__

Discuss name resolution when using NLB? Because it maps to several instances different IP, it will resolve to to all IPs, but what if you want just a regional IP (AZ).

__ANSWER__

**RESEARCH** How/Why this is important

This is related to routing traffic back to local AZ, costs/latency.

__QUESTION_END__

## Question 039

__QUESTION__

What is the purpose of Gateway Load Balancer (GLB)?

__ANSWER__

It operations on Level 3, can inspect packets. Used for sending traffic to 3rd party security services.

You would configure GLB to sit in front of your app and send packets to the GLB for security inspection.

If all is good, it forwards the packets back to the application.

__QUESTION_END__

## Question 040

__QUESTION__

What targets does GLB support?

__ANSWER__

- EC2 instances
- IP Addresses – must be private IPs (10.x.x.x)

__QUESTION_END__

## Question 041

__QUESTION__

Which of the four Load Balancers is Cross-Zone distribution enabled?
Which ones charge?

__ANSWER__

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

__QUESTION_END__

## Question 042

__QUESTION__

Which LB support 'sticky'? Why would you not want to use it?

__ANSWER__

- It is possible to implement stickiness so that the same client is always redirected to the same instance behind a load balancer
- This works for Classic Load Balancers & Application Load Balancers
- The “cookie” used for stickiness has an expiration date you control
- Use case: make sure the user doesn’t lose his session data
- Enabling stickiness may bring imbalance to the load over the backend EC2 instances

__QUESTION_END__

## Question 043

__QUESTION__

What are the three request routing routines, which apply to which LB

__ANSWER__

`Least Outstanding` - ALB, CLB. Instances with the least outstanding requests (better "work" distribution)

`Round Robin` - ALB, CLB

`Flow Hash` - Belongs with NLB, has kinda sticky effect

__QUESTION_END__

## Question 044

__QUESTION__

API Gateway limits to know (2)?

What are some of the advantages (8)?

__ANSWER__

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

__QUESTION_END__

## Question 045

__QUESTION__

Three points about API Gateway Deployments

__ANSWER__

- API changes are deployed to “Stages” (as many as you want)
- Use the naming you like for stages (dev, test, prod)
- Stages can be rolled back as a history of deployments is kept

__QUESTION_END__

## Question 046

__QUESTION__

What are the three API-G Integrations?

__ANSWER__

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

__QUESTION_END__

## Question 047

__QUESTION__

If implementing a solution with API-G and S3. What is one of the S3 concerns? How to get around it.

__ANSWER__

10MB API-G Limit is a concern. You can set-up a "pre-request" to get a pre-signed upload URL, and directly upload to S3.

Lambda generates the Pre-sign URL

__QUESTION_END__

## Question 048

__QUESTION__

What are the 3 types of API-G Endpoints? When to use which?

__ANSWER__

- Edge-Optimized (default): For global clients
  - Requests are routed through the CloudFront Edge locations (improves latency)
  - The API Gateway still lives in only one region
- Regional:
  - For clients within the same region
  - Could manually combine with CloudFront (more control over the caching strategies and the distribution)
- Private:
  - Can only be accessed from your VPC using an interface VPC endpoint (ENI)
  - Use a resource policy to define access

__QUESTION_END__

## Question 049

__QUESTION__

Eight points about API-G Caching?

__ANSWER__

- Caching reduces the number of calls made to the backend
- Default TTL (time to live) is 300 seconds (min: 0s, max: 3600s)
- Caches are defined per stage
- Possible to override cache settings per method
- Clients can invalidate the cache with header: Cache-Control: max-age=0 (with proper IAM authorization)
- Able to flush the entire cache (invalidate it) immediately
- Cache encryption option
- Cache capacity between 0.5GB to 237GB

__QUESTION_END__

## Question 050

__QUESTION__

What are the 3 5xx errors and their meaning mentioned in the lecture?

__ANSWER__

- 5xx means Server errors
  - 502: Bad Gateway Exception, usually for an incompatible output returned from a Lambda proxy integration backend and occasionally for out-of-order invocations due to heavy loads.
  - 503: Service Unavailable Exception
  - 504: Integration Failure – ex Endpoint Request Timed-out Exception API Gateway requests time out after 29 second maximum

__QUESTION_END__

## Question 051

__QUESTION__

Four points of security for API-G?

__ANSWER__

- Load SSL certificates and use Route53 to define a CNAME
- Resource Policy (~S3 Bucket Policy):
  - control who can access the API
  - Users from AWS accounts, IP or CIDR blocks, VPC or VPC Endpoints
- IAM Execution Roles for API Gateway at the API level
  - To invoke a Lambda Function, an AWS service…
- CORS (Cross-origin resource sharing):
  - Browser based security
  - Control which domains can call your API

__QUESTION_END__

## Question 052

__QUESTION__

What are the three main Authorization Techniques used by API-G?

__ANSWER__

- IAM based access (AWS_IAM)
  - Good for providing access within your infrastructure
  - Pass IAM credentials in headers through Sig V4
- Lambda Authorizer (formerly Custom Authorizer)
  - Use Lambda to verify a custom OAuth / SAML / 3rd party authentication

- Cognito User Pools
  - Client authenticates with Cognito
  - Client passes the token to API Gateway
  - API Gateway knows out-of-the-box how to verify to token

__QUESTION_END__

## Question 053

__QUESTION__

What are the 3 logging methods? Something special about some/most of them?

__ANSWER__

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

__QUESTION_END__

## Question 054

__QUESTION__

What are the 4 DNS records discussed in the lectures?

__ANSWER__

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

__QUESTION_END__

## Question 055

__QUESTION__

What is the services/resources you CAN NOT set alias to?

__ANSWER__

EC2 DNS names

__QUESTION_END__

## Question 056

__QUESTION__

Which DNS records do not have TTL.

What is the benefit/cost of long/short TTL

__ANSWER__

ALIAS records are they only DNS records that do not require TTL

When longer TTL fewer looks ups, less money spent on R53.
Shorter TTL more look ups more R53 money.

Long TTL can be a pain when trying to update names

__QUESTION_END__

## Question 057

__QUESTION__

Four points about simple DNS routing.

__ANSWER__

- Typically, route traffic to a single resource
- Can’t be associated with Health Checks
- Can specify multiple values in the same record
- If multiple values are returned, a random one is chosen by the client

__QUESTION_END__

## Question 058

__QUESTION__

With "Lowest Latency" routing. How is latency determined?

__ANSWER__

Latency is based on traffic between users and AWS Regions

Hence, it makes sense if a user is in Germany, and the APP is in Asia, that the user is routed through US.

__QUESTION_END__

## Question 059

__QUESTION__

What is the use-case for geolocation over latency based routing?

__ANSWER__

Geolocation can be used to restrict access within geoloaction (compliance). To assure users within a certain area access certain resource

__QUESTION_END__

## Question 060

__QUESTION__

What are the 6 traffic routing methods? What are the use-cases pros and cons?

__ANSWER__

### Routing Policies – Simple (4:10)

### Routing Policies – Weighted (4:53)

### Routing Policies – Latency-based (5:22)

### Routing Policies – Failover (Active-Passive) (6:08)

### Routing Policies – Geolocation (6:36)

### Routing Policies – Geoproximity (7:14)

### Routing Policies – IP-based Routing (9:51)

__QUESTION_END__

## Question 061

__QUESTION__

R53 Zones, how many? What are they?

__ANSWER__

- Public Hosted Zones – contains records that specify how to route traffic on the Internet (public domain names) application1.mypublicdomain.com
- Private Hosted Zones – contain records that specify how you route traffic within one or more VPCs (private domain names)

__QUESTION_END__

## Question 062

__QUESTION__

Three "good to know" R53 points ?

__ANSWER__

- For internal private DNS (Private Hosted Zone), you must enable the VPC settings enableDnsHostnames and enableDnsSupport
- DNS Security Extensions (DNSSEC)
  - A protocol for securing DNS traffic, verifies DNS data integrity and origin
  - Protects against Man in the Middle (MITM) attacks
  - Route 53 supports both DNSSEC for Domain Registeration and DNSSEC Signing
  - Works only with Public Hosted Zones
- Route 53 with 3rd Registrar
  - You can buy the domain out of AWS and use Route 53 as the DNS provider
  - Update the NS records on the 3rd party Registrar

__QUESTION_END__

## Question 063

__QUESTION__

How to establish failover with R53/health checks

__ANSWER__

**RESEARCH** I think the deal is that you create one DNS that points to two ALB, R53 will do health checks on both before. If one is failing it will return only the working record

__QUESTION_END__

## Question 064

__QUESTION__

How to implement Health Check on Private Hosted Zone

__ANSWER__

- You can create a CloudWatch Metric and associate a CloudWatch Alarm, then create a Health Check that checks the alarm itself

**RESEARCH** This is a health check on a DNS record or server?

__QUESTION_END__

## Question 065

__QUESTION__

What is R53 - Hybrid DNS?

__ANSWER__

- Hybrid DNS – resolving DNS queries between VPC (Route 53 Resolver) and your networks (other DNS Resolvers)

> I think when you have a resolver for one network that includes private resources (IPs), and you want dns look-up into other private networks (on prem as example)

__QUESTION_END__

## Question 066

__QUESTION__

What are the 3 R53 Resolver rule types?

__ANSWER__

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

__QUESTION_END__

## Question 067

__QUESTION__

What is "Anycast IP"?

__ANSWER__

**RESEARCH** This is unclear. When using global accelerator - 2 Anycast IP and they are used to route traffic? These are standard IPs that are used in DNS resolution?

__QUESTION_END__

## Question 068

__QUESTION__

What are the advantages of Global Accelerator and one limitation?

__ANSWER__

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

__QUESTION_END__

## Question 069

__QUESTION__

What protocols does Global Accelerator support?

__ANSWER__

TCP and UDP, which means, good fit for non-http use case, UDP, MQTT (IoT), VOIP. Also good for HTTP.

__QUESTION_END__

## Question 070

__QUESTION__

What are the 9 basic architecture for the application/web layer?
EC2/ALB/API-G,etc configurations?

__ANSWER__

- EC2 on its own with Elastic IP
- EC2 with Route53
- ALB + ASG
- ALB + ECS on EC2
- ALB + ECS on Fargate
- ALB + Lambda
- API Gateway + Lambda
- API Gateway + AWS Service
- API Gateway + HTTP backend (ex: ALB)

__QUESTION_END__

## Question 071

__QUESTION__

Dis(2)/Advantages(3) of using "EC2 with Elastic IP" architecture

__ANSWER__

- Quick failover
- The client should not see the change happen
- Helpful if the client needs to resolve by static Public IP address
- **Does not scale**
- **Cheap**

__QUESTION_END__

## Question 072

__QUESTION__

When to use CloudFront vs Accelerator

__ANSWER__

**RESEARCH** These serve different purposes. Can/do they work together? What problem is each solving?

__QUESTION_END__

## Question 073

__QUESTION__

Dis/advantages of "Stateless web app - scaling horizontally"?

__ANSWER__

Advantage:

- “DNS-based load balancing”
- Ability to use multiple instances
  Disadvantage
- Route53 TTL implies client may get outdated information
- Clients must have logic to deal with hostname resolution failures
- Adding an instance may not receive full traffic right away due to DNS
  TTL

> I don't think this is a real architecture plan but rather an example of how it "could be" done.
>

__QUESTION_END__

## Question 074

__QUESTION__

Dis/advantage of "ALB + ASG". Also hint/best-practice regarding utilization.

__ANSWER__

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

__QUESTION_END__

## Question 075

__QUESTION__

Dis/advantage of "ALB + ECS on EC2 (backed by ASG)". Also, need to be able to compare/contrast to "ALB + ASG". How to over come the limitations?

__ANSWER__

- Same properties as ALB + ASG
- Application is run on Docker
- **ASG + ECS allows to have dynamic port mappings**
- Tough to orchestrate ECS service auto-scaling + ASG auto-scaling

To overcome limitations use Fargate...

__QUESTION_END__

## Question 076

__QUESTION__

Dis/advantages of "ALB + ECS on Fargate"?
Mostly it's just one disadvantage.

__ANSWER__

- Application is run on Docker
- Service Auto Scaling is easy
- Time to be in-service is quick (no need to launch an EC2 instance in advance)
- Still limited by the ALB in case of sudden peaks
- “serverless” application tier
- “managed” load balancer

__QUESTION_END__

## Question 077

__QUESTION__

Dis/advantages of "ALB + Lambda"?

__ANSWER__

- Limited to Lambda’s runtimes
- Seamless scaling thanks to Lambda
- Simple way to expose Lambda functions as HTTP/S **without all the features from API Gateway**
- Can combine with WAF (Web Application Firewall)
- Good for hybrid microservices
- Example: use ECS for some requests, use Lambda for others

> He mentions that can use custom docker/image if using docker strongly recommended to use ECS run time.

> He said it's a very useful and under appreciated?
>

__QUESTION_END__

## Question 078

__QUESTION__

Dis/advantages of using "API Gateway + Lambda"

__ANSWER__

- Pay per request, seamless scaling, fully serverless
- Soft limits: 10000/s API Gateway, 1000 concurrent Lambda
- API Gateway features: authentication, rate limiting, caching, etc…
- Lambda Cold Start time may increase latency for some requests
- Fully integrated with X-Ray

__QUESTION_END__

## Question 079

__QUESTION__

Dis/advantages of using "API Gateway + AWS Service"?

__ANSWER__

- Lower latency, cheaper
- Not using Lambda concurrent capacity, no custom code
- Expose AWS APIs securely through API Gateway
- SQS, SNS, Step Functions…
- Remember API Gateway has a payload limit of 10 MB (can be
  a problem for S3 proxy)

> Really the point seems API-G + Lamaba + AWS service doesn't make much sense if you can skip the Lambda

__QUESTION_END__

## Question 080

__QUESTION__

Dis/advantages of "API Gateway + HTTP backend"?
(something about onprem)

__ANSWER__

- Can connect to…
- on-premises service
- Application Load Balancer
- 3rd party HTTP service

__QUESTION_END__

## Question 081

__QUESTION__

What is AWS Outpost

__ANSWER__

System to deal with on-prem infrastructure. AWS Gives it a cute name "Outpost" and logically represent your "rack".

You can run EC2 instances on both. I am sure there are further service integrations.

__QUESTION_END__

## Question 082

__QUESTION__

What is AWS WaveLength?

__ANSWER__

Deploy resources on 5G networks (the telecommunications networks). From what I understand physically located in the telecom. The idea is that this is the nearest you can get to mobile users hence lowest letency. Can put several AWS services: ECS, EBS, VPC? etc

__QUESTION_END__

## Question 083

__QUESTION__

What are "Local Zone"

__ANSWER__

Local Available Zones, as in Denver, Chicago, Los Angeles. Basically, you are extending a zone that is more local for lower latency. It appears it fits into the VPC as an regular AZ

__QUESTION_END__
