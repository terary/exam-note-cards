# Section 3 — extracted questions

## Question 001

__QUESTION__

Elements of IAM Statement (entity) (5)? 
Two have lists have sub lists (3 each)

__ANSWER__

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

__QUESTION_END__

## Question 002

__QUESTION__

What is the anatomy of a IAM policy (5)?

__ANSWER__

JSON doc with Effect, Action, Resource, Conditions, Policy Variables

__QUESTION_END__

## Question 003

__QUESTION__

What is the consequence of an Explicit DENY in a policy? (or any DENY)

__ANSWER__

Deny takes precedent over ALLOW.  Any evaluated deny results in DENY regardless of any allows

__QUESTION_END__

## Question 004

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

## Question 005

__QUESTION__

If a user has permissions A, B, and C.

Then then assume a role with permissions P, Q and R

What is the effective permissions?

What is the pseudo-exception?

__ANSWER__

Effective Permissions, P, Q, R.  When assuming a role we loose all the original permissions and take on the assumed role's permissions.

The pseudo-exception is Resource Policies.  When we permit using Resource Policy instead of Assumed Role, the user's permissions persists.

__QUESTION_END__

## Question 006

__QUESTION__

Bounders are supported for which 2 out of 3 IAM entity?

__ANSWER__

Supported for Users and Roles, not supported for Groups

__QUESTION_END__

## Question 007

__QUESTION__

Permission Boundary.  Suppose Boundary has ALLOW A, B, C, and a user has permissions P, Q, R, and they attempt Q.  What will be the result?

__ANSWER__

implied DENY (not allowed) as the boundary must also have the Q

__QUESTION_END__

## Question 008

__QUESTION__

What are the three use cases for IAM Permission Boundary

__ANSWER__

- Allow users (developers) manage their own permissions
- delegate responsibility to non-admin (people managers)
- restrict one specific user: (instead of a whole account using Organizations & SCP)

__QUESTION_END__

## Question 009

__QUESTION__

Using IAM Access Analyzer, how to audit, validate or generate a policy?

__ANSWER__

Step 1 - Create **Zone of Trust**

__QUESTION_END__

## Question 010

__QUESTION__

STS Temporary credentials last how long?

__ANSWER__

15 minutes to 12 hours. I assume it's a matter of configuration

__QUESTION_END__

## Question 011

__QUESTION__

What are the steps to set-up STS to Assume a Role (4)?

__ANSWER__

1. Define an IAM Role within your account or cross-account
2. Define which principals can access this IAM Role
3. Use AWS STS (Security Token Service) to retrieve credentials and impersonate the IAM Role you have access to (AssumeRole API)
4. Temporary credentials can be valid between 15 minutes to 12 hour

__QUESTION_END__

## Question 012

__QUESTION__

What are the use cases for Assume Role?

__ANSWER__

- Provide access for an IAM user in one AWS account that you own to access
  resources in another account that you own (self.account to self.account)
- Provide access to IAM users in AWS accounts owned by third parties (self.account to other.account)
- Provide access for services offered by AWS to AWS resources
  (aws.services to self.resources)
- Provide access for externally authenticated users (identity federation)
  (other.user to self.account)

\* I am pretty sure there are some redundancies

__QUESTION_END__

## Question 013

__QUESTION__

STS - How to revoke active sessions?

__ANSWER__

Revoke active sessions and credentials for a role (by adding a policy using a time statement – AWSRevokeOlderSessions)

**TODO** - revoke active session - see this work

__QUESTION_END__

## Question 014

__QUESTION__

Benefits of same account Assume Role (4)?

Same Account

__ANSWER__

- You must explicitly grant your users permission to assume the role.
- Your users must actively switch to the role using the AWS Management Console or assume the role using the AWS CLI or AWS API
- You can add multi-factor authentication (MFA) protection to the role so that only users who sign in with an MFA device can assume the role
- Least privilege + auditing using CloudTrail

__QUESTION_END__

## Question 015

__QUESTION__

Explain "Confused Deputy" and how an externalId creates an additional layer of trust.

__ANSWER__

![Confused Deputy](https://docs.aws.amazon.com/images/IAM/latest/UserGuide/images/confuseddeputyproblem2.png "Confused Deputy")

- Self account creates a role `ExampleRole` and provides ARN to Other account
- Bad Actor create a Identical Role (`ExampleRole`) in their account.
- Bad Actor provides ARN to self account, pretending it's to badActor account. Hence, other thinks they are assuming role in badActor account but actually assumes role in Self account.
- Other account thinks it's operating in BadActor account but actually it is operating in BadActor account (hence confused deputy).

So the Self generates an external ID and shares it with the Other account. When Other requests temporary credentials, it must provided the externalId.

"self" - my account
"other" - some trusted external account
"badActor" - account of the bad actor

__QUESTION_END__

## Question 016

__QUESTION__

What makes self.account-to-self.account different than self.account-to-other.account?

__ANSWER__

Zone of Trust. The organization has a zone of trust. When going into another account (different org), we cross zone of trust boundaries, I think.

__QUESTION_END__

## Question 017

__QUESTION__

What is the definition of Zone Of Trust - specifically what does it include

__ANSWER__

Accounts Organizations that you own.

__QUESTION_END__

## Question 018

__QUESTION__

What is the process of create a "trust relationship" between Organization/Account? Who provides what?

__ANSWER__

- For granting access to a 3rd party:
  - The 3rd party AWS account ID
  - **An External ID** (secret between you and the 3rd party)
    - To uniquely associate with the role between you and 3rd party
    - Must be provided when defining the trust and when assuming the role
    - Must be chosen by the 3rd party
  - Define permissions in the IAM policy

__QUESTION_END__

## Question 019

__QUESTION__

Important STS APIs (3 + 2)?

__ANSWER__

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

__QUESTION_END__

## Question 020

__QUESTION__

What are the four flavors or Identity Federation?

__ANSWER__

- SAML 2.0
- Custom Identity Broker
- Web Identity Federation With(out) Amazon Cognito
- IAM Identity Center

__QUESTION_END__

## Question 021

__QUESTION__

What is 'SAML 2.0 Federation'?
What is IAM Identity Center Federation?

__ANSWER__

- SAML 2.0 Federation is the **“old way”**, IAM Identity Center Federation is the **new managed and simpler way**

__QUESTION_END__

## Question 022

__QUESTION__

When to use Custom Identity Broker (provider) Application?

__ANSWER__

If the IdP is not SAML compatible with SAML 2.0

__QUESTION_END__

## Question 023

__QUESTION__

What are the three flavors of AWS MicroSoft Active Directory (AD) integrations?
What are the differences

__ANSWER__

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

__QUESTION_END__

## Question 024

__QUESTION__

What is `OrganizationAccountAccessRole` used for? When is it created?

__ANSWER__

`OrganizationAccountAccessRole` **EXAM** understand when it is needed and when it is created.

- IAM role which grants full administrator permissions in the Member account to the Management account
- Used to perform admin tasks in the Member accounts (e.g., creating IAM users)
- Could be assumed by IAM users in the Management account
- Automatically added to all new Member accounts created with AWS Organizations
- Must be created manually if you invite an existing Member account

__QUESTION_END__

## Question 025

__QUESTION__

What is the Organization/Account "Feature Modes" (2)? What are the dis/advantage?

__ANSWER__

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

__QUESTION_END__

## Question 026

__QUESTION__

When is the IAM policy useful/necessary?

```
        {
            "Sid":"anything"
            "Effect": "Allow"
            "Action": "*"
            "Resource": "*"
        },

```

__ANSWER__

Service Control Policy (SCP). Children account must have explicit allow to allow parent account access. The broad allow is often coupled with specific denies.

__QUESTION_END__

## Question 027

__QUESTION__

Create a conditional IAM policy using `ForAllValues` and/or `ForAnyValues`

__ANSWER__

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

__QUESTION_END__

## Question 028

__QUESTION__

Write a IAM policy to restrict by region

__ANSWER__

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

__QUESTION_END__

## Question 029

__QUESTION__

Using IAM conditionals what does a restrict if does not have tag policy look like?

__ANSWER__

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

__QUESTION_END__

## Question 030

__QUESTION__

Organizational IAM policy to `opt-out` of AWS collection data for training purpose?

__ANSWER__

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

__QUESTION_END__

## Question 031

__QUESTION__

What is the service to use, to use one login in for multiple aws accounts.
(One login for everything, EC2 Instances, multiple AWS accounts, Salesforce, etc)

__ANSWER__

IAM Identity Service (formally known as SSO)

__QUESTION_END__

## Question 032

__QUESTION__

What are the three main use case for Identity Center Fined Grain Permissions/Assignments? Give example uses.

__ANSWER__

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

__QUESTION_END__

## Question 033

__QUESTION__

Regarding AWS's Control Tower
What are the two types of **guardrails** and give an example use-case for both.

__ANSWER__

- **Preventive** – using SCPs (e.g., Disallow Creation of Access Keys for the Root User)
- **Detective** – using AWS Config (e.g., Detect Whether MFA for the Root User is Enabled)

__QUESTION_END__

## Question 034

__QUESTION__

Regarding Control Tower Guard Rails Levels. How many levels are there? Give example use case of all, and give the source of the policy.

__ANSWER__

- **Mandatory**
  - Automatically enabled and enforced by AWS Control Tower
  - Example: Disallow public Read access to the Log Archive account
- **Strongly Recommended**
  - Based on AWS best practices (optional)
  - Example: Enable encryption for EBS volumes attached to EC2 instances
- **Elective**
  - Commonly used by enterprises (optional)
  - Example: Disallow delete actions without MFA in S3 buckets

__QUESTION_END__

## Question 035

__QUESTION__

What are the "old" and "new" ways to do Web Identity Federation?

__ANSWER__

I believe "Web Identity Federation" is the old way and "Cognito" is the new way.

__QUESTION_END__
