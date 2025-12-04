## Section 2 Data Ingestion (TO DO)

Note: These are probably not questions that I have about the subject matter but rather question I thought would be good on a quiz. I will need to look at my notes for the questions about subject matter.

Q: ELT Is for Data-lake or Data-warehouse and why?
A: ELT is Data warehouse, because it's Schema on write. Eg: Write data to meet Schema requirements

Q. ELT Is for Data-lake or Data-warehouse and why?
A: ELT is for Data-lake because its schema-on-read. We transform the data on read (not write)

Q. Which is more expensive/less expensive Data-Lake or Data-warehouse?
A. Warehouse more expensive/Lake less expensive, in general terms. Certainly we can goof it up.

Q. What is best if you had to pick one. D. Lake, D. warehouse, D. Lake house Why?
A. D. Lake house is best of both worlds. Also it can support ACID (I am not sure about this, need to read/review further)

Q. What are the main ETL/ELT Pipeline Orchestration Services?
A: Event Bridge, Step Functions, Glue Workflow, AWS Managed Workflow / Apache Airflow (MWAA)

**EXAM** expect to know when to use: Kinesis vs Kafka MSK (_tmc_)

Kafka - topic? Kinesis Shard? (_tmc_)

### Notes

"partition per topic" I understand what it means but I am surprised it mentioned here _tmc_ I need to understand this service better

> MKS Serverless charges for both ingress and egress, AWS used to charge for only egress on network, verify if that is still trued

> probably want to get a list of ALL file formats and a description of their structure and their origin (where does parquet get used, from where did it come? like xls are Excel)

- D. Lake more common for Machine Learning
- Using both is acceptable - it's a matter of the right tool for the job

> When to use IOPS and when to use Disk Size? or is this a multi-dimension metric?

> What is "hot shard"
