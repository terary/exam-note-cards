# Section 6 — questions

## Question 001

__QUESTION__

The following describes which volume/drive?

- Network drive you attach to ONE instance only
- Linked to a specific availability zone (transfer: snapshot => restore)
- Volumes can be resized (ONLY UP)
- **Make sure you choose an instance type that is EBS optimized to enjoy maximum throughput**

__ANSWER__

EBS

__QUESTION_END__

## Question 002

__QUESTION__

What are the 4 EBS volume types? Which can be used as boot devices?

__ANSWER__

- EBS Volumes come in 6 types
- `gp2 / gp3 (SSD)`: General purpose SSD volume that balances price and performance for a wide variety of workloads
- `io1 / io2` Block Express: Highest-performance SSD volume for mission-critical low-latency or high-throughput workloads
- `st1 (HDD)`: Low cost HDD volume designed for frequently accessed, throughput-intensive workloads
- `sc1 (HDD)`: Lowest cost HDD volume designed for less frequently accessed workloads

- EBS Volumes are characterized in Size | Throughput | IOPS (I/O Ops Per Sec)
- When in doubt always consult the AWS documentation – it’s good!
- Only gp2/gp3 and io1/io2 can be used as boot volumes

__QUESTION_END__

## Question 003

__QUESTION__

What is the AWS feature to make snap-shots rapidly available (no warm up)

__ANSWER__

- **EBS volumes restored by snapshots need to be pre-warmed (use the Fast
  Snapshot Restore FSR feature or fio/dd command to read the entire volume)**

__QUESTION_END__

## Question 004

__QUESTION__

What is "Data Life Cycle Manager" (3)? What is are the limitations (2)

__ANSWER__

- Automate the creation, retention, and deletion of EBS snapshots and EBS-backed AMIs
- Schedule backups, cross-account snapshot copies, delete outdated backups, …
- Uses resource tags to identify the resources (EC2 instances, EBS volumes)
- Can’t be used to manage snapshots/AMIs created outside DLM
- Can’t be used to manage instance-store backed AMIs

__QUESTION_END__

## Question 005

__QUESTION__

What is the difference between "Data Lifecycle Manager" and "AWS Backup"?

__ANSWER__

- Use Data Lifecycle Manager - when you want to automate the creation, retention, and deletion of
  EBS Snapshots

- Use AWS Backup
  - to manage and monitor backups across the AWS services you use, including EBS volumes, from a single place

__QUESTION_END__

## Question 006

__QUESTION__

How to encrypt EBS volumes?

__ANSWER__

- New Amazon EBS volumes aren’t encrypted by default
- There’s an account-level setting to encrypt automatically new EBS volumes and Snapshots
- This setting needs to be enabled on a per-region basis

__QUESTION_END__

## Question 007

__QUESTION__

What is the catch to multi-attache EBS

__ANSWER__

- Attach the same EBS volume to multiple
  EC2 instances in the same AZ
- Each instance has full read & write
  permissions to the volume
- Use Cases:

- Achieve higher application availability in clustered Linux applications (ex: Teradata)
- Applications must manage concurrent write operations

__QUESTION_END__

## Question 008

__QUESTION__

What are the pros/cons of Local EC2 Instances Store (device attached to EC2 instances)

__ANSWER__

- Physical disk attached to the physical server where your EC2 is
- Very High IOPS (because physical)
- Disks up to 7.5 TiB (can change over time), stripped to reach 60 TiB (can change over time…)
- Block Storage (just like EBS)
- Cannot be increased in size
- Risk of data loss if hardware fails

__QUESTION_END__

## Question 009

__QUESTION__

Compare Contrast EBS to Instance Store?

__ANSWER__

- Instance store is physically attached to the machine (**ephemeral storage**)
- EBS is a network drive (persistent)
- Pros:
  - Better I/O performance (EBS gp2 has a max IOPS of 16000, io1 of 64000, io2
    Block Express of 256000)
  - Good for buffer / cache / scratch data / temporary content
  - Data survives reboots
- Cons:
  - On **stop or termination**, the instance store is lost
  - You can’t resize the instance store
  - Backups must be operated by the user

__QUESTION_END__

## Question 010

__QUESTION__

7 Points to remember about EFS?

__ANSWER__

- Use cases: content management, web serving, data sharing, WordPress
- Compatible with Linux based AMI (not Windows), POSIX-compliant
- Uses NFSv4.1 protocol
- Uses security group to control access to EFS
- Encryption at rest using KMS
- POSIX file system (~Linux) that has a standard file API
- File system scales automatically, pay-per-use, no capacity planning!

__QUESTION_END__

## Question 011

__QUESTION__

Using EFS How can we save 90%?
What is the cheapest/fastest, and the problems with it?

__ANSWER__

- Storage Tiers (lifecycle management feature – move file after N days)
- Standard: for frequently accessed files
- Infrequent access (EFS-IA): cost to retrieve files, lower price to store.
- Archive: rarely accessed data (few times each year), 50% cheaper
- Implement lifecycle policies to move files between storage tiers

- Availability and durability
- Standard: Multi-AZ, great for prod
- One Zone: One AZ, great for dev, backup enabled by default, compatible with IA (EFS One Zone-IA)

- Over 90% in cost savings

__QUESTION_END__

## Question 012

__QUESTION__

What are the 4 S3 Anti patterns

__ANSWER__

- Anti patterns:
  - Lots of small files
  - POSIX file system (use EFS instead), file locks
  - Search features, queries, rapidly changing data
  - Website with dynamic content

__QUESTION_END__

## Question 013

__QUESTION__

Performance Stats for S3? (3) - base line performance.
And 3 performance optimizations?

__ANSWER__

- Amazon S3 automatically scales to high request rates, **latency 100-200 ms**
- Your application can achieve at least 3,500 PUT/COPY/POST/DELETE or
  5,500 GET/HEAD requests per second per prefix in a bucket.
- There are no limits to the number of prefixes in a bucket.

Multi-Part upload:

    - recommended for files > 100MB, must use for files > 5GB
    - Can help parallelize uploads (speed up transfers)

S3 Transfer Acceleration - Increase transfer speed by transferring file to an AWS edge location which will forward the data to the S3 bucket in the
target region - Compatible with multi-part upload

S3 Byte-Range Fetches (8:01)

__QUESTION_END__

## Question 014

__QUESTION__

What is storage lens (5)

__ANSWER__

missing answer

__QUESTION_END__

## Question 015

__QUESTION__

What is the first step to create LifeCycle Rules (or improve them?

__ANSWER__

- May be seen as “Storage Class Analysis” at the exam
- Help you decide when to transition objects to the right storage class
- Recommendations for Standard and Standard IA
  - Does NOT work for One-Zone IA or Glacier
- Report is updated daily
- 24 to 48 hours to start seeing data analysis
- Visualize data in Amazon QuickSight
- Good first step to put together Lifecycle Rules (or
  improve them)

__QUESTION_END__

## Question 016

__QUESTION__

What are the 8 default S3 Lens metrics (4 with use cases)?

__ANSWER__

- Summary Metrics
  - **Use cases: identify the fastest-growing (or not used) buckets and prefixes**
- Cost-Optimization Metrics
  - **Use cases: identify buckets with incomplete multipart uploaded older than 7 days, Identify which objects could be transitioned to lower-cost storage class**

- Data-Protection Metrics
  - **Use cases: identify buckets that aren’t following data-protection best practices**
- Access-management Metrics
  - **Use cases: identify which Object Ownership settings your buckets use**
- Event Metrics
  - no Use case mentioned
- Performance Metrics
  - no Use case mentioned
- Activity Metrics
  - no Use case mentioned
- Detailed Status Code Metrics
  - no Use case mentioned

__QUESTION_END__

## Question 017

__QUESTION__

What are the two deployment options for FSx-Luster? What are the stats for each?

__ANSWER__

- Scratch File System
  - Temporary storage
  - Data is not replicated (doesn’t persist if file server fails)
  - High burst (6x faster, 200MBps per TiB)
  - Usage: short-term processing, optimize costs

- Persistent File System
  - Long-term storage
  - Data is replicated within same AZ
  - Replace failed files within minutes
  - Usage: long-term processing, sensitive data

> Notice that this is FSx-Luster not FSx - something else

__QUESTION_END__

## Question 018

__QUESTION__

How to migrate FSx (windows) singleAz to MultiAx? Two Approaches.

__ANSWER__

> from Single AZ to Multi AZ
> Basically, you have to put your data someplace... Then the MultiAz FS will read/initialize from it.

Two approaches:
A) FSx SingleAz -> AWS DataSync -> FSx MultiAz
B) FSx SingleAz -> backup -> FSx Multi Az

__QUESTION_END__

## Question 019

__QUESTION__

How to shrink FSx Volume? hint: It will require using special service.

__ANSWER__

- If you take a backup, you can only restore to a same size
- You can only increase the amount of storage capacity for a file system; you cannot decrease storage capacity.
- Instead, create a new FSx (smaller), use DataSync to sync data and then migrate your app over

> Similar to migrating from single->multiple Az, You can't actually resize the volume but you stick the data some other place, start a new volume and move to the data to new volume. Must use DataSync to migrate data

__QUESTION_END__

## Question 020

__QUESTION__

What is Lustre "Data Lazy Loading" and what is the advantage?

__ANSWER__

- Any data processing job on Lustre with S3 as an input data source can be started without Lustre doing a full download of the dataset first
- Data is lazy loaded: only the data that is actually processed is loaded, meaning you can decrease your costs and latency
- Data is also loaded only once, therefore you reduce your requests on Amazon S3
  > Hint - this is source data S3
  >

__QUESTION_END__

## Question 021

__QUESTION__

What is DataSync? What is it used for? Transfer rates?
What are the 3 targets?

__ANSWER__

- Move large amount of data to and from
  - On-premises / other cloud to AWS (NFS, SMB, HDFS, S3 API…) – needs agent
  - AWS to AWS (different storage services) – no agent needed
- Can synchronize to:
  - Amazon S3 (any storage classes – including Glacier)
  - Amazon EFS
  - Amazon FSx (Windows, Lustre, NetApp, OpenZFS...)
- Replication tasks can be scheduled hourly, daily, weekly
- **File permissions and metadata are preserved (NFS POSIX, SMB…)**
- One agent task can use 10 Gbps, can setup a bandwidth limit

**EXAM** Expect "**File permissions and metadata are preserved (NFS POSIX, SMB…)**" to be on the exam

__QUESTION_END__

## Question 022

__QUESTION__

In regards to DataSync - what is "Snowcone" how/why is it used?

__ANSWER__

> If network does not have bandwidth use the AWS Snowcone (agent pre-installed).

__QUESTION_END__

## Question 023

__QUESTION__

What is "Data Exchange"?

__ANSWER__

- Find, subscribe to, and use third-party data in the cloud
  - Reuters, who curate data from over 2.2 million unique news stories per year in
    multiple languages
  - Change Healthcare, who process and anonymize more than 14 billion healthcare
    transactions and $1 trillion in claims annually
  - Dun & Bradstreet, who maintain a database of more than 330 million global
    business records;
  - Foursquare, whose location data is derived from 220 million unique consumers
    and includes more than 60 million global commercial venues.

- Once subscribed to a data product, you can use the AWS Data
  Exchange API to load data directly into Amazon S3 and then analyze it
  with a wide variety of AWS analytics and machine learning services

__QUESTION_END__

## Question 024

__QUESTION__

Suppose you have an ML project and requires data of a certain shape (user response, movie review, router news). How can AWS provide you that data.

__ANSWER__

"Data Exchange" A service AWS provides to "broker" data from source. (routers, foursquare, etc.)

__QUESTION_END__

## Question 025

__QUESTION__

How to move data from S3 or EFS using FTP (the AWS solution not simple set-up ftp server).

__ANSWER__

- A fully-managed service for file transfers into and out of Amazon S3 or
  Amazon EFS using the FTP protocol
- Supported Protocols
  - **AWS Transfer for FTP** (File Transfer Protocol (FTP))
  - **AWS Transfer for FTPS** (File Transfer Protocol over SSL (FTPS))
  - **AWS Transfer for SFTP** (Secure File Transfer Protocol (SFTP))
- Managed infrastructure, Scalable, Reliable, Highly Available (multi-AZ)
- Pay per provisioned endpoint per hour + data transfers in GB
- Store and manage users’ credentials within the service
- Integrate with existing authentication systems (Microsoft Active Directory, LDAP, Okta, Amazon Cognito, custom)
- Usage: sharing files, public datasets, CRM, ERP,

__QUESTION_END__

## Question 026

__QUESTION__

List 8 storage classes most to least expensive.

__ANSWER__

- EBS io2, io1
- EFS Standard / EFS OneZone
- EBS gp2, gp3,
- EBS st1
- EFS Standard IA/ S3 Standard
- EBS sc1
- EFS OneZone IA
- S3 Standard IA (cheapest)

**RESEARCH** use cases - I would expect EFS to be more expensive

__QUESTION_END__
