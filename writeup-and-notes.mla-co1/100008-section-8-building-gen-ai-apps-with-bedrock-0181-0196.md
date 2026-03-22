# Section 8: Building Generative AI Applications with Bedrock

### ⭐0181 Intro (1:00)

> Hands on in this section

> Learn suite of foundation model

> Learn to Extend Models

### ⭐0182 Building Generative AI with Bedrock and Foundation Models

> Foundation Models - just the underlying models we using in AWS, text gen, imagine gen, etc

> AWS has it's own model called "titan"

> OpenAI is not supported (competitor)

> Has Meta and Anthropic

> `Bedrock` is an API we use to build the application

- An API for generative AI Foundation Models
  - Invoke chat, text, or image models
  - Pre-built, your own fine-tuned models or your own models
  - Third party models bill you through AWS via their own pricing
  - Support for RAG
  - Support for LLM agents

> It's important to know the pricing before you sign-up for the service.

**It is serverless\_** **EXAM**

- Can integrate with `SageMaker Canvas`

- Four kinds of endpoints (to use through console instead of UI)
  - bedrock (manage)
    - Manage
    - Deploy
    - Train Models
  - bedrock-runtime (use)
    - Perform inference, (execute prompts, generate embeddings, etc)
    - `Converse`, `ConverseStream`, `InvokeModel`, `InvokeModelWithResponseStream` (notice "x" and "xStream")
  - bedrock-agent
    - Manage, deploy, train LLM agents and knowledge bases
  - bedrock-agent-runtime
    - Perform inference against agent and KB.
    - `InvokeAgent`, `Retrieve`, `RetrieveAndGenerate`

#### Bedrock IAM Permissions (5:19)

- **MUST** use IAM user, root account won't work (should never do it anyway)
- User must have relevant Bedrock permissions. Two important
  - `AmazonBedrockFullAccess`
  - `AmazonBedrockFullReadonly`
- Admin users may have necessary permissions implied
- These do not appear to be be the only bedrock permissions

#### Bedrock Model Access (6:10)

- Before using any base model in Bedrock, you must first request access
  > This is AWS making you agree to the terms and pricing
- `Titan` does not require pre-approval as it is AWS's model, approval immediate.
- Third party models may require you to submit additional information
  - you will be billed the third party's rates through AWS
  - It only takes a few minutes for approval
- Be sure to check pricing (aws.amazon.com/bedrock/pricing)

> Hence planning the app before building is a good idea.

> Pricing may not be obvious when requesting approval. It is the users (YOUR) responsibility to know what you are signing up for, and there will always be a price, even when not mentioned.

#### Lets Play

- Bedrock provides a "playground" environments
  - Chat
  - Text
  - Images
- Must have model access
- **Also useful for evaluating your own custom/imported models**

### ⭐0183 A note on bedrock mode access

> A text document that says:

```
Access to all Bedrock foundation models is now supposed to be enabled by default, but apparently an exception (for now) is models from Anthropic, like the one we show in the following activity. If you are using an Anthropic model for the first time (like Claude Sonnet) you need to first submit a use case and request access to it.

You should be able to do this by visiting the Model Catalog in the Bedrock console before using a Claude model. A use case of "educational use with an online course" sounds reasonable to me.

Or, you could simply choose a foundation model that is not from Anthropic.
```

### ⭐0184 Lab: Chat, Text, IMage Foundation Model

> Lab, walk through many functionalities

Bedrock Side menu:

- Discover
- Test
- Infer
- Tune

Bedrock test

- Test/Chat
  - Option to choose conversation (Chat) (maintain context) or single-shot
  - Choose Model
    - Has various model parameters:
      - System prompt,
      - Model reasoning,
      - output size restriction,
      - stop sequence,
      - temperature (top_k, top_p)
    - **Options will vary by model**
    - Model Guardrails
    - Can upload files (images, documents etc)
  - Image playground (generate imagine)
    - On Demand/provisioned
    - Choose bunches of things to do, find object, add object, guardrails avoid images that..., color palate

Various models have various options so each model's configuration will be different, and therefore not covered within lecture. Just how to use Bedrock.

`top p` top probability
`top k` k number of token to choose from (head of the snake)

4:16. "temperature" appears to be either `temperature` or `top p`, as if the options are mutually exclusive, it may be a goofy UI

### ⭐0185 Fine Tuning Custom models and Continuous Pre-training with Bedrock (7:32)

#### Fine Tuning

- Adapt an existing LLM to your specific use case
  > Actually extending the model, baked-in training, enhancing the model
  - Eliminates the need to build up a big conversation to get the results you want ("eg prompt engineering"/"prompt design")
  - Saves on tokens in the long run
- Your fine-tuned model can be used like any other
- You can fine-tune a fine-tuned model, making it "smarter" over time
- Application Examples:
  - Chatbot with certain personality or style, or with a certain objective (i.e. customer support or writing ads)
  - Training with data ore recent than what the LLM had (update training)
  - Training with proprietary data (ie: past emails or messages, customer support transcripts)
  - Specific applications (classification, evaluating truth)

> Could be more expensive in the short run

#### Fine-tuning in Bedrock "Custom Models" (3:30)

> Bedrock calls 'fine-tuning' "Custom Models"

> Not all models can be fine-tuned

- Titan, CoHere, and Meta are models that can be 'fine-tuned'
- Text models: provided labeled training paris of prompts and completion
  - Can be question/answers
  - upload training data to S3
- Image models: provide pair of images S3 paths to image descriptions (prompts)
  - used for text-to-image or image-to-embeddings
- Use VPC and PrivateLink to sensitive training data
  Example training data **EXAM**
- Can get expensive
- Can be time consuming

```json
{
  "prompt": "what is the meaning of life",
  "completion": "The meaning of life is 42"
},
{
  "prompt": "what is the best doctor who",
  "completion": "Matt Smith..."
},

```

\* not clear to me if all bedrock uses this format and will get translated per model. OpenAI uses same format different labels.

\* interesting to note that we take the training data is independent of the model. We can use the same training data to train newer models.... Foundation Update - so to speak.

#### "Continued Pre-Training"

- Like fine-tuning, but with unlabeled data
- Just feed it text to familiarize the model with
  - Your own business documents
  - Whatever
- Basically includes extra data into the model itself
  - So you don't need to include it in the prompts

\* This is interesting for iStackBuddy. This gives sort of a fixed context. I wonder how it would be used for iStackBuddy, we don't have to continue prompt injecting, but we would need to be careful that the data is useful. No reason to inform iStackBuddy about SumoQuery if we are asking about Field Logic Problems

Example Pre-training data:

```json
{
  "input": "some fact about one"
}
{
  "input": "some other fact about a different subject"
}
```

### ⭐0186 Retrieval Augmented Generation (8:28)

> Alterative to fine-tuning RAG

> Bedrock calls RAG, knowledge bases (it's a little different)

- Like an open-book exam for LLM
- You query some external database for the answers instead for relying on the LLM
- Then, work those answers into the prompt for the LLM to work with
  - Or, use tools and functions to incorporate the search into LLM in a slight more principled way

> To be clear, we are doing semantic search

#### Pros and Cons

- Pros

  - Faster & cheaper way to incorporate **new or proprietary** information into GenAI, vs fine-tuning **short term**
  - Updating info is just a mater of updating database
  - Can leverage "Semantic Search", via **vector stores**
  - Can prevent "Hallucinations" when you ask the model about something it was not trained on (this is a stretch)
  - If boss wants "AI search" it is an easy way to deliver
  - You are not **training** the model. Hence, management of proprietary data, not shared with outside

- Cons (not likely on exam):
  - Potentially the worlds worst search engine
  - Very sensitive to the prompt templates you use to incorporate your data (I assume with creating vectors to search... if we create embeddings the one way, we need to use that same way for search)
  - Non-deterministic (how can you evaluate results if they are expected to be different).
  - It can still hallucinate
  - Very sensitive to the information you retrieve

> You have to be mindful of chunking strategy. Simply "here a chunk, there a chunk, every where a chunk-chunk" will not produce good results

> Think of the challenges of find questions about Romania

#### RAG Example winning at jeopardy (7:08)

Gives the standard example. Encode query, search, pull documents, feed everything into LLM for response

### ⭐0187 Vector Stores and Embeddings with Amazon

#### Choosing a database for RAG (8:03)

> Critical component is the Database (AWS calls it a 'data store'). Remember not all implement vector search, and search may be different from one database/data-store to another

- You could use whatever database is appropriate for the type of data you are retrieving
  - Graph database (ie: **Neo4j**) for retrieving product recommendations or relationships between items
  - OpenSearch or something traditional text search (TF/IDF)
  - But almost every example you find of RAG, uses **Vector database**
  - Note **Elasticsearch/OpenSearch can function as vector DB** (openSearch is AWS service)

> Vector Stores - Store "embeddings" (vectors)

#### Review Embeddings (1:43)

- An embedding is just a big vector associated with your data (high dimension, 1000's of dimensions)
- Think of it as a point in multi-dimensional space (typically 100's or 1,000's of dimensions)
- Embeddings are computed such that items that are similar to each other are close to each other in that space
  > "Geometrically Close" -> Similar
- We can use embeddings base models (like titan) to compute them en-masse

#### Embeddings are vectors so store them in .... (3:52)

- stored in a vector database
- it just stores your data alongside the computed embedding vectors (this may be a bedrock thing, I had to organize the tables/documents to store along-side)
- Leverage the embeddings you might already have for ML
- Retrieval looks like this:
  - Compute an embedding vector for the thing you want to search for
  - Query the database for the top items close to that vector
  - You get back the top-N most similar things (`k-nearest neighbor`)
  - Vector Search
- Examples of vector database
  - Coercing existing database to do vector search
    - OpenSearch/ElasticSearch, SQL, Neptune, Redis, MongoDB, Cassandra
  - Purpose build vector DBs
    - Pinecone, Weaviate (commercial)
    - Chroma, Margo, Vespa, Ordant, LanceDB, vectordb (open source)

> "Coercing existing database" - Meaning some vendors have added this feature

> You can use whatever datastore you want and tie bedrock to it. OpenSearch is recommended because it is AWS.

#### Example star-trek (6:20)

Same example - nothing new here.

> (TODO) A curious question, can we limit our embeddings to be a fixed number of feature/dimension? Would this make the search/find more efficient? If our documents are expected to be fairly uniform (conversation within the organization) so we only care about a subset of everything

### ⭐0188 Implementing RAG with Amazon Bedrock and Knowledge Bases (5:01)

> Bedrock we call RAG "Knowledge bases"

#### RAG in Bedrock: Knowledge Bases

- You can upload your own documents (unstructured) or structured data (via S3, maybe with JSON schema), into bedrock knowledge-base
  - Other sources: web-crawler, Confluence, Salesforce, Sharepoint (third-party connections)
- Must use an embedding model
  - For which you must have obtained model access (asked aws to approve)
  - Currently **Cohere** or **Amazon Titan** **EXAM**
  - You can control the vector dimensions (**NOTE** you were wondering about this, if consistent vector dimensions could help find things like Romania)
- And a vector store of some sort
  - For development, a serverless OpenSearch instance my be used by default
  - MemoryDB now has vector capabilities
  - Or Aurora, MongoDB, Pinecone, Redis Enterprise Cloud
  - You can control the "chunking" of your data
    - How many tokens are represented by each token

> OpenSearch, MemoryDB, Aurora, MongoDB, Pinecone, Redis Enterprise Cloud have vector capabilities **EXAM** want to know a few, at least pinecone

**EXAM**, need to remember, the basic order, embed (requires chunking), store, search. Hence, we need functionality, embed/search which is offered by only some DB

> He said it is common practice to chunk at 300 characters, no rhyme or reason, just 300 characters for chunk - this is **NOT GOOD**

#### Using Knowledge Base (3:13)

- "Chat with your Document" (AWS feature in the console)
  - Basically automatic RAG
- Integrate into a an application directly
- Incorporate it into an agent
  - Agentic RAG

> He goes on to discuss the traditional, embed query, find nearest results, add to prompt, send to robot for response

### ⭐0189 **LAB** Building and Querying a RAG System

**LAB**
Bedrock Console says "Create Knowledge Base" with

- Vector store
- structured data source (SQL Databases or similar)
- **Kendra GenAI Index** (we haven't seen this yet)

When creating the Knowledge Base, Bedrock will ask source of data and give several options: S3, Crawler, Confluence, Salesforce, Custom, etc

Bedrock offers datasources:

- Default Parser (text, excel, html, markdown)
- "Automatic Parser", for Images, Audio, PDFs.
- Foundation Model

It offers a few different chunking strategy:

- Default Chunking (something like best effort, not really sure)
- Fixed-size chunk
- Hierarchical Chunking
- Semantic Chunking
- No Chunking

\* He doesn't go into detail about the chunking strategy.

Can associate a lambda with the datastore for inbound data (transformations I assume)

"Data delete policy" This indicates the datastore should persist. Hence, we can re-use datastore **and we have to be careful to tear-down anything we create when no longer needed**, Deletes the datastore, not the instance - **YOU WILL CONTINUED TO GET BILLED**

**EXAM** may encourage us to use "OpenSearch" as vector store, many other options available but in the lecture it seemed like it is the 'best' option

The console has a test feature. You can query the knowledge base. It sill show results but also relevant chunks (for verifying chunking strategy)

**Warns again about tear-down EVERYTHING** couple hundred bucks a month for a nothing- knowledge base.

### ⭐0190 - Additional Chunking Strategy

> Added the new strategy in 0189 (previous section). Nothing else to see here.

### ⭐0191 Content Filtering with Amazon Bedrock Guardrails (4min)

> Guardrail - content filtering in and out (prompt and response)

- Content filtering prompts and response
- Works with text foundation model
- Not currently for images (audio, video). **TODO** **EXAM** check if guardrails is still only for text
- Word filtering
- topic filter (politics, competitors, hateful) - filter options
- profanity filtering
- PII (remove or masking)
- **Context Grounding Check** (new a few years ago)
  - Help prevent hallucination
  - Measures "grounding" (how similar the response is to the contextual data received)
  - And relevance of response to the query
  - > Measure two things, has two thresholds:
    - A) `Grounding` [score]
    - B) `Relevance`
- Can be incorporated into agents and knowledge bases (chat bots that use KB?)
- Can configure 'blocked message' response

**EXAM** Know the 'contextual grounding' and the two thresholds

**EXAM** know the filter/masking feature, blocked message response

### ⭐0192 LAB Building and testing guardrails (9:42)

Part of configuration:

- Name
- Description
- Message for Blocked prompt (checkbox "same for response")
- x-region
- KMS keys

**TODO** previous section we were unsure about imagine filtering. In the lab it appears it will filter images. Need to look at what it can filter, today.

Filter Categories:

- Hate
- Insults
- Sexual
- Violence
- Misconduct

- Actions: Block (or something else)
- Can set thresholds: `None`, `Low`, `Medium`, `High`

**TODO** Can enable "prompt attack" filtering (FOR THAT REASON USE GUARDRAILS)

> Doesn't go into detail but said many features require x-region

Can filter/block specific topics "No discussion of politics", allows examples, choose input and/or output. Additional examples allowed.

- Can add custom words to filtering
- Block Sensitive (gives bunches of options Driver's License, DoB, etc)

**TODO** Grounding and Relevance - are two different things . one is related to prompt the other response - need to figure out which is which.

**EXAM** have several todo's to do before exam

### ⭐0193 Building LLM Agents (10:00)

> Given tools to the foundation models
> [I think can add to fine-tuned]

- Given tools to your LLM
- The LLM is given discretion on which tools to use for what purpose
- The agent has a memory, an ability to plan how to answer a request and tools it can use in the process
- In practice, the "memory" is just a chat history and external data stores, and the "planning module" is guidance given the LLM on how to break down a question into sub-questions, that the tools might be able to help with
- Prompts associated with each tool are used to guide it on how to use its tools (prompts perhaps not the right word)

> He goes on to explain 'tools are functions' nothing new here.

- **Lambda** is the recommended 'tool'

#### How do agents know which function/parameters

**BEDROCK** specific **EXAM**

- Start with foundation model to work with
- In Bedrock, "Action Groups" define a tool
  - A prompt informs the FM when to use it
    - "Use this function to determine the correct weather in city"
  - You must define the parameter your tool (Lambda function) expects
    - Define name, description, type, and required or not
    - The description is actually important and will be used by the LLM to extract the require info from user prompt
    - **You can also allow the FM to go back and ask the user for missing information** (this only works because of the 'memory')
    - This can be done using OpenAI style schemas, or visually with a table in Bedrock UI
  - Agents may also be associated with **knowledge bases**
    - Again, a prompt tells the LLM when it should use it
      - "Use this for answering questions about X"
      - This is "Agentic RAG", RAG is just another tool
  - Optional "Code Interpreter" allows the agent to write its own code to answer questions or produce charts

#### Deploy Bedrock Agents

**TODO** build an agent in Bedrock - checks weather or something stupid

- Create an "alias" for an agent
  - **This creates a deployed snapshot**
- On-Demand Throughput (ODT, up to some point)
  - Allows agent to run at quotas set at the account level
  - **LOWER OR NORMAL VOLUME**
- Provision throughput (PT, only so many tokens)
  - Allows you to purchase an increased rate and number of tokens for your agent
  - **HIGH VOLUME**
- Your application can use the `InvokeAgent` request using your alias ID and an agents for Amazon Bedrock Runtime Endpoint

### ⭐0194 LAB Build Bedrock Agent with guardrails, knowledge base and tools (20:00)

Lab -

#### Create Action Group

- Supports "Multi Agent Collaboration" we don't get into it.
- Choose 'model under the hood', default Claude (today, who knows about tomorrow)
- Allow which built-in tools (Code Interpreter, etc)

Not clear to me if "Action Group" is a function (one), or a group of functions

**TODO** needs to build agent and better understand the language of AWS, using Lambda

- He provides the function (no surprise here) (He wrote a lambda)
- **Choose Memory** (This I do not understand, I thought "memory" was the chat conversation but it is also a setting in bedrock)
- Set-up guardrail

The test functionality (the Console 'test' feature) appears to be super fast.

**TODO** look at 'trace' with Agents (13:30)
**TODO** Look at 'deploy version alias' - understand a little better, how that works (16:30)

Tear-down

### ⭐0195 - warning to make sure tear-down means EVERYTHING

```
Just another reminder - if you've been following along with the labs in this section, be sure to delete your OpenSearch serverless domains AND any Opensearch Collections in your account!

Deleting your Bedrock agent does NOT do this automatically, and if even if you leave OpenSearch unused, it can cost you hundreds of dollars per month.
```

### ⭐0196 More Amazon Bedrock Features (3:58)

- Imported Models
  - Import Models from S3 or SageMaker
- Model Evaluation
  - Automatic: accuracy, toxicity, robustness, BERTScore (**EXAM**), F1, etc
  - Test against your own prompts or built-in prompt database
  - Human: bring your own team
  - Human: AWS Manged Team
- Provisioned Throughput
- Watermark detection
  - Detects if an image was generated by Titan
- Bedrock Studio
  - Create a web app workspace for Bedrock without AWS accounts
  - Uses SSO integration with IAM and your own IdP
  - Users can collaborate on projects and components

**TODO** Store model in S3, then use it in SM or Bedrock
