1. Amazon Comprehend (classification and custom entity recognition)
   Description: A natural-language-processing (NLP) service: sentiment analysis, entity recognition, key-phrases, language detection, PII detection, custom classification and custom entity recognition. (AWS Documentation)

Cost / pricing dimensions:

Standard (pre-built) APIs: charged per “unit” where 1 unit = 100 characters. Minimum charge per request is 3 units (300 characters) for many features. (Amazon Web Services, Inc.)

Example: for entity recognition/sentiment etc you might see ~$0.0001 per unit (per 100 characters) in lower volume tiers. (Astuto AI)

Custom model / endpoint: For custom classification/entity you pay for training (e.g., ~$3/hour model-training) plus endpoint hosting ($0.0005 per second for an inference unit) for real-time endpoints. (Amazon Web Services, Inc.)

Free tier: 50,000 units (≈ 5 million characters) per API per month for the first 12 months for new users. (Amazon Web Services, Inc.)

Model / training?:

For standard APIs: AWS uses its own generic models (you do not train your own).

If you use “Custom Classification” or “Custom Entities”, you provide labelled data, AWS trains a model for you, you host an endpoint → so you do build a custom model for your use case.

Security / access / encryption:

Works with AWS IAM for access control (who can call the APIs). (AWS Documentation)

Input/output data and the underlying compute volumes can be encrypted: you can use your own AWS KMS key to encrypt the output results and storage volumes. (AWS Documentation)

Data in transit (API calls) and at rest (S3, volumes) should be protected; you manage access to source documents (e.g., in S3) and result storage via IAM/S3 policies.

Key point: Standard usage = no training, pay per text unit. Custom = you train model, pay training+endpoint.

2. Amazon Translate (language to other language)
   Description: Neural machine translation service — translates text between languages.

Cost / pricing dimensions:

Charged per characters processed. For example AWS lists roughly US $15 per 1 million characters for standard translation in one public-tutorial. (Rates vary by region/version.)

Model / training?:

The default translation uses AWS’s generic pretrained translation models — you do not train your own from scratch.

AWS also offers “Active Custom Translation” (for example using custom terminology or translation memory) which is more advanced; you may provide custom data but you’re not fully “training from scratch” in many cases.

Security / access / encryption:

Uses IAM for who can call translation APIs.

Data in transit is encrypted over TLS (standard AWS API). At rest: If you persist translations in S3 or other storage you’re responsible for encryption & IAM.

If you translate sensitive text, ensure source storage is secure, logs are managed, encryption at rest is enabled.

Key point: Translation = pay per character, uses AWS models by default; customization possible but still managed.

3. Amazon Transcribe (Speech to Text, S2T)
   Description: Speech-to-text service: converts audio into text (supports streaming & batch).

Cost / pricing dimensions:

You pay per audio minute (or fraction) processed. For example one AWS solution cost sheet lists ~US $0.72 for 30 minutes of standard transcription.

Model / training?:

Standard transcription uses AWS’s pretrained speech → text models (you don’t train).

But you can provide custom vocabularies and custom language models (in some cases) which refine performance for your domain — not fully training from scratch, but customization.

Security / access / encryption:

Use IAM to control who can submit audio/transcriptions.

Transcription works over TLS for API calls; you should ensure audio/text data at rest is encrypted (e.g., if stored in S3).

Because audio may contain sensitive PII, you should apply data-governance: restrict access to transcripts, enable audit logging (CloudTrail), use KMS for encryption.

Key point: Pay per audio minute; mostly AWS model; custom vocab possible; secure your audio/text data.

4. Amazon Polly (Text to Speech - T2S)
   Description: Text-to-speech service: convert text into spoken audio in multiple languages/voices.

Cost / pricing dimensions:

Charged on the number of characters synthesized (or sometimes per thousand characters) depending on language/voice. Example from AWS solution cost sheet: ~US $0.60 for 30,500 characters across 5 languages in a sample.

Model / training?:

Uses AWS’s pretrained voices. You do not train your own voice model unless you use a voice-customization feature (which is more advanced and may incur additional cost).

Security / access / encryption:

Use IAM to control who can generate speech.

The text you supply may be sensitive; ensure it's encrypted or access restricted.

If you store the generated audio in S3, ensure encryption at rest, proper IAM/S3 policies, logging.

Key point: Pay per characters; AWS voices; you can embed polly in apps; secure your input/output.

5. Amazon Rekognition (Image and video analysis)
   Description: Image and video analysis service: object/scene detection, face detection/recognition, text in images, celebrity recognition, video analysis, etc.

Cost / pricing dimensions:

Charged based on type and size of analysis. For example video with face detection might cost a few dollars for 30 minutes (per a solution cost sheet ~US $3 for 30 minutes video face detection).

Image analysis charged per image; video analysis often by minute of video processed or per object/frame.

Model / training?:

For standard APIs: you use AWS’s pretrained vision models (you don’t train).

For custom labeling / custom model (“Rekognition Custom Labels”) you can bring your own images/labels and AWS will train a model tailored to your objects or scenes — so you do train in that scenario.

Security / access / encryption:

Potentially highly sensitive (faces, people, PII). Ensure IAM roles restrict access.

Data in transit is encrypted via TLS; results or stored media in S3 should be encrypted at rest (KMS).

If face recognition or similar features are used, you must comply with local privacy/regulation (e.g., face recognition laws).

Use VPC endpoints if you want to restrict traffic, enable logging/Audit via CloudTrail.

Key point: Pay per image/minute; standard model vs custom labels; strong security & privacy concerns.

6. Amazon Lex (to build bots, speech recognition + dialogs ->Lambda)
   Description: Conversational AI service: build conversational bots/chatbots (text or voice) using automatic speech recognition + NLP + dialogue management.

Cost / pricing dimensions:

Charged per request: e.g., text requests and voice requests have different pricing (per text-request or per voice-request-minute). (Exact numbers vary by region & version)

Model / training?:

Underlying model (speech recognition, NLP) is provided by AWS; you configure bot logic (intents, slots, utterances). So you don’t train low-level model unless you include optional customizations (e.g., custom slot types, Lambda integration).

Security / access / encryption:

Use IAM to control who can define/deploy/use bots.

For voice bots: audio in transit via TLS, storage of transcripts or logs in S3 should be encrypted.

If your bot handles sensitive user data (PII), ensure secure logging, encrypt storage, implement access controls, audit.

Optionally integrate with Amazon Cognito or IAM for user authentication in your bot flows.

Key point: Pay per bot usage; you configure the conversation; AWS provides underlying ML; secure user data/integrations.

7. Amazon Personalize (personalizatin/recommendation engine)
   Description: Real-time personalization & recommendation engine: you provide user/item interaction data, Personalize builds models and serves recommendations.

Cost / pricing dimensions:

Pricing is based on: size of dataset/training data, hours for training, hosting hours, and perhaps inference (recommendation) requests. (Exact numbers vary; refer AWS site for region).

Model / training?:

Yes: you supply your interaction data (user/item events), you choose a recipe/algorithm, and AWS builds and trains the model for you; you don’t manage the algorithm internals but you do provide data/training.

Security / access / encryption:

Your user-interaction data is often sensitive (personalization, consumption). Use IAM to restrict access to datasets and model endpoints.

Data at rest (in S3, or wherever you store the interaction data) should be encrypted (KMS). Inference endpoints should be secured (VPC endpoints, private networks if needed).

Logs, monitoring, audit should be enabled for inference and dataset access.

Key point: Pay for building and serving personalized recommendations; you train the model with your data; secure your dataset and endpoints.

8. Amazon Textract (extract text from ID, Forms, Tables etc)
   Description: Document understanding service: extracts text, forms, tables, and handwritten text from scanned documents (images or PDFs).

Cost / pricing dimensions:

Charged per “page” or “document” processed, depending on API used (e.g., DetectDocumentText vs AnalyzeDocument). You pay for the amount of data processed (pages, MB) based on region/pricing.

Model / training?:

Standard usage: you send documents, AWS’s models extract text/tables/forms. You don’t train a model.

For very custom extractions (e.g., custom form fields), you might use separate ML services or combination of Textract + custom models; but Textract itself is managed.

Security / access / encryption:

Documents may contain sensitive data (PII, contracts, financials) → must restrict access (IAM), encrypt at rest (S3 + KMS) and in transit (TLS).

When exporting results to S3, ensure encryption and appropriate lifecycle/retention policies.

Use VPC endpoints or private networks if needed to restrict access. Audit logs via CloudTrail.

Key point: Pay per page/document processed; no training required for standard use; secure your document ingestion and result handling.

9. Amazon Kendra (Semantic Search across S3, Sharepoint, DB, etc)
   Description: Intelligent enterprise search service using ML: lets you build a search index across various data sources (S3, SharePoint, databases etc) with semantic search, ranking, relevance tuning. (AWS Documentation)

Cost / pricing dimensions:

Pricing is per “index” capacity plus storage units and query units. For example:

GenAI Enterprise Edition: base index ~$US $0.32 per hour (≈ US $230/month) for up to 20,000 docs/200MB, 0.1 QPS (~8,000 queries/day). Additional storage units ~$0.25 per hour each (20k docs/200MB each). Additional query units ~$0.07 per hour each (0.1 QPS each). (Amazon Web Services, Inc.)

Developer Edition: ~$1.125 per hour (~US $810/month) for ~10k docs/3GB, 0.05 QPS. (ElasticScale)

Model / training?:

You configure the index (ingest documents, set data sources, optionally adjust relevance tuning). The underlying search/ML model is provided by AWS — you don’t train from scratch.

The model learns from usage/feedback (relevance tuning) but you don’t explicitly provision training jobs. So you use the managed ML search engine rather than train your own from scratch.

Security / access / encryption:

Data sources: you grant Kendra access (via IAM, roles) to crawl/index data from S3, SharePoint, etc.

API access: use IAM for who can query the Kendra index.

Encryption: data at rest (indexes, documents) can be encrypted, use KMS. Data in transit (queries) over TLS.

Access control: you can restrict search results based on user identity/role; integrate with Cognito, SAML, Active Directory.

Audit logging: use CloudTrail etc to track searches/queries if needed.

Key point: Pay per index capacity + storage + queries; uses AWS-provided model; you set up ingestion, tuning; secure data, sources, queries.

10. Amazon Augmented AI (A2I) (Workflow to include Human in AI review low confidence, QA, etc)
    Description: Human-in-the-loop (HITL) service: you integrate ML services (Textract, Rekognition, etc) and when model confidence is below threshold you route to human reviewers via A2I workflow, track review, feed results back into ML.

Cost / pricing dimensions:

You pay for human task time (per reviewer minute) + the cost of the underlying ML service for inference. (Exact pricing depends on region/Mcrowd)

Model / training?:

A2I itself does not train models. It orchestrates human review for other AWS ML services. You could use results from A2I human reviews to retrain your models in other services, but A2I is not a model-training service.

Security / access / encryption:

Since humans will review potentially sensitive items (images, documents, transcripts) you must manage reviewer access, secure data in review tasks, audit logs.

Use IAM roles to limit who can view human task UI or results. Use encrypted storage for task data. Use VPC endpoints if tasks contain PII and you want to keep data in private network.

The underlying ML service (e.g., Textract) still uses encryption/secure transit.

Key point: Pay for human review + underlying ML; no training directly in A2I; secure review workflow + data.

11. “Hardware AI” (AWS infrastructure for AI/ML) (Two Chips)
    Description: AWS provides specialized compute hardware for ML training/inference (e.g., GPU/Accelerator EC2 instances, AWS Trainium/Inferentia chips) rather than a fully managed higher-level AI service.

Cost / pricing dimensions:

You pay standard EC2/instance hourly rates for the instance type you choose (GPU, etc). Plus storage, networking, data transfer.

Model / training?:

Yes — you build your own ML models, train, tune, deploy. This is the “build your own ML infrastructure” path.

Security / access / encryption:

Standard AWS infrastructure security applies: VPC isolation, IAM control of EC2, encrypted storage (EBS, S3), key management (KMS), secure access (SSH, bastion hosts), network segmentation, and so on.

Key point: This is infrastructure rather than managed AI service. You are responsible for entire ML pipeline — more flexibility, more responsibility.

12. Amazon Lookout for Metrics (and related “Lookout” services) (Lookout\* - many services - anomoly detection, equipment, process, etc)
    Note: There are multiple “Lookout” services (Lookout for Equipment, Lookout for Assets, etc). I’ll summarise in general terms.
    Description: Anomaly-detection services — you feed time-series or sensor/event data and the service finds anomalies (e.g., unusual behaviour) with minimal ML expertise required.

Cost / pricing dimensions:

Example: Lookout for Metrics is charged per metric monitored per month. For example ~$US $0.75 per metric/mo for first 1000 metrics, ~$US $0.50 per metric/mo for next range. (AWS Documentation)

Model / training?:

You configure monitoring; the service runs auto-ML to detect anomalies; you don’t explicitly train a model. Thus, you “use” a managed model rather than build/training custom.

Security / access / encryption:

Data you send may be sensitive (operations, business metrics) → control access via IAM, encrypt data at rest/in transit, store logs securely.

Endpoint/API via TLS; storage in AWS services encrypted.

Key point: Pay per metric; managed ML; you configure the service; secure your metric data.

13. Amazon Fraud Detector (ID theft, Financial Transaction etc)
    Description: Service for building fraud detection (payments, identities, accounts) using machine learning. It provides features, variable selection, model building, scoring, and deployment for fraud use cases.

Cost / pricing dimensions:

Pricing: based on number of event-evaluations (scored events), plus model training and hosting hours. (Exact numbers need to be looked up per region)

Model / training?:

Yes: you provide event data, define variables/features, the service builds and trains models specific to your domain. You deploy the model and the service handles scoring. So you do build a model.

Security / access / encryption:

Fraud domain is sensitive (financial transactions, identities) → strong security required: IAM for who can define detectors, variables, see results; data encryption at rest/in transit; audit trails; compliance (PCI, etc) if applicable.

Use VPC endpoints or private access if you bind to real-time transaction systems; logs must be protected.

Key point: You build and train model; pay for training + event scoring; secure entire pipeline strongly.

14. “Q-Business”, “Q-Apps”, “Q-Developer” (Q\* I think 'no code')
    These refer to the newer AWS generative-AI / LLM services (for example under the “Amazon Q” brand) — the exact full feature/pricing details may still be evolving. I’ll summarise as best-known:
    Description:

Q-Business: LLM-powered analytics on business data (insights, dashboards, etc).

Q-Apps: Build conversational or agent-type applications quickly using LLM backend.

Q-Developer: Provide developers more control/integration to build custom LLM-based applications or fine-tune models.

Cost / pricing dimensions:

Likely charged based on model usage (tokens processed), number of app/agent invocations, or hosting compute hours. Because these are relatively new services, check the AWS official pricing page for “Amazon Q” services in your region.

Model / training?:

These services provide pretrained large language models (LLMs). For Q-Business and Q-Apps you generally use AWS’s model and may inject your data/context — you do not build a model from scratch. For Q-Developer you may have more customisation/fine-tuning options (so you may train or fine-tune a model).

Security / access / encryption:

Because you’re dealing with business data, conversational flows, maybe PII or proprietary data: you must apply strong IAM controls on who can use the service, secure the data in transit (TLS) and at rest, ensure logs and moderation are handled.

If your app handles sensitive content, ensure the underlying model’s output is moderated, use guardrails, and ensure data retention/erase policies.

Key point: Newer services, pay per token/use, generic AWS models by default, customisation possible; ensure enterprise-grade data security.

Important Notes & Caveats
Pricing varies significantly by region (AWS region), edition (standard vs enterprise), usage volume, and additional features (custom models, real-time endpoints, datasets). Always check the AWS official pricing page for that service in your region.

When a service offers “custom model” capability (e.g., Comprehend custom entities, Rekognition custom labels, Personalize), there are additional costs: training time, hosting endpoints, dataset preparation.

For “managed” services (e.g., Translate, Polly, Textract standard, Kendra indexing) you often leverage AWS’s underlying models and pay for usage rather than training.

Security is always “shared responsibility”: AWS secures the service infrastructure; you secure your data inputs/outputs, IAM permissions, encryption, network access, logging, and compliance.

Many of these services support encryption at rest (via AWS KMS) and encryption in transit (TLS). You also need to manage IAM permissions & resource-level access (who can call the API, who can access results).

Exam-focus: Know the “what you pay for” (units: characters, pages, minutes, queries, capacity units) and whether you train or not. Also know that you can restrict access & encrypt.

If you like, I can pull together a full table (Excel/Google-Sheet format) with all these services plus a few others (maybe ~20 services) showing: service, what it does, pricing dimension, training required (yes/no), security notes — and I can highlight the ones most likely to appear on the exam. Would you like that?
