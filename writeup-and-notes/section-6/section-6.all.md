# Section 6: Storage - EBS & Local Instance Store

**Topic:** 69. EBS & Local Instance Store  
**Duration:** 9min  
**Section:** 6

### EBS

- Network drive you attach to ONE instance only
- Linked to a specific availability zone (transfer: snapshot => restore)
- Volumes can be resized
- Make sure you choose an instance type that is EBS optimized to enjoy maximum
  throughput

**QUESTION**
The following describes which volume/drive?

- Network drive you attach to ONE instance only
- Linked to a specific availability zone (transfer: snapshot => restore)
- Volumes can be resized (ONLY UP)
- **Make sure you choose an instance type that is EBS optimized to enjoy maximum throughput**

**ANSWER**
EBS
**QUESTION_END**

### EBS Volume Types (0:52)

- EBS Volumes come in 6 types
- `gp2 / gp3 (SSD)`: General purpose SSD volume that balances price and performance for a wide variety of workloads
- `io1 / io2` Block Express: Highest-performance SSD volume for mission-critical low-latency or high-throughput workloads
- `st1 (HDD)`: Low cost HDD volume designed for frequently accessed, throughput-intensive workloads
- `sc1 (HDD)`: Lowest cost HDD volume designed for less frequently accessed workloads

- EBS Volumes are characterized in Size | Throughput | IOPS (I/O Ops Per Sec)
- When in doubt always consult the AWS documentation – it’s good!
- Only gp2/gp3 and io1/io2 can be used as boot volumes

**QUESTION**
What are the 4 EBS volume types? Which can be used as boot devices?
**ANSWER**

- EBS Volumes come in 6 types
- `gp2 / gp3 (SSD)`: General purpose SSD volume that balances price and performance for a wide variety of workloads
- `io1 / io2` Block Express: Highest-performance SSD volume for mission-critical low-latency or high-throughput workloads
- `st1 (HDD)`: Low cost HDD volume designed for frequently accessed, throughput-intensive workloads
- `sc1 (HDD)`: Lowest cost HDD volume designed for less frequently accessed workloads

- EBS Volumes are characterized in Size | Throughput | IOPS (I/O Ops Per Sec)
- When in doubt always consult the AWS documentation – it’s good!
- Only gp2/gp3 and io1/io2 can be used as boot volumes

**QUESTION_END**

### EBS Snapshots (2:10)

- Incremental – only backup changed blocks
- EBS backups use IO, and you shouldn’t run them while your application is
  handling a lot of traffic
- Snapshots will be stored in S3 (but you won’t directly see them)
- Not necessary to detach volume to do snapshot, but recommended
- Can copy snapshots across region (for DR)
- Can make Image (AMI) from Snapshot
- **EBS volumes restored by snapshots need to be pre-warmed (use the Fast
  Snapshot Restore FSR feature or fio/dd command to read the entire volume)**

**QUESTION**
What is the AWS feature to make snap-shots rapidly available (no warm up)
**ANSWER**

- **EBS volumes restored by snapshots need to be pre-warmed (use the Fast
  Snapshot Restore FSR feature or fio/dd command to read the entire volume)**

**QUESTION_END**

**TODO** Create a snapshot, move it to another region and restore, also look at the FSR (you need to know a couple of commands before you can use the snapshot)

### Amazon Data Lifecycle Manager (3:56)

- Automate the creation, retention, and deletion of EBS snapshots and EBS-backed AMIs
- Schedule backups, cross-account snapshot copies, delete outdated backups, …
- Uses resource tags to identify the resources (EC2 instances, EBS volumes)
- Can’t be used to manage snapshots/AMIs created outside DLM
- Can’t be used to manage instance-store backed AMIs

**QUESTION**
What is "Data Life Cycle Manager" (3)? What is are the limitations (2)
**ANSWER**

- Automate the creation, retention, and deletion of EBS snapshots and EBS-backed AMIs
- Schedule backups, cross-account snapshot copies, delete outdated backups, …
- Uses resource tags to identify the resources (EC2 instances, EBS volumes)
- Can’t be used to manage snapshots/AMIs created outside DLM
- Can’t be used to manage instance-store backed AMIs

**QUESTION_END**

### Amazon Data Lifecycle Manager vs. AWS Backup (4:52)

- Use Data Lifecycle Manager - when you want to automate the creation, retention, and deletion of
  EBS Snapshots

- Use AWS Backup
  - to manage and monitor backups across the AWS services you use, including EBS volumes, from a single place

**QUESTION**
What is the difference between "Data Lifecycle Manager" and "AWS Backup"?
**ANSWER**

- Use Data Lifecycle Manager - when you want to automate the creation, retention, and deletion of
  EBS Snapshots

- Use AWS Backup
  - to manage and monitor backups across the AWS services you use, including EBS volumes, from a single place

**QUESTION_END**

### EBS Encryption – Account level setting (5:18)

- New Amazon EBS volumes aren’t encrypted by default
- There’s an account-level setting to encrypt automatically new EBS volumes and Snapshots
- This setting needs to be enabled on a per-region basis
  **QUESTION**
  How to encrypt EBS volumes?
  **ANSWER**
- New Amazon EBS volumes aren’t encrypted by default
- There’s an account-level setting to encrypt automatically new EBS volumes and Snapshots
- This setting needs to be enabled on a per-region basis
  **QUESTION_END**

**RESEARCH** Encryption of EBS - can only happen with the account setting?

### EBS Multi-Attach – io1/io2 family (6:38)

- Attach the same EBS volume to multiple
  EC2 instances in the same AZ
- Each instance has full read & write
  permissions to the volume
- Use Cases:

- Achieve higher application availability in clustered Linux applications (ex: Teradata)
- Applications must manage concurrent write operations

**QUESTION**
What is the catch to multi-attache EBS
**ANSWER**

- Attach the same EBS volume to multiple
  EC2 instances in the same AZ
- Each instance has full read & write
  permissions to the volume
- Use Cases:

- Achieve higher application availability in clustered Linux applications (ex: Teradata)
- Applications must manage concurrent write operations

**QUESTION_END**

### Local EC2 Instance Store (6:50)

(disk attached to the instances)

- Physical disk attached to the physical server where your EC2 is
- Very High IOPS (because physical)
- Disks up to 7.5 TiB (can change over time), stripped to reach 60 TiB (can change over time…)
- Block Storage (just like EBS)
- Cannot be increased in size
- Risk of data loss if hardware fails
  **QUESTION**
  What are the pros/cons of Local EC2 Instances Store (device attached to EC2 instances)
  **ANSWER**

- Physical disk attached to the physical server where your EC2 is
- Very High IOPS (because physical)
- Disks up to 7.5 TiB (can change over time), stripped to reach 60 TiB (can change over time…)
- Block Storage (just like EBS)
- Cannot be increased in size
- Risk of data loss if hardware fails

**QUESTION_END**

### Instance Store vs EBS

- Instance store is physically attached to the machine (ephemeral storage)
- EBS is a network drive (persistent)
- Pros:
  - Better I/O performance (EBS gp2 has a max IOPS of 16000, io1 of 64000, io2
    Block Express of 256000)
  - Good for buffer / cache / scratch data / temporary content
  - Data survives reboots
- Cons:
  - On stop or termination, the instance store is lost
  - You can’t resize the instance store
  - Backups must be operated by the user

**QUESTION**
Compare Contrast EBS to Instance Store?
**ANSWER**

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

**QUESTION_END**

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - Amazon EFS

**Topic:** 70. Amazon EFS  
**Duration:** 9min  
**Section:** 6

### EFS – Elastic File System

- Managed NFS (network file system) that **can be mounted on many EC2**
- EFS works with EC2 instances in multi-AZ, & on–premises (DX & VPN)
- Highly available, scalable, expensive (3x gp2), pay per GB used

### EFS – Elastic File System

- Use cases: content management, web serving, data sharing, WordPress
- Compatible with Linux based AMI (not Windows), POSIX-compliant
- Uses NFSv4.1 protocol
- Uses security group to control access to EFS
- Encryption at rest using KMS
- POSIX file system (~Linux) that has a standard file API
- File system scales automatically, pay-per-use, no capacity planning!

**QUESTION**
7 Points to remember about EFS?
**ANSWER**

- Use cases: content management, web serving, data sharing, WordPress
- Compatible with Linux based AMI (not Windows), POSIX-compliant
- Uses NFSv4.1 protocol
- Uses security group to control access to EFS
- Encryption at rest using KMS
- POSIX file system (~Linux) that has a standard file API
- File system scales automatically, pay-per-use, no capacity planning!

**QUESTION_END**

### EFS – Performance & Storage Classes (2:01)

- EFS Scale
- 1000s of concurrent NFS clients, 10 GB+ /s throughput
- Grow to Petabyte-scale network file system, automatically
- Performance Mode (set at EFS creation time)
- General Purpose (default) – latency-sensitive use cases (web server, CMS, etc…)
- Max I/O – higher latency, throughput, highly parallel (big data, media processing)
- Throughput Mode
- Bursting – 1 TB = 50MiB/s + burst of up to 100MiB/s
- Provisioned – set your throughput regardless of storage size, ex: 1 GiB/s for 1 TB storage
- Elastic – automatically scales throughput up or down based on your workloads
- Up to 3GiB/s for reads and 1GiB/s for writes
- Used for unpredictable workloa

**RESEARCH** EFS Capacity and performance. How to set max performance? What are the "performance modes", what is the thoroughput modes?

### EFS – Storage Classes (3:49)

- Storage Tiers (lifecycle management feature – move file after N days)
- Standard: for frequently accessed files
- Infrequent access (EFS-IA): cost to retrieve files, lower price to store.
- Archive: rarely accessed data (few times each year), 50% cheaper
- Implement lifecycle policies to move files between storage tiers

- Availability and durability
- Standard: Multi-AZ, great for prod
- One Zone: One AZ, great for dev, backup enabled by default, compatible with IA (EFS One Zone-IA)

- Over 90% in cost savings

**QUESTION**
Using EFS How can we save 90%?
What is the cheapest/fastest, and the problems with it?
**ANSWER**

- Storage Tiers (lifecycle management feature – move file after N days)
- Standard: for frequently accessed files
- Infrequent access (EFS-IA): cost to retrieve files, lower price to store.
- Archive: rarely accessed data (few times each year), 50% cheaper
- Implement lifecycle policies to move files between storage tiers

- Availability and durability
- Standard: Multi-AZ, great for prod
- One Zone: One AZ, great for dev, backup enabled by default, compatible with IA (EFS One Zone-IA)

- Over 90% in cost savings

**QUESTION_END**

### EFS - On-premises & VPC Peering (5:37)

[Diagram not available]
The point is its' possible to access the EFS from onprem using site-to-site VPN or DirectConnect

### EFS – Access Points (6:40)

- Easily manage applications access to NFS environments
- Enforce a POSIX user and group to use when accessing the file system
- Restrict access to a directory within the file system and optionally specify a different root directory
- Can restrict access from NFS clients using IAM policies

**RESEARCH** What is this EFS Access Points? How do we set-up? What do they look like?

### EFS – File System Policies (7:50)

- Resource-based policy to control access to EFS File Systems (same as S3
  bucket policy)
- By default, it grants full access to all clients

### EFS – Cross-Region Replication (8:14)

- Replicate objects in an EFS file system to another AWS Region
- Setup for new or existing EFS file systems
- Provides RPO and RTO of minutes
- Doesn’t affect the provisioned throughput of the EFS file system
- Use cases: meet your compliance and business continuity goals

**RESEARCH** Cross Region Replication EFS. He gives a few points but I didn't really "visualize" it.

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - Amazon S3

**Topic:** 71. Amazon S3  
**Duration:** 10min  
**Section:** 6

## Notes

- Object storage, serverless, unlimited storage, pay-as-you-go
- Good to store static content (image, video files)
- Access objects by key, no indexing facility
- Not a filesystem, cannot be mounted natively on EC2

- Anti patterns:
  - Lots of small files
  - POSIX file system (use EFS instead), file locks
  - Search features, queries, rapidly changing data
  - Website with dynamic content

**QUESTION**
What are the 4 S3 Anti patterns
**ANSWER**

- Anti patterns:
  - Lots of small files
  - POSIX file system (use EFS instead), file locks
  - Search features, queries, rapidly changing data
  - Website with dynamic content

**QUESTION_END**

### S3 Storage Classes Comparison (0:30)

![S3 Storage Classes](https://jayendrapatil.com/wp-content/uploads/2023/06/S3-Storage-Classes-Performance.png "S3 Storage Classes")

> You can transition/delete objects using lifecycle policy

### S3 – Replication (Versioning enabled) (1:23)

- Cross Region Replication (CRR)
- Same Region Replication (SRR)
- Combine with Lifecycle Rules

- Helpful to reduce latency, disaster recovery, security

- **S3 Replication Time Control (S3 RTC)**
- Replicates most objects that you upload to Amazon S3 in seconds, and 99.99% of those objects within 15 minutes
- Helpful for compliance, DR, etc..

Interesting Tidbit

> S3 Replication is asynchronous, typically replicating most objects within seconds to minutes, with a 15-minute SLA for 99.99% of objects when using Replication Time Control (RTC). Lifecycle policies do not automatically apply to the destination bucket; you must configure separate lifecycle rules on the destination bucket to manage storage classes or expirations

RTC = Replication Time Control

### S3 Event Notifications (2:49)

- **S3:ObjectCreated**, **S3:ObjectRemoved**, **S3:ObjectRestore**, **S3:Replication** and more
- Object name filtering possible (\*.jpg)
- Use case: generate thumbnails of images uploaded to S3
- Can create as many “S3 events” as desired
- S3 event notifications typically deliver events in seconds but can sometimes take a minute or longer

### S3 Event Notifications with Amazon EventBridge (3:21)

- Advanced filtering options with JSON rules (metadata, object size, name...)
- Multiple Destinations – ex Step Functions, Kinesis Streams / Firehose…
- EventBridge Capabilities – Archive, Replay Events, Reliable delivery

### S3 – Baseline Performance (4:35)

- Amazon S3 automatically scales to high request rates, **latency 100-200 ms**
- Your application can achieve at least 3,500 PUT/COPY/POST/DELETE or
  5,500 GET/HEAD requests per second per prefix in a bucket.
- There are no limits to the number of prefixes in a bucket.
- Example (object path => prefix):
- bucket/folder1/sub1/file => /folder1/sub1/
- bucket/folder1/sub2/file => /folder1/sub2/
- bucket/1/file=> /1/
- bucket/2/file=> /2/
- If you spread reads across all four prefixes evenly, you can achieve 22,000
  requests per second for GET and HEAD

**QUESTION**
Performance Stats for S3? (3) - base line performance.
And 3 performance optimizations?
**ANSWER**

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

**QUESTION_END**

### S3 Performance (6:11)

Multi-Part upload:

    - recommended for files > 100MB, must use for files > 5GB
    - Can help parallelize uploads (speed up transfers)

S3 Transfer Acceleration - Increase transfer speed by transferring file to an AWS edge location which will forward the data to the S3 bucket in the
target region - Compatible with multi-part upload

### S3 Performance – S3 Byte-Range Fetches (8:01)

- Parallelize GETs by requesting specific byte ranges
- Better resilience in case of failures

> Can be used to speed downloads or retrieve partial files

### S3 Multi-Part Upload – Remove Incomplete Parts (9:12)

- Understand, analyze, and optimize storage across entire AWS Organization
- Discover anomalies, identify cost efficiencies, and apply data protection best practices across entire AWS Organization (30 days usage & activity metrics)
- Aggregate data for Organization, specific accounts, regions, buckets, or prefixes
- Default dashboard or create your own dashboards
- Can be configured to export metrics daily to an S3 bucket (CSV, Parquet)

**QUESTION**
What is storage lens (5)
**ANSWER**

**QUESTION_END**

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - Amazon S3 - Storage Class Analysis

**Topic:** 72. Amazon S3 - Storage Class Analysis  
**Duration:** 1min  
**Section:** 6

### S3 Analytics – Storage Class Analysis

- May be seen as “Storage Class Analysis” at the exam
- Help you decide when to transition objects to the right storage class
- Recommendations for Standard and Standard IA
  - Does NOT work for One-Zone IA or Glacier
- Report is updated daily
- 24 to 48 hours to start seeing data analysis
- Visualize data in Amazon QuickSight
- Good first step to put together Lifecycle Rules (or
  improve them)

**QUESTION**
What is the first step to create LifeCycle Rules (or improve them?
**ANSWER**

- May be seen as “Storage Class Analysis” at the exam
- Help you decide when to transition objects to the right storage class
- Recommendations for Standard and Standard IA
  - Does NOT work for One-Zone IA or Glacier
- Report is updated daily
- 24 to 48 hours to start seeing data analysis
- Visualize data in Amazon QuickSight
- Good first step to put together Lifecycle Rules (or
  improve them)

**QUESTION_END**

### Storage Lens – Default Dashboard

- Visualize summarized insights and trends for both free and advanced metrics
- Default dashboard shows Multi-Region and Multi-Account data
- Preconfigured by Amazon S3
- Can’t be deleted, but can be disabled

### Storage Lens – Metrics (I)

- Summary Metrics
  - General insights about your S3 storage
  - StorageBytes, ObjectCount…
  - **Use cases: identify the fastest-growing (or not used) buckets and prefixes**
- Cost-Optimization Metrics
  - Provide insights to manage and optimize your storage costs
  - NonCurrentVersionStorageBytes, IncompleteMultipartUploadStorageBytes…
  - **Use cases: identify buckets with incomplete multipart uploaded older than 7 days, Identify which objects could be transitioned to lower-cost storage class**

### Storage Lens – Default Dashboard (II) (3:26)

- Data-Protection Metrics
  - Provide insights for data protection features
  - VersioningEnabledBucketCount, MFADeleteEnabledBucketCount, SSEKMSEnabledBucketCount,
    CrossRegionReplicationRuleCount…
  - **Use cases: identify buckets that aren’t following data-protection best practices**
- Access-management Metrics
  - Provide insights for S3 Object Ownership
  - ObjectOwnershipBucketOwnerEnforcedBucketCount…
  - **Use cases: identify which Object Ownership settings your buckets use**
- Event Metrics
  - Provide insights for S3 Event Notifications
  - EventNotificationEnabledBucketCount (identify which buckets have S3 Event Notifications configured)

### Storage Lens – Default Dashboard (III) (3:59)

- Performance Metrics
  - Provide insights for S3 Transfer Acceleration
  - TransferAccelerationEnabledBucketCount (identify which buckets have S3 Transfer Acceleration enabled)
- Activity Metrics
  - Provide insights about how your storage is requested
  - AllRequests, GetRequests, PutRequests, ListRequests, BytesDownloaded…
- Detailed Status Code Metrics
  - Provide insights for HTTP status codes
  - 200OKStatusCount, 403ForbiddenErrorCount, 404NotFoundErrorCount…

**QUESTION**
What are the 8 default S3 Lens metrics (4 with use cases)?
**ANSWER**

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

**QUESTION_END**

### Storage Lens – Free vs. Paid (5:09)

- Free Metrics
  - Automatically available for all customers
  - Contains around 28 usage metrics
  - Data is available for queries for 14 days

- Advanced Metrics and Recommendations
  - Additional paid metrics and features
  - Advanced Metrics – Activity, Advanced Cost Optimization, Advanced Data Protection, Status Code
  - CloudWatch Publishing – Access metrics in CloudWatch without additional charges
  - Prefix Aggregation – Collect metrics at the prefix level
  - Data is available for queries for 15 months

**RESEARCH** How would I find how many objects are encrypted across the whole org, account, bucket?

## Notes

**QUESTION**

**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - Amazon S3 - Storage Lens

**Topic:** 73. Amazon S3 - Storage Lens  
**Duration:** 6min  
**Section:** 6

### S3 – Storage Lens

This got combined with 10072

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - S3 Solution Architecture

**Topic:** 74. S3 Solution Architecture  
**Duration:** 6min  
**Section:** 6

### S3 Solution Architecture Exposing Static Objects (cloudfront- cache)

[Diagram demonstrate different scenario]
Ultimately it boils down to host static resources on S3 then reference those in the client (hence no infrastructure - client-s3)

### S3 Solution Architecture Indexing objects in DynamoDB (2:25)

**RESEARCH** What would be the cost of storing urls in DynamoDB (1, 10, 100 million records)

### Solution Architecture on AWS Dynamic vs Static Content

[Diagram explain different scenario]

Basically,
Use DynamoDB for files that may change frequently or similar non-stale scenario. For static content serve from bucket. They don't go into detail but I think this can be handled at R53,

**RESEARCH** Can I use R53 to route requests for static content? CloudFront?

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - Amazon FSx

**Topic:** 75. Amazon FSx  
**Duration:** 8min  
**Section:** 6

### Amazon FSx – Overview

- Launch 3rd party high-performance file systems on AWS
- **Fully managed service**
  > Same as RDS but for file system

Supports:

- FSx for Lustre
- FSx for Windows File Server
- FSx for NetApp ONTAPP
- FSx for OpenZFS

### Amazon FSx for Windows (File Server)

- FSx for Windows is a fully managed Windows file system **share drive**
- Supports **SMB** protocol & Windows **NTFS**
- Microsoft Active Directory integration, ACLs, user quotas
- **Can be mounted on Linux EC2 instances** (**EXAM**)
- Supports Microsoft's Distributed File System (DFS) Namespaces (group files across multiple FS)
- Scale up to 10s of GB/s, millions of IOPS, 100s PB of data
- Storage Options:
  - SSD – latency sensitive workloads (databases, media processing, data analytics, …)
  - HDD – broad spectrum of workloads (home directory, CMS, …)
- Can be accessed from your on-premises infrastructure (VPN or Direct Connect)
- Can be configured to be Multi-AZ (high availability)
- Data is backed-up daily to S3

**RESEARCH** "- Can be configured to be Multi-AZ (high availability)" I think that is not applicable for all FSx (only windows)

### Amazon FSx for Lustre (2:50)

- Lustre is a type of parallel distributed file system, for large-scale computing
- The name Lustre is derived from “Linux” and “cluster
- Machine Learning, **High Performance Computing (HPC)** (**EXAM** want to know 'hpo' => luster)
- Video Processing, Financial Modeling, Electronic Design Automation
- Scales up to 100s GB/s, millions of IOPS, sub-ms latencies
- Storage Options:
  - SSD – low-latency, IOPS intensive workloads, small & random file operations
  - HDD – throughput-intensive workloads, large & sequential file operations
- Seamless integration with S3
  - Can “read S3” as a file system (through FSx)
  - Can write the output of the computations back to S3 (through FSx)
- Can be used from on-premises servers (VPN or Direct Connect)

### FSx Lustre - File System Deployment Options (4:08)

- Scratch File System
  - Temporary storage
  - Data is not replicated (doesn’t persist if file server fails)
  - High burst (6x faster, 200MBps per TiB)
  - Usage: short-term processing, optimize costs

- Persistent File System - Long-term storage - Data is replicated within same AZ - Replace failed files within minutes - Usage: long-term processing, sensitive data
  **QUESTION**
  What are the two deployment options for FSx-Luster? What are the stats for each?
  **ANSWER**
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

**QUESTION_END**

### Amazon FSx for NetApp ONTAP (5:54)

- Managed NetApp ONTAP on AWS
- File System compatible with NFS, SMB, iSCSI protocol
- Move workloads running on ONTAP or NAS to AWS
- Works with:
  - Linux
  - Windows
  - MacOS
  - VMware Cloud on AWS
  - Amazon Workspaces & AppStream 2.0
  - Amazon EC2, ECS and EKS
- Storage shrinks or grows automatically
- Snapshots, replication, low-cost, compression and data
  de-duplication
- **Point-in-time instantaneous cloning (helpful for testing
  new workloads)**

### Amazon FSx for OpenZFS (7:24)

- Managed OpenZFS file system on AWS
- File System compatible with NFS (v3, v4, v4.1, v4.2)
- Move workloads running on ZFS to AWS
- Works with:
  - Linux
  - Windows
  - MacOS
  - VMware Cloud on AWS
  - Amazon Workspaces & AppStream 2.0
  - Amazon EC2, ECS and EKS
- Up to 1,000,000 IOPS with < 0.5ms latency
- Snapshots, compression and low-cost
- Point-in-time instantaneous cloning (helpful for
  testing new workloads)

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - Amazon FSx - Solution Architectures

**Topic:** 76. Amazon FSx - Solution Architectures  
**Duration:** 3min  
**Section:** 6

### FSx – Solution Architecture Migration from Single AZ to Multi AZ

> from Single AZ to Multi AZ
> Basically, you have to put your data someplace... Then the MultiAz FS will read/initialize from it.

Two approaches:
A) FSx SingleAz -> AWS DataSync -> FSx MultiAz
B) FSx SingleAz -> backup -> FSx Multi Az

**QUESTION**
How to migrate FSx (windows) singleAz to MultiAx? Two Approaches.
**ANSWER**

> from Single AZ to Multi AZ
> Basically, you have to put your data someplace... Then the MultiAz FS will read/initialize from it.

Two approaches:
A) FSx SingleAz -> AWS DataSync -> FSx MultiAz
B) FSx SingleAz -> backup -> FSx Multi Az

**QUESTION_END**

### FSx – Solution Architecture Decrease FSx Volume Size (0:56)

- If you take a backup, you can only restore to a same size
- You can only increase the amount of storage capacity for a file system; you cannot decrease storage capacity.
- Instead, create a new FSx (smaller), use DataSync to sync data and then migrate your app over

> Similar to migrating from single->multiple Az, You can't actually resize the volume but you stick the data some other place, start a new volume and move to the data to new volume. Must use DataSync to migrate data

**QUESTION**
How to shrink FSx Volume? hint: It will require using special service.
**ANSWER**

- If you take a backup, you can only restore to a same size
- You can only increase the amount of storage capacity for a file system; you cannot decrease storage capacity.
- Instead, create a new FSx (smaller), use DataSync to sync data and then migrate your app over

> Similar to migrating from single->multiple Az, You can't actually resize the volume but you stick the data some other place, start a new volume and move to the data to new volume. Must use DataSync to migrate data

**QUESTION_END**

### FSx for Lustre – Data Lazy Loading (1:48)

- Any data processing job on Lustre with S3 as an input data source can be started without Lustre doing a full download of the dataset first
- Data is lazy loaded: only the data that is actually processed is loaded, meaning you can decrease your costs and latency
- Data is also loaded only once, therefore you reduce your requests on Amazon S3

**QUESTION**
What is Lustre "Data Lazy Loading" and what is the advantage?
**ANSWER**

- Any data processing job on Lustre with S3 as an input data source can be started without Lustre doing a full download of the dataset first
- Data is lazy loaded: only the data that is actually processed is loaded, meaning you can decrease your costs and latency
- Data is also loaded only once, therefore you reduce your requests on Amazon S3
  > Hint - this is source data S3
  > **QUESTION_END**

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - AWS DataSync

**Topic:** 77. AWS DataSync  
**Duration:** 5min  
**Section:** 6

### AWS DataSync

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

**QUESTION**
What is DataSync? What is it used for? Transfer rates?
What are the 3 targets?
**ANSWER**

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
**QUESTION_END**

### AWS DataSync NFS / SMB to AWS (S3, EFS, FSx…)

[diagram, not available]

You need to use DataSync for on-prem transfer

> If network does not have bandwidth use the AWS Snowcone (agent pre-installed).

**QUESTION**
In regards to DataSync - what is "Snowcone" how/why is it used?
**ANSWER**

> If network does not have bandwidth use the AWS Snowcone (agent pre-installed).

**QUESTION_END**

### AWS DataSync Transfer between AWS storage services (3:51)

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - AWS DataSync - Solution Architecture

**Topic:** 78. AWS DataSync - Solution Architecture  
**Duration:** 1min  
**Section:** 6

### AWS DataSync Private VIF through Direct Connect

Google said an "VIF" is:

> A virtual interface is a logical connection that sits on top of your physical Direct Connect link. Think of the physical DX connection as the cable, and the VIF as the lane of traffic you configure on that cable. We need VIFs because they determine where your traffic is going

It was a diagram to explain how to configure DataSync with private VIF through direct connect. \_\_The point being had to set up two interfaces one on private VIF and another (PrivateLink) interface within the VPC

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - AWS Data Exchange

**Topic:** 79. AWS Data Exchange  
**Duration:** 2min  
**Section:** 6

### AWS Data Exchange

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

**QUESTION**
What is "Data Exchange"?
**ANSWER**

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

**QUESTION_END**

**QUESTION**
Suppose you have an ML project and requires data of a certain shape (user response, movie review, router news). How can AWS provide you that data.
**ANSWER**

"Data Exchange" A service AWS provides to "broker" data from source. (routers, foursquare, etc.)
**QUESTION_END**

### AWS Data Exchange – Other Products

- AWS Data Exchange for Redshift
  - Find and subscribe to third-party data in AWS Data Exchange that you can
    query in an Amazon Redshift data warehouse in minutes
  - Easily license your data in Amazon Redshift through AWS Data Exchange

- AWS Data Exchange for APIs
  - Find and subscribe to third-party APIs with a consistent access using AWS SDKs
  - Consistent AWS-native authentication and governance

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - AWS Transfer Family

**Topic:** 80. AWS Transfer Family  
**Duration:** 5min  
**Section:** 6

### AWS Transfer Family

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

**QUESTION**
How to move data from S3 or EFS using FTP (the AWS solution not simple set-up ftp server).
**ANSWER**

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

**QUESTION_END**

### AWS Transfer Family (1:48)

[diagram]

### AWS Transfer Family – Endpoint Types

> Public IP are managed by AWS and can change over time - hence you should use domain name instead. This means no firewall restrictions allow-list,(I am not sure why)

Three Endpoints

1. Public - no firewall allow-list
2. Private (VPC endpoint)
3. VPC endpoint with internet facing acess

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**

# Section 6: Storage - AWS Storage Services Price Comparison

**Topic:** 81. AWS Storage Services Price Comparison  
**Duration:** 3min  
**Section:** 6

### Price of Storage (GB Month)

**EXAM** Storage class/price, S3, EBS, EFS. There is a diagram that demonstrates the pricing options. Going from expensive to cheapest, EBS io1, io2 -- S3 Standard IA. You may not need to memorize each cell but you do want to memorize the pattern. Consider S3->EBS->EFS (one dimension) then Standard->Archive/SC1/OneZone1A

**EXAM** Knowing the use case for each EFS/S3/EBS will help rule-out bad answers

### Most expensive to least expensive

- EBS io2, io1
- EFS Standard / EFS OneZone
- EBS gp2, gp3,
- EBS st1
- EFS Standard IA/ S3 Standard
- EBS sc1
- EFS OneZone IA
- S3 Standard IA

**QUESTION**
List 8 storage classes most to least expensive.
**ANSWER**

- EBS io2, io1
- EFS Standard / EFS OneZone
- EBS gp2, gp3,
- EBS st1
- EFS Standard IA/ S3 Standard
- EBS sc1
- EFS OneZone IA
- S3 Standard IA (cheapest)

**RESEARCH** use cases - I would expect EFS to be more expensive

**QUESTION_END**

## Notes

**QUESTION**
**ANSWER**

**QUESTION_END**

![Alt text](image-url.jpg "Optional title")

**RESEARCH**
