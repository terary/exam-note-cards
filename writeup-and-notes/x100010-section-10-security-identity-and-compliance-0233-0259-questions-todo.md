#### QUESTION X

What is "Principle of Least Privilege"?

#### ANSWER X

Grant only the permissions required to perform a task

#### END QUESTION

#### QUESTION X

What is "IAM Access Analyzer" How is it used, specifically for developing least privilege policy?

#### ANSWER X

It can be used to help generate least privilege policy, or audit a user's activity

#### END QUESTION

#### QUESTION X

If I want to generate a 'List privilege policy' what is the go-to tool?

#### ANSWER X

"IAM Access Analyzer"

#### END QUESTION

#### QUESTION X

What is the securest way of dealing with PII or other sensitive data?

#### ANSWER X

Don't import it or delete it, when possible. Otherwise obfuscate, Anonymize

#### END QUESTION

#### QUESTION X

What is the most basic AWS security practices (6)?

#### ANSWER X

- use identity and Access Management (IAM)
- setup user accounts with only the permissions they need
- Use MFA
- Use SSL/TLS when connecting to anything
- Use **CloudTrail** to log API and user activity
- Use Encrypting
- Be careful with PII and other sensitive data

#### END QUESTION

#### QUESTION X

What is the difference/purpose of CloudTrail vs CloudWatch

#### ANSWER X

CloudTrail is for auditing trail of activity log of what every one did, CloudWatch - Watching Log data raising alarms/monitors when something is wrong

#### END QUESTION

---

#### QUESTION X

SM - Should we encrypt /opt/ml and/or /tmp?

#### ANSWER X

Not sure but I _think_ so? - need to research this

#### END QUESTION

#### QUESTION X

Discuss briefly SageMaker's Inflight Encryption

#### ANSWER X

#### Protecting your data **in transit** with SageMaker (3:26)

- All traffic support TLS/SSL
- IAM roles are assigned to SageMaker to give permissions to access resources
- Inter-node training communication may be **optionally** encrypted
  - Can increase training time and cost with deep learning
  - AKA inter-container traffic encryption
  - Enable via console or API when setting up training/tuning job
  - **THIS IS LIKELY UNNECESSARY UNLESS FOR SPECIAL COMPLIANCE OR CONTRACTUAL REQUIREMENTS** This will have a sizable cost impact when dealing with several nodes - use only if necessary, rely more on VPC `inter container traffic encryption`

> IAM Policy should implement 'principle of least privilege'

#### END QUESTION

#### QUESTION X

What are the common IAM policies related to SageMaker?
(user Policy/action (7) and Predifned Policy (4))#### ANSWER X

It is not necessary to know these but it will be a good idea to be familar

#### ANSWER X

- User permissions for:
  - CreateTrainingJob
  - CreateModel
  - CreateEndpointConfig
  - CreateTransformJob
  - CreateHyperParameterTuningJob
  - CreateNotebookInstance
  - UpdateNotebookInstance
- Predefined policy:
  - AmazonSAageMakerReadOnly
  - AmazonSageMakerFullAccess
  - AdministratorAccess
  - DataScientist

#### END QUESTION

#### QUESTION X

Using IAM, how can we prevent users from running expensive jobs?

#### ANSWER X

> Using IAM you can lock-down expensive functionality so that the user can do some stuff, but not expensive stuff.

#### END QUESTION

#### QUESTION X

Discuss breifly the roles CloudWatch and CloudTrail play within SageMaker

#### ANSWER X

- CloudWatch can log, monitor and alarm on:
  - INvocations and latency of endpoints
  - Health of instance nodes (CPU, memory, et)
  - **Ground Truth** (active workers, how much they are doing, can monitory performance of humans doing work, label tasks, confirm bad inference (probably))
- CloudTrail records actions from users, roles, and services
  - Log files are delivered to S3 for auditing

#### END QUESTION

#### QUESTION X

IAM is regional or global?

#### ANSWER X

Global - need to get a uniform permission from single source of truth - must be global

#### END QUESTION

#### QUESTION X

IAM Groups have a significant restriction - what?

#### ANSWER X

Group can not contain other groups.
A user can belong to zero group (not best practice), more than one group.. But group can not contain another group

#### END QUESTION

#### QUESTION X

What is Multi Session Support how to enable it and what does it do? what is the limitation?

#### ANSWER X

- "Multi Session Support" - is an option under the menu option (top-right) with other user specific options

- This allows you to log-in using different **ACCOUNT** (not necessarily user)

#### END QUESTION

#### QUESTION X

What are the statement elements of a policy file (6)?

#### ANSWER X

- Consists of:
  - Version Policy - 2012-10-17
  - id - option identify policy
  - statements (one or more)
    - sid statement id, optional
    - effect, wither allow or deny (Allow|Deny)
    - principal - user(s) or role(s) - can have multiple principals
    - Action - list of actions this policy allows or denies
    - Resource: the resources the policy applies to
    - Conditions: (doesn't demonstrate but mentions it)

#### END QUESTION

#### QUESTION X

Key benefit of MFA?

#### ANSWER X

**EXAM** If user looses password, account does not become compromised because the device is necessary.. This allows opportunity to change password and does not require EVERYBODY to change password **MAIN BENEFIT**

#### END QUESTION

#### QUESTION X

What are the two Password Protection mechanism AWS Offers

#### ANSWER X

Password policy (min, length, expire, etc)
and MFA -

#### END QUESTION

#### QUESTION X

What are the allowed devices for MFA (4)?

#### ANSWER X

- Virtual Device (Authy/google auth, etc)
- Universal 2nd factor (U2F) - hardward/usb drive
- Hardware Key Fob MFA Device (fancy hardware)
- Hardware Key Fob **GOVERNMENT** AwsGovCloud

#### END QUESTION

#### QUESTION X

Government MFA device - what is it?

#### ANSWER X

- Hardware Key Fob **GOVERNMENT** AwsGovCloud
  I guess there is a special device that can be used for gov cloud.

#### END QUESTION

#### QUESTION X

For services that perform tasks on our bahalf, what is the IAM requirement

#### ANSWER X

Services require Service Roles (IAM Role for Service). The "role" will need a policy that allows the action.

#### END QUESTION

#### QUESTION X

How to set-up IAM for services that work on our behalf?

#### ANSWER X

We are focusing on creating a role for "AWS service"

1. create role
2. attach policy to role

#### END QUESTION

#### QUESTION X

How to prevent Man In The Middle Attacks?

#### ANSWER X

Inflight Encryption (SSL/TSL)

#### END QUESTION

#### QUESTION X

What are the three mechanism for encryption in the cloud? (It is supposed to be a very basic question)

#### ANSWER X

Three Mechanism for Encryption in the cloud

- Inflight - SSL/TSL
- At rest ( I guess)
- Envelope (client stores encrypted files on untrusted server)

I think this is the pre-cursor for the argument for KMS encryption

#### END QUESTION

#### QUESTION X

What is "Envelope Encryption"

#### ANSWER X

If working with untrusted servers, client can post encrypted files. The client would de/encrypt the file and server can never decrypt

#### END QUESTION

#### QUESTION X

How frequently are KMS keys rotated?

#### ANSWER X

AWS Managed keys are rotated once a year
Customer managed keys and be set to rotate however frequently or manually (not sure if there is a max 1 year)

#### END QUESTION

#### QUESTION X

How many regions can a KMS key exist in?

#### ANSWER X

Natually a KMS key can only exist in one region. However I saw an option in the Hands One that allowed 'multi-regaion', which I imagine means few not many.

They go on to say you can have 'multi-region' keys?(0249/2:44)

#### END QUESTION

#### QUESTION X

KMS Keys are regional or global

#### ANSWER X

Natually a KMS key can only exist in one region. However I saw an option in the Hands One that allowed 'multi-regaion', which I imagine means few not many.

They go on to say you can have 'multi-region' keys?(0249/2:44)

#### END QUESTION

#### QUESTION X

How to copy encrypted snapshot (EBS as example)?

#### ANSWER X

If you are copying snapshots across accounts

1. Create a snapshot, encrypted with your own KMS key (customer managed Key)
2. Attached a KMS key Policy to authorized cross-account access
3. Share the encrypted snapshot
4. (in target) Create a copy of the snapshot, encrypt it with a CMK in your account
5. Create a volume form the snapshot

#### END QUESTION

#### QUESTION X

The default, KMS Key Access Policy - who can access the key?

#### ANSWER X

Without a policy nobday can access key. AWS's default policy allows everybody within the account to access the key.

#### END QUESTION

#### QUESTION X

How to implement Cross-Account KMS Key Access?

#### ANSWER X

You have to have a IAM policy that allows external account to access the key.

#### END QUESTION

#### QUESTION X

What two conditionals are required for AWS managed key IAM policy?
probably not important for the exam but good confidence booster

#### ANSWER X

The policy conditionals need to include: `kms:ViaService` and `kms:CallerAccount`

#### END QUESTION

#### QUESTION X

What is Amazon Macie? (Brief description)

#### ANSWER X

- Amazon Macie is a fully managed data security and data privacy service that uses machine learning and pattern matching to discover and protect your sensitive data in AWS.

- Macie helps identify and alert you to sensitive data, such as PII

[S3 Bucket] ---analyze---> [Macie] ----notify----> [EventBridge]---> integrations

No cost mentioned.

#### END QUESTION

#### QUESTION X

Which is recommended Parameter Store or Secrets Manager - why?

#### ANSWER X

SM is newer and can force rotation

#### END QUESTION

#### QUESTION X

How to implement multi-region secret

#### ANSWER X

When you create the secrets there is an option to make it multi-region (I guess)

#### END QUESTION

#### QUESTION X

Secrets are region or global (explain) ? (kinda of a trick)

#### ANSWER X

Secrets are Regional with an option to create multi-region secrets

#### END QUESTION

#### QUESTION X

What are some advantages of multi-region secrets?

#### ANSWER X

Why is this good?

- Ability to promote a read replica Secret to a standalone secret
- Multi Region Apps
- Disaster Recovery
- Multi region RDS, replica can use same secrets

#### END QUESTION

#### QUESTION X

What are the 5 services that support WAF?

#### ANSWER X

- Deployed on:
  - Application Load Balancer
  - API Gateway
  - CloudFront
  - AppSync - GraphQL - API
  - Cognito User Pool

#### END QUESTION

#### QUESTION X

What is the big restriction/limitation with WAF?

#### ANSWER X

Only supports Layer7 (http) hence only deals with http requests

#### END QUESTION

#### QUESTION X

What is WAF Rule Group

#### ANSWER X

Just a collection of rules that can be re-used. Rule template, I assume.

#### END QUESTION

#### QUESTION X

What are the common attacks WAF can help prevent

#### ANSWER X

- IP Set: up to 10,000 IP addresses - use multiple rules for IPs
- HTTP headers, HTTP body, or URL strings protects from common attack, SQL Injection, Cross-site scripting (XSS)
- Size constraints
- Geo-match (block country)
- Rate-base rules (to count occurrences of events) - DDoS protection

#### END QUESTION

#### QUESTION X

Describe WAF briefly

#### ANSWER X

- Protect your app from common web exploits (**LAYER 7, HTTP**)
- Layer 7 is HTTP (vs Layer 4, TCP/UDP)

- Deployed on:
  - Application Load Balancer
  - API Gateway
  - CloudFront
  - AppSync - GraphQL - API
  - Cognito User Pool

**EXAM** He said the exam will be tricky. That it may ask about deploying network load balancer(NLB). From what I recall NLB support both Layer 7 and Layer 4, but may not support WAF. Also, make sure to the 5 services.

#### WAF ACL (0:54)

- Define Web ACL Rules:

  - IP Set: up to 10,000 IP addresses - use multiple rules for IPs
  - HTTP headers, HTTP body, or URL strings protects from common attack, SQL Injection, Cross-site scripting (XSS)
  - Size constraints
  - Geo-match (block country)
  - Rate-base rules (to count occurrences of events) - DDoS protection

- Web ACL are Regional except CloudFront
- A rule group is a **reusable set of rules**

#### Fixed IP using WAF with Load Balancer (2:08)

- WAF does not support the NLB (layer 4)
- We can use **Global Accelerator** for fixed IP and WAF on the ALB

Diagram
[end-users] -> [Global Accelerator] <--->[VPC, ALB <-> EC2]
The point is that the GA sits in front of the ALB and makes requests directly to the ALB on behalf of the end-user. The ALB calls WAF/ACL then processes request.

#### END QUESTION

#### QUESTION X

Briefly describe AWS Shield

#### ANSWER X

- DDoS Distributed Denial of Service - many requests at the same time.

- **AWS Shield Standard**:
  - Free service that is activated for every AWS customer
  - Provides protection from attacks such as SYN/UDP floods, Reflection attacks and other **Layer 3/Layer 4** attacks
- AWS Shield **Advanced**:
  - Optional DDoS mitigation service ($3,000 per month per organization)
  - Protects against more sophisticated attack on EC2, ELB, CloudFront, Global Accelerator, Route 53
  - 24/7 access to AWS DDoS response (DRP)
  - Protects against **higher fees during usage spikes** due to DDoS (**closest thing to insurance for DDoS**)
  - Shield Advanced automatic application DDoS mitigation automatically creates, evaluates and deploys AWS WAF rules to mitigate layer 7 attacks

This section really seem more about promoting the $3000/month service than anything else.

#### END QUESTION

#### QUESTION X

Discuss briefly how we use IGW and NAT Gateway to allow access to the internet while proventing access FROM the internet to private subnets

#### ANSWER X

> A public subnet will have a **Route** to the internet gateway

- Internet Gateways help our VPC instances connect with the internet
- Public subnets have a route to the internet gateway

- NAT Gateways (AWS-Managed) & NAT Instances (self managed) allow your instances in your **Private Subnets** to access the internet while remain private (one way communication initiation)

The Internet Gateway sits in the entire VPC, Subnets within IGW. The Nat Gateway sits in the public Subnet, and provides access to the private subnet

![Alt text](https://www.cloudzero.com/wp-content/uploads/2024/08/nat-gateway-diagram.webp "width:250")

#### END QUESTION

#### QUESTION X

A brief discussion of NACL vs Security group

#### ANSWER X

- Network Access Control List (NACL, Network ACL)

  - A firewall which controls traffic from and to **subnet**
  - Can have **ALLOW** and **DENY** rules
  - Rules only include IP Addresses ( I think because level 4)

- Security Groups
  - A Firewall that controls traffic to and from an ENI / an EC2 Instances
  - Can have **only ALLOW** rules
  - Rules include **IP and other Security Groups** (huge)

ENI - Elastic Network Interface
Default NACL allows everything in and out. Hence, we don't interact with it too much but it can be an extra level of security.

**EXAM** Before traffic gets to EC2 (ENI), it has to go through NACL

#### END QUESTION

#### QUESTION X

A brief discussion about VPC Flow Logs (3)

#### ANSWER X

- Capture information about IP traffic going into your interfaces:
  - VPC Flow Logs
  - Subnet Flow Logs
  - Elastic Network Interface (ENI/EC2 Instances)
- Helps to monitor & troubleshoot connectivity issues. Example:

  - subnet2subnet
  - subnet2internet
  - internet2subnet

- Captures network information from AWS Manged interfaces too: Elastic Load Balancers, ElasticCache, RDS, Aurora, etc

- VPC Flow Logs data can go to S3, CloudWatch Logs, and Kineses Data Firehose
  **EXAM** How to troubleshoot connectivity issue to/from Security Group or ENI/EC2, from/to internet and from/to AWS Services (or some)

#### END QUESTION

#### QUESTION X

Where can we send flow logs (3)?

#### ANSWER X

S3, CloudWatch Logs, and Kineses Data Firehose

#### END QUESTION

#### QUESTION X

If we are expreiencing connectivity issues, what is one of the first places to check?

#### ANSWER X

VPC Flow Logs

#### END QUESTION

#### QUESTION X

What can VPC Flow Logs help troubleshoot

#### ANSWER X

- Helps to monitor & troubleshoot connectivity issues. Example:

  - subnet2subnet
  - subnet2internet
  - internet2subnet

- Captures network information from AWS Manged interfaces too: Elastic Load Balancers, ElasticCache, RDS, Aurora, etc

#### END QUESTION

#### QUESTION X

What is the VPC Cheat Sheet, (11 items)?
This isn't very important but you should know what all the the things are.

#### ANSWER X

- VPC - virtual private cloud (we always use default therefore never see it)
- Subnets - tied to AZ, network partition of the VPC
- Internet Gateway: at the VPC level, provide internet access
- NAT Gateway / Instances: give internet access to private subnets
- NACL Stateless, subnet rules for inbound and outbout
- Security Groups: stateful, operate at the EC2 instance level or ENI
- VPC Peering: Connect two VPC, no IP overlap
- VPC Endpoints: Provides Private Access to AWS services within VPC
- VPC Flow Logs: Network traffic Logs
- Site to Site VPN
- Direct Connect: direct private connection to AWS

#### END QUESTION

#### QUESTION X

Discuss briefly PrivateLink
( You just need the very basics, use case)

#### ANSWER X

- VPC Peering doesn't scale
- PrivateLink the most secure and scalable way to expose a service to 1000s of VPCs
- Does not require VPC Peering, internet gateway, NET, route tables

Suppose there is a vendor using AWS and they want to provide services to other AWS clients. They want to allow direct access to the VPC. They need to be able to allow 1000's of connections.

PrivateLink is **Their Network Load Balancer connected to your Elastic Network Interface**

#### END QUESTION

---
