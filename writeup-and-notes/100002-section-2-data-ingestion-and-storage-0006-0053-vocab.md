## Vocabulary Section 2 Data Ingestion

- `Data Velocity`

  - > Data Velocity is one of the three V's of data properties. It refers to how fast data is generated and processed: Batch Process, Real-time, or Near Real-time. Examples include IoT data, sensor data, and high frequency trades.

- `Data Volume`

  - > Data Volume is one of the three V's of data properties. It refers to the size or amount of data: GB, TB, PB. It concerns how we store it, how we access it, and what preprocessing concerns exist.

- `Data Variety`

  - > Data Variety is one of the three V's of data properties. It refers to the types of data: Structured/Unstructured. Sources include API, Stream, Human input, and electronic devices (mobile devices).

- `ETL (Extract, Transform, Load)`

  - > ETL is a data integration process that involves three steps: Extract (fetch data from sources like API, disk, etc.), Transform (convert from source to target format, clean, enrich, aggregate, calculations, encoding/decoding, handle missing data), and Load (move to target destination). Velocity affects load strategy (batch, realtime, streaming). Used with Data Warehouses which use Schema-on-Write.

- `ELT (Extract, Load, Transform)`

  - > ELT is a data integration process where data is first extracted and loaded into the target system, then transformed. This is used with Data Lakes which use Schema-on-Read, where structure is applied AFTER the data is stored.

- `Data Warehouse`

  - > A data warehouse is a legacy system designed for complete queries using "Star" or "Snowflake" structured schemas. It uses Schema-on-Write (ETL), is optimized to read headers, and is designed for structured data. Examples include Redshift, Google Big Data Query, and Azure SQL Data warehouse. Generally more expensive and less agile than Data Lakes.

- `Data Lake`

  - > A data lake holds vast amounts of raw data with no preprocessing. It supports batch, real-time, and streaming data. Uses Schema-on-Read (ELT) where structure is applied after the fact using services like Athena and Glue. Can store structured, unstructured, and semi-structured data. Examples include S3, Azure data lake store, and Hadoop. Generally less expensive and more agile than Data Warehouses.

- `Data Lakehouse`

  - > A data lakehouse combines the best features of both Data Warehouses and Data Lakes. It can support ACID transactions and provides the structure of a warehouse with the flexibility of a lake.

- `Data Mesh`

  - > Data Mesh is a concept (not a topology) where individual tenants own their own data within a domain. The tenant manages data collection, transformation, and augmentation. Data is managed/governed by domain with centralized standards, using federated governance with centralized standards. Self-service tooling and infrastructure (like Glue) are used. This is a paradigm for managing data, securing it, and allowing federated access.

- `Schema-on-Write`

  - > Schema-on-Write is the approach used by Data Warehouses where data is transformed to meet schema requirements before being written (ETL process).

- `Schema-on-Read`

  - > Schema-on-Read is the approach used by Data Lakes where data is stored as-is (raw), and structure is applied when the data is read (ELT process).

- `ACID`

  - > ACID stands for Atomicity, Consistency, Isolation, Durability. It refers to database transaction properties. Data Lakehouse can support ACID transactions, combining warehouse structure with lake flexibility.

- `JDBC (Java Database Connectivity)`

  - > JDBC is a Java-based API for database connectivity. It is platform independent but language dependent (Java).

- `ODBC (Open Database Connectivity)`

  - > ODBC is an API for database connectivity. It is platform dependent (drivers written in/for many languages) but language independent.

- `AVRO`

  - > AVRO is a binary data format that stores data with schema. Both data and schema are flexible. When to use: big data, real-time data, schema evolution, efficient serialization. Used with systems like Kafka, Spark, Flink, and Hadoop.

- `Parquet`

  - > Parquet is a column storage format optimized for analysis with efficient compression/decompression. When to use: analyzing large datasets, reading columns instead of records, storing on distributed systems where IO is optimized. Used with systems like Hadoop, Spark, Hive, Impala, and Redshift Spectrum.

- `ORC (Optimized Row Columnar)`

  - > ORC is a columnar storage format similar to Parquet, optimized for reading and writing data. Used with systems like Hive and Hadoop for efficient analytics workloads.

- `S3 (Simple Storage Service)`

  - > Amazon S3 is an object storage service used for backup, recovery, storage, static websites, archives, hybrid storage, app hosting, media hosting, and big data analytics. Uses buckets (main containers) and items/objects (files). Buckets must be globally unique and are defined regionally.

- `S3 Bucket`

  - > S3 Bucket is the main container in S3. Buckets must be globally unique across all AWS accounts and regions. Buckets are defined regionally but appear as a global service. There are two types: "general purpose" and "directory" (directory type is out of scope for exam).

- `S3 Object Key`

  - > S3 Object Key is the full path to an object, for example s3://bucket-name/the/path/to/item.ext. The Object Key is prefix + object name.

- `S3 Object Value`

  - > S3 Object Value is the contents of the file stored in S3. It is the actual data stored in the object.

- `S3 Prefix`

  - > S3 Prefix is the path portion of an S3 object key. For example, in s3://bucket-name/the/path/to/item.ext, the prefix is "/the/path/to/". S3 performance is measured by prefix, not bucket. There are no actual directories in S3, but the UI creates the appearance of folders.

- `S3 Metadata`

  - > S3 Metadata consists of key=value pairs that can be set by system or user. Metadata provides additional information about the object.

- `S3 Tags`

  - > S3 Tags are key-value pairs that can be applied to objects. Up to 10 tags are supported universally. Tags can be used for lifecycle rules and access control.

- `S3 versionId`

  - > S3 versionId is an identifier for object versions when versioning is enabled. When versionId is null, it indicates the bucket has versioning enabled but the item was likely created before versioning was enabled.

- `CRR (Cross Region Replication)`

  - > CRR is S3 Cross Region Replication, used for compliance, lower latency, cross-account replication. Replication is async, requires versioning, can be cross-account, and only works for new items.

- `SRR (Same Region Replication)`

  - > SRR is S3 Same Region Replication, used for log aggregation and prod/dev replication. Replication is async, requires versioning, can be cross-account, and only works for new items.

- `S3-GP (S3 Standard - General Purpose)`

  - > S3-GP is S3 Standard General Purpose storage class. It has 99.99% availability (4-9's, 53 minutes downtime per year), used for frequent access, low latency, tolerant of 2 concurrent facility failures at AWS. Use cases: big data analysis, reliable gaming, low latency, content distribution.

- `S3-IA (S3 Infrequent Access)`

  - > S3-IA is S3 Standard Infrequent Access storage class. It has 99.9% availability, for less frequent access (supports rapid access), low cost, cost on retrieve, best for backup/restore.

- `S3-1ZIA (S3 OneZone Infrequent Access)`

  - > S3-1ZIA is S3 OneZone Infrequent Access storage class. It has 99.5% availability, high durability in a single AZ (if AZ fails all data is lost), best for secondary backup or content that can be easily recreated.

- `S3-GIR (S3 Glacier Instant Retrieval)`

  - > S3-GIR is S3 Glacier Instant Retrieval storage class. It provides instant retrieval (milliseconds), minimal storage time 90 days, low cost best for Archive and Backup, pricing: storage + retrieval.

- `S3-GFR (S3 Glacier Flexible Retrieval)`

  - > S3-GFR is S3 Glacier Flexible Retrieval storage class. It offers Expedited Retrieval (1-5 minutes), Standard retrieval (3-5 hours), Bulk retrieval (5-12 hours), min storage 90 days.

- `S3-G-Arch (S3 Glacier Deep Archive)`

  - > S3-G-Arch is S3 Glacier Deep Archive storage class. It offers standard retrieval (12 hours), bulk retrieval (48 hours), min storage 180 days, lowest cost for long-term archival.

- `S3 Intelligent Tiering`

  - > S3 Intelligent Tiering allows automatic movement between tiers with a small moving fee and no retrieval fee. Default is frequent access. Moves to infrequent after 30 days, archive instant access after 90 days, archive slower access after 90-700 days, and deep archive after 180-700+ days.

- `S3 Transition Action`

  - > S3 Transition Action is a type of Life Cycle Rule action that moves objects from tier to tier (e.g., after 60 days, after 6 months to Glacier).

- `S3 Expiration Action`

  - > S3 Expiration Action is a type of Life Cycle Rule action that deletes objects (e.g., delete logs after 365 days, delete old versions, clean up incomplete multi-part uploads after 2 weeks). Life Cycle Rules can be created for prefix or tags.

- `SSE-S3 (Server-Side Encryption with S3 managed keys)`

  - > SSE-S3 is Standard AWS Management encryption. Data is encrypted but no key is specified, managed wholly by AWS. Requires header x-amz-server-side-encryption: "AES256". SSE-S3 is default encryption and can be forced with bucket policy.

- `SSE-KMS (Server-Side Encryption with AWS KMS managed keys)`

  - > SSE-KMS uses AWS Key Management Service. Client code specifies which key to use. Usage can be logged in CloudTrail (good for audit/compliance). Requires header: x-amz-server-side-encryption: "aws:kms". May require further API calls which can introduce latency.

- `SSE-C (Server-Side Encryption with Customer-provided keys)`

  - > SSE-C uses Customer Provided Key. Client manages key, key is sent in header with every request, AWS does not store this key, HTTPS only. Client must provide same key for get/fetch operations.

- `S3 Access Point (AP)`

  - > S3 Access Points serve as aliases for bucket prefixes. Each Access Point has its own DNS name (unique internet name), its own policy, and manages security at scale. AP Policy looks the same as S3 policy. Access Points can serve as a level of different security - S3 bucket can be less restrictive while S3 Access Point can be more restrictive, allowing different security settings for different users/groups.

- `S3 Object Lambda`

  - > S3 Object Lambda sits between Bucket and Access Point and acts as a transformation layer. You can have several Access Points calling different Lambda functions to transform data differently. Origin data remains unchanged but provides different "views" of the data.

- `ACL (Access Control List)`

  - > ACL is Access Control List. In S3, Object ACL and Bucket ACL can be disabled. ACLs provide fine-grained access control at the object or bucket level.

- `IAM (Identity and Access Management)`

  - > IAM is AWS Identity and Access Management. In S3, IAM principal can access IFF: (IAM permission allow) OR (Resource permission allow) AND there are no deny. Principle can be user or service (not owner).

- `Block Public Access`

  - > Block Public Access is an S3 feature that prevents data leaks. When "on" it will never be public. This serves as a master override for public access settings.

- `EBS (Elastic Block Store)`

  - > EBS is Elastic Block Store, a network-attached storage volume for EC2 instances. Data persists after instances are terminated. Can be configured to delete on termination. Root drive (drv0) auto-deletes by default, but this can be overwritten. Bound to one AZ, can make snapshot and transport to other AZ.

- `Elastic Volume`

  - > Elastic Volume can change attributes on the fly: IOPS and volume type. It cannot decrease size. This is a feature of EBS volumes.

- `EFS (Elastic File System)`

  - > EFS is Elastic File System, a managed network file system that can be mounted to multiple EC2 instances simultaneously across multiple AZs. It scales automatically, supports NFSv4.1 Protocol, is not Windows compatible (requires Linux AMI), uses Security Groups to control access, KMS for encryption at rest, POSIX file system. Costs approximately 3x GP2, pay per use/access (not allocated).

- `EFS-Standard`

  - > EFS-Standard is the EFS storage class for frequent use. It supports multi-AZ and is the default tier for EFS.

- `EFS-Infrequent Access`

  - > EFS-Infrequent Access is an EFS storage class with cost to retrieve, lower price to start. Implement lifecycle policy to move files between tiers.

- `EFS-Archive`

  - > EFS-Archive is an EFS storage class for rarely accessed files (few times a year), 50% cheaper than standard. Implement lifecycle policy to move files between tiers.

- `NFS (Network File System)`

  - > NFS is Network File System protocol. EFS uses NFSv4.1 Protocol. It allows multiple clients to access shared files over a network.

- `POSIX (Portable Operating System Interface)`

  - > POSIX is a family of standards for operating system compatibility. EFS is a POSIX file system, meaning it uses standard APIs like ls, rm, etc. It provides Unix-like file system semantics.

- `FSx`

  - > FSx is AWS's fully managed third-party file system service. It supports four types: Windows (fully managed Windows Share), Lustre (Linux + Cluster), NetApp OnTap (managed ONTAP on AWS), and OpenZFS (scales up to 1Million IOPS, 0.5ms latency).

- `FSx for Windows`

  - > FSx for Windows is a fully managed Windows Share. Supports NTFS and SMB, can move with EC2 (different EC2 can connect), ACLs, user quotas, supports Microsoft's Distributed File System (DFS). Scales up to 10's GB/s, millions of IOPS, 1000's of petabytes. Storage options: SSD/HDD. Supports multiple AZ. Uses S3 for backups. Can connect via DirectConnect or VPN.

- `NTFS (New Technology File System)`

  - > NTFS is Microsoft's proprietary file system. FSx for Windows supports NTFS and SMB protocols.

- `SMB (Server Message Block)`

  - > SMB is Server Message Block protocol, used for file sharing in Windows networks. FSx for Windows supports SMB protocol.

- `DFS (Distributed File System)`

  - > DFS is Microsoft's Distributed File System. FSx for Windows supports DFS for managing file shares across multiple servers.

- `FSx for Lustre`

  - > FSx for Lustre is a parallel file system (Linux + Cluster = Lustre). Optimized for Machine Learning, video processing, financial models, electrical design automation, and High Performance Compute (HPC). Scales 100's GB/s, millions IOPS, sub-ms latency. Has seamless S3 integration. Deploy options: Scratch (temporary, not replicated, no backup, high performance, 6x faster) or Persistent (long term storage, replicated across AZ).

- `Lustre`

  - > Lustre is a parallel distributed file system (Linux + Cluster = Lustre). FSx for Lustre is AWS's managed version optimized for HPC and Machine Learning workloads.

- `HPC (High Performance Compute)`

  - > HPC is High Performance Compute. FSx for Lustre is optimized for HPC workloads, providing high throughput and low latency for compute-intensive applications.

- `FSx for NetApp OnTap`

  - > FSx for NetApp OnTap is "Managed ONTAP on AWS". Features: move running workloads, broad compatibility (Mac, Linux, VMWare, Windows, AWS EC2/EKS/ECS), auto scale shrink/grow, snapshot low cost compression, point in time clones for workload transfers.

- `ONTAP`

  - > ONTAP is NetApp's unified storage operating system. FSx for NetApp OnTap provides managed ONTAP on AWS with broad compatibility across platforms.

- `FSx for OpenZFS`

  - > FSx for OpenZFS scales up to 1Million IOPS, 0.5ms latency, point in time clone. Same OS as NetApp/OnTap.

- `OpenZFS`

  - > OpenZFS is an open-source file system. FSx for OpenZFS provides managed OpenZFS on AWS with high performance characteristics.

- `IOPS (Input/Output Operations Per Second)`

  - > IOPS is Input/Output Operations Per Second, a performance metric for storage systems. EBS volumes are allocated in Size and/or IOPS. Elastic Volume can change IOPS on the fly.

- `AZ (Availability Zone)`

  - > AZ is Availability Zone, a distinct location within an AWS region. EBS volumes are bound to one AZ but can be moved via snapshots. EFS supports multiple AZs. FSx supports multiple AZs for some file system types.

- `Kinesis Data Stream`

  - > Kinesis Data Stream is an AWS managed service for real-time streaming data. Producers send data to Kinesis Streams, which Consumers read from. Key characteristics: 365 days retention on stream, can be replayed, data cannot be deleted (MUST expire), up to 1MB message size, order is guaranteed for data using partitionId, encryption: in-flight HTTPS/SSL, at rest KMS.

- `Kinesis Producer`

  - > Kinesis Producer sends data to Kinesis Streams. Producers can be applications, IoT devices, click streams, metrics, or logs. KPL (Kinesis Producer Library) is optimized for standard operations.

- `Kinesis Consumer`

  - > Kinesis Consumer reads data from Kinesis Streams. Consumers can be applications, Lambda, Firehose, etc. KCL (Kinesis Client Library) is optimized for standard operations.

- `KPL (Kinesis Producer Library)`

  - > KPL is Kinesis Producer Library, an SDK library optimized for standard Kinesis producer operations. Best practice for sending data to Kinesis.

- `KCL (Kinesis Client Library)`

  - > KCL is Kinesis Client Library, an SDK library optimized for standard Kinesis consumer operations. Best practice for reading data from Kinesis.

- `Kinesis Shard`

  - > Kinesis Shard is a unit of capacity in Kinesis Data Stream. Each shard inbound 1MB/s or 1000 records/second, each shard outbound 2MB/s. Provisioned Mode uses shards for capacity. Hot shard occurs when one shard receives more data than others.

- `Kinesis Firehose`

  - > Kinesis Firehose collects data from producers and batches it, then flushes batch/queue periodically. It's fully managed, serverless, autoscales, pay what you use, near real-time (because of buffering). Loads streamed data to many destinations, no storage, no replay. Can transform using Lambda at receiver, can write failed data to S3 bucket.

- `MSK (Managed Streaming for Kafka)`

  - > MSK is AWS Managed Streaming for Kafka. It's fully managed, deploys in your VPC multi-AZ (up to 3), auto recovery from common failures, data stored on EBS, supports custom configuration, can support up to 10MB message (Kinesis only 1MB), can retain data indefinitely (Kinesis only 365 days).

- `MSK Connect`

  - > MSK Connect deploys Kafka Connect to MSK via plug-in. It moves data from Kafka to wherever (S3, other AWS services). AutoScale, no infrastructure, priced at $0.11 per worker/hour.

- `MSK Serverless`

  - > MSK Serverless is hands-free configuration where you define topics and number of partitions per topic. Security is IAM access control. Pricing: $0.75 per cluster hour, $0.0015 partition hour, $0.10 GB storage per month, $0.10 ingress GB, $0.05 egress GB.

- `Kafka`

  - > Kafka is an open-source distributed event streaming platform. MSK is AWS's fully managed Kafka service. Kafka uses topics and partitions for data organization.

- `Kafka Topic`

  - > Kafka Topic is a category or feed name to which records are published. Producers send data into Kafka topics, which get replicated across few/all brokers. MSK organizes data by topic/partition (Kinesis uses stream/shard).

- `Kafka Partition`

  - > Kafka Partition is a division of a topic. MSK Serverless allows you to define number of partitions per topic. Data is organized by topic/partition in MSK.

- `ZooKeeper`

  - > ZooKeeper is a centralized service for maintaining configuration information and providing distributed synchronization. MSK creates and manages Kafka Broker and ZooKeeper nodes.

- `MSAF (Managed Service for Apache Flink)`

  - > MSAF is AWS Managed Service for Apache Flink. Flink replaces something leaner (Kinesis + SQL). Flink is Managed/Serverless and used for stream processing and analytics.

- `Flink`

  - > Flink is Apache Flink, an open-source stream processing framework. MSAF is AWS's managed version. Flink is used for real-time stream processing and analytics.

- `SASL/SCRAM`

  - > SASL/SCRAM is an authentication method. SASL (Simple Authentication and Security Layer) with SCRAM (Salted Challenge Response Authentication Mechanism) uses passwords. MSK supports SASL/SCRAM (AuthN) + Kafka ACL (AuthZ) using passwords as one of three security authentication methods.

- `TLS (Transport Layer Security)`

  - > TLS is Transport Layer Security, a cryptographic protocol for secure communication. MSK uses in-flight TLS, at rest EBS encryption. S3 uses SSL/TLS and HTTPS for in-flight encryption.

- `SSL (Secure Sockets Layer)`

  - > SSL is Secure Sockets Layer, a predecessor to TLS. S3 uses SSL/TLS and HTTPS for in-flight encryption. AWS recommends bucket policy requiring aws:SecureTransport.

- `HTTPS (HyperText Transfer Protocol Secure)`

  - > HTTPS is HyperText Transfer Protocol Secure. SSE-C requires HTTPS only. S3 uses HTTPS for secure data transfer.

- `CloudTrail`

  - > CloudTrail is AWS service that provides logging of API calls. SSE-KMS usage can be logged in CloudTrail, which is good for audit/compliance.

- `Prometheus`

  - > Prometheus is an open-source monitoring and alerting toolkit. MSK supports Prometheus monitoring: open port on cluster, broker, and topic, set up JMX export metrics on node exporter (CPU and disk metrics).

- `JMX (Java Management Extensions)`

  - > JMX is Java Management Extensions, a Java technology for managing and monitoring applications. MSK Prometheus monitoring uses JMX export metrics on node exporter.

- `MWAA (Managed Workflows for Apache Airflow)`

  - > MWAA is AWS Managed Workflows for Apache Airflow. It is one of the ETL/ELT Pipeline Orchestration Services in AWS, along with Event Bridge, Step Functions, and Glue Workflow.

- `EventBridge`

  - > EventBridge is an AWS serverless event bus service. For S3 event notifications, EventBridge can send to 18 other services, allows advanced filtering (match metadata like object size, file name), and supports replay. It is one of the ETL/ELT Pipeline Orchestration Services.

- `SNS (Simple Notification Service)`

  - > SNS is AWS Simple Notification Service. S3 events can be sent to SNS, SQS, Lambda, or EventBridge. You must create resource policies to allow S3 to write to these services.

- `SQS (Simple Queue Service)`

  - > SQS is AWS Simple Queue Service. S3 events can be sent to SNS, SQS, Lambda, or EventBridge. You must create resource policies to allow S3 to write to these services.

- `Lambda`

  - > Lambda is AWS serverless compute service. S3 events can be sent to Lambda. Kinesis Firehose can transform using Lambda at receiver. S3 Object Lambda sits between Bucket and Access Point for data transformation.

- `Athena`

  - > Athena is AWS interactive query service. Data Lakes use Schema-on-Read where structure is applied after the fact using services like Athena and Glue.

- `Glue`

  - > Glue is AWS fully managed ETL service. Data Lakes use Schema-on-Read where structure is applied after the fact using services like Athena and Glue. Glue is considered reliable for pipeline management. Data Mesh uses self-service tooling and infrastructure like Glue.

- `Redshift`

  - > Redshift is AWS data warehouse service. It is an example of a Data Warehouse system, designed for complete queries using structured schemas.

- `Hadoop`

  - > Hadoop is an open-source framework for distributed storage and processing. It is an example of a Data Lake system. AVRO and Parquet formats are used with Hadoop.

- `Spark`

  - > Spark is an open-source distributed computing system. AVRO and Parquet formats are used with Spark for big data processing.

- `Hive`

  - > Hive is a data warehouse software built on Hadoop. Parquet format is used with Hive for analytics workloads.

- `Impala`

  - > Impala is a SQL query engine for Hadoop. Parquet format is used with Impala for analytics workloads.

- `VPC (Virtual Private Cloud)`

  - > VPC is AWS Virtual Private Cloud. MSK deploys in your VPC multi-AZ. S3 Access Points can improve/enforce accessibility through VPC/Security configuration.

- `DirectConnect`

  - > DirectConnect is AWS service for dedicated network connection. FSx for Windows and FSx for Lustre can connect via DirectConnect or VPN.

- `VPN (Virtual Private Network)`

  - > VPN is Virtual Private Network. FSx for Windows and FSx for Lustre can connect via DirectConnect or VPN.

- `KMS (Key Management Service)`

  - > KMS is AWS Key Management Service. SSE-KMS uses AWS Key Manager. EFS uses KMS for encryption at rest. Kinesis and MSK use KMS for at-rest encryption.

- `Security Group (SG)`

  - > Security Group is a virtual firewall for EC2 instances and other AWS resources. EFS uses Security Groups to control access. MSK uses network security groups.

- `EC2 (Elastic Compute Cloud)`

  - > EC2 is AWS Elastic Compute Cloud. EBS volumes attach to EC2 instances. EFS can be mounted to multiple EC2 instances. FSx for Windows can move with EC2.

- `AMI (Amazon Machine Image)`

  - > AMI is Amazon Machine Image, a template for EC2 instances. EFS is not Windows compatible (requires Linux AMI).

- `gp2 (General Purpose SSD Volume Type 2)`

  - > gp2 is EBS General Purpose SSD Volume Type 2. IO increases as size increases (IO allocation increase so does disk size allocation). EFS costs approximately 3x the cost of GP2.

- `gp3 (General Purpose SSD Volume Type 3)`

  - > gp3 is EBS General Purpose SSD Volume Type 3. IO can increase independently of disk size, unlike gp2 where IO increases with size.
