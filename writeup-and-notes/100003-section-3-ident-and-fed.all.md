# Section 3: Identity & Federation - IAM

**Topic:** 4. IAM  
**Duration:** 13min  
**Section:** 3

## Notes


## Transcripts
So let's get started with IAM. So first there's a lot of things you should know about IAM already. So I'm not gonna go over the basics. I will just try to remind you what it is.

So users have long term credentials and therefore you're AWS users.

You can group them and you can also define roles which are going to be short term credentials and then we use the STS service to endorse these roles and get credentials that are gonna be temporary out of those, to do the actions that the roles are authorized to do.


A specific kinda role we've been seeing all along in the courses is the EC2 instance role where it's going to use the EC2 metadata service to get these short-term credentials on an EC2 instance. And you can assign only one role at a time for the instance. But this way, your instance can access for example, an S3 Bucket or DynamoDB table and so on.

There's also service roles which are assigned to services directly. So if you have a service such as API Gateway or CodeDeploy that needs to do an action on an Auto Scaling Group or a Lambda Function or something else, then that service needs to have a role and that role needs to be able and provisioned to do all the actions it needs.

Okay and then finally we have Cross Account roles. And these roles are going to be really helpful in case you need to access another account to perform actions in that other account.

You never share user's credentials Cross Account, you always allow to assume roles and we'll see this in details in this course.

Now you have policies in IAM and they will define what a role or a user can do. And so you have three kinds, You have AWS Managed, which is policies defined by AWS that are going to be changing over time, maybe, but they will do something very specific.

Customer Managed, which is you creating these policies and you can assign them to multiple users or multiple roles and you can make them evolve over time, version them. Or Inline Policies, which are going to be policies assigned to one specific user or one specific role and you can make them evolve over time but you cannot share them across users or across roles.

And finally we'll do a discussion on resource based policies.

_QUESTION_
Elements of IAM Statement (entity) (5)? 
Two have lists have sub lists (3 each)

_ANSWER_
- Users: Long term credentials
- Groups:
- Roles: short-term credentials, uses STS
    - EC2 Instance Roles: uses EC2 metadata service. __One Role at a time__ per instance
    - Service Roles: API Gateway, CodeDeploy, etc
    - Cross Account Roles
- Policies
    - AWS Managed
    - Customer Managed
    - Inline Policy
- Resource Based Policies (S3 Bucket, SQS, etc)        

_END_QUESTION



Slide 2 (2:08) (IAM Policies Deep Dive)

So this is when you have an S3 Bucket policy

or an SQS queue policy and so on,

which would allow us to perform

some really interesting patterns

and we'll see this in this lecture.

So what does an IAM policy look like?

Well, first of all it's going to be JSON document

and they will have four things or five things,

Effects, Action, Resources, Conditions

and sometimes in it, Policy Variables.

We'll do a deep dive in all of those.

But the idea is that a JSON policy looks like this.

And then we have some statement,

for example allow EC2 attach volume,

EC2 detach volume on the resource

which is all EC2 instances.

And the condition is string equals

resource type department development.

That means that only the EC2 instances

tagged with this tag can be attached

or detached to volume and so on.

So this is quite specific

and you can get very, very crazy with IAM policies

but this is how all of AWS works

and we know this already.

If there is an explicit DENY in your IAM policy

then it will have precedence over any ALLOW

and so that means that explicit DENY's

always have the highest priority,

and we'll have a lecture exactly

to understand how IAM policies

and everything else are evaluated in order.

Okay so the best practice we know this already

is to use the least privilege for maximum security.

That means that you need to make sure

that the IAM policies are allowed

just to do what they need to be doing and not more.

Some tools we can use to make sure that this is the case,

there is IAM Access Advisor

where you can see all the permissions

you have granted to an IAM policy.

And the last time each of these permissions

was last accessed.

So in case you have a policy

or something that was not used for a year

maybe it's worth removing it from the IAM policy

to ensure there is less privilege.

Okay, another one is going to be Access Analyzer

and this is to analyze resources are shared

with external entities, for example,

S3 Buckets and this will allow you

to look at if other accounts have access to your S3 Bucket,

maybe there's something you're not expecting here

and you want to make sure to lock down that S3 bucket.

Okay, if you're not very familiar with IAM policy

I would encourage you to go to this URL

to make sure you look at a few of them

and understand them better.

But I would assume that by now

you know what they look like already and how they work.

--
IAM Policies Deep Dive 
- Anatomy of a policy: JSON doc with Effect, Action, Resource, Conditions, Policy Variables
- Explicit DENY has precedence over ALLOW - Best practice: use least privilege for maximum security 
    - Access Advisor: See permissions granted and when last accessed
    - Access Analyzer: Analyze resources that are shared with external entity
- Navigate Examples at: https://docs.aws.amazon.com/IAM/latest/UserGuide/access_policies_examples.html
--

- Anatomy of a policy: JSON doc with Effect, Action, Resource, Conditions, Policy Variables
- Explicit DENY has precedences of ALLOW
- Best practice: use least privilege for maximum security
- Tools to policy review
    - Access Advisor: See permissions granted and when last access
    - Access Analyzer: Analyze resources that are shared with external entity


__QUESTION__
What is the anatomy of a IAM policy (5)? 
__ANSWER__
JSON doc with Effect, Action, Resource, Conditions, Policy Variables
__QUESTION_END__


__QUESTION__
What is the consequence of an Explicit DENY in a policy? (or any DENY)
__ANSWER__
Deny takes precedent over ALLOW.  Any evaluated deny results in DENY regardless of any allows
__QUESTION_END__





Slide 3 4:19
IAM Managed Policies (Important ones)
`AdministratorAccess`
```
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```
`PowerUserAccess`
```
{
"Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "NotAction":[
                "iam:*", "organizations:*", "account:*"
            ]
            "Resource": "*"
        }
    ]
}
```

`NotAction` instead of `DENY`, to avoid the Deny.  With a specified deny it may have a conflict, NotAction avoids that


### Conditions (6:11)
Basic Form:
```
"Condition" : { "{condition-operator}" : { "{condition-key}" : "{condition-value}" }}
```

Operators:
- `String` (StringEquals, StringNotEquals, StringLike…)
    - "Condition": {"StringEquals": {"aws:PrincipalTag/job-category": "iamuser-admin"}}
    - "Condition": {"StringLike": {"s3:prefix": [ "", "home/", "home/${aws:username}/" ]}}
- `Numeric` (NumericEquals, NumericNotEquals, NumericLessThan…)
- `Date` (DateEquals, DateNotEquals, DateLessThan…)
- `Boolean` (Bool):
    - “Condition": {"Bool": {"aws:SecureTransport": "true"}}
    - "Condition": {"Bool": {"aws:MultiFactorAuthPresent": "true"}}
- (Not)`IpAddress`:
    - "Condition": {"IpAddress": {"aws:SourceIp": "203.0.113.0/24"}}
- `ArnEquals`, ArnLike
- `Null`: "Condition":{"Null":{"aws:TokenIssueTime":"true"}}


__QUESTION__
What are the 7 IAM Condition Operators
__ANSWER__
- `String` (StringEquals, StringNotEquals, StringLike…)
    - "Condition": {"StringEquals": {"aws:PrincipalTag/job-category": "iamuser-admin"}}
    - "Condition": {"StringLike": {"s3:prefix": [ "", "home/", "home/${aws:username}/" ]}}
- `Numeric` (NumericEquals, NumericNotEquals, NumericLessThan…)
- `Date` (DateEquals, DateNotEquals, DateLessThan…)
- `Boolean` (Bool):
    - “Condition": {"Bool": {"aws:SecureTransport": "true"}}
    - "Condition": {"Bool": {"aws:MultiFactorAuthPresent": "true"}}
- (Not)`IpAddress`:
    - "Condition": {"IpAddress": {"aws:SourceIp": "203.0.113.0/24"}}
- `ArnEquals`, ArnLike
- `Null`: "Condition":{"Null":{"aws:TokenIssueTime":"true"}}
__QUESTION_END__



### IAM Policies Variables and Tags (8:02)

Example: ${aws:username}
- "Resource": ["arn:aws:s3:::mybucket/${aws:username}/*"]

AWS Specific:
- aws:CurrentTime, aws:TokenIssueTime, aws:principaltype, aws:SecureTransport, aws:SourceIp, aws:userid, ec2:SourceInstanceARN

Service Specific:
- s3:prefix, s3:max-keys, s3:x-amz-acl, sns:Endpoint, sns:Protocol…

Tag Based:
- iam:ResourceTag/key-name, aws:PrincipalTag/key-name



### IAM Roles vs Resource Based Policies (9:24)

Attach a policy to a resource (example: S3 bucket policy) versus attaching of a using a role as a proxy


__QUESTION__
If a user has permissions A, B, and C.

Then then assume a role with permissions P, Q and R

What is the effective permissions?

What is the pseudo-exception?
__ANSWER__

Effective Permissions, P, Q, R.  When assuming a role we loose all the original permissions and take on the assumed role's permissions.

The pseudo-exception is Resource Policies.  When we permit using Resource Policy instead of Assumed Role, the user's permissions persists.
__QUESTION_END__

__TMC__
This isn't entirely clear to me what/why.  I get the basics but not clear why Resource Based is better than Assumed.
__TMC__


### IAM Roles vs Resource Based Policies
- When you assume a role (user, application or service), you give up your
original permissions and take the permissions assigned to the role

- When using a resource-based policy, the principal doesn’t have to give up any
permissions

- Example: User in account A needs to scan a DynamoDB table in Account A
and dump it in an S3 bucket in Account B.

- Supported by: Amazon S3 buckets, SNS topics, SQS queues, Lambda
functions, ECR, Backup, EFS, Glacier, AWS Artifact, Secrets Manager, ACM,
KMS, CloudWatch Logs, API Gateway, EventBridge etc…


When using a Resource Based policy the user doesn't give up their permissions. 


### IAM Permission Boundaries

- IAM Permission Boundaries are supported for users and roles (not groups)
- Advanced feature to use a managed policy to set the maximum permissions
an IAM entity can get.

__QUESTION__
Bounders are supported for which 2 out of 3 IAM entity?
__ANSWER__
Supported for Users and Roles, not supported for Groups

__QUESTION_END__


Boundaries are the Maximum allowed permissions.  Something like Deny All not in the boundary. Hence, no explicit deny.  A user can have allow xyz, but if not ALSO allowed in the boundary, it will yield a DENY (or no allow permission)

__QUESTION__
Permission Boundary.  Suppose Boundary has ALLOW A, B, C, and a user has permissions P, Q, R, and they attempt Q.  What will be the result?
__ANSWER__
implied DENY (not allowed) as the boundary must also have the Q
__QUESTION_END__


Use Cases:

- Delegate responsibilities to non
administrators within their permission
boundaries, for example create new IAM
users

- Allow developers to self-assign policies
and manage their own permissions, while
making sure they can’t “escalate” their
privileges (= make themselves admin)

- Useful to restrict one specific user
(instead of a whole account using Organizations & SCP)


__QUESTION__
What are the three use cases for IAM Permission Boundary
__ANSWER__
- Allow users (developers) manage their own permissions
- delegate responsibility to non-admin (people managers)
- restrict one specific user: (instead of a whole account using Organizations & SCP) 

__QUESTION_END__# Section 3: Identity & Federation - IAM Access Analyzer

**Topic:** 5. IAM Access Analyzer  
**Duration:** 3min  
**Section:** 3

## Notes

- Find out which resources are shared externally
  - S3 Buckets
  - IAM Roles
  - KMS Keys
  - Lambda Functions and Layers
  - SQS queues
  - Secrets Manager Secrets
- Define Zone of Trust = AWS Account or AWS Organization
- Access outside zone of trusts => findings

### 1:44

-IAM Access Analyzer Policy Validation - Validates your policy against IAM policy grammar and best practices - General warnings, security warnings, errors, suggestions - Provides actionable recommendations

- IAM Access Analyzer Policy Generation
  - Generates IAM policy based on access activity
  - CloudTrail logs is reviewed to generate the policy with the **fine-grained permissions and the appropriate Actions and Services**
  - Reviews CloudTrail logs for up to 90 days

**QUESTION**
Using IAM Access Analyzer, how to audit, validate or generate a policy?
**ANSWER**

Step 1 - Create **Zone of Trust**

**QUESTION_END**

**Todo** Use Access Analyzer to audit, generate, verify policy
# Section 3: Identity & Federation - STS

**Topic:** 6. STS  
**Duration:** 12min  
**Section:** 3

## Notes

- Define an IAM Role within your account or cross-account
- Define which principals can access this IAM Role
- Use AWS STS (Security Token Service) to retrieve credentials and impersonate the IAM Role you have access to (AssumeRole API)
- Temporary credentials can be valid between 15 minutes to 12 hour

**QUESTION**
STS Temporary credentials last how long?
**ANSWER**
15 minutes to 12 hours. I assume it's a matter of configuration
**QUESTION_END**

**QUESTION**
What are the steps to set-up STS to Assume a Role (4)?
**ANSWER**

1. Define an IAM Role within your account or cross-account
2. Define which principals can access this IAM Role
3. Use AWS STS (Security Token Service) to retrieve credentials and impersonate the IAM Role you have access to (AssumeRole API)
4. Temporary credentials can be valid between 15 minutes to 12 hour

**QUESTION_END**

#### Assume a Role with STS (2:02)

Use Cases:

- Provide access for an IAM user in one AWS account that you own to access
  resources in another account that you own
- Provide access to IAM users in AWS accounts owned by third parties
- Provide access for services offered by AWS to AWS resources
- Provide access for externally authenticated users (identity federation)

- Ability to revoke active sessions and credentials for a role (by adding a policy using a time statement – AWSRevokeOlderSessions)

  **When you assume a role (user, application or service), you give up your original permissions and take the permissions assigned to the role**

**QUESTION**
What are the use cases for Assume Role?
**ANSWER**

- Provide access for an IAM user in one AWS account that you own to access
  resources in another account that you own (self.account to self.account)
- Provide access to IAM users in AWS accounts owned by third parties (self.account to other.account)
- Provide access for services offered by AWS to AWS resources
  (aws.services to self.resources)
- Provide access for externally authenticated users (identity federation)
  (other.user to self.account)

\* I am pretty sure there are some redundancies

**QUESTION_END**

**QUESTION**
STS - How to revoke active sessions?

**ANSWER**
Revoke active sessions and credentials for a role (by adding a policy using a time statement – AWSRevokeOlderSessions)

**TODO** - revoke active session - see this work

**QUESTION_END**

### Providing Access to an IAM User in Your or Another AWS Account That You Own (3:00)

- You can grant your IAM users permission to switch to roles within your AWS
  account or to roles defined in other AWS accounts **that you own**.

Benefits:

- You must explicitly grant your users permission to assume the role.
- Your users must actively switch to the role using the AWS Management Console or assume the role using the AWS CLI or AWS API
- You can add multi-factor authentication (MFA) protection to the role so that only users who sign in with an MFA device can assume the role
- Least privilege + auditing using CloudTrail

**QUESTION**
Benefits of same account Assume Role (4)?

Same Account
**ANSWER**

- You must explicitly grant your users permission to assume the role.
- Your users must actively switch to the role using the AWS Management Console or assume the role using the AWS CLI or AWS API
- You can add multi-factor authentication (MFA) protection to the role so that only users who sign in with an MFA device can assume the role
- Least privilege + auditing using CloudTrail

**QUESTION_END**

#### Cross account access with STS (4:00)

They provide a graphic but it looks like it's pretty much the same thing.

- Admin creates role **in production** to be used by developers in the **developer account**
- Dev request to access role to access production s3 bucket
- STS provided temporary credentials
- Developer can access production S3 bucket

This scenario assumes the organization has Production Account and Developer's Account

#### Providing Access to AWS Accounts Owned by Third Parties (4:49)

- Zone of trust = accounts, organizations that you own
- Outside Zone of Trust = 3rd parties
- Use IAM Access Analyzer to find out which resources are exposed
- For granting access to a 3rd party:
  - The 3rd party AWS account ID
  - **An External ID** (secret between you and the 3rd party)
    - To uniquely associate with the role between you and 3rd party
    - Must be provided when defining the trust and when assuming the role
    - Must be chosen by the 3rd party
  - Define permissions in the IAM policy

The account/org providing the access creates the external key

#### Confused Deputy

![Confused Deputy](https://docs.aws.amazon.com/images/IAM/latest/UserGuide/images/confuseddeputyproblem2.png "Confused Deputy")

- Self account creates a role `ExampleRole` and provides ARN to Other account
- Bad Actor create a Identical Role (`ExampleRole`) in their account.
- Bad Actor provides ARN to self account, pretending it's to badActor account. Hence, other thinks they are assuming role in badActor account but actually assumes role in Self account.
- Other account thinks it's operating in BadActor account but actually it is operating in BadActor account (hence confused deputy).

So the Self generates an external ID and shares it with the Other account. When Other requests temporary credentials, it must provided the externalId.

"self" - my account
"other" - some trusted external account
"badActor" - account of the bad actor

**QUESTION**
Explain "Confused Deputy" and how an externalId creates an additional layer of trust.
**ANSWER**
![Confused Deputy](https://docs.aws.amazon.com/images/IAM/latest/UserGuide/images/confuseddeputyproblem2.png "Confused Deputy")

- Self account creates a role `ExampleRole` and provides ARN to Other account
- Bad Actor create a Identical Role (`ExampleRole`) in their account.
- Bad Actor provides ARN to self account, pretending it's to badActor account. Hence, other thinks they are assuming role in badActor account but actually assumes role in Self account.
- Other account thinks it's operating in BadActor account but actually it is operating in BadActor account (hence confused deputy).

So the Self generates an external ID and shares it with the Other account. When Other requests temporary credentials, it must provided the externalId.

"self" - my account
"other" - some trusted external account
"badActor" - account of the bad actor

**QUESTION_END**

**QUESTION**
What makes self.account-to-self.account different than self.account-to-other.account?
**ANSWER**
Zone of Trust. The organization has a zone of trust. When going into another account (different org), we cross zone of trust boundaries, I think.
**QUESTION_END**

**QUESTION**
What is the definition of Zone Of Trust - specifically what does it include
**ANSWER**
Accounts Organizations that you own.
**QUESTION_END**

**QUESTION**
What is the process of create a "trust relationship" between Organization/Account? Who provides what?
**ANSWER**

- For granting access to a 3rd party:
  - The 3rd party AWS account ID
  - **An External ID** (secret between you and the 3rd party)
    - To uniquely associate with the role between you and 3rd party
    - Must be provided when defining the trust and when assuming the role
    - Must be chosen by the 3rd party
  - Define permissions in the IAM policy

**QUESTION_END**

#### Session Tags in STS

- Tags that you pass when you assume an IAM Role or federate user in STS
- `aws:PrincipalTag` Condition
  - Compares the tags attached to the principal making the request with the tag you specified in the policy
  - Example: allow a principal to pass session tags only if the principal making the request has the specified tags

```
{
    permission stuff
    "Condition": {
        "StringEquals": {
            "aws:PrincipalTag/Department": "HR"
        }
    }

}
```

I **Assume** that the 'tag' here is 'Department':"HR. Basically help helps to define groups of people.

#### STS Important APIS

- `AssumeRole`: access a role within your account or cross-account
- `AssumeRoleWithSAML`: return credentials for users logged with SAML
- `AssumeRoleWithWebIdentity`: return creds for users logged with an IdP
  - Example providers include Amazon Cognito, Login with Amazon, Facebook,
    Google, or any OpenID Connect-compatible identity provider
  - AWS recommends using Cognito instead
- `GetSessionToken`: for MFA, from a user or AWS account root user
- `GetFederationToken`: obtain temporary creds for a federated user,
  usually a proxy app that will give the creds to a distributed app inside a
  corporate network

##

**QUESTION**
Important STS APIs (3 + 2)?
**ANSWER**

- `AssumeRole`: access a role within your account or cross-account
- `AssumeRoleWithSAML`: return credentials for users logged with SAML
- `AssumeRoleWithWebIdentity`: return creds for users logged with an IdP
  - Example providers include Amazon Cognito, Login with Amazon, Facebook,
    Google, or any OpenID Connect-compatible identity provider
  - AWS recommends using Cognito instead
- `GetSessionToken`: for MFA, from a user or AWS account root user
- `GetFederationToken`: obtain temporary creds for a federated user,
  usually a proxy app that will give the creds to a distributed app inside a
  corporate network

`Assume*` - 3

`Get*Token` - 2

**QUESTION_END**

**QUESTION**
**ANSWER**

**QUESTION_END**
# Section 3: Identity & Federation - Identity Federation & Cognito

**Topic:** 7. Identity Federation & Cognito  
**Duration:** 9min  
**Section:** 3

## Notes

- Give users outside of AWS permissions to access AWS resources in your account
- You don’t need to create IAM Users (user management is outside AWS)
- Use cases:
  - A corporate has its own identity system (e.g., Active Directory)
  - Web/Mobile application that needs access to AWS resources
- Identity Federation can have many flavors:
  - SAML 2.0
  - Custom Identity Broker
  - Web Identity Federation With(out) Amazon Cognito
  - IAM Identity Center

**QUESTION**
What are the four flavors or Identity Federation?
**ANSWER**

- SAML 2.0
- Custom Identity Broker
- Web Identity Federation With(out) Amazon Cognito
- IAM Identity Center

**QUESTION_END**

### SAML 2.0 Federation (1:41)

- Security Assertion Markup Language 2.0 (SAML 2.0)
- Open standard used by many identity providers (e.g., ADFS)
  - Supports integration with Microsoft Active Directory Federations Services (ADFS)
  - Or any SAML 2.0–compatible IdPs with AWS
- Access to AWS Console, AWS CLI, or AWS API using temporary credentials
  - No need to create IAM Users for each of your employees
  - Need to setup a trust between AWS IAM and SAML 2.0 Identity Provider (both ways)
- **Under-the-hood: Uses the STS API** `AssumeRoleWithSAML`
- SAML 2.0 Federation is the **“old way”**, IAM Identity Center Federation is the **new managed and simpler way**
- https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html

**QUESTION**
What is 'SAML 2.0 Federation'?
What is IAM Identity Center Federation?

**ANSWER**

- SAML 2.0 Federation is the **“old way”**, IAM Identity Center Federation is the **new managed and simpler way**

**QUESTION_END**

### SAML 2.0 Federation – AWS **API** Access (2:39)

Diagram

The first diagram/demonstrations shows a user interacting with their SSO provider, upon authN/authZ they're given a `SAML Assertion` which is then used in AWS to gain temporary credentials.

### SAML 2.0 Federation – AWS **Console** Access (3:31)

Diagram - Similar set-up as API access. Except there is no temporary credentials to be used for API access instead a temporary url is provided through authenticated redirect (or similar) and the user then access console.

### SAML 2.0 Federation – Active Directory FS (ADFS) (4:20)

Same set-up but instead of an unknown IdP, it's ActiveDirectory.

### Custom Identity Broker Application (4:38)

**If your IdP is not compatible with SAML 2.0**

- **Use only if Identity Provider is NOT compatible with SAML 2.0**
- The Identity Broker Authenticates users & requests temporary credentials from AWS
- The Identity Broker must determine the appropriate IAM Role
- Uses the STS API AssumeRole or GetFederationToken

The set-up here is that the broker (IdP) will get the temporary credentials from AWS (not the user, user client). I would think, as far as AWS is concerned they don't really care how, but it is probably related to who can make what calls.. Like the IdP has a trust some-how.

**QUESTION**
When to use Custom Identity Broker (provider) Application?
**ANSWER**
If the IdP is not SAML compatible with SAML 2.0
**QUESTION_END**

### Web Identity Federation – Without Cognito (5:54)

**Not Recommended by AWS** anymore. use Cognito instead

This uses special API `AssumeRoleWithWebIdentity`. The web identity comes from the web federation (Gmail, facebook, github, etc.). Client exchanges WebIdentity for temporary credentials.

### Web Identity Federation – With Cognito (7:08)

- Preferred over for Web Identity Federation
  - Create IAM Roles using Cognito with the least privilege needed
  - Build trust between the OIDC IdP and AWS

- Cognito benefits:
  - Supports anonymous users
  - Supports MFA
  - Data Synchronization

- Cognito replaces a Token Vending Machine (TVM)

### Web Identity Federation – IAM Policy

- After being authenticated with Web Identity Federation, you can identify the user with an IAM policy variable

- Examples:
  - cognito-identity.amazonaws.com:sub
  - www.amazon.com:user_id
  - graph.facebook.com:id
  - accounts.google.com:sub

Can use IAM conditional variables to restrict (or allow) these users.
`${www.amazon.com:user_id}`

## --

**QUESTION**
**ANSWER**

**QUESTION_END**
# Section 3: Identity & Federation - AWS Directory Services

**Topic:** 8. AWS Directory Services  
**Duration:** 13min  
**Section:** 3

## Notes

### What is Microsoft Active Directory (AD)?

- Found on any Windows Server with AD Domain Services
- Database of objects: User Accounts, Computers, Printers, File Shares, Security Groups
- Centralized security management, create account, assign permissions
- Objects are organized in **trees**
- A group of trees is a **forest**

> The point he makes is that the user can log into any of the trees within the forest because they all use the same **Domain Controller** (or whatever MS calls their central auth provider)

### What is ADFS (AD Federation Services)? (1:38)

- ADFS provides Single Sign-On across applications
- SAML across 3rd party: AWS Console, Dropbox, Office365, etc

The same basic auth flow as SAML or maybe bring-your-custom-auth. In that the end-user authenticates with their auth provider, gains saml token, saml token used to auth with AWS, AWS responds with redirect to AWS console (loosely speaking, I am sure I am over simplifying)

### AWS Directory Services (2:25)

AWS Managed Service for MS Active Directory. Three flavors

- **AWS Managed Microsoft AD**
  - Create your own AD in AWS, manage users locally, supports MFA
  - Establish “trust” connections with your on-premises AD

- **AD Connector**
  - Directory Gateway (proxy) to redirect to on-premises AD, supports MFA
  - Users are managed on the on-premises AD

- **Simple AD**
  - AD-compatible managed directory on AWS
  - Cannot be joined with on-premises AD

**QUESTION**
What are the three flavors of AWS MicroSoft Active Directory (AD) integrations?
What are the differences
**ANSWER**

- **AWS Managed Microsoft AD**
  - Create your own AD in AWS, manage users locally, supports MFA
  - Establish “trust” connections with your on-premises AD
  - **I believe this requires 2 user lists, in cloud and premise**

- **AD Connector**
  - Directory Gateway (proxy) to redirect to on-premises AD, supports MFA
  - Users are managed on the on-premises AD
  - **I believe this requires only one user list, on-prem, requires cloud connect to on-prem for auth, I think**

- **Simple AD**
  - AD-compatible managed directory on AWS
  - **Cannot be joined with on-premises AD**
  - No link to on-prem, simple, I thought he said backed by Samba - but maybe not, **cheaper**

**QUESTION_END**

### AWS Directory Services AWS Managed Microsoft AD (4:47)

**EXAM** if you know only one of the three, is this the one to know.

- Managed Service: Microsoft AD in **your AWS VPC**

- EC2 Windows Instances:
  - EC2 Windows instances can join the domain and run traditional AD applications (sharepoint, etc)
  - Seamlessly Domain Join Amazon EC2 Instances from Multiple Accounts & VPCs

- Integrations:
  - RDS for SQL Server, AWS Workspaces, Quicksight…
  - AWS SSO to provide access to 3rd party applications

- Standalone repository in AWS or joined to on- premises AD
- Multi AZ deployment of AD in 2 AZ, # of DC (Domain Controllers) can be increased for scaling
- Automated backups
- Automated Multi-Region replication of your directory

> So what he is saying is the managed service requires two or more AZ (I think). It can be integrated with AWS services (eg, your user can auth with AD and use AWS services as opposed to IAM user)

> Also he mentioned running MS apps on EC instances (sharepoint as example).

### AWS Microsoft Managed AD - Integrations (6:00)

> It's a large graphic the demonstrates all of the apps/services a person can access with AD + AWS

- Aws Services/Apps
  - AWS Workspaces
  - AWS Work Docs
  - AWS QuickSite
- Traditional AD Apps
  - SQL Server
  - .NET apps
  - SharePoint

* This requires a **AD Two-way Forest Trust**

### Connect to on-premises AD (7:08)

- Ability to connect your on-premises Active Directory to AWS Managed Microsoft AD
- Must establish a **Direct Connect (DX)** or **VPN connection**
- Can setup three kinds of forest trust:
  - One-way trust: AWS => on-premises
  - One-way trust: on-premises => AWS
  - Two-way forest trust: AWS ó on-premises
- Forest trust is different than synchronization

> Replication is not supported so the systems must maintain two lists or one system must trust the other.

### Solution Architecture: Active Directory Replication (9:23)

- You may want to create a replica of your AD on EC2 in the cloud to minimize latency of in case DX or VPN goes down
- Establish trust between the AWS Managed Microsoft AD and EC2

**EXAM** if the exam is going to ask, it will be something like how to create replication for AD. Such that if there is failure on-prem users can still authenticate. Its kinda goofy, have to have AD on Prem, AD Self-managed, AWS Managed AD and configure them all to work together. Honestly, if I get that question wrong - it will be ok with me.

### AWS Directory Services AD Connector (10:50)

- AD Connector is a directory gateway to redirect directory requests to your on-premises Microsoft Active Directory
- No caching capability
- Manage users solely on-premises, no possibility of setting up a trust
- VPN or Direct Connect (**no trust set-up** which sounds good to me)
- **Doesn’t work with SQL Server, doesn’t do seamless joining, can’t share directory**

> If the connector/VPN goes down, **this is useless**.

The flow is pretty silly.

- User on prem connects to AWS
- AWS uses `LDAP` to connect on prem to get user auth
- User can then get temporary creds for AWS services

> Cheap/Easy for set-up. vulnerable to VPN connection also local user authenticates remotely, to the local auth provider so its still kinda stupid

### AWS Directory Services Simple AD (12:20)

- Simple AD is an inexpensive Active Directory–compatible service with the common directory features.
  - Supports joining EC2 instances, manage users and groups
  - Does not support MFA, RDS SQL server, AWS SSO
  - **Small: 500 users, large: 5000 users**
  - **Powered by Samba 4**, compatible with Microsoft AD
  - lower cost, low scale, basic AD compatible, or LDAP compatibility
  - No trust relationship (with on-prem AD)

> **Does not support MFA, RDS, SQL Server, AWS SSO**

**EXAM** - you may want to know option one "AWS Managed Microsoft AD", and the pros/cons of the others. Fail-over, user management, service access, MFA are things that may/not be available for each... AT THE END OF THE DAY. ITS MICROSOFT - so don't break a sweat trying to know everything
# Section 3: Identity & Federation - AWS Organizations

**Topic:** 9. AWS Organizations  
**Duration:** 6min  
**Section:** 3

## Notes

![AWS Organizations](https://k21academy.com/aws-cloud/aws-organizations/ "AWS Organizations")

### AWS Organizations - OrganizationAccountAccessRole

`OrganizationAccountAccessRole` **EXAM** understand when it is needed and when it is created.

- IAM role which grants full administrator permissions in the Member account to the Management account
- Used to perform admin tasks in the Member accounts (e.g., creating IAM users)
- Could be assumed by IAM users in the Management account
- Automatically added to all new Member accounts created with AWS Organizations
- Must be created manually if you invite an existing Member account

**QUESTION**
What is `OrganizationAccountAccessRole` used for? When is it created?
**ANSWER**
`OrganizationAccountAccessRole` **EXAM** understand when it is needed and when it is created.

- IAM role which grants full administrator permissions in the Member account to the Management account
- Used to perform admin tasks in the Member accounts (e.g., creating IAM users)
- Could be assumed by IAM users in the Management account
- Automatically added to all new Member accounts created with AWS Organizations
- Must be created manually if you invite an existing Member account

**QUESTION_END**

### Multi Account Strategies (2:20)

Use cases:

- Create accounts per department, per cost center, per dev / test / prod based on regulatory restrictions (using SCP), for better resource isolation (ex: VPC), to have separate per-account service limits, isolated
  account for logging,
- Multi Account vs. One Account Multi VPC
- Use tagging standards for billing purposes
- Enable CloudTrail on all accounts, send logs to central S3 account
- Send CloudWatch Logs to central logging account
- Strategy to create an account for security

### Organizational Units (OU) - Examples (3:11)

Graphic, not available on internet
The point of the graphic is that you can organize your accounts as you need.

Maybe by Business Unit, maybe by Environmental Lifecycle, Project (project1, project2), based, etc

### AWS Organization - Feature Modes (3:42)

- **Consolidated billing features**:
  - Consolidated Billing across all accounts - single payment method
  - Pricing benefits from aggregated usage (volume discount for EC2, S3…)
- **All Features (Default)**:
  - Includes consolidated billing features, SCP
  - Invited accounts must approve enabling all features
  - Ability to apply an SCP to prevent member accounts from leaving the org
  - Can’t switch back to Consolidated Billing Features only

One advantages of consolidating accounts like this is billing is consolidated yielding savings.

**QUESTION**
What is the Organization/Account "Feature Modes" (2)? What are the dis/advantage?
**ANSWER**

- **Consolidated billing features**:
  - Consolidated Billing across all accounts - single payment method
  - Pricing benefits from aggregated usage (volume discount for EC2, S3…)
- **All Features (Default)**:
  - Includes consolidated billing features, SCP
  - Invited accounts must approve enabling all features
  - Ability to apply an SCP to prevent member accounts from leaving the org
  - Can’t switch back to Consolidated Billing Features only

> Note that when using 'all features' the added account must approve. The account can
> **NEVER** be unassociated hence the reason for the approval.

One advantages of consolidating accounts like this is billing is consolidated yielding savings.

**QUESTION_END**

### AWS Organizations – Reserved Instances (4:48)

- For billing purposes, the consolidated billing feature of AWS Organizations treats all the accounts in the organization as one account.
- This means that all accounts in the organization can receive the hourly cost benefit of Reserved Instances that are purchased by any other account.
- The payer account (Management account) of an organization can turn off Reserved Instance (RI) discount and Savings Plans discount sharing for any accounts in that organization, including the payer account
- **This means that RIs and Savings Plans discounts aren't shared between any accounts that have sharing turned off**.
- To share an RI or Savings Plans discount with an account, **both accounts must have sharing turned on**

### AWS Organizations – Moving Accounts (5:59)

1. Send an invite to the member account from the AWS Organization
2. Accept the invite to the new Organization from the member account

--
**QUESTION**
**ANSWER**

**QUESTION_END**
# Section 3: Identity & Federation - AWS Organizations Policies

**Topic:** 10. AWS Organizations Policies  
**Duration:** 11min  
**Section:** 3

## Notes

### Service Control Policies (SCP)

- Define allowlist or blocklist IAM actions
- **Applied at the OU or Account level**
- Does not apply to the Management Account (to avoid lockout)
- SCP is applied to all the Users and Roles in the account, **including Root user**
- The SCP does not affect Service-linked roles
  - Service-linked roles enable other AWS services to integrate with AWS Organizations and can't be restricted by SCPs.
- SCP must have an explicit Allow from the root a each OU in the direct path
  to the target account (does not allow anything by default)
- Use cases:
  - Restrict access to certain services (for example: can’t use EMR)
  - Enforce PCI compliance by explicitly disabling services

There must be an explicit `ALLOW`

### SCP Hierarchy

![SCP Hierarchy](https://images.viblo.asia/a274c068-f9c9-4ecc-bbc5-98ea7dcac34f.png "SCP Hierarchy")

The point is that all sub-accounts must have `FullAwsAccess`. That parent `DENY` propagate down. If the parent has FullAwsAccess but DENY for Athena, children account will not have access to Athena (grandchildren also inherit the deny).

### SCP Examples Blocklist and Allowlist strategies

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid":"anything"
            "Effect": "Allow"
            "Action": "*"
            "Resource": "*"
        },
        {
            "Sid":"anything"
            "Effect": "Deny"
            "Action": "dynamodb:*"
            "Resource": "*"
        }
    ]
}
```

**QUESTION**

When is the IAM policy useful/necessary?

```
        {
            "Sid":"anything"
            "Effect": "Allow"
            "Action": "*"
            "Resource": "*"
        },

```

**ANSWER**
Service Control Policy (SCP). Children account must have explicit allow to allow parent account access. The broad allow is often coupled with specific denies.
**QUESTION_END**

### IAM Policy Evaluation Logic (5:00)

The basics - nothing new here. Basically, if there is a explicit DENY then DENY, then if no `ALLOW` then we implicitly deny.

### Restricting Tags with IAM Policies

- You can restrict specific Tags on AWS resources
- Using the aws:TagKeys Condition Key
- Validate the Tag Keys attached to a resource against the Tag Keys in the IAM Policy
- Example: allow IAM users to create EBS Volumes only if it has the “Env” and “CostCenter” Tags
- Use either ForAllValues (must have all keys) or ForAnyValue (must have any of these keys at a minimum)

```
        {
            "Sid":"anything"
            "Effect": "Allow"
            "Action": "something:*"
            "Resource": "something:*"
            "Conditions": {
                "ForAllValues:StringEquals": {
                    "aws:TagKeys": ["Env", "CostCenter"]
                }
            }
        },

```

**QUESTION**
Create a conditional IAM policy using `ForAllValues` and/or `ForAnyValues`
**ANSWER**

```
        {
            "Sid":"anything"
            "Effect": "Allow"
            "Action": "something:*"
            "Resource": "something:*"
            "Conditions": {
                "ForAllValues:StringEquals": {
                    "aws:TagKeys": ["Env", "CostCenter"]
                }
            }
        },

```

**QUESTION_END**

### Using SCP to Deny a Region aws:RequestedRegion (6:52)

> These are going to be DENY because there should be a master/main "ALLOW" everything

```
        {
            "Sid":"anything"
            "Effect": "Deny"
            "Action": "something:*"
            "Resource": "something:*"
            "Conditions": {
                "StringEquals": {
                    "aws:RequestRegion": ["us-east-1", "us-east-1"]
                }
            }
        },

```

**QUESTION**
Write a IAM policy to restrict by region
**ANSWER**

```
        {
            "Sid":"anything"
            "Effect": "Deny"
            "Action": "something:*"
            "Resource": "something:*"
            "Conditions": {
                "StringEquals": {
                    "aws:RequestRegion": ["us-east-1", "us-east-1"]
                }
            }
        },
```

**QUESTION_END**

### Using SCP to Restrict Creating Resources without appropriate Tags (7:43)

- Prevent IAM Users/Roles in the affected Member accounts from creating resources if they don’t have a specific Tags
- Example: restrict launching an EC2 instance if it doesn’t have the “Project” and “CostCenter” Tags

```
        {
            "Sid":"anything"
            "Effect": "Deny"
            "Action": "something:*"
            "Resource": "something:*"
            "Conditions": {
                "Null": {
                    "aws:RequestTag/CostCenter": true
                }
            }
        },
```

**QUESTION**
Using IAM conditionals what does a restrict if does not have tag policy look like?
**ANSWER**

```
        {
            "Sid":"anything"
            "Effect": "Deny"
            "Action": "something:*"
            "Resource": "something:*"
            "Conditions": {
                "Null": {
                    "aws:RequestTag/CostCenter": true
                }
            }
        },
```

**QUESTION_END**

### AWS Organizations – Tag Policies (8:30)

- Helps you standardize tags across resources in an AWS Organization
- Ensure consistent tags, audit tagged resources, maintain proper resources categorization, …
- You define Tag keys and their allowed values
- Helps with AWS Cost Allocation Tags and Attribute-based Access Control
- Prevent any non-compliant tagging operations on specified services and resources
- Generate a report that lists all tagged/non- compliant resources
- Use Amazon EventBridge to monitor non- compliant tags

**The Flow (Mental Model)**

1. You write the policy JSON
2. You go to AWS Organizations
3. You:
   - Create the policy under Policies → **Tag policies**
   - Attach it to:
     - Root (entire org)
     - OU (organizational unit)
     - Individual AWS account

Policy From OpenAI

```
{
  "tags": {
    "Environment": {
      "tag_key": {
        "@@assign": "Environment"
      },
      "tag_value": {
        "@@assign": [
          "Dev",
          "Test",
          "Prod"
        ]
      },
      "enforced_for": {
        "@@assign": [
          "ec2:instance",
          "s3:bucket",
          "rds:db"
        ]
      }
    },
    "Owner": {
      "tag_key": {
        "@@assign": "Owner"
      },
      "tag_value": {
        "@@pattern": "^[a-zA-Z0-9._%+-]+@example\\.com$"
      }
    },
    "CostCenter": {
      "tag_key": {
        "@@assign": "CostCenter"
      },
      "tag_value": {
        "@@pattern": "^[0-9]{4}$"
      }
    },
    "Project": {
      "tag_key": {
        "@@assign": "Project"
      },
      "tag_value": {
        "@@allowed_values": [
          "Website",
          "MobileApp",
          "InternalTool"
        ]
      }
    }
  }
}
```

**TODO** I should create organization implement tag policy that A) requires 'to-be-deleted' tag, and an delete after tag

### AWS Organizations – AI Services Opt-out Policies (9:30)

- Certain AWS AI services may use your content for continuous improvement of Amazon AI/ML services
- Example: Amazon Lex, Amazon Comprehend, Amazon Polly, …
- You can opt-out of having your content stored or used by AWS AI services
- Create an Opt-out Policy that enforces this setting across all Member accounts and AWS Regions
- You can opt-out all AI services or selected services
- Can be attached to Organization Root, specific OU, or individual Member account

**QUESTION**
Organizational IAM policy to `opt-out` of AWS collection data for training purpose?
**ANSWER**

For specific services

```
{
  "services": {
    "default": {
      "opt_out_policy": {
        "@@assign": "optOut"
      }
    },
    "rekognition": {
      "opt_out_policy": {
        "@@assign": "optOut"
      }
    },
    "comprehend": {
      "opt_out_policy": {
        "@@assign": "optOut"
      }
    },
    "textract": {
      "opt_out_policy": {
        "@@assign": "optOut"
      }
    }
  }
}
```

For All services

```
{
  "services": {
    "default": {
      "opt_out_policy": {
        "@@assign": "optOut"
      }
    },
  }
}
```

**QUESTION_END**

### AWS Organizations – Backup Policies (10:26)

- AWS Backup enables you to create Backup Plans that define how to backup your AWS resources
- JSON documents that define Backup Plans across an AWS Organization
- Gives you granular control over backing up your resources (e.g., backup frequency, time window, backup region, …)
- Can be attached to Organization Root, specific OU, or individual Member account
- Immutable Backup Plans appear in Member accounts (view ONLY)

Example:

```
{
  "plans": {
    "PII_backup_plan": {
      "regions": {
        "@@assign": [
          "us-east-1",
          "us-west-2"
        ]
      },
      "rules": {
        "DailyBackups": {
          "schedule_expression": {
            "@@assign": "cron(0 5 * * ? *)"
          },
          "start_backup_window_minutes": {
            "@@assign": "60"
          },
          "complete_backup_window_minutes": {
            "@@assign": "180"
          },
          "lifecycle": {
            "delete_after_days": {
              "@@assign": "30"
            }
          },
          "target_backup_vault_name": {
            "@@assign": "Default"
          }
        },
        "WeeklyBackups": {
          "schedule_expression": {
            "@@assign": "cron(0 6 ? * SUN *)"
          },
          "lifecycle": {
            "delete_after_days": {
              "@@assign": "90"
            }
          },
          "target_backup_vault_name": {
            "@@assign": "Default"
          }
        }
      },
      "selections": {
        "tags": {
          "PIIResources": {
            "iam_role_arn": {
              "@@assign": "arn:aws:iam::$account:role/service-role/AWSBackupDefaultServiceRole"
            },
            "tag_key": {
              "@@assign": "DataClassification"
            },
            "tag_value": {
              "@@assign": [
                "PII",
                "Sensitive"
              ]
            }
          }
        }
      }
    }
  }
}
```

**This is not an IAM policy, this is a \_Organizational Backup Policy**

# --

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")
# Section 3: Identity & Federation - AWS IAM Identity Center

**Topic:** 11. AWS IAM Identity Center  
**Duration:** 7min  
**Section:** 3

## Notes

### AWS IAM Identity Center (successor to AWS Single Sign-On)

> IAM Identity Service, same-same, SSO

- One login (single sign-on) for all your
  - AWS accounts in AWS Organizations
  - Business cloud applications (e.g., Salesforce, Box, Microsoft 365, …)
  - SAML2.0-enabled applications
  - **EC2 Windows Instances**

- Identity providers
  - Built-in identity store in IAM Identity Center
  - 3rd party: Active Directory (AD), OneLogin, Okta

**QUESTION**
What is the service to use, to use one login in for multiple aws accounts.
(One login for everything, EC2 Instances, multiple AWS accounts, Salesforce, etc)
**ANSWER**
IAM Identity Service (formally known as SSO)
**QUESTION_END**

### AWS IAM Identity Center – Login Flow (1:30)

There is a graphic. It's the same thing you've seen a thousand times. Successful login, then you're prompted for which AWS account you wish to assume.

### AWS IAM Identity Center (2:20)

> He discusses the "flow"
> A) login via browser to IAM Identity Center
> B) Identity Center reviews the "User Store" can be Active Directory or AWS Identity Center built in Identity Store (didn't mention if we could use others).
> C) After Step BE completes user has access to AWS Cloud resources (the aws web console), third party apps (Slack, Box, etc), custom SAML apps.

Which apps the user has permission for is determined by **Permission Sets**

### IAM Identity Center (3:16)

Another Graphic demonstrating "Permission Sets" which can be assigned to **user or group**, Maybe you define fullAdmin for Dev but ReadOnly for prod

### AWS IAM Identity Center Fine-grained Permissions and Assignments (4:29)

- Multi-Account Permissions
  - Manage access across AWS accounts in your AWS Organization
  - Permission Sets – a collection of one or more IAM Policies assigned to users and groups to define AWS access
- Application Assignments
  - SSO access to many SAML 2.0 business applications (Salesforce,
    Box, Microsoft 365, …)
  - Provide required URLs, certificates, and metadata
- Attribute-Based Access Control (ABAC)
  - Fine-grained permissions based on users’ attributes stored in IAM Identity Center Identity Store
  - Example: cost center, title, locale, …
  - Use case: Define permissions once, then modify AWS access by changing the attributes

**QUESTION**
What are the three main use case for Identity Center Fined Grain Permissions/Assignments? Give example uses.
**ANSWER**

- 1. Multi-Account Permissions
  - Manage access across AWS accounts in your AWS Organization
  - Permission Sets – a collection of one or more IAM Policies assigned to users and groups to define AWS access
- 2. Application Assignments
  - SSO access to many SAML 2.0 business applications (Salesforce,
    Box, Microsoft 365, …)
  - Provide required URLs, certificates, and metadata
- 3. Attribute-Based Access Control (ABAC)
  - Fine-grained permissions based on users’ attributes stored in IAM Identity Center Identity Store
  - Example: cost center, title, locale, …
  - Use case: Define permissions once, then modify AWS access by changing the attributes

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")
# Section 3: Identity & Federation - AWS Control Tower

**Topic:** 12. AWS Control Tower  
**Duration:** 4min  
**Section:** 3

## Notes

### AWS Control Tower

- Easy way to set up and govern a secure and compliant multi-account
  AWS environment based on best practices
- Benefits:
  - Automate the set up of your environment in a few clicks
  - Automate ongoing policy management using **guardrails**
  - Detect policy violations and remediate them
  - Monitor compliance through an interactive dashboard
- AWS Control Tower runs on top of AWS Organizations:
- It automatically sets up AWS Organizations to organize accounts and implement
  SCPs (Service Control Policies)

**TODO** At least click through, 'monitor compliance' through interactive dashboard

### AWS Control Tower – Account Factory (0:31)

- Automates account provisioning and deployments
- Enables you to create pre-approved baselines and configuration options for AWS accounts in your organization (e.g., VPC default configuration, subnets, region, …)
- Uses AWS Service Catalog to provision new AWS accounts

**TODO** It says it provisions accounts, configured default VPC (when does an account have default VPC?), create pre-approved baseline and configurations. **You want to** click through to understand hwo this works.

> He goes on to explain that if you want to integrate with Active Directory you need to do x, y, z. I don't think it's necessary that I integrate with Active Directory but probably have a basic understanding.

### AWS Control Tower – Detect and Remediate Policy Violations (2:19)

- Guardrail
  - Provides ongoing governance for your Control Tower environment (AWS Accounts)
  - Preventive – using SCPs (e.g., Disallow Creation of Access Keys for the Root User)
  - Detective – using AWS Config (e.g., Detect Whether MFA for the Root User is Enabled)
  - Example: identify non-compliant resources (e.g., untagged resources)

> Two types of Guardrails, "Preventative" using SCPs or "Detective"

Guardrails can be used to send SNS message to notify Admin to remedy or send to Lambda. I am guessing you can send to EventBridge and do anything.

**QUESTION**
Regarding AWS's Control Tower
What are the two types of **guardrails** and give an example use-case for both.
**ANSWER**

- **Preventive** – using SCPs (e.g., Disallow Creation of Access Keys for the Root User)
- **Detective** – using AWS Config (e.g., Detect Whether MFA for the Root User is Enabled)
  **QUESTION_END**

### AWS Control Tower – Guardrails Levels (3:13)

- Mandatory
  - Automatically enabled and enforced by AWS Control Tower
  - Example: Disallow public Read access to the Log Archive account
- Strongly Recommended
  - Based on AWS best practices (optional)
  - Example: Enable encryption for EBS volumes attached to EC2 instances
- Elective
  - Commonly used by enterprises (optional)
  - Example: Disallow delete actions without MFA in S3 buckets

**QUESTION**
Regarding Control Tower Guard Rails Levels. How many levels are there? Give example use case of all, and give the source of the policy.
**ANSWER**

- **Mandatory**
  - Automatically enabled and enforced by AWS Control Tower
  - Example: Disallow public Read access to the Log Archive account
- **Strongly Recommended**
  - Based on AWS best practices (optional)
  - Example: Enable encryption for EBS volumes attached to EC2 instances
- **Elective**
  - Commonly used by enterprises (optional)
  - Example: Disallow delete actions without MFA in S3 buckets

**QUESTION_END**

## ----

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")
# Section 3: Identity & Federation - AWS Resource Access Manager (RAM)

**Topic:** 13. AWS Resource Access Manager - RAM  
**Duration:** 5min  
**Section:** 3

## Notes

### AWS Resource Access Manager (RAM)

- **Share AWS resources** that you own with other AWS accounts
- Share with any account or within your Organization
- Avoid resource duplication!
- VPC Subnets
  - Allow to have all the resources launched in the same subnets
  - Must be from the same AWS Organizations.
  - Cannot share security groups and default VPC
  - Participants can manage their own resources in there
  - Participants can't view, modify, delete resources that belong to other participants or the owner
- AWS Transit Gateway
- Route 53 (Resolver Rules, DNS Firewall Rule Groups)
- License Manager Configurations

**TODO** Have a closer look at the things that can and can not be shared. I have a feeling it is a big deal.

### AWS Resource Access Manager (RAM) (0:58)

- A set of one or more CIDR blocks
- Makes it easier to configure and maintain Security Groups and Route Tables
- Customer-Managed Prefix List
  - Set of CIDRs that you define and manage by you
  - Can be shared with other AWS accounts or AWS Organization
  - Modify to update many security groups at once

- AWS-Managed Prefix List
- Set of CIDRs for AWS services
- You can’t create, modify, share, or delete them

**TODO** Look closer at what capacity/resources can be shared. "Capacity Reservation"

### Resource Access Manager – VPC example (1:26)

- Each account
  - is responsible for its own resources
  - cannot view, modify or delete other resources in other accounts

- Network is shared so…
  - Anything deployed in the VPC can talk to other resources in the VPC
  - Applications are accessed easily across accounts, using private IP!
  - Security groups from other accounts can be referenced for maximum security
- Use Cases:
  - Applications within the same trust boundaries
  - Applications with a high degree of inter-connectivity

**EXAM** get solid on this concept of shared VPC. He mentioned useful for inter organization account. I believe it can also be used with extra-organization accounts, is there a use case for that?

**TODO** He says Security Groups can be referenced but earlier he said they can't be shared?

### Resource Access Manager Managed Prefix List (2:42)

- **A set of one or more CIDR blocks** (a prefix list)
- Makes it easier to configure and maintain Security Groups and Route Tables
- Customer-Managed Prefix List
  - Set of CIDRs that you define and manage by you
  - Can be shared with other AWS accounts or AWS Organization
  - Modify to update many security groups at once
- **AWS-Managed Prefix List**
  - Set of CIDRs for AWS services
  - You can’t create, modify, share, or delete them

> You can define a universal list of CIDR blocks to be used in Security Groups. The Prefix list (cidr blocks) can be referenced by security groups given an organizational level definitions.

> **Changing the Prefix list will update dependent security groups**

### Resource Access Manager Route 53 Outbound Resolver (4:23)

Helps you scale forwarding rules to your DNS in case you have multiple accounts and VPC.

This allows you to have a "centralized management" of Route 53 Resolver rules.

## --

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")
# Section 3: Identity & Federation - Summary

**Topic:** 14. Summary of Identity & Federation  
**Duration:** 2min  
**Section:** 3

## Notes

### Summary of Identity & Federation

- Users and Accounts all in AWS
- AWS Organizations
- AWS Control Tower to setup secure & complaint multi-account AWS environment (**best practices**)
- Federation with SAML
- Federation without SAML with a custom IdP (GetFederationToken)
- IAM Identity Center to connect to multiple AWS Accounts (Organization) and SAML apps
- Web Identity Federation - the old way(**not recommended**)
- Cognito for most web and mobile applications (has anonymous mode, MFA)
- AWS Directory Service:
  - **Managed Microsoft AD** – standalone or setup trust AD with on-premises, has MFA, seamless join, RDS integration
  - **AD Connector** – proxy requests to on-premises
  - **Simple AD** – standalone & cheap AD-compatible with no MFA, no advanced capabilities
- AWS RAM to **share resources** (example VPC subnets)

**QUESTION**
What are the "old" and "new" ways to do Web Identity Federation?

**ANSWER**

I believe "Web Identity Federation" is the old way and "Cognito" is the new way.

**QUESTION_END**

# ---

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")
