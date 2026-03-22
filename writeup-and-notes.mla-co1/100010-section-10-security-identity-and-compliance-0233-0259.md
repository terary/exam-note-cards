# Section 10: Security, Identity, and Compliance

### ⭐0233 - Intro (0:29)

> Says Security will be on exam. We'll talk about security best practices, SM security concerns, and AWS Security services

### ⭐0234 Principle of Least Privilege (2:07)

**EXAM** Grant only the permissions required to perform a task

- Grant only the permissions required to perform a task
- During development, it may make sense to use broader/looser security
- Should lock-down once you have an better idea of the exact services and operations a workload requires
- can use the **IAM Access Analyzer** to generate least privilege policies based on access activity, based on past activity. Hint, you can 'monitor' recent dev activity to know what you need to grant

### ⭐0235 Data Masking and Anonymization (2:32)

> **Exam** will expect you to know about it

- Dealing with PII or other sensitive data
- **masking** obfuscates data
  - for example masking all but the last 4 digits of a credit card or social security number
  - Masking passwords
  - Support in **Glue DataBrew** and **redshift**

Example redshift policy:
`CREATE MASKING POLICY mask_credit_card_full WITH (credit_card VARCHAR(256) USING('0000000000000'::TEXT))` **Not likely to be on exam**

#### Anonymization techniques (1:24)

- Anonymization techniques
  - Replace with random
  - Shuffle
  - Encrypt (deterministic or probabilistic)
  - Hashing

> Instead of 'masking' can replace it so it is different the actual source

- Or just delete it or don't import it.

### ⭐0236 Sagemaker Security: Encryption at Rest and in Transit (4:31)

> **EXAM** Is expected to have SM security questions

#### General AWS Security

- use identity and Access Management (IAM)
  - setup user accounts with only the permissions they need
- Use MFA
- Use SSL/TLS when connecting to anything
- Use CloudTrail to log API and user activity
- Use Encrypting
- Be careful with PII and other sensitive data (rest and transit)

**EXAM** Know the difference/purpose of CloudTrail vs CloudWatch (CloudTrail is for auditing trail of activity log of what every one did, CloudWatch - Watching Log data raising alarms/monitors when something is wrong)

#### Protecting your data **at Rest** with SageMaker (2:21)

- AWS Key Management (KMS)
  - Accepted by notebooks and all SageMaker jobs
    - Training, parameter tuning, batch transform, endpoints
    - **Notebooks and everything under `/opt/ml` and `/tmp` can be encrypted with KMS**
  - S3
    - Can use encrypted S3 buckets for training data and hosting models
    - S3 Can also use KMS
    - Use standard S3 encryption

**tmc** I think the take-away is, use standard S3 and have KMS key available for training data, parameter tuning etc

#### Protecting your data **in transit** with SageMaker (3:26)

- All traffic support TLS/SSL
- IAM roles are assigned to SageMaker to give permissions to access resources
- Inter-node training communication may be **optionally** encrypted
  - Can increase training time and cost with deep learning
  - AKA inter-container traffic encryption
  - Enable via console or API when setting up training/tuning job
  - **THIS IS LIKELY UNNECESSARY UNLESS FOR SPECIAL COMPLIANCE OR CONTRACTUAL REQUIREMENTS** This will have a sizable cost impact when dealing with several nodes - use only if necessary, rely more on VPC `inter container traffic encryption`

> IAM Policy should implement 'principle of least privilege'

### ⭐0237 SM Security: VPC, IAM, Logging, Monitoring (4:02)

#### SM + VPC

- Training jobs run in a VPC
- You can use Private VPC for more security
  - You'll need to set-up S3 VPC endpoints
  - Custom endpoint policies and S3 bucket policies cna keep this secure
- Notebook are internet-enabled by default (notebook can access internet- hole if you do not know the source of the notebook)
  - this can be a security hole
  - **if disabled, your VPC needs an interface endpoint (PrivateLink) or NAT Gateway, and allow outbound connects, for training and hosting your work**
- Training and Inference Containers are also internet-enabled by default
  - Network isolation is an option, but this also prevents S3 access

`PrivateLink` - the new VPC-to-VPC ( I forget what that was called before)

> You can use S3 policies to make it secure.

**TMC** I think SM will require access to S3 and allow inbound http if using notebook-- I think
**TMC** I think we're trying to say, you need to be mindful about accessing notebooks. This require in-bound http connection (I think, to view SM console/notebook?)
**TMC** Never heard of Private VPC? Virtual Private Cloud, Private Virtual Private Cloud?

#### SM + IAM (2:09)

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

> Using IAM you can lock-down expensive functionality so that the user can do some stuff, but not expensive stuff.

#### SM Logging and Monitoring (3:02)

- CloudWatch can log, monitor and alarm on:
  - INvocations and latency of endpoints
  - Health of instance nodes (CPU, memory, et)
  - **Ground Truth** (active workers, how much they are doing, can monitory performance of humans doing work, label tasks, confirm bad inference (probably))
- CloudTrail records actions from users, roles, and services
  - Log files are delivered to S3 for auditing

### ⭐0238 IAM Introduction Users, Groups, Policies (3:22)

- IAM = Identity and Access Management **GLOBAL SERVICE**
- Root Account created by default should never be used or shared
- Users are people within your organization and can be grouped
- **GROUPS ONLY CONTAIN USERS** and can not contain other groups?
- Not necessary to user belongs zero or more groups (zero group not best practice)

#### Permissions (2:06)

- users or Groups can be assigned a JSON documents call `policies`
- These policies define "permissions" of the users
- In AWS you apply the "least privilege principle"

Example Policy File

```
{
    "Version": '2012-10-17"
    "Statement": [
        "Effect": "Allow"
        "Action": "API endpoint / function or other" (S3:*)
        "Resource": "thing to act upon" "bucket-name"
    ]
}
```

### ⭐0239 IAM Users and Groups **Hands On** (6:22)

Nothing special - you've crated 100's of user - nothing new

He shows how to use 'private' window to create multiple "sessions" (different login). However, there was a notice in the video explaining there is a newer/better way.

### ⭐0240 Console - Simultaneous Sign-in (1:48)

- "Multi Session Support" - is an option under the menu option (top-right) with other user specific options

- This allows you to log-in using different **ACCOUNT** (not necessarily user)

### ⭐0241 IAM Policies Inheritance (2:50)

`Inline Policy` (IAM)

Example Policy

```
{
    "Version": '2012-10-17"
    "Statement": [
        "Effect": "Allow"
        "Principal": ""
        "Action": "API endpoint / function or other" (S3:*)
        "Resource": "thing to act upon" "bucket-name"
    ]
}
```

\* note that I thought 'resource' and 'principal' were mutually exclusive but the slide shows it can have both properties (not either or)

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

**EXAM** Said we should be comfortable with policies - which Iam

### ⭐0242 IAM Policies **HANDS ON** (8:01)

- Shows the use of removing user from group (loss of privilege)
- adding permission back to user
- demonstrate failed permission
- demonstrate inherit permission from group
- demos policy file
- create own policy
- tear-down

### ⭐0243 IAM MFA (4:10)

#### IAM - password policy

Two defense mechanism

- password policy
  - Minimum length
  - require
    - upper/lower case
    - number
    - non alpha-numeric
  - Allow all IAM users to change their own password
  - Require pw expire
  - no pw re-use
    > Good for protection against brute strength

#### Multi-Factor Auth - MFA (1:11)

- Users can access and changes resources within your account
- **YOU WANT AT A MINIMUM ROOT USER MFA ENABLED**

- MFA = password you know + device you own

Makes a example.

> **EXAM** If user looses password, account does not become compromised because the device is necessary.. This allows opportunity to change password and does not require EVERYBODY to change password **MAIN BENEFIT**

**EXAM** Device options, devices you can use

- Virtual MFA (Authy/google authenticator)
- Universal 2nd Factor (U2F) security key (physical device)
- Hardware Key Fob MFA Device (fancy hardware)
- Hardware Key Fob **GOVERNMENT** AwsGovCloud

### ⭐0244 IAM - MFA, Hands On (4:01)

> There is a dialog/walk-through to setup MFA, its the same as all the others. Scan code, enter codes, click button, blah blah blah

### ⭐0245 IAM Roles for Services (1:39) "Service Roles"

- Services will also get IAM roles.
- To do so, we will assign permission to AWS service with IAM Roles
- Common Roles:

  - EC2 Instance Roles
  - Lambda Function roles
  - Roles for CloudFormation

  ### ⭐0246 IAM Roles for Services "Service Roles" (2:05) - Hands On

  - AWS Provides standard roles
  - Can make custom roles.

  We are focusing on creating a role for "AWS service"

  1. create role
  2. attach policy to role

### ⭐0247 Encryption 101

- Encryption in-flight, uses TLS/SSL. TSL/SSL means data is encrypted, put on the wire and decrypted when received, the wire is encrypted
- In-flight encryption prevents Man In The Middle (MITM) attacks

#### Client Side Encryption (3:04)

- Client is encrypted by the client and never decrypted by the server
- In cases we are working with untrusted servers, client should encrypt and decrypt client side and the server can never decrypt (this could be known as 'envelope encryption')

Three Mechanism for Encryption in the cloud

- Inflight - SSL/TSL
- At rest ( I guess)
- Envelope (client stores encrypted files on untrusted server)

I think this is the pre-cursor for the argument for KMS encryption

### ⭐0248 AWS KMS (Key Management Service) (7:04)

- Anytime you hear "encryption" probably related with KMS
- AWS manages encryption keys for us
- Fully integrated with IAM for authorization
- Easy way to control access to your data
- Able to audit KMS key usage using CloudTrail **EXAM**
- Seamlessly integrated into most AWS services (EBS, S3, RDS, SSM, etc)
- **Never ever store your secrets in plain text especially in your code**
  - KMS Key encryption also available through API calls (SDK, CLI)
  - Encrypted secrets can be stored in the code / environment variables

#### KMS Keys Types

- KMS Keys in the new name of KMS Customer Master Key (who cares)
- Two types:
  - Symmetric (AES-256 Keys)
    - Single encryption key is used to Encrypt and Decrypt (**THIS IS NOT SAME AS PUBLIC ENCRYPTION**)
    - AWS Services that are integrated with KMS use Symmetric CMKs
    - You never get access to the KMS Key unencrypted (**must call KMS to use**)
  - Asymmetric (RSA & ECC Key pairs)
    - Public (encrypt) and Private Key (Decrypt) pair
    - Used for De/Encrypt or sign/verify operations
    - **The public key is downloadable, but you can't access the private key unencrypted**
    - **use cases: encryption outside of AWS by user who can't call KMS API**

#### AMS KMS (Key Management Service) (3:10)

- Types of KMS Keys

  - AWS Owned Key (**free**): `SSE-S3`, `SSE-SQS`, `SSE-DDB` (default key)
  - AWS Managed Key (**free**): aws/service name, aws/rds (I have not seen this in use)
  - Customer managed key **created** in KMS, **$1/month**
  - Customer managed key **imported** in KMS, **$1/month**

- Additionally, pay for API call to KMS ($.03/1000 calls) **EXAM** for each key type?

- Automatic Key Rotation
- AWS Managed Keys are rotated once a year
- Customer Managed Keys (must be enabled) automatic and on-demand
- Imported KMS key: only manual rotation possible using alias

#### Copying across region (4:51)

- The same KMS key can not live in two regions
- For copying snapshots, we need to encrypt at source, copy snap shot ONLY to other region (AWS should re-encrypt, using new key).

It is not clear to me how AWS knows when/how/which new KMS key to use? I imagine during the copy process, we must specify which new key to use? or which key within the region?

#### KMS Key Policies (5:46)

- Control Access to KMS keys "similar" to S3 bucket policy (I guess they mean policy file)
- Difference: YOU CAN NOT CONTROL ACCESS WITHOUT THEM, I think what he is saying is that there MUST be an access policy, without out there is no access, however. that is in-line with S3 or any IAM resource policy - not sure the big deal

- Default KMS Key Policy
  - Create if you don't provide a specific KMS Key Policy
  - Complete access to the key to the root user = entire AWS account (He is say anybody in the account can use the key, if using the default policy)
- Custom KMS Key Policy
  - Define users, roles, that can access the KMS key
  - Define who can administer the key
  - Useful for cross-account access of your KMS key

If you are copying snapshots across accounts

1. Create a snapshot, encrypted with your own KMS key (customer managed Key)
2. Attached a KMS key Policy to authorized cross-account access
3. Share the encrypted snapshot
4. (in target) Create a copy of the snapshot, encrypt it with a CMK in your account
5. Create a volume form the snapshot

### ⭐0249 AWS KMS **Hands On** (9:31)

We see the `aws/service` (example; `aws/s3`) - That is under the Key Management console, "AWS Managed Keys"

- The security policy for AWS managed keys have two conditions

```json
"Conditions": {
    "StringEquals": {
      "kms:CallerAccount": "12345"
      "kms:ViaService": "servicename - ec2.eu-west1-amazonaws.com"
    }
}
```

Needs: `kms:ViaService` and `kms:CallerAccount`

They go own to say you can have 'multi-region' keys?(0249/2:44)

- You can use the CLI to de/encrypt files locally - which is interesting but not important

### ⭐0250 Amazon Macie (1:03)

- Amazon Macie is a fully managed data security and data privacy service that uses machine learning and pattern matching to discover and protect your sensitive data in AWS.

- Macie helps identify and alert you to sensitive data, such as PII

[S3 Bucket] ---analyze---> [Macie] ----notify----> [EventBridge]---> integrations

No cost mentioned.

### ⭐0251 AWS Secrets Manager (2:10)

**newer** than **parameter Store**

- newer service, meant for storing secret
- Capability to force rotation of secrets every X day
- Automate generation of secrets on rotation (uses/requires a Lambda function)
- Integration with AMAZON RDS
- Secrets can be encrypted using KMS

**EXAM** Mostly meant for RDS/Aurora integration. When we see 'secrets' on the exam, we are probably talking about Secrets Manager

#### Multi Region Secrets

- Replicate Secrets across multiple AWS Regions
- SM keeps read replica in sync with the primary secret

Why is this good?

- Ability to promote a read replica Secret to a standalone secret
- Multi Region Apps
- Disaster Recovery
- Multi region RDS, replica can use same secrets

### ⭐0252 Secrets **Hands On** (4:00)

There are several options for secret creation

- RDS Database
- DocumentDB
- etc
- Other type of secret

The thing to note, with the known services, it appears to know what the secrets should be (username, password, etc). The 'other type' allows/requires you add key/value (as expected)\

### ⭐0253 WAF (3:01)

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

### ⭐0254 AWS Shield (2:04)

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

### ⭐0255 VPC, Subnets, Internet Gateway, NAT Gateway (5:23)

- VPC Virtual Private Cloud (Area: Regional)
- Subnets allow you to Partition your network inside your VPC (Area: Availability Zone) - subnet sits inside AZ
- Public Subnet can access and be access from the world
- Private Subnet not accessible from internet
- To define access to the internet between subnets, we use **Route Tables** (this is new to me)

CIDR Range - allowed IP within the vpc

#### Internet Gateway and NAT Gateways (2:55)

> A public subnet will have a **Route** to the internet gateway

- Internet Gateways help our VPC instances connect with the internet
- Public subnets have a route to the internet gateway

- NAT Gateways (AWS-Managed) & NAT Instances (self managed) allow your instances in your **Private Subnets** to access the internet while remain private (one way communication initiation)

The Internet Gateway sits in the entire VPC, Subnets within IGW. The Nat Gateway sits in the public Subnet, and provides access to the private subnet

![Alt text](https://www.cloudzero.com/wp-content/uploads/2024/08/nat-gateway-diagram.webp "width:250")

### ⭐0256 NACLs, Security Groups, VPC Flow Logs (4:39)

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

#### VPC Flow Logs

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

### ⭐0257 VPC Peering, Endpoints, VPN, Direct Connect (5:00)

#### VPC Peering

> Want to connect two VPC as though they are one network (region to region as example) - this is call 'Peering'

- Connect two VPC, privately using AWS's network
- Make them behave as if they were the same network
- **Must not have overlapping CIDR (IP address ranges)**
- VPC peering connection is **not transitive** (must be established for each VPC that needs to communicate with one another) - A <-> B, B<-> C, A IS NOT inherently connected to C. It must be A<->C, A <-> B, B<->C

#### VPC Endpoint (1:50)

**EXAM** Said it was very important

-

> AWS Services are public. When we use the services we are going through public (www) network. This because significant when your EC2 instances are in a private network with no access to the public

- Endpoints allow you to connect to AWS services using private network instead of the public www network
- This gives enhanced security and lower latency to access AWS services

- VPC **endpoint Gateway**: S3 & DynamoDB
- VPC **endpoint interface**: most other services (including S3 and DynamoDB)

**EXAM** Exam not likely to ask the differences but rather "if you need to connect two VPC privately..."

#### Site to Site VPN & Direct Connect

- site to site VPN

  - Connect an on-premiseVPN to AWS
  - The connect ion automatically encrypted
  - Goes over the public internet

- Direct Connect (DX)
  - Establishes physical connection between on-premise and AWS
  - The connection is private, secure and fast
  - goes over a private network
  - Takes at least a month to establish

### ⭐0258 VPC Cheat Sheet and Closing Comments (3:00)

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

### ⭐0259 PrivateLink (3:00)

- VPC Peering doesn't scale
- PrivateLink the most secure and scalable way to expose a service to 1000s of VPCs
- Does not require VPC Peering, internet gateway, NET, route tables

Suppose there is a vendor using AWS and they want to provide services to other AWS clients. They want to allow direct access to the VPC. They need to be able to allow 1000's of connections.

PrivateLink is **Their Network Load Balancer connected to your Elastic Network Interface**
