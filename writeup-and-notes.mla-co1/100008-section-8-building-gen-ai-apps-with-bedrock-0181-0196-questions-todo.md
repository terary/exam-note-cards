# Section 8: Building Generative AI Applications with Bedrock (Questions and Todo)

> 181

#### QUESTION X

What is a "Foundation Model" and how are they used

#### ANSWER X

Foundation model are pre-trained models: Titan, Claude, etc that can be extended (or not) to support the application

#### END QUESTION

#### QUESTION X

\***\*\_\_\_\_\*\*** are pre-trained models: Titan, Claude, etc that can be extended (or not) to support the application

#### ANSWER X

Foundation model are pre-trained models: Titan, Claude, etc that can be extended (or not) to support the application

#### END QUESTION

#### QUESTION X

What makes titan special

#### ANSWER X

Titan is AWS's own foundation model. It still requires approval but approval is much quicker. There would be no third party billing or terms (probably has it own terms)

#### END QUESTION

#### QUESTION X

Which model: **\_** Is AWS's own foundation model. It still requires approval but approval is much quicker. There would be no third party billing or terms (probably has it own terms)

#### ANSWER X

Titan

#### END QUESTION

#### QUESTION X

Bedrock is serverless or not?

#### ANSWER X

Bedrock is serverless

#### END QUESTION

#### QUESTION X

What are the four (4) Bedrock API groups

#### ANSWER X

- Manage Chat/Continuation
- Execute Chat/Continuation
  - `Converse`, `ConverseStream`, `InvokeModel`, `InvokeModelWithResponseStream` (notice "x" and "xStream")
- Manage Agent
- Execute Agent
  - `InvokeAgent`, `Retrieve`, `RetrieveAndGenerate`

#### END QUESTION

#### QUESTION X

What are the two most important Bedrock IAM permissions

#### ANSWER X

- **MUST** use IAM user, root account won't work (should never do it anyway)
- User must have relevant Bedrock permissions. Two important
  - `AmazonBedrockFullAccess`
  - `AmazonBedrockFullReadonly`
- Admin users may have necessary permissions implied
- These do not appear to be be the only bedrock permissions

#### END QUESTION

- 0183 - a text document
- 0184 - lab

- 185

#### QUESTION X

Discuss "fine tuning"? What is it how is it used

#### ANSWER X

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

#### END QUESTION

#### QUESTION X

The following describes what concept

```
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
```

#### ANSWER X

"fine tuning"

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

#### END QUESTION

#### QUESTION X

What is "Custom Model"?

#### ANSWER X

A model that has been 'fine tuned'

#### END QUESTION

#### QUESTION X

What does AWS call "Fine Tuning"?

#### ANSWER X

"Custom model"

#### END QUESTION

#### QUESTION X

What is a reason a model can't be fine tuned.

#### ANSWER X

Only some models allow fine tuning. Titan, CoHere, and Meta - according to the lecture. However, the lecture is a bit outdated and this represents only AWS's offerings. OpenAI can be fine-tuned (not through AWS)

#### END QUESTION

#### QUESTION X

In fine-tuning a model, how do we keep proprietary data secure (private)?
**EXAM**

#### ANSWER X

Use VPC and PrivateLink
**EXAM**

#### END QUESTION

#### QUESTION X

What are some disadvantages to fine-tuning?

#### ANSWER X

- Can be up-front costly, with potential for lower usage cost
- Can be time consume
- Have to provide training data

#### END QUESTION

#### QUESTION X

What is 'Continued Pre-training'?

#### ANSWER X

- Like fine-tuning, but with unlabeled data
- Just feed it text to familiarize the model with
  - Your own business documents
  - Whatever
- Basically includes extra data into the model itself
  - So you don't need to include it in the prompts

#### END QUESTION

#### QUESTION X

What is the difference between "fine-tuning" and "continued pre-training"

#### ANSWER X

Fine-tuning uses prompt/reponse labeled conversations style

```json
{
  "prompt": ...,
  "completion": ....
},
...

```

Where as 'Continued Pre-training' uses a "factoid" style of training data

```json
{
  "input": "some fact about one"
}
{
  "input": "some other fact about a different subject"
}
```

#### END QUESTION

#### QUESTION X

How to extend a model's knowledge to include new or proprietary data without including the data in training?

#### ANSWER X

RAG. Because the model is never "trained" on the data. We use RAG to get relevant (new or proprietary data) to augment the prompt/response

#### END QUESTION

#### QUESTION X

How to do a "semantic" search?

#### ANSWER X

RAG. You will need to encode the query into a vector, and compare to find nearest in the knowledge base.

#### END QUESTION

#### QUESTION X

What are the pros to RAG?
(6 total, 3 important)

#### ANSWER X

- Faster & cheaper way to incorporate **new or proprietary** information into GenAI, vs fine-tuning **short term**
- Updating info is just a mater of updating database
- Can leverage "Semantic Search", via **vector stores**
- Can prevent "Hallucinations" when you ask the model about something it was not trained on (this is a stretch)
- If boss wants "AI search" it is an easy way to deliver
- You are not **training** the model. Hence, management of proprietary data, not shared with outside.

#### END QUESTION

#### QUESTION X

The following describes the pros of what method/service/technique?

```
  - Faster & cheaper way to incorporate **new or proprietary** information into GenAI, vs fine-tuning **short term**
  - Updating info is just a mater of updating database
  - Can leverage "Semantic Search", via **vector stores**
  - Can prevent "Hallucinations" when you ask the model about something it was not trained on (this is a stretch)
  - If boss wants "AI search" it is an easy way to deliver
  - You are not **training** the model. Hence, management of proprietary data, not shared with outside.
```

#### ANSWER X

    RAG

#### END QUESTION

#### QUESTION X

What are the cons of RAG

#### ANSWER X

- Cons (not likely on exam):
  - Potentially the worlds worst search engine
  - Very sensitive to the prompt templates you use to incorporate your data (I assume with creating vectors to search... if we create embeddings the one way, we need to use that same way for search)
  - Non-deterministic (how can you evaluate results if they are expected to be different).
  - It can still hallucinate
  - Very sensitive to the information you retrieve

> You have to be mindful of chunking strategy. Simply "here a chunk, there a chunk, every where a chunk-chunk" will not produce good results

> Think of the challenges of find questions about Romania

#### END QUESTION

#### QUESTION X

Discuss costs dis/advantage between fine-tuning and RAG (which is more expensive, why)?

#### ANSWER X

Fine-tuning may be more expensive up front with diminished costs over time (future prompts require less context).
RAG doesn't have the training expense so no up front costs. However, future prompt will still require context and the documents added to the prompt with increase token count.

#### END QUESTION

#### QUESTION X

What is an "Embedding"?

#### ANSWER X

Its a 'vector', encoded statement/text, 100's or 1000's of dimensions.
We 'embed' to create a vector (I guess)

#### END QUESTION

#### QUESTION X

What is the basic flow of semantic search

#### ANSWER X

1. Take all documents or information and embed to get vector
2. Store vector with document (or differnt table, depends your use case)
3. Take query and embed into vector
4. Query database/vector store for nearest neighbors (semantic similar)
5. Using results pull the documents (unless vector is stored with the document and it may be part of the search results)
6. Add documents to prompt
7. Send revised prompted (augmented with documents)

#### END QUESTION

#### QUESTION X

The search results are similar to which algorithm?

#### ANSWER X

K-Nearest Neighbor. We get results that are 'near' our given query

#### END QUESTION

#### QUESTION X

How do we store vectors/embeddings?
What is AWS's recommendation?

#### ANSWER X

We store them in a vector store.

Whatever we use, it should support 'vector search'.

Many existing databases have added vector search capability. There are several purpose built vector store software (pinecone being the most popular)

AWS will likely recommend OpenSearch/Elastic Search because it is AWS's own service

#### END QUESTION

0188

#### QUESTION X

Comment on the structure of the data required for bedrock.

#### ANSWER X

Can be just about anything. Structured or not, with schmea or not. Bedrock will chunk using defaults (bad) so almost anything will do, but not do well.

We didn't go into but chunking strategy is important here

#### END QUESTION

#### QUESTION X

What are some alterative sources of data for knowldge bases? We can upload data but how/where else?

#### ANSWER X

Webcrawer, jira, SQS/SNS (probably), etc. Anything that can land in an S3 bucket (proably). Remember you can have multiple knowledge base so they don't all have to have the same shape

#### END QUESTION

#### QUESTION X

What are the key activities in doing knowledgebase search?

#### ANSWER X

- embed data into vector (chunking strategy relevant but not converd)
- store embeddings/vectors into dataabase that supports vectors
- Accept and embed query
- Do **vector search** (for k-nearest)
- add results to prompt, or whatever, results will likely have confidence score

#### END QUESTION

#### QUESTION X

What kind of data can be used in knowledgebase? (files, file type, content)

#### ANSWER X

Just about anything, text, excel, images, audio, pdf

#### END QUESTION

#### QUESTION X

What sources can be used for KB? (where data can be stored)

#### ANSWER X

S3, webcrawer, salesforce, custom, et

#### END QUESTION

#### QUESTION X

What shape does the data need to have for Bedrock KB? Structured or unstructured?

#### ANSWER X

Bedrock can parse most anything either default, best guess, or custom parser

#### END QUESTION

0190

#### QUESTION X

What chunking strategy are available in Bedrock

#### ANSWER X

- Default Chunking (something like best effort, not really sure)
- Fixed-size chunk
- Hierarchical Chunking (parent one chunk, children other chunks)
- Semantic Chunking (Uses FM to group relevant sentences)
- No Chunking

**Also** you can associated a Lambda function, I think for chunking but data formatting? "Bring your own Lambda that will control chunking"

#### END QUESTION

0191 - 4:00 minute only

#### QUESTION X

Guardrails List features/filters (6)?

#### ANSWER X

Content Filtering based on:

- word filtering
- topic filtering
- PII
- profantity
- probably others
- Context Grounding Check (_BIG_)
- Blocked Message Response

#### END QUESTION

#### QUESTION X

What is "Context Grounding Check" how does it work?

#### ANSWER X

It has two thresholds

- Grounding (Content retreived)
- Relevance (Query?)

_NOTE_ I am not really sure query/retrieved context are grounding and relevence

#### END QUESTION

#### QUESTION X

For Agents "what is memory"

#### ANSWER X

Nothing really. Because each prompt sends the whole conversation there is context, which serves as memory

#### END QUESTION

#### QUESTION X

How does the agent know which tool to call and with what parameters?

#### ANSWER X

Each function and each parameter have a defintion that describes it's purpose, type, required.
The agent knows which function to call because of it's description. It knows which parameters because of their description.

#### END QUESTION

#### QUESTION X

What is the recommended tool provider

#### ANSWER X

Lambda, not really "recommended" but the lecture seems to promote the idea Lambda can be used and they may be a good choice depending on use case.

#### END QUESTION

#### QUESTION X

What are "Action Groups"

#### ANSWER X

These are the 'tools'. Amazon calls them "Action Group" (I imagine that is a collection of tools/functions)

#### END QUESTION

#### QUESTION X

How to define a function (Lambad, Action Groupe, tool)? what is the format?

#### ANSWER X

I believe OpenApi (lecture said OpenAI), schema can be used. It should give each function/parameter a name and description. For parameter additionally define type and is/required.

#### END QUESTION

#### QUESTION X

How to implement RAG with Agents.

#### ANSWER X

RAG would be a tool call like any other (I think) - therefore no magic

#### END QUESTION

#### QUESTION X

Agents what is the "Code Interpreter" tool used for?

#### ANSWER X

So the agent can write code. However, it is not clear to me where that code would run. The lecture suggests the agent would run that code.

#### END QUESTION

#### QUESTION X

How are agents billed? which is best for higher/lower throughput/usage

#### ANSWER X

- On-Demand Throughput (ODT, up to some point)
  - Allows agent to run at quotas set at the account level
  - **LOWER OR NORMAL VOLUME**
- Provision throughput (PT, only so many tokens)
  - Allows you to purchase an increased rate and number of tokens for your agent
  - **HIGH VOLUME**

#### END QUESTION

#### QUESTION X

What is `InvokeAgent` and and where is it used, what is the one definately required parameter (besides prompt)

#### ANSWER X

You will need a `alias id`, the snapshot of the agent, plus probably you'll want/need a prompt
`InvokeAgent` is the endpoint/method for the API

#### END QUESTION

#### QUESTION X

What are the "additional" features of Bedrock?

#### ANSWER X

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

#### END QUESTION

#### QUESTION X

Bedrock limits you to which Foundation Models

#### ANSWER X

No real limits, you can bring your own. It also only offers Models from some providers but not others... They're not limiting you which models that you can use, but they are limiting who they are doing business with.

#### END QUESTION

#### QUESTION X

How can you use Bedrock to evaluate a model?

#### ANSWER X

- Model Evaluation
  - Automatic: accuracy, toxicity, robustness, BERTScore (**EXAM**), F1, etc
  - Test against your own prompts or built-in prompt database
  - Human: bring your own team
  - Human: AWS Manged Team

#### END QUESTION

---

#### QUESTION X

#### ANSWER X

#### END QUESTION
