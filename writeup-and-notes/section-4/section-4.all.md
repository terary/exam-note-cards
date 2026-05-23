# Section 4: Security - CloudTrail

**Topic:** 15. CloudTrail  
**Duration:** 6min  
**Section:** 4

## Notes

### AWS CloudTrail

- Provides governance, compliance and audit for your AWS Account
- CloudTrail is enabled by default!
- Get an history of events / API calls made within your AWS Account by:
  - Console
  - SDK
  - CLI
- AWS Services
- Can put logs from CloudTrail into CloudWatch Logs or S3
- **A trail can be applied to All Regions (default) or a single Region**.
- If a resource is deleted in AWS, investigate CloudTrail first!

> Used to see who did what, when.

**QUESTION**
CloudTrail - regional or global? What do I need to do to have per-region trail if for example I had different compliance standards (EU vs Au vs US)
**ANSWER**

**TODO** I don't know how to do this.
**QUESTION_END**

### CloudTrail Diagram (1:26)

![Cloud Trail](https://cloudviz.io/assets/12-best-practices-for-using-aws-cloudtrail/main-image.png "Cloud Trail")

### CloudTrail Events (1:38)

- Management Events:
  - Operations that are performed on resources in your AWS account
  - Examples:
    - Configuring security (IAM AttachRolePolicy)
    - Configuring rules for routing data (Amazon EC2 CreateSubnet)
    - Setting up logging (AWS CloudTrail CreateTrail)
  - By default, trails are configured to log management events.
  - Can separate Read Events (that don’t modify resources) from Write Events (that may modify resources)
- Data Events:
  - By default, data events are not logged (because high volume operations)
  - Amazon S3 object-level activity (ex: GetObject, DeleteObject, PutObject): can separate Read and Write Events
  - AWS Lambda function execution activity (the Invoke API)
- CloudTrail Insights Events:
  - See next slide :)

**QUESTION**
What are the three types of CloudTrail Events?
Brief description of each.
**ANSWER**

- Management Events:
  - Operations that are performed on resources in your AWS account
  - Examples:
    - Configuring security (IAM AttachRolePolicy)
    - Configuring rules for routing data (Amazon EC2 CreateSubnet)
    - Setting up logging (AWS CloudTrail CreateTrail)
  - By default, trails are configured to log management events.
  - Can separate **Read Events** (that don’t modify resources) from **Write Events** (that may modify resources)
- Data Events:
  - By default, data events are not logged (**because high volume operations**)
  - Amazon S3 object-level activity (ex: GetObject, DeleteObject, PutObject): can separate Read and Write Events
  - AWS Lambda function execution activity (the Invoke API)
- CloudTrail Insights Events:
  - See next slide :)

**QUESTION_END**

### CloudTrail Insights

- Enable CloudTrail Insights to **detect unusual activity** in your account:
  - inaccurate resource provisioning
  - hitting service limits
  - Bursts of AWS IAM actions
  - Gaps in periodic maintenance activity
- **CloudTrail Insights analyzes normal management events to create a baseline**
- And then **continuously analyzes write events to detect unusual patterns**
  - Anomalies appear in the CloudTrail console
  - Event is sent to Amazon S3
  - An EventBridge event is generated (for automation needs)

![CloudTrail with insights](https://softprom.com/sites/default/files/2020/CloudTrail%20Insights.jpg "CloudTrail with insights")

> **Notice this sends event to EventBridge**

**QUESTION**
What CloudTrail related services sends events to EventBridge
**ANSWER**
CloudTrail Insights
**QUESTION_END**

### CloudTrail Events Retention (4:49)

- Events are stored for 90 days in CloudTrail
- To keep events beyond this period, log them to S3 and use Athena

**QUESTION**
What is the retention period of CloudTrail events? What to do if you need them longer?
**ANSWER**

- Events are stored for 90 days in CloudTrail
- To keep events beyond this period, log them to S3 and use Athena

**QUESTION_END**

**TODO** Use Athena to look at CloudTrail events in S3

### Study notes

CloudWatch = operational monitoring, not governance

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - CloudTrail - EventBridge Integration

**Topic:** 16. CloudTrail - EventBridge Integration  
**Duration:** 2min  
**Section:** 4

## Notes

### Amazon EventBridge – Intercept API Calls

![Event Bridge](https://velog.velcdn.com/images/pingu_9/post/41adfa68-2ffd-4c19-bae6-d287730e0525/image.png "Event Bridge")

The point is that you can configure (something EventBridge or CloudTrail) to send events to SNS to page/ping somebody for specific activity (DeleteTable api call as example)

**TMC** I am not sure if all CloudTrail events go to EventBridge or only those with CloudTrail Insights - this slide suggest all go to EvtBridge

**QUESTION**
Using CloudTrail, how do we notify someone of sensitive API calls (DeleteTable as example)?
**ANSWER**

Events go to CloudTrail, then can also go to EventBridge and from there SNS.

**QUESTION_END**

We can send SNS messages for any API activity, `AssumeRole`, `AuthorizeSecurityGroupIngress`

# --

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - CloudTrail - SA Pro

**Topic:** 17. CloudTrail - SA Pro  
**Duration:** 7min  
**Section:** 4

## Notes

### CloudTrail – Solution Architecture: Delivery to S3

S3 Enhancements:

- Enable Versioning
- MFA Delete Protection
- S3 Lifecycle Policy (S3 IA, Glacier…)
- S3 Object Lock
- SSE-S3 or SSE-KMS encryption
- Feature to perform CloudTrail Log File Integrity validation (SHA-256 for hashing and signing)

![CloudTrail Flow](https://images.viblo.asia/e4a82481-81aa-4c3a-a32d-f990cd845a4a.png "CloudTrail Flow")

**TODO** Do this, all, try with cloudformation

**QUESTION**
Two paths to send message from CloudTrail. What are they what are the pros/cons.
**ANSWER**

1. You can harvest events from the fact that CloudTrail dumps to S3 and that launches an S3 Event

2. CloudTrail can send events directly so you can respond directly

Pros/Cons

- S3 Event is generic and probably slow

**QUESTION_END**
**QUESTION**
What is S3 Object Lock?
**ANSWER**
Out of scope of the current subject but he said Object Lock prevents objects from ever being deleted or modified.

**QUESTION_END**

So utilizing CloudTrail plus other services. CloudTrail can write events to S3, S3 can make sure the file is never deleted or modified, also it can verify integrity of the file (double "file not modified" verification).

### CloudTrail - Solution Architecture: Multi Account, Multi Region Logging (2:28)

[missing graphic]
Observations:

- The S3 bucket policy is necessary for cross-account delivery
- If Account A wants to access its CloudTrail files:
  - Option 1: create a cross-account role and assume the role
  - Option 2: edit the bucket policy

> The point is that there is more than one way to skin a cat when it comes to implementing the security policy (option 1 or 2)

### CloudTrail - Solution Architecture: Alert for API calls (3:45)

![Alert for API calls](https://i.sstatic.net/OWhYt.jpg "Alert for API calls")

- Log filter metrics can be used to detect a high level of API happening
- Ex: Count occurrences of EC2 TerminateInstances API
- Ex: Count of API calls per user
- Ex: Detect high level of Denied API calls

**TODO** Set-up alert for an activity using CT, CT-Logs, cw alarm, sns

### CloudTrail – Solution Architecture: Organizational Trail (5:09)

**Exam**

- Organization Trail is created in the parent/main account - not children accounts
- The logging will take effect for ALL children account (probably parent as well)

### CloudTrail: How to react to events the fastest?

**Overall, CloudTrail may take up to 15 minutes to deliver events**

- EventBridge:
  - Can be triggered for any API call in CloudTrail
  - **The fastest, most reactive way**
- CloudTrail Delivery in CloudWatch Logs:
  - Events are streamed
  - Can perform a metric filter to **analyze occurrences and detect anomalies**
- CloudTrail Delivery in S3:
  - Events are delivered every 5 minutes
  - Possibility of analyzing logs integrity, deliver cross account, long-term storage

**QUESTION**
What are the 3 ways that CloudWatch can deliver events?
What to use if you need to know the number of x in a given hour?
What to use if you want the fastest reaction time?
**ANSWER**

- EventBridge:
  - Can be triggered for any API call in CloudTrail
  - **The fastest, most reactive way**
- CloudTrail Delivery in CloudWatch Logs:
  - Events are streamed
  - Can perform a metric filter to **analyze occurrences and detect anomalies**
- CloudTrail Delivery in S3:
  - Events are delivered every 5 minutes
  - Possibility of analyzing logs integrity, deliver cross account, long-term storage

**QUESTION_END**

# --

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - KMS

**Topic:** 18. KMS  
**Duration:** 8min  
**Section:** 4

## Notes

### AWS KMS (Key Management Service)

- Anytime you hear “encryption” for an AWS service, it’s most likely KMS
- Easy way to control access to your data, AWS manages keys for us
- Fully integrated with IAM for authorization
- Seamlessly integrated into:
  - Amazon EBS: encrypt volumes
  - Amazon S3: Server-side encryption of objects
  - Amazon Redshift: encryption of data
  - Amazon RDS: encryption of data
  - Amazon SSM: Parameter store
  - Etc…
- KMS Keys are regional, and can only used in the region they’re created in

**QUESTION**
What are the region limitations for KMS keys?
**ANSWER**
Keys are regional, can only be used in the region they were created in.
**QUESTION_END**

### KMS – KMS Key (Symmetry) Types (0:45)

- Symmetric (AES-256 keys)
  - First offering of KMS, single encryption key that is used to Encrypt and Decrypt
  - **AWS services that are integrated with KMS use Symmetric KMS keys**
  - Necessary for envelope encryption
  - You never get access to the KMS key unencrypted (must call KMS API to use)
- Asymmetric (RSA & ECC key pairs)
  - Public (Encrypt) and Private Key (Decrypt) pair
  - Used for Encrypt/Decrypt, or Sign/Verify operations
  - The public key is downloadable, but you can’t access the Private Key unencrypted
  - Use case: encryption outside of AWS by users who can’t call the KMS API

**QUESTION**
Regarding KMS keys, which does most (all) AWS services use? Asymmetric or Symmetric encryption?
**ANSWER**

- **AWS services that are integrated with KMS use Symmetric KMS keys**

**QUESTION_END**

### Types of KMS Keys

- Customer Managed Keys
  - Create, manage and use, can enable or disable
  - Possibility of rotation policy (new key generated every year, old key preserved)
  - Can add a Key Policy (resource policy) & audit in CloudTrail
  - Leverage for envelope encryption
- AWS Managed Keys
  - Used by AWS service (aws/s3, aws/ebs, aws/redshift)
  - Managed by AWS (automatically rotated every 1 year)
  - View Key Policy & audit in CloudTrail
- AWS Owned Keys
  - Created and managed by AWS, use by some AWS services to protect your resources
  - Used in multiple AWS accounts, but they are not in your AWS account
  - You can’t view, use, track, or audit

### KMS Key Material Origin

- Identifies the source of the key material in the KMS key
- Can’t be changed after creation
- KMS (AWS_KMS) – default
  - AWS KMS creates and manages the key material in its own key store
- External (EXTERNAL)
  - You import the key material into the KMS key
  - You’re responsible for securing and managing this key material outside of AWS
- Custom Key Store (AWS_CLOUDHSM)
  - AWS KMS creates the key material in a custom key store (CloudHSM Cluster)

> I am not sure what he means by "key material"

### KMS Key Source – Custom Key Store (CloudHSM) (4:47)

[missing graphic]

- Integrate KMS with CloudHSM cluster as a Custom Key Store
- Key materials are stored in a CloudHSM cluster that you own and manage
- The cryptographic operations are performed in the HSMs
- Use cases:
  - You need direct control over the HSMs
  - KMS keys needs to be stored in a dedicated HSMs

### KMS Key Source - External

[missing graphic]

- Import your own key material into KMS key, Bring Your Own Key (BYOK)
- You’re responsible for key material’s security, availability, and durability outside of AWS
- Supports both Symmetric and Asymmetric KMS keys
- Can’t be used with Custom Key Store (CloudHSM)
- Manually rotate your KMS key (Automatic & On-demand Key Rotation are NOT supported)

### KMS Multi-Region Keys (7:07)

![KMS Multi-Region Keys](https://docs.aws.amazon.com/images/kms/latest/developerguide/images/multi-region-keys.png "KMS Multi-Region Keys")

- A set of identical KMS keys in different AWS Regions that can be used
  interchangeably (~ same KMS key in multiple Regions)
- Encrypt in one Region and decrypt in other Regions (No need to re-encrypt
  or making cross-Region API calls)
- Multi-Region keys have the same key ID, key material, automatic rotation, …
- KMS Multi-Region are NOT global (Primary + Replicas)
- Each Multi-Region key is managed **independently**
- Only one primary key at a time, can promote replicas into their own primary
- Use cases: Disaster Recovery, Global Data Management (e.g., DynamoDB
  Global Tables), Active-Active Applications that span multiple Regions,
  Distributed Signing applications,

**QUESTION**
If KMS Keys are regional, how do we have Multi-Region keys?
**ANSWER**
It's possible to replicate the KMS key into other regions. These are replicas hence changes to the original changes the replica.

**QUESTION_END**

# --

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - Parameter Store

**Topic:** 19. Parameter Store  
**Duration:** 4min  
**Section:** 4

## Notes

### SSM Parameter Store

- Secure storage for configuration and secrets
- Optional Seamless Encryption using KMS
- Serverless, scalable, durable, easy SDK
- Version tracking of configurations / secrets
- Security through IAM
- **Notifications with Amazon EventBridge**
- Integration with CloudFormation

**QUESTION**
What are the benefits for Parameter Store (7)?
**ANSWER**

- Secure storage for configuration and secrets
- Optional Seamless Encryption using KMS
- Serverless, scalable, durable, easy SDK
- **Version tracking of configurations / secrets**
- Security through IAM
- **Notifications with Amazon EventBridge**
- Integration with CloudFormation

**QUESTION_END**

### SSM Parameter Store Hierarchy

- /my-department/
  - my-app/
    - dev/
      - db-url
      - db-password
    - prod/
      - db-url
      - db-password

- /other-department/

- /aws/reference/secretsmanager/secret_ID_in_Secrets_Manager

  > **Allows access from Parameter Store to Secrets Manager**

- /aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2 (public)
  > **public parameters (EC2-AMIs as example)**

### Standard and advanced parameter tiers

| Feature                                                         | Standard             | Advanced                               |
| --------------------------------------------------------------- | -------------------- | -------------------------------------- |
| Total number of parameters allowed (per AWS account and Region) | 10,000               | 100,000                                |
| Maximum size of a parameter value                               | 4 KB                 | 8 KB                                   |
| Parameter policies available                                    | No                   | Yes                                    |
| Cost                                                            | No additional charge | Charges apply                          |
| Storage pricing                                                 | Free                 | $0.05 per advanced parameter per month |

> **EXAM** Should probably be familiar with the quota/functionality differences

### Parameters Policies (for advanced parameters)

> "Advanced" Parameter store can be thought of as "Parameter Store" with "Policies"

**for advanced parameters ONLY**

- Allow to assign a TTL to a parameter (expiration date) to force updating or deleting sensitive data such as passwords
- Can assign multiple policies at a time

**TODO** Figure out how advanced parameter store sends notification to EventBridge

> Can have TTL policies but also policy to send notification to event bridge (about to expire)

**QUESTION**
Regarding Parameter Store. How do we get/send notification of a parameter is about to expire
**ANSWER**

However, its a feature of the "Advanced" parameter store and policies.

I am not sure of the steps but I think

1. Set-up TTL live policy
2. Set up notification for x days before TTL

Also, we can get notified of 'no change in x days'

> These are events sent to cloudwatch "Create notification policies to send notifications from CloudWatch Events. Notifications can be based on when this parameter expires, or if the parameter has not changed for a given period of time." From there I imaging you set-up filter/metric then alarm

**QUESTION_END**

# --

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - Secrets Manager

**Topic:** 20. Secrets Manager  
**Duration:** 6min  
**Section:** 4

## Notes

### AWS Secrets Manager

- Meant for storing secrets (e.g., passwords, API keys, …)
- Capability to force **rotation of secrets every X days**
  - Automate generation of secrets on rotation (uses Lambda)
  - Natively supports Amazon RDS (all supported DB engines), Redshift, DocumentDB
  - Support other databases and services ( **using custom Lambda function**)
- Control access to secrets using Resource-based Policy
- Integration with other AWS services to natively pull secrets from Secrets Manager: **CloudFormation, CodeBuild, ECS, EMR, Fargate, EKS, Parameter Store and more ...**

### Secrets Manager – with CloudFormation

[graphic not available]

**TODO** Build two cloudformation template - A) Create a secret manager secret and B) one to read secret manager secret

### Secrets Manager – Sharing Across Accounts

> Resource Access Manager (RAM) will not work here

To share across accounts we must set-up a IAM policy to allow it. The IAM policy should include a condition `kms:ViaService: secretsmanager.{region}.amazonaws.com` for action `kms:Decrypt`

There are two permission policy, 1. getSecretValue (which will be encrypted), and 2) access to the decrypt key (decrypt functionality).

**TODO** Maybe try to do this but it may be time consuming and not all that valuable.

- Secrets Manager ($$$):
  - Automatic rotation of secrets with AWS Lambda
  - Lambda function is provided for RDS, Redshift, DocumentDB
  - KMS encryption is mandatory
  - Can integration with CloudFormation
- SSM Parameter Store ($):
  - Simple API
  - No secret rotation (can enable rotation using Lambda triggered by EventBridge)
  - KMS encryption is optional
  - Can integration with CloudFormation
  - Can pull a Secrets Manager secret using the SSM Parameter Store API

**QUESTION**
Compare/Contrast Secrets Manager(4) to Parameter Store (5)
**ANSWER**

- Secrets Manager ($$$):
  - Automatic rotation of secrets with AWS Lambda
  - Lambda function is provided for RDS, Redshift, DocumentDB
  - KMS encryption is mandatory
  - Can integration with CloudFormation
- SSM Parameter Store ($):
  - Simple API
  - No secret rotation (can enable rotation using Lambda triggered by EventBridge)
  - **KMS encryption is optional**
  - Can integration with CloudFormation
  - Can pull a Secrets Manager secret using the SSM Parameter Store API

Secrets Manager does an RDS auto-rotate key. You can get the same behavior in Parameter Store, except you have to write the code, and set-up notification to invoke the code, etc. (This would be a question of cost, if SM is very expensive and the only useful functionality is rotation... but it is not its only useful functionality)

**QUESTION_END**

**QUESTION**
In very simple terms. What is the difference between Parameter Store, Parameter Store Advanced and Secrets Manager?
**ANSWER**
Parameter (as the name suggests) are for parameters. You can keep credentials in it but there are perhaps better alternatives. (config values)

Parameter Store Advanced - Parameter store with policies. The policies are focused on rotation/expiration of the parameter.

Secrets Manager - deals more with "secrets" and auto rotation. (credential values)

**QUESTION_END**

## ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - RDS Security

**Topic:** 21. RDS Security  
**Duration:** 1min  
**Section:** 4

## Notes

### RDS - Security

- KMS encryption at rest for underlying EBS volumes / snapshots
- Transparent Data Encryption (TDE) **for Oracle and SQL Server**
- IAM authentication **for MySQL, PostgreSQL and MariaDB**
- SSL encryption to RDS is possible for **all** DB (in-flight)
- **Authorization still happens within RDS (not in IAM)**
- Can copy an un-encrypted RDS snapshot into an encrypted one
- CloudTrail cannot be used to track queries made within RDS

**TODO** understand better about what IAM can/not do for the different databases. Oracle and MSSQL support TDE (which doesn't sound like user auth), but Mysql Psql, maria all have IAM but the other two do not?

OpenAI said:

```
1. IAM Database Authentication (login with IAM)

This lets you log into a DB without passwords, using IAM tokens.

Supported in Amazon RDS:

-Supported:

  - MySQL
  - PostgreSQL
  - MariaDB
  - Aurora MySQL
  - Aurora PostgreSQL

- Not supported:
  - Oracle
  - SQL Server

Why? Because IAM auth requires AWS to inject a temporary auth plugin into the DB engine — only some engines support it.
```

...

```
Final mental model
IAM DB auth = login control
TDE = encryption at rest
They are unrelated features

Your note decoded:

Oracle and MSSQL support TDE but Mysql Psql maria all have IAM but the other two do not?

Yes — that’s exactly correct.
```

**QUESTION**
What are the 7 RDS security points?
**ANSWER**

- KMS encryption at rest for underlying EBS volumes / snapshots
- Transparent Data Encryption (TDE) **for Oracle and SQL Server**
- SSL encryption to RDS is possible for **all** DB (in-flight)
- IAM authentication for MySQL, PostgreSQL and MariaDB
- **Authorization still happens within RDS (not in IAM)**
- Can copy an un-encrypted RDS snapshot into an encrypted one
- CloudTrail cannot be used to track queries made within RDS

**QUESTION_END**

Can't delete secrets, I think. Or there is a rule about deleting unused secrets, must wait 7 days?

When working with cross-region replica secrets, A) you can't delete the source secret, B) it looks the same, there is a little banner telling you the secret is a replica. I had to go into the primary secret and remove the replica, then I could delete the key. Removing the replica also removed it from the other region (no surprise). When in the other region, the replica key had a button about "promote to primary" or similar.

## ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - SSL Encryption, SNI & MITM

**Topic:** 22. SSL Encryption, SNI & MITM  
**Duration:** 8min  
**Section:** 4

## Notes

### SSL/TLS - Basics

- SSL refers to Secure Sockets Layer, used to encrypt connections
- TLS refers to Transport Layer Security, which is a newer version
- Nowadays, TLS certificates are mainly used, but people still refer as SSL
- Public SSL certificates are issued by Certificate Authorities (CA)
- Comodo, Symantec, GoDaddy, GlobalSign, Digicert, Letsencrypt, etc…
- SSL certificates have an expiration date (you set) and must be renewed

### SSL Encryption – How it works (2:50)

- Asymmetric Encryption is expensive (SSL) [in terms of cpu usage]
- Symmetric encryption is cheaper
- Asymmetric handshake is used to exchange a per-client random symmetric key
- Possibility of client sending an SSL certificate as well (two-way certificate)

> The big take-away is that during handshake a symmetric key is generated and used for communication. Asymmetric key is only used during hand-shake.

![How SSL Works](https://miro.medium.com/v2/resize:fit:1400/1*kL2UuV63yiTJubcafQ6YIA.png "How SSL Works")

### SSL – Server Name Indication (SNI) (3:07)

- SNI solves the problem of loading multiple SSL certificates onto one web server (to serve multiple websites)
- It’s a “newer” protocol, and requires the client to indicate the hostname of the target server in the initial SSL handshake
- The server will then find the correct certificate, or return the default one

Note:

- Only works for ALB & NLB (newer generation), CloudFront
- Does not work for CLB (older gen)

> This is related to the fact that https protocol original dictated that host name should be encrypted and therefore servers couldn't identify the correct server to serve the correct certificate

**QUESTION**
Regarding "SSL/ SNI (Server Name Indicator)" Limitations. Discuss why SNI is useful and what are the service limitations?
**ANSWER**
Note:

- Only works for ALB & NLB (newer generation), CloudFront
- Does not work for CLB (older gen) (CLB "Classic Load Balancer")

> This is related to the fact that https protocol original dictated that host name should be encrypted and therefore servers couldn't identify the correct server to serve the correct certificate

> The graphic suggest Target Groups determines certificate.

**QUESTION_END**

### SSL – Man in the Middle Attacks

[Graphic Not available]
**IMPORTANT**

**EXAM**

"Man in the Middle attack" is when the a rogue server intercepts packets intended for a different server. When not using HTTPS there is no cert exchange and therefore no verification.

When HTTPS there is a certificate exchange, therefore server verification. However, it's possible to infect a client with a rouge certificate, so when verification occurs it uses faulty certificate given false trust.

### SSL – Man in the Middle Attack How to prevent

1. Don’t use public-facing HTTP, use HTTPS (meaning, use SSL/TLS certificates)
2. Use a DNS that has DNSSEC
   - To send a client to a pirate server, a DNS response needs to be “forged” by a server which intercepts them

- It is possible to protect your domain name by configuring `DNSSEC`
- Amazon Route 53 supports DNSSEC for domain registration.
- Route 53 supports DNSSEC for DNS service as of December 2020 (using KMS)
- You could also run a custom DNS server on Amazon EC2 for example (Bind is the most popular, dnsmasq, KnotDNS, PowerDNS).

**QUESTION**
How to avoid Man-in-the-middle attacks (SSL)?
**ANSWER**

1. Don’t use public-facing HTTP, use HTTPS (meaning, use SSL/TLS certificates)
2. Use a DNS that has DNSSEC
   - To send a client to a pirate server, a DNS response needs to be “forged” by a server which intercepts them

- It is possible to protect your domain name by configuring `DNSSEC`
- Amazon Route 53 supports DNSSEC for domain registration.
- Route 53 supports DNSSEC for DNS service as of December 2020 (using KMS)
- You could also run a custom DNS server on Amazon EC2 for example (Bind is the most popular, dnsmasq, KnotDNS, PowerDNS).

> Because Route53 didn't used to support DNSSEC running an alterative DNS server may have been an option, but its not longer necessary.

**QUESTION_END**

#--
**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - AWS Certificate Manager (ACM)

**Topic:** 23. AWS Certificate Manager - ACM  
**Duration:** 4min  
**Section:** 4

## Notes

### AWS Certificate Manager (ACM)

- To host public SSL certificates in AWS, you can:
  - Buy your own and upload them using the CLI
  - Have ACM provision and renew public SSL certificates for you (free of cost)

- ACM loads SSL certificates on the following integrations:
  - Load Balancers (including the ones created by EB)
  - CloudFront distributions
  - APIs on API Gateways

- SSL certificates is overall a pain to manually manage, so ACM is great to leverage in your AWS infrastructure!

[missing graphic]
**QUESTION**
Which services auto-load certificate?
**ANSWER**

- Load Balancers
- CloudFormation Distributions
- APIs on API Geteways

> He said, anywhere there is a need for certificate, ACM integrates with it

**QUESTION_END**

### ACM – Good to know

- Possibility of creating public certificates
  - Must verify public DNS
  - Must be issued by a trusted public certificate authority (CA)
- Possibility of creating private certificates
  - For your internal applications
  - You create your own private CA
  - Your applications must trust your private CA
- Certificate renewal:
  - Automatically done if generated provisioned by ACM
  - Any manually uploaded certificates must be renewed manually and re-uploaded
- ACM is a **regional** service
- To use with a global application (multiple ALB for example), you need to issue an SSL certificate in each region where you application is deployed.
- **You cannot copy certs across regions**

**QUESTION**
Are certificates region or global?
**ANSWER**
They are regional. If you have multi-region app you'll need to create certificate for each region
**QUESTION_END**

> Renewals - if you bring-your-own, then you must renew (upload new certs), acm automatically does this for you

**TODO** how does ACM work with CloudFront. He said we don't have to worry about certs if using CloudFront.

OpenAI said:

```
Short answer: No — ACM is not redundant with CloudFront.
Amazon CloudFront depends on AWS Certificate Manager for HTTPS to the viewer.

The confusion usually comes from thinking CloudFront “already does TLS.” It does — but it still needs a certificate, and ACM provides it.

When using CloudFront, there are two separate HTTPS hops:

Viewer (browser)
      ↓ HTTPS (cert #1)
CloudFront
      ↓ HTTPS (cert #2 optional)
Origin (ALB / S3 / API)

ACM can be used in both places.

```

###

# --

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - CloudHSM

**Topic:** 24. CloudHSM  
**Duration:** 5min  
**Section:** 4

## Notes

### CloudHSM

- KMS => AWS manages the software for encryption
- CloudHSM => AWS provisions encryption hardware
- Dedicated Hardware **(HSM = Hardware Security Module)**
- You manage your own encryption keys entirely (**not AWS**)
- HSM device is tamper resistant, FIPS 140-2 Level 3 compliance
- Supports both symmetric and asymmetric encryption (SSL/TLS keys)
- No free tier available
- Must use the CloudHSM Client Software
- Redshift supports CloudHSM for database encryption and key management
- Good option to use with **SSE-C encryption**

**QUESTION**
What is CloudHSM (10)?

**ANSWER**

- KMS => AWS manages the software for encryption
- CloudHSM => AWS provisions encryption hardware
- Dedicated Hardware **(HSM = Hardware Security Module)**
- You manage your own encryption keys entirely (**not AWS**)
- HSM device is tamper resistant, FIPS 140-2 Level 3 compliance
- Supports both symmetric and asymmetric encryption (SSL/TLS keys)
- No free tier available
- Must use the CloudHSM Client Software
- Redshift supports CloudHSM for database encryption and key management
- Good option to use with **SSE-C encryption**

**QUESTION_END**

### CloudHSM – High Availability

- CloudHSM clusters are spread across Multi AZ (HA)
- Great for availability and durability

### CloudHSM vs. KMS

![KMS vs CloudHSM](https://godleon.github.io/blog/images/aws/Security/CloudHSM_compare-with-KMS-1.png "KMS vs CloudHSM")

# --

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - Solution Architecture - SSL on ELB

**Topic:** 25. Solution Architecture - SSL on ELB  
**Duration:** 3min  
**Section:** 4

## Notes

### Solution Architecture: SSL on ALB

[missing graphic]
Depicts classic User->load balancer (https) -> instances (http).
In that the loadbalancer does ssl-termination (not sure the phrase), https to loadbalancer, lb to instance is only http

### Solution Architecture: SSL on web server EC2 instance

It's possible to load certificates on each instance. The example he provided was using NLB in place of ALB (nlb is tcp), and instances interact with NLB over https.

You could load certificates at boot time and manage the whole thing yourself. Or you could use CloudHSM, SSL Offloading

### Solution Architecture: CloudHSM – SSL Offloading

- You can offload SSL to CloudHSM (SSL Acceleration)
- Supported by NGINX, Apache Web servers and IIS for Windows Server
- Extra security: the SSL private key never leaves the HSM device
- Must setup a cryptographic user (CU) on the CloudHSM device

> He makes the point that you could use CloudHSM to handle encryption for the instances instead of them doing the de/encryption.

# --

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - S3 Security

**Topic:** 26. S3 Security  
**Duration:** 10min  
**Section:** 4

## Notes

### S3 Encryption for Objects

- SSE-S3: encrypts S3 objects using keys handled & managed by AWS
- SSE-KMS: leverage KMS to manage encryption keys
  - Key usage appears in CloudTrail
  - objects made public can never be read
  - On s3:PutObject, make the permission kms:GenerateDataKey is allowed
- SSE-C: when you want to manage your own encryption keys
- Client-Side Encryption
- Glacier: all data is AES-256 encrypted, key under AWS control

**QUESTION**
Discuss some quarks of SSE-KMS (3 points)?

**ANSWER**

- Key usage appears in CloudTrail
- objects made public can never be read
- On s3:PutObject, make the permission kms:GenerateDataKey is allowed

**QUESTION_END**

**QUESTION**
What is the quark about S3-Glacier?
**ANSWER**
Glacier: all data is AES-256 encrypted, key under AWS control
**TODO** As I read it, there is nothing for users to do for encryption in glacier. What if we encrypt using SSE-KMS, and our life cycle rules move to Glacier? What happens to the encryption then?

AI Said:

```
Summary (what AWS exams expect)

Glacier + encryption rules:

- Always encrypted at rest
- SSE-S3 simplest
- SSE-KMS requires key access at restore time
- If KMS key deleted → data unrecoverable
- Cross-account requires KMS policy
- Encryption unchanged during lifecycle transitions
- SSE-C risky for long-term Glacier storage
```

**QUESTION_END**

### Encryption in transit (SSL / TLS)

- Amazon S3 exposes:
  - HTTP endpoint: non encrypted
  - HTTPS endpoint: encryption in flight
- You’re free to use the endpoint you want, but HTTPS is recommended
- HTTPS is mandatory for SSE-C
- To enforce HTTPS, use a Bucket Policy with aws:SecureTransport

> Take-away, http is an option but never suggested.

**QUESTION**
How to enforce s3 https?
**ANSWER**
To enforce HTTPS, use a Bucket Policy with aws:SecureTransport
**QUESTION_END**

### Events in S3 Buckets (2:25)

- S3 Access Logs:
  - Detailed records for the requests that are made to a bucket
  - Might take hours to deliver
  - Might be incomplete (best effort)
- S3 Events Notifications:
  - Receive notifications when certain events happen in your bucket
  - E.g.: new objects created, object removal, restore objects, replication events
  - Destinations: SNS, SQS queue, Lambda
  - Typically delivered in seconds but can take minutes, notification for every object if versioning is enabled, else risk of one notification for two same object write done simultaneously
- Trusted Advisor:
  - Check the bucket permission (is the bucket public?)
- Amazon EventBridge:
  - Need to enable CloudTrail object level logging on S3 first
  - Target can be Lambda, SQS, SNS, etc…

### S3 Security (4:06)

- User based
  - IAM policies - **which API calls should be allowed for a specific user from IAM console**

- Resource Based
  - Bucket Policies - bucket wide rules from the S3 console - allows cross account
  - Object Access Control List (ACL) – finer grain
  - Bucket Access Control List (ACL) – less common

### S3 Bucket Policies (4:49)

- Use S3 bucket for policy to:
  - Grant public access to the bucket
  - Force objects to be encrypted at upload
  - Grant access to another account (Cross Account)

- Optional Conditions on:
  - SourceIp: Public IP or Elastic IP | VpcSourceIp: Private IP (through VPC Endpoint)
  - Source VPC or Source VPC Endpoint – only works with VPC Endpoints
  - CloudFront Origin Identity
  - MFA

**QUESTION**
Give some example use-cases for bucket policies (7)?
**ANSWER**

- Use S3 bucket for policy to:
  - Grant public access to the bucket
  - Force objects to be encrypted at upload
  - Grant access to another account (Cross Account)

- Optional Conditions on:
  - SourceIp: Public IP or Elastic IP | VpcSourceIp: Private IP (through VPC Endpoint)
  - Source VPC or Source VPC Endpoint – only works with VPC Endpoints
  - CloudFront Origin Identity
  - MFA

**QUESTION_END**

### S3 pre-signed URLs (6:03)

- Can generate pre-signed URLs using SDK or CLI
  - For downloads (easy, can use the CLI)
  - For uploads (harder, must use the SDK)
- Valid for a default of 3600 seconds, can change timeout with --expires-in
  [TIME_BY_SECONDS] argument
- Users given a pre-signed URL inherit the permissions of the person who
  generated the URL for GET / PUT
- Examples :
  - Allow only logged-in users to download a premium video on your S3 bucket
  - Allow an ever changing list of users to download files by generating URLs dynamically
  - Allow temporarily a user to upload a file to a precise location in our bucket

> "pre-signed" url means YOU are signing with YOUR credentials and authorization is based on YOUR creds. Doesn't make much of difference but it's interesting.

### VPC Endpoint Gateway for S3 (7:04)

[no graphic available]
So .... VPC Endpoint Gateway, is to make internet resources available on private VPC.

To gain access to an S3 bucket that is public from an instance that is in a public bucket, it's all public. **you could restrict by ip** if you wanted to to do that. (S3 Bucket policy by `AWS:SourceIP` (public IP))

**EXAM**
However, using a VPC Endpoint Gateway is another way to restrict S3 access. In this scenario **ALL TRAFFIC STAYS PRIVATE** (S3 Bucket Bucket policy by `AWS:SourceVpce`), `AWS:SourceVpc` (encompass all possible VPC endpoints)

**QUESTION**
How to restrict S3 Access to a VPC?
**ANSWER**
**TODO** not sure, but involves a `VCP Endpoint Gateway`
**QUESTION_END**

### S3 Object Lock & Glacier Vault Lock (9:11)

- S3 Object Lock
  - Adopt a WORM (Write Once Read Many) model
  - Block an object version deletion for a specified amount of time

- Glacier Vault Lock
  - Adopt a WORM (Write Once Read Many) model
  - Lock the policy for future edits (can no longer be changed)
  - Helpful for compliance and data retention

**QUESTION**
How to enforce WORM on S3 or Glacier?
**ANSWER**
**TODO** I don't really know, use "Object Lock" or "Glacier Vault Lock"

`use "Object Lock" or "Glacier Vault Lock"` is the correct answer

```
Key difference (exam tip)
S3 Object Lock → object-level WORM
Glacier Vault Lock → vault-level policy WORM
```

```
1) S3 → Object Lock

Use S3 Object Lock when data is in S3.

Modes:
  - Governance mode (can override with special permissions)
  - Compliance mode (cannot be overridden at all)
Can set:
  - Retention period
  - Legal holds

👉 This is the most common modern answer


2) Glacier → Vault Lock

Use Glacier Vault Lock (for Amazon S3 Glacier)

- Lets you enforce policies like:
  - “No deletes for X days”
- Once locked:
  - Policy becomes immutable

👉 This is more “old-school Glacier” but still appears in exams


```

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - S3 Access Points

**Topic:** 27. S3 Access Points  
**Duration:** 4min  
**Section:** 4

## Notes

### S3 – Access Points

[graphic depicts 'prefix' of s3, to be used as access point]

- Access Points simplify security management for S3 Buckets
- Each Access Point has:
  - its own DNS name (Internet Origin or VPC Origin)
  - an access point policy (similar to bucket policy) – manage security at scale

**TODO** the graphic shows user in the Analytics Group have access to two prefixes `/finance/` and `/sales`, Is this one Access point? or is it the case there is a policy for the group? Can access points reference more than one prefix?

### S3 – Access Points – VPC Origin (2:33)

• **We can define the access point to be accessible only from within the VPC**
• You must create a VPC Endpoint to access the Access Point (Gateway or Interface Endpoint)
• The VPC Endpoint Policy must allow access to the target bucket and Access Point

**QUESTION**
How to restrict access to an S3 bucket (access point) to certain VPC?
**ANSWER**

• **We can define the access point to be accessible only from within the VPC**
• You must create a VPC Endpoint to access the Access Point (Gateway or Interface Endpoint)
• The VPC Endpoint Policy must allow access to the target bucket and Access Point

**TODO** not really sure but I need to try this
**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - S3 Multi-Region Access Points

**Topic:** 28. S3 Multi-Region Access Points  
**Duration:** 3min  
**Section:** 4

## Notes

### S3 – Multi-Region Access Points

- Provide a global endpoint that span S3 buckets in multiple AWS regions
- Dynamically route requests to the nearest S3 bucket (lowest latency)
- Bi-directional S3 bucket replication rules are created to keep data in sync across regions
- **Failover Controls** – allows you to shift requests across S3 buckets in different AWS regions within minutes (Active-Active or Active-Passive)

**QUESTION**
Multi-region Access Point (S3), What are the advantages/use-cases?
**ANSWER**

- Provide a global endpoint that span S3 buckets in multiple AWS regions
- Dynamically route requests to the nearest S3 bucket (lowest latency)
- Bi-directional S3 bucket replication rules are created to keep data in sync across regions
- **Failover Controls** – allows you to shift requests across S3 buckets in different AWS regions within minutes (Active-Active or Active-Passive)

**QUESTION_END**

### S3 – Multi-Region Access Points (2:40)

[graphic depicting routing of S3/access-point request to alternative S3 bucket]

### Multi-Region Access Points – Failover Controls

[graphic same as above.. shows routing of failed bucket]

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - S3 Multi-Region Access Points - Hands On

**Topic:** 29. S3 Multi-Region Access Points - Hands On  
**Duration:** 4min  
**Section:** 4

## Notes

Hands On - set-up buckets, multi-region access points

**TODO** do this hands on

**QUESTION**
What is the 'sync' status of multi-region access points?
**ANSWER**
They're suppose to be bi-directional.. effectively making the buckets mirrors (**TODO** confirm this)

- Create 2 buckets, different regions
- Create "Multi Region Access Point"
  - "Add Buckets"
  - "Block public access" options
  - "Create Multi Region Access Point" - click the button
  - Takes some time to create, 30 minutes to 24 hours

Multiple Region Access Point seem to be doing Cross Region Replication under the hood.

Hence, this exercise is just about setting up access points with some automagic replication.

It's not possible to filter what will be replicated by configuring the access point. But you can filter when doing replication. If you wanted to, that's a bit off topic a curiosity.

In creating MRAP you DO NEED to create replication rules. Data doesn't replicate without them I guess.

Replication isn't strictly necessary but data will be out of sync and you'll get 404's when requesting data outside of region. Further, different regions will experience different 404s.

**Bucket Versioning is Require!**

**QUESTION_END**

# Section 4: Security - S3 Object Lambda

**Topic:** 30. S3 Object Lambda  
**Duration:** 3min  
**Section:** 4

## Notes

### S3 Object Lambda

- Use AWS Lambda Functions to change the object before it is retrieved by the caller application
- Only one S3 bucket is needed, on top of which we create S3 Access Point and S3 Object Lambda Access Points.
- Use Cases:
  - Redacting personally identifiable information for analytics or non- production environments.
  - Converting across data formats, such as converting XML to JSON.
  - Resizing and watermarking images on the fly using caller-specific details, such as the user who requested the object. **One example given was water mark specific to user**.

**TODO** Are access points necessary to create Object Lambda, he said Object Lambda are another reason for Access Points

**TODO** Does S3 Object Lambdas need "warm-up"? Also, can we call cron to do warm-ups? I mean we can schedule lambda same as cron? can we do warm up there? When doing "warm-up" does it make sense to send arguments `isWarmUp` which then quick-returns.

# Section 4: Security - DDoS and AWS Shield

**Topic:** 31. DDoS and AWS Shield  
**Duration:** 6min  
**Section:** 4

## Notes

### What’s a DDOS\* Attack?

[no graphic available]

He describes typical DDoS attach, except he introduces a level of "master" computers that manage the bots (meaning the attacker isn't managing the bots).

### Type of Attacks on your infrastructure (1:02)

- Distributed Denial of Service (DDoS):
  - When your service is unavailable because it’s receiving too many requests
  - SYN Flood (Layer 4): send too many TCP connection requests
  - UDP Reflection (Layer 4): get other servers to send many big UDP requests
  - DNS flood attack: overwhelm the DNS so legitimate users can’t find the site
  - Slow Loris attack: a lot of HTTP connections are opened and maintained
- Application level attacks:
  - more complex, more specific (HTTP level)
  - Cache bursting strategies: overload the backend database by invalidating cache

**QUESTION**
What are the different DDoS attacks? System(4)/Application(2)?

There are 4 attacks and a couple of other considerations.
**ANSWER**

- Distributed Denial of Service (DDoS):
  - When your service is unavailable because it’s receiving too many requests
  - `SYN Flood` (Layer 4): send too many TCP connection requests
  - `UDP Reflection` (Layer 4): get other servers to send many big UDP requests
  - `DNS flood attack`: overwhelm the DNS so legitimate users can’t find the site
  - `Slow Loris attack`: a lot of HTTP connections are opened and maintained
- Application level attacks:
  - more complex, more specific (HTTP level)
  - Cache bursting strategies: overload the backend database by invalidating cache

**QUESTION_END**

### DDoS Protection on AWS (2:16)

- `AWS Shield Standard`: protects against DDoS attack for your website and
  applications, for all customers at no additional costs
- `AWS Shield Advanced`: 24/7 premium DDoS protection
- `AWS WAF`: Filter specific requests based on rules
- `CloudFront and Route 53`:
  - Availability protection using global edge network
  - Combined with AWS Shield, provides DDoS attack mitigation at the edge
- `Be ready to scale` – leverage AWS Auto Scaling
- `Separate static resources` (S3 / CloudFront) from dynamic ones (EC2 / ALB)
- Read the whitepaper for details:
  https://d1.awsstatic.com/whitepapers/Security/DDoS_White_Paper.pdf

**QUESTION**
Which anti-DDoS service is enabled by default?
**ANSWER**
`AWS Shield Standard`: protects against DDoS attack for your website and
applications, for all customers at no additional costs
**QUESTION_END**

**QUESTION**
What services and technique are suggested to mitigate and/or prevent DDoS (6)?
**ANSWER**

- `AWS Shield Standard`: protects against DDoS attack for your website and
  applications, for all customers at no additional costs
- `AWS Shield Advanced`: 24/7 premium DDoS protection
- `AWS WAF`: Filter specific requests based on rules
- `CloudFront and Route 53`:
  - Availability protection using global edge network
  - Combined with AWS Shield, provides DDoS attack mitigation at the edge
- `Be ready to scale` – leverage AWS Auto Scaling
- `Separate static resources` (S3 / CloudFront) from dynamic ones (EC2 / ALB)
- Read the whitepaper for details:
  https://d1.awsstatic.com/whitepapers/Security/DDoS_White_Paper.pdf

**QUESTION_END**

### Sample Reference Architecture (4:25)

[Graphic not available]

### AWS Shield

- **AWS Shield Standard**:
  - Free service that is activated for every AWS customer
  - Provides protection from attacks such as SYN/UDP Floods, Reflection attacks and other layer 3/layer 4 attacks
- **AWS Shield Advanced**:
  - Optional DDoS mitigation service ($3,000 per month per organization)
  - Protect against more sophisticated attack on Amazon EC2, Elastic Load Balancing (ELB), Amazon CloudFront, AWS Global Accelerator, Route 53
  - 24/7 access to AWS DDoS response team (DRP)
  - Protect against higher fees during usage spikes due to DDoS

**QUESTION**
What is the difference between Shield and Shield Advanced? More specifically what is the fee what do you get for the fee?
**ANSWER**

- **AWS Shield Standard**:
  - Free service that is activated for every AWS customer
  - Provides protection from attacks such as SYN/UDP Floods, Reflection attacks and other layer 3/layer 4 attacks
- **AWS Shield Advanced**:
  - Optional DDoS mitigation service ($3,000 per month per organization)
  - Protect against more sophisticated attack on Amazon EC2, Elastic Load Balancing (ELB), Amazon CloudFront, AWS Global Accelerator, Route 53
  - 24/7 access to AWS DDoS response team (DRP)
  - Protect against higher fees during usage spikes due to DDoS

> This doesn't make a lot of sense to me 'Protect against higher fees'. If unit costs go down with the more you use, wouldn't the fees then go down? I think he means there is insurance, that you'll be protected against the "additional" costs incurred by DDoS attack.

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - AWS WAF - Web Application Firewall

**Topic:** 32. AWS WAF - Web Application Firewall  
**Duration:** 6min  
**Section:** 4

## Notes

### AWS WAF – Web Application Firewall

- Protects your web applications from common web exploits (Layer 7)
- Deploy on Application Load Balancer (localized rules)
- Deploy on API Gateway (rules running at the regional or edge level)
- Deploy on CloudFront (rules globally on edge locations)
  - Used to front other solutions: CLB, EC2 instances, custom origins, S3 websites
- Deploy on AppSync (protect your GraphQL APIs)
- WAF is not for DDoS protection
- Define Web ACL (Web Access Control List):
  - Rules can include IP addresses, HTTP headers, HTTP body, or URI strings
  - Protects from common attack - SQL injection and Cross-Site Scripting (XSS)
  - Size constraints, Geo match
  - Rate-based rules (to count occurrences of events)
- Rule Actions: Count | Allow | Block | CAPTCHA | Challenge

**QUESTION**
What is the relationship between CloudFront and WAF? He says you can run WAF on CloudFront
**ANSWER**
**TODO** find the answer to this question
**QUESTION_END**

**QUESTION**
Given the network stack, what level does WAF operate on, what level does Shield mostly work on.
**ANSWER**
WAF - Layer 7
Shield - Layer 4

**QUESTION_END**

**QUESTION**
What is the functional difference between Shield and WAF?
**ANSWER**
WAF is Layer 7 (http) so it's going to to monitor Layer 7 activity.

Shield is Layer 4 so it will monitory monitor network signals (SYN flood, DNS DDoS)

HTTP/S is layer 7.

**QUESTION_END**

**TODO** Set-up WAF, get to know "Rule Actions: Count | Allow | Block | CAPTCHA | Challenge"

**QUESTION**
What is one very significant purposes of WAF rule Action `COUNT`?
**ANSWER**
It can be used to determine the effectiveness of a rule. Count how many of a thing happen to know if you are looking at the right things.

**QUESTION_END**

### AWS WAF – Managed Rules (2:01)

- Library of over 190 managed rules
- Ready-to-use rules that are managed by AWS and AWS Marketplace Sellers
- **Baseline Rule Groups** – general protection from common threats
  - `AWSManagedRulesCommonRuleSet`, `AWSManagedRulesAdminProtectionRuleSet`, …
- **Use-case Specific Rule Groups** – protection for many AWS WAF use cases - `AWSManagedRulesSQLiRuleSet`, `AWSManagedRulesWindowsRuleSet`,
  `AWSManagedRulesPHPRuleSet`, `AWSManagedRulesWordPressRuleSet`, …
- **IP Reputation Rule Groups** – block requests based on source (e.g., malicious IPs)
  - `AWSManagedRulesAmazonIpReputationList`, `AWSManagedRulesAnonymousIpList`
- **Bot Control Managed Rule Group** – block and manage requests from bots
  - `AWSManagedRulesBotControlRuleSet`

**QUESTION**
WAF predefined rule Managed Rules. What are the 4 main groups?
**ANSWER**

**EXAM**

- **Baseline Rule Groups**
- **Use-case Specific Rule Groups**
- **IP Reputation Rule Groups** (EXAM)
- **Bot Control Managed Rule Group**

Probably the exam will want you to know about "IP Reputation Rule Groups" in some detail but basic idea for the others

- **Baseline Rule Groups** – general protection from common threats
  - `AWSManagedRulesCommonRuleSet`, `AWSManagedRulesAdminProtectionRuleSet`, …
- **Use-case Specific Rule Groups** – protection for many AWS WAF use cases - `AWSManagedRulesSQLiRuleSet`, `AWSManagedRulesWindowsRuleSet`,
  `AWSManagedRulesPHPRuleSet`, `AWSManagedRulesWordPressRuleSet`, …
- **IP Reputation Rule Groups** – block requests based on source (e.g., malicious IPs)
  - `AWSManagedRulesAmazonIpReputationList`, `AWSManagedRulesAnonymousIpList`
- **Bot Control Managed Rule Group** – block and manage requests from bots
  - `AWSManagedRulesBotControlRuleSet`

**QUESTION_END**

### WAF - Web ACL – Logging (3:27)

- You can send your logs to an:
  - Amazon CloudWatch Logs log group – 5 MB per second
  - Amazon Simple Storage Service (Amazon S3) bucket – 5 minutes interval
  - Amazon Kinesis Data Firehose – limited by Firehose quotas

### Solution Architecture – Enhance CloudFront Origin Security with AWS WAF & AWS Secrets Manager (EXAM) (4:30)

[graphic missing]

**EXAM** YOU WILL NEED TO KNOW HOW TO DO THIS

**TODO** VERY IMPORTANT - TO DO THIS.

VERY VERY VERY IMPORTANT TO BE ABLE TO SET-up THIS SET-up.

> I choose not to do this at this time because I do not have ALB set-up. I would have to set-up everything in this example. There was no tutorial. I hope to circle back to this.

# ---

**QUESTION**
**ANSWER**
**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - AWS Firewall Manager

**Topic:** 33. AWS Firewall Manager  
**Duration:** 3min  
**Section:** 4

## Notes

### AWS Firewall Manager

- Manage rules in **all accounts** of an AWS Organization
- Security policy: common set of security rules
  - WAF rules (Application Load Balancer, API Gateways, CloudFront)
  - AWS Shield Advanced (ALB, CLB, NLB, Elastic IP, CloudFront)
  - Security Groups for EC2, Application Load Balancer and ENI resources in VPC
  - AWS Network Firewall (VPC Level)
  - Amazon Route 53 Resolver DNS Firewall
  - Policies are created at the region level
- **Rules are applied to new resources as they are created (good for compliance) across all and future accounts in your Organization**

**QUESTION**
AWS Firewall Manager.
Rules are regional or global? What services can rules apply to?
**ANSWER**

- Manage rules in **all accounts** of an AWS Organization
- Security policy: common set of security rules
  - WAF rules (Application Load Balancer, API Gateways, CloudFront)
  - AWS Shield Advanced (ALB, CLB, NLB, Elastic IP, CloudFront)
  - Security Groups for EC2, Application Load Balancer and ENI resources in VPC
  - AWS Network Firewall (VPC Level)
  - Amazon Route 53 Resolver DNS Firewall
  - Policies are created at the region level
- **Rules are applied to new resources as they are created (good for compliance) across all and future accounts in your Organization**

**QUESTION_END**

### WAF vs. Firewall Manager vs. Shield

- **WAF, Shield and Firewall Manager are used together for comprehensive protection**
- Define your Web ACL rules in WAF
- For granular protection of your resources, WAF alone is the correct choice
- If you want to use AWS WAF across accounts, accelerate WAF configuration,
  automate the protection of new resources, use Firewall Manager with AWS WAF
- Shield Advanced adds additional features on top of AWS WAF, such as dedicated
  support from the Shield Response Team (SRT) and advanced reporting.
- **If you’re prone to frequent DDoS attacks, consider purchasing Shield Advanced**

**QUESTION**
What is the differences between: WAF, Firewall Mangers, Shield?
**ANSWER**

- **WAF, Shield and Firewall Manager are used together for comprehensive protection**
- Define your Web ACL rules in WAF
- For granular protection of your resources, WAF alone is the correct choice
- If you want to use AWS WAF across accounts, accelerate WAF configuration,
  automate the protection of new resources, use Firewall Manager with AWS WAF
- Shield Advanced adds additional features on top of AWS WAF, such as dedicated
  support from the Shield Response Team (SRT) and advanced reporting.
- **If you’re prone to frequent DDoS attacks, consider purchasing Shield Advanced**

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - Blocking an IP Address

**Topic:** 34. Blocking an IP Address  
**Duration:** 5min  
**Section:** 4

## Notes

### Blocking an IP address

[diagram not available]

First line of defense: NACL
Second line of defense: SG (only has "Allow" rules)
Third Line of defense: Role your own firewall on the instance (run your own fire wall)

### Blocking an IP address – with an ALB (1:32)

![Blocking an IP address – with an ALB ](https://i.ytimg.com/vi/Dy2S6MrtzdU/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGCIgUih_MA8=&rs=AOn4CLCFuvEyNRX1slMQ1xhz6WUdK7FTSQ "Blocking an IP address – with an ALB ")

He makes the point that by adding the ALB the EC2 instances can be in a private VPC and through SG rules you can allow only connections from the ALB.

Further the ALB has some security features.

The ALB sits behind the NACL so NACL rules are still applicable.

### Blocking an IP address – with an NLB

[graphic not available but pretty much the same as the previous ALB].

The point made here is that it's similar configuration ALB/NLB.
**WAIT** there is more. Because we're using the NLB we can plug-in the WAF at this level, and all the features WAF provides

**Additionally, WAF can be added to the system if you add cloudfront. Doing that makes NACLs useless**

He makes the point that if adding CloudFront

**QUESTION**
Adding WAF to a system makes NACLs useless. Where/How does adding a WAF to a system make the NACLs useless
**ANSWER**

When adding WAF for ip-address filtering to CloudFront. I assume NACLs become redundant.

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - Amazon Inspector

**Topic:** 35. Amazon Inspector  
**Duration:** 2min  
**Section:** 4

## Notes

### Amazon Inspector

- Automated Security Assessments

- For EC2 instances
  - Leveraging the AWS System Manager (SSM) agent
  - Analyze against unintended network accessibility
  - Analyze the running OS against known vulnerabilities
- For Container Images push to Amazon ECR
  - Assessment of Container Images as they are pushed
- For Lambda Functions
  - Identifies software vulnerabilities in function code and package
    dependencies
  - Assessment of functions as they are deployed

- Reporting & integration with AWS Security Hub
- Send findings to **Amazon Event Bridge**

**QUESTION**
Amazon Inspector "Automated Security Assessments". What are the three groups of things it can be used with? What are the advantages?
**ANSWER**

- For EC2 instances
  - Leveraging the AWS System Manager (SSM) agent
  - Analyze against unintended network accessibility
  - Analyze the running OS against known vulnerabilities
- For Container Images push to Amazon ECR
  - Assessment of Container Images as they are pushed
- For Lambda Functions
  - Identifies software vulnerabilities in function code and package
    dependencies
  - Assessment of functions as they are deployed

I am only guessing that Lambda and ECR does one scan on push, whereas EC2 instances run an agent (not sure if that takes up processing power).

- Reporting & integration with AWS Security Hub
- Send findings to **Amazon Event Bridge**

**QUESTION_END**

### What does Amazon Inspector evaluate? (1:43)

- Remember: only for EC2 instances, Container Images & Lambda functions
- Continuous scanning of the infrastructure, only when needed
- Package vulnerabilities (EC2, ECR & Lambda) – database of CVE
- Network reachability (EC2)
- A risk score is associated with all vulnerabilities for prioritization

**QUESTION**
What does Amazon Inspector evaluate?
**ANSWER**

- Remember: only for EC2 instances, Container Images & Lambda functions
- Continuous scanning of the infrastructure, only when needed
- Package vulnerabilities (EC2, ECR & Lambda) – database of CVE
- Network reachability (EC2)
- A risk score is associated with all vulnerabilities for prioritization

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - AWS Config

**Topic:** 36. AWS Config  
**Duration:** 4min  
**Section:** 4

## Notes

### AWS Config

- Helps with auditing and recording **compliance** of your AWS resources
- Helps record configurations and changes over time
- AWS Config Rules **does not prevent actions** from happening (no deny)
- Questions that can be solved by AWS Config:
  - Is there unrestricted SSH access to my security groups?
  - Do my buckets have any public access?
  - How has my ALB configuration changed over time?
- You can receive alerts (**SNS notifications**) for any changes
- AWS Config is a per-region service
- Can be aggregated across regions and accounts

**QUESTION**

- What are some of the questions we can answer when using AWS Config?
- What is the one notification type AWS Config supports?
  **ANSWER**
  - Is there unrestricted SSH access to my security groups?
  - Do my buckets have any public access?
  - How has my ALB configuration changed over time?

The think to remember, AWS Config, is not an "enforcer" it is an "observer" for compliance issues/monitoring/reporting.

He says "can receive SNS Topic" notification. He did not mention other services.

**TODO** Can AWS Config send events to EventBridge or other services? SNS only (later he mentions Event Bridge)?

**QUESTION_END**

**TODO** Set-up AWS Config see it in action

### AWS Config Rules (2:36)

- Can use AWS managed config rules (over 75)
- Can make custom config rules (must be defined in AWS Lambda)
  - Evaluate if each EBS disk is of type gp2
  - Evaluate if each EC2 instance is t2.micro
- Rules can be evaluated / triggered:
  - For each config change
  - And / or: at regular time intervals
- Trigger Amazon EventBridge if the rule is non-compliant (chain with Lambda)
- Rules can have auto remediations through SSM Automations
  - If a resource is not compliant, you can trigger an auto remediation
  - Ex: remediate security group rules, stop instances with non-approved tags

**QUESTION**
AWS Config Rules - how to build a custom rule?
**ANSWER**

- Can make custom config rules (must be defined in AWS Lambda)

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - AWS Managed Logs

**Topic:** 37. AWS Managed Logs  
**Duration:** 1min  
**Section:** 4

## Notes

### AWS Managed Logs

- Load Balancer Access Logs (ALB, NLB, CLB) => to S3
  - Access logs for your Load Balancers
- CloudTrail Logs => to S3 and CloudWatch Logs
  - Logs for API calls made within your account
- VPC Flow Logs => to S3, CloudWatch Logs, Kinesis Data Firehose
  - Information about IP traffic going to and from network interfaces in your VPC
- Route 53 Access Logs => to CloudWatch Logs
  - Log information about the queries that Route 53 receives
- S3 Access Logs => to S3
  - Server access logging provides detailed records for the requests that are made to a bucket
- CloudFront Access Logs => to S3
  - Detailed information about every user request that CloudFront receives
- AWS Config => to S3

**QUESTION**
What are the various logs, where do they write the logs, what activity do they log (7)?
**ANSWER**

- Load Balancer Access Logs (ALB, NLB, CLB) => to S3
  - Access logs for your Load Balancers
- CloudTrail Logs => to S3 and CloudWatch Logs
  - Logs for API calls made within your account
- VPC Flow Logs => to S3, CloudWatch Logs, Kinesis Data Firehose
  - Information about IP traffic going to and from network interfaces in your VPC
- Route 53 Access Logs => to CloudWatch Logs
  - Log information about the queries that Route 53 receives
- S3 Access Logs => to S3
  - Server access logging provides detailed records for the requests that are made to a bucket
- CloudFront Access Logs => to S3
  - Detailed information about every user request that CloudFront receives
- AWS Config => to S3

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - Amazon GuardDuty

**Topic:** 38. Amazon GuardDuty  
**Duration:** 3min  
**Section:** 4

## Notes

### Amazon GuardDuty

- Intelligent Threat discovery to protect your AWS Account
- Uses Machine Learning algorithms, anomaly detection, 3rd party data
- One click to enable (30 days trial), no need to install software
- Input data includes:
  - CloudTrail Events Logs – unusual API calls, unauthorized deployments
  - CloudTrail Management Events – create VPC subnet, create trail, …
  - CloudTrail S3 Data Events – get object, list objects, delete object, …
  - VPC Flow Logs – unusual internal traffic, unusual IP address
  - DNS Logs – compromised EC2 instances sending encoded data within DNS queries
  - Optional Feature – EKS Audit Logs, RDS & Aurora, EBS, Lambda, S3 Data Events…
- Can setup EventBridge rules to be notified in case of findings
- EventBridge rules can target AWS Lambda or SNS
- Can **protect against CryptoCurrency attacks** (has a dedicated “finding” for it)

**TODO** Set-up Guard Duty, find cost information. This looks like a must-have service, try find reasons not to use it (devils advocate).

### Amazon GuardDuty (1:59)

Graphic not available

### GuardDuty – Delegated Administrator (2:32)

- AWS Organization member accounts can be designated to be a GuardDuty Delegated Administrator
- Have full permissions to enable and manage GuardDuty for all accounts in the Organization
- Can be done only using the Organization Management Account

# ---

**QUESTION**
Discuss GuardData protection/costs
**ANSWER**
GuardDuty Pricing Plan,

- runtime $1.50/vCPU/month first 500 vcpu
- S3 $0.80/1 million events/
- eks $1.60/1 million events/

It's costly. "Events" Are cloudwatch log items. Things like S3 GetObject. GD monitors those events in effort to detect bad actors.

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - IAM Advanced Policies

**Topic:** 39. IAM Advanced Policies  
**Duration:** 4min  
**Section:** 4

## Notes

### IAM Conditions

- `aws:SourceIp` restrict the client IP from which the API calls are being made
- `aws:RequestedRegion` restrict the region the API calls are **made to**

- `ec2:ResourceTag` restrict based on tags
- `aws:PrincipalTag/Department`
- `aws:MultiFactorAuthPresent` to force MFA

### IAM for S3

- permission `s3:ListBucket` rules that list `arn:aws:s3:::test` applies to bucket

- Permissions: `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject` applies to
  `arn:awn:s3:::test/*` (notice the `/*`)

> The point is that /\* applies to objects in the bucket, when it is missing it applies to the bucket. Of course, permissions (actions are only applicable to the things they represent 'GetObject' is something within the bucket (item) and those rules are not necessary interchangeable.

"Object Level Permission"

"Bucket Level Permissions"

### Resource Policies & aws:PrincipalOrgID (3:19)

- `aws:PrincipalOrgID` can be used in any resource policies to restrict access to accounts that are member of an AWS Organization

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - EC2 Instance Connect

**Topic:** 40. EC2 Instance Connect  
**Duration:** 2min  
**Section:** 4

## Notes

### EC2 Instance Connect (SendSSHPublicKey API)

This is really cool. As I understand it, this allows you to access instances without having the identify (key) file.

Basically Instance Connect pushes an identity file to the instances (I guess it provides the private key to you), then you can connect. The key file lives on the instance for 60 seconds only.

**QUESTION**
How to access an instances via SSH without the identify file (key)?
**ANSWER**
EC2 Instance Connect (SendSSHPublicKey API).

There is a 60 second TTL on the file.
**QUESTION_END**

**TODO** Set-up this, always

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

# Section 4: Security - AWS Security Hub

**Topic:** 41. AWS Security Hub  
**Duration:** 3min  
**Section:** 4

## Notes

### AWS Security Hub

- Central security tool to manage security across several AWS accounts and automate
  security checks
- Integrated dashboards showing current security and compliance status to quickly take actions
- **Automatically aggregates alerts in predefined or personal findings formats from various AWS services & AWS partner tools**:
  - Config
  - GuardDuty
  - Inspector
  - Macie
  - IAM Access Analyzer
  - AWS Systems Manager
  - AWS Firewall Manager
  - AWS Health
  - AWS Partner Network Solutions
- **Must first enable the AWS Config Service**

**TODO** Setup security Hub (and cost)

**QUESTION**
Discuss Security Hub costs
**ANSWER**
You buy a "Plan" which includes some features. Additionally you pay for more of what you use in terms of "Pricing is anchored on Amazon EC2 instances as 1 resource unit".

AWS Lambda functions at 1/12 of a resource unit (12 functions = 1 resource unit), Amazon ECR container images at 1/18 of a resource (18 images = 1 resource unit), and AWS IAM users and roles at 1/125 of a resource (125 IAM resources = 1 resource unit).

I think to determine costs requires knowing what/how-many you need to cover.

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 4: Security - Amazon Detective

**Topic:** 42. Amazon Detective  
**Duration:** 1min  
**Section:** 4

## Notes

### Amazon Detective

- GuardDuty, Macie, and Security Hub are used to identify potential security issues, or findings
- Sometimes security findings require deeper analysis to isolate the root cause and take action – it’s a complex process
- Amazon Detective analyzes, investigates, and quickly identifies the root cause of security issues or suspicious activities (using ML and graphs)
- Automatically collects and processes events from VPC Flow Logs, CloudTrail, GuardDuty and create a unified view
- Produces visualizations with details and context to get to the root cause

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")
