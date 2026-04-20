# Section 4 — extracted questions

## Question 001

__QUESTION__

CloudTrail - regional or global? What do I need to do to have per-region trail if for example I had different compliance standards (EU vs Au vs US)

__ANSWER__

**TODO** I don't know how to do this.

__QUESTION_END__

## Question 002

__QUESTION__

What are the three types of CloudTrail Events?
Brief description of each.

__ANSWER__

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

__QUESTION_END__

## Question 003

__QUESTION__

What CloudTrail related services sends events to EventBridge

__ANSWER__

CloudTrail Insights

__QUESTION_END__

## Question 004

__QUESTION__

What is the retention period of CloudTrail events? What to do if you need them longer?

__ANSWER__

- Events are stored for 90 days in CloudTrail
- To keep events beyond this period, log them to S3 and use Athena

__QUESTION_END__

## Question 005

__QUESTION__

Using CloudTrail, how do we notify someone of sensitive API calls (DeleteTable as example)?

__ANSWER__

Events go to CloudTrail, then can also go to EventBridge and from there SNS.

__QUESTION_END__

## Question 006

__QUESTION__

Two paths to send message from CloudTrail. What are they what are the pros/cons.

__ANSWER__

1. You can harvest events from the fact that CloudTrail dumps to S3 and that launches an S3 Event

2. CloudTrail can send events directly so you can respond directly

Pros/Cons

- S3 Event is generic and probably slow

__QUESTION_END__

## Question 007

__QUESTION__

What is S3 Object Lock?

__ANSWER__

Out of scope of the current subject but he said Object Lock prevents objects from ever being deleted or modified.

__QUESTION_END__

## Question 008

__QUESTION__

What are the 3 ways that CloudWatch can deliver events?
What to use if you need to know the number of x in a given hour?
What to use if you want the fastest reaction time?

__ANSWER__

- EventBridge:
  - Can be triggered for any API call in CloudTrail
  - **The fastest, most reactive way**
- CloudTrail Delivery in CloudWatch Logs:
  - Events are streamed
  - Can perform a metric filter to **analyze occurrences and detect anomalies**
- CloudTrail Delivery in S3:
  - Events are delivered every 5 minutes
  - Possibility of analyzing logs integrity, deliver cross account, long-term storage

__QUESTION_END__

## Question 009

__QUESTION__

What are the region limitations for KMS keys?

__ANSWER__

Keys are regional, can only be used in the region they were created in.

__QUESTION_END__

## Question 010

__QUESTION__

Regarding KMS keys, which does most (all) AWS services use? Asymmetric or Symmetric encryption?

__ANSWER__

- **AWS services that are integrated with KMS use Symmetric KMS keys**

__QUESTION_END__

## Question 011

__QUESTION__

If KMS Keys are regional, how do we have Multi-Region keys?

__ANSWER__

It's possible to replicate the KMS key into other regions. These are replicas hence changes to the original changes the replica.

__QUESTION_END__

## Question 012

__QUESTION__

What are the benefits for Parameter Store (7)?

__ANSWER__

- Secure storage for configuration and secrets
- Optional Seamless Encryption using KMS
- Serverless, scalable, durable, easy SDK
- **Version tracking of configurations / secrets**
- Security through IAM
- **Notifications with Amazon EventBridge**
- Integration with CloudFormation

__QUESTION_END__

## Question 013

__QUESTION__

Regarding Parameter Store. How do we get/send notification of a parameter is about to expire

__ANSWER__

**TODO** - I need to figure this out.

However, its a feature of the "Advanced" parameter store and policies.

I am not sure of the steps but I think

1. Set-up TTL live policy
2. Set up notification for x days before TTL

Also, we can get notified of 'no change in x days'

__QUESTION_END__

## Question 014

__QUESTION__

Compare/Contrast Secrets Manager(4) to Parameter Store (5)

__ANSWER__

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

__QUESTION_END__

## Question 015

__QUESTION__

In very simple terms. What is the difference between Parameter Store, Parameter Store Advanced and Secrets Manager?

__ANSWER__

Parameter (as the name suggests) are for parameters. You can keep credentials in it but there are perhaps better alternatives. (config values)

Parameter Store Advanced - Parameter store with policies. The policies are focused on rotation/expiration of the parameter.

Secrets Manager - deals more with "secrets" and auto rotation. (credential values)

__QUESTION_END__

## Question 016

__QUESTION__

What are the 7 RDS security points?

__ANSWER__

- KMS encryption at rest for underlying EBS volumes / snapshots
- Transparent Data Encryption (TDE) **for Oracle and SQL Server**
- SSL encryption to RDS is possible for **all** DB (in-flight)
- IAM authentication for MySQL, PostgreSQL and MariaDB
- **Authorization still happens within RDS (not in IAM)**
- Can copy an un-encrypted RDS snapshot into an encrypted one
- CloudTrail cannot be used to track queries made within RDS

__QUESTION_END__

## Question 017

__QUESTION__

Regarding "SSL/ SNI (Server Name Indicator)" Limitations. Discuss why SNI is useful and what are the service limitations?

__ANSWER__

Note:

- Only works for ALB & NLB (newer generation), CloudFront
- Does not work for CLB (older gen) (CLB "Classic Load Balancer")

> This is related to the fact that https protocol original dictated that host name should be encrypted and therefore servers couldn't identify the correct server to serve the correct certificate

> The graphic suggest Target Groups determines certificate.

__QUESTION_END__

## Question 018

__QUESTION__

How to avoid Man-in-the-middle attacks (SSL)?

__ANSWER__

1. Don’t use public-facing HTTP, use HTTPS (meaning, use SSL/TLS certificates)
2. Use a DNS that has DNSSEC
   - To send a client to a pirate server, a DNS response needs to be “forged” by a server which intercepts them

- It is possible to protect your domain name by configuring `DNSSEC`
- Amazon Route 53 supports DNSSEC for domain registration.
- Route 53 supports DNSSEC for DNS service as of December 2020 (using KMS)
- You could also run a custom DNS server on Amazon EC2 for example (Bind is the most popular, dnsmasq, KnotDNS, PowerDNS).

> Because Route53 didn't used to support DNSSEC running an alterative DNS server may have been an option, but its not longer necessary.

__QUESTION_END__

## Question 019

__QUESTION__

Which services auto-load certificate?

__ANSWER__

- Load Balancers
- CloudFormation Distributions
- APIs on API Geteways

> He said, anywhere there is a need for certificate, ACM integrates with it

__QUESTION_END__

## Question 020

__QUESTION__

Are certificates region or global?

__ANSWER__

They are regional. If you have multi-region app you'll need to create certificate for each region

__QUESTION_END__

## Question 021

__QUESTION__

What is CloudHSM (10)?

__ANSWER__

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

__QUESTION_END__

## Question 022

__QUESTION__

Discuss some quarks of SSE-KMS (3 points)?

__ANSWER__

- Key usage appears in CloudTrail
- objects made public can never be read
- On s3:PutObject, make the permission kms:GenerateDataKey is allowed

__QUESTION_END__

## Question 023

__QUESTION__

What is the quark about S3-Glacier?

__ANSWER__

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

__QUESTION_END__

## Question 024

__QUESTION__

How to enforce s3 https?

__ANSWER__

To enforce HTTPS, use a Bucket Policy with aws:SecureTransport

__QUESTION_END__

## Question 025

__QUESTION__

Give some example use-cases for bucket policies (7)?

__ANSWER__

- Use S3 bucket for policy to:
  - Grant public access to the bucket
  - Force objects to be encrypted at upload
  - Grant access to another account (Cross Account)

- Optional Conditions on:
  - SourceIp: Public IP or Elastic IP | VpcSourceIp: Private IP (through VPC Endpoint)
  - Source VPC or Source VPC Endpoint – only works with VPC Endpoints
  - CloudFront Origin Identity
  - MFA

__QUESTION_END__

## Question 026

__QUESTION__

How to restrict S3 Access to a VPC?

__ANSWER__

**TODO** not sure, but involves a `VCP Endpoint Gateway`

__QUESTION_END__

## Question 027

__QUESTION__

How to enforce WORM on S3 or Glacier?

__ANSWER__

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

__QUESTION_END__

## Question 028

__QUESTION__

How to restrict access to an S3 bucket (access point) to certain VPC?

__ANSWER__

• **We can define the access point to be accessible only from within the VPC**
• You must create a VPC Endpoint to access the Access Point (Gateway or Interface Endpoint)
• The VPC Endpoint Policy must allow access to the target bucket and Access Point

**TODO** not really sure but I need to try this

__QUESTION_END__

## Question 029

__QUESTION__

Multi-region Access Point (S3), What are the advantages/use-cases?

__ANSWER__

- Provide a global endpoint that span S3 buckets in multiple AWS regions
- Dynamically route requests to the nearest S3 bucket (lowest latency)
- Bi-directional S3 bucket replication rules are created to keep data in sync across regions
- **Failover Controls** – allows you to shift requests across S3 buckets in different AWS regions within minutes (Active-Active or Active-Passive)

__QUESTION_END__

## Question 030

__QUESTION__

What is the 'sync' status of multi-region access points?

__ANSWER__

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

__QUESTION_END__

## Question 031

__QUESTION__

What are the different DDoS attacks? System(4)/Application(2)?

There are 4 attacks and a couple of other considerations.

__ANSWER__

- Distributed Denial of Service (DDoS):
  - When your service is unavailable because it’s receiving too many requests
  - `SYN Flood` (Layer 4): send too many TCP connection requests
  - `UDP Reflection` (Layer 4): get other servers to send many big UDP requests
  - `DNS flood attack`: overwhelm the DNS so legitimate users can’t find the site
  - `Slow Loris attack`: a lot of HTTP connections are opened and maintained
- Application level attacks:
  - more complex, more specific (HTTP level)
  - Cache bursting strategies: overload the backend database by invalidating cache

__QUESTION_END__

## Question 032

__QUESTION__

Which anti-DDoS service is enabled by default?

__ANSWER__

`AWS Shield Standard`: protects against DDoS attack for your website and
applications, for all customers at no additional costs

__QUESTION_END__

## Question 033

__QUESTION__

What services and technique are suggested to mitigate and/or prevent DDoS (6)?

__ANSWER__

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

__QUESTION_END__

## Question 034

__QUESTION__

What is the difference between Shield and Shield Advanced? More specifically what is the fee what do you get for the fee?

__ANSWER__

- **AWS Shield Standard**:
  - Free service that is activated for every AWS customer
  - Provides protection from attacks such as SYN/UDP Floods, Reflection attacks and other layer 3/layer 4 attacks
- **AWS Shield Advanced**:
  - Optional DDoS mitigation service ($3,000 per month per organization)
  - Protect against more sophisticated attack on Amazon EC2, Elastic Load Balancing (ELB), Amazon CloudFront, AWS Global Accelerator, Route 53
  - 24/7 access to AWS DDoS response team (DRP)
  - Protect against higher fees during usage spikes due to DDoS

> This doesn't make a lot of sense to me 'Protect against higher fees'. If unit costs go down with the more you use, wouldn't the fees then go down? I think he means there is insurance, that you'll be protected against the "additional" costs incurred by DDoS attack.

__QUESTION_END__

## Question 035

__QUESTION__

What is the relationship between CloudFront and WAF? He says you can run WAF on CloudFront

__ANSWER__

**TODO** find the answer to this question

__QUESTION_END__

## Question 036

__QUESTION__

Given the network stack, what level does WAF operate on, what level does Shield mostly work on.

__ANSWER__

WAF - Layer 7
Shield - Layer 4

__QUESTION_END__

## Question 037

__QUESTION__

What is the functional difference between Shield and WAF?

__ANSWER__

WAF is Layer 7 (http) so it's going to to monitor Layer 7 activity.

Shield is Layer 4 so it will monitory monitor network signals (SYN flood, DNS DDoS)

HTTP/S is layer 7.

__QUESTION_END__

## Question 038

__QUESTION__

What is one very significant purposes of WAF rule Action `COUNT`?

__ANSWER__

It can be used to determine the effectiveness of a rule. Count how many of a thing happen to know if you are looking at the right things.

__QUESTION_END__

## Question 039

__QUESTION__

WAF predefined rule Managed Rules. What are the 4 main groups?

__ANSWER__

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

__QUESTION_END__

## Question 040

__QUESTION__

AWS Firewall Manager.
Rules are regional or global? What services can rules apply to?

__ANSWER__

- Manage rules in **all accounts** of an AWS Organization
- Security policy: common set of security rules
  - WAF rules (Application Load Balancer, API Gateways, CloudFront)
  - AWS Shield Advanced (ALB, CLB, NLB, Elastic IP, CloudFront)
  - Security Groups for EC2, Application Load Balancer and ENI resources in VPC
  - AWS Network Firewall (VPC Level)
  - Amazon Route 53 Resolver DNS Firewall
  - Policies are created at the region level
- **Rules are applied to new resources as they are created (good for compliance) across all and future accounts in your Organization**

__QUESTION_END__

## Question 041

__QUESTION__

What is the differences between: WAF, Firewall Mangers, Shield?

__ANSWER__

- **WAF, Shield and Firewall Manager are used together for comprehensive protection**
- Define your Web ACL rules in WAF
- For granular protection of your resources, WAF alone is the correct choice
- If you want to use AWS WAF across accounts, accelerate WAF configuration,
  automate the protection of new resources, use Firewall Manager with AWS WAF
- Shield Advanced adds additional features on top of AWS WAF, such as dedicated
  support from the Shield Response Team (SRT) and advanced reporting.
- **If you’re prone to frequent DDoS attacks, consider purchasing Shield Advanced**

__QUESTION_END__

## Question 042

__QUESTION__

Adding WAF to a system makes NACLs useless. Where/How does adding a WAF to a system make the NACLs useless

__ANSWER__

When adding WAF for ip-address filtering to CloudFront. I assume NACLs become redundant.

__QUESTION_END__

## Question 043

__QUESTION__

Amazon Inspector "Automated Security Assessments". What are the three groups of things it can be used with? What are the advantages?

__ANSWER__

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

__QUESTION_END__

## Question 044

__QUESTION__

What does Amazon Inspector evaluate?

__ANSWER__

- Remember: only for EC2 instances, Container Images & Lambda functions
- Continuous scanning of the infrastructure, only when needed
- Package vulnerabilities (EC2, ECR & Lambda) – database of CVE
- Network reachability (EC2)
- A risk score is associated with all vulnerabilities for prioritization

__QUESTION_END__

## Question 045

__QUESTION__

- What are some of the questions we can answer when using AWS Config?
- What is the one notification type AWS Config supports?

__ANSWER__

- Is there unrestricted SSH access to my security groups?
  - Do my buckets have any public access?
  - How has my ALB configuration changed over time?

The think to remember, AWS Config, is not an "enforcer" it is an "observer" for compliance issues/monitoring/reporting.

He says "can receive SNS Topic" notification. He did not mention other services.

**TODO** Can AWS Config send events to EventBridge or other services? SNS only (later he mentions Event Bridge)?

__QUESTION_END__

## Question 046

__QUESTION__

AWS Config Rules - how to build a custom rule?

__ANSWER__

- Can make custom config rules (must be defined in AWS Lambda)

__QUESTION_END__

## Question 047

__QUESTION__

What are the various logs, where do they write the logs, what activity do they log (7)?

__ANSWER__

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

__QUESTION_END__

## Question 048

__QUESTION__

How to access an instances via SSH without the identify file (key)?

__ANSWER__

EC2 Instance Connect (SendSSHPublicKey API).

There is a 60 second TTL on the file.

__QUESTION_END__
