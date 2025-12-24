# Section 7: Generative AI Model Fundamentals

### ⭐0168 Generative AI Model Fundamental (intro)

`Transformer Architecture` - He said that LLM are built on a `Transformer Architecture`. Probably not on the exam but a interesting aspect

### ⭐0169 The Transformers and Generative AI

`Transformer Architecture` (Transformer, to change, not transistor to keep)

- `self-attention`

The idea behind an RNN is that it has a feedback loop

#### The evolution of Transformers (1:42)

- RNN's, LSTMs
- Introduced a feedback loop for **propagating information forward**
- Useful for modeling sequential things
  - Time series
  - Language! (A sequence of works [order], or tokens)

I think he makes the point that with 'feedback' or a 'data hold' future operations can make use of that result. From this we can build/predicate series. This kinda gives an accumulative effect, the final result (or result until now), is reflective of all the previous operation results. He is calling the "data hold" **Last hidden state**.

- Machine translation
- Encoder / Decoder architecture
- **Encoders and Decoders are RNN`s**

As we attempt to 'encode' or 'decode a natural language sentence, we encode each word and the next, with each word changing the "meaning", of the whole of sentence. This "meaning" is the "hidden state" and we reach final word it is the **best representation** of the meaning of the sentence.

When translation, we encode (en) then hand the sentence to decode (sp).

A disadvantage of this approach is the one vector (meaning) creates a **information bottle** neck. For long sentences (or paragraphs) the final meaning can become diluted.

#### "Attention" is all you need

> Big break through 2017

To overcome the Encoder/Decoder machine translations, we use `attention` (4:21)

- We don't build the hidden state iteratively. Instead each step has it's own 'hidden state'. Each individual word would have it's own hidden state
- This helps with word order as well. With the hidden state of the word, we can look at the meaning of the word but also meaning derived from context/usage.
- **This introduces a relation**, not only the current word but what other words do I need to pay attention to?
- RNN's are still sequential in nature, can't be parallelized

[There is a diagram that is useful, didn't see similar in google]

06:53 - **Attention Weights** the weight of each attention. The idea that each hidden-state/attention may be weight differently (noun, verb etc)

Significant limitation is parallelism.

**Feed forward networks** we ditch the RNN and hidden state for the improved FFNN. FFNN use `self attention` that allows work to be parallelized. This is key to making the LLM possible

### ⭐0170 Self-attention and Attention Based Neural Networks (8:30)

> Self attention more in-depth

- Each encoder or decoder has a list of embeddings (vectors) for each token
- Self attention produces a weighted average of all token embeddings. The magic is in computing the **attention weights**
- This results in tokens being tied to other tokens that are important for it's context and a new embedding that captures it's "meaning" in context

[diagram demonstrates "I read a good novel" will put weight on a word 'book' (not in the sentence)].
[second diagram makes a example with different meaning for "novel" and the heavy word is 'original' or 'new']

> Self attention is about finding the appropriate or 'true' meaning to the word novel.

#### How does it work

- There are three matrices of weights are learned through backpropagation
  - Query (Wq)
  - Key (Wk)'
  - Value (Wv)
- Every token gets a query(q), Key(k) and value (v), vector by muliplying its embedding against these three matrices.

#### How self-attention is weighted

- Compute a score for each token by multiplying (dot product) its query with each key
- `Scaled data product attention`
- Dot product is just one similarity function we can use
- In practice, `softmax` is then applied to the scores to normalized.

#### Masked Self Attention (04:00)

> The idea is to keep attention from peeking into the future

- A mask can be applied to prevent tokens from 'peeking' into the future.
- GPT does this but BERT does something else (masked language modeling)
  > A masked applied to all future tokens. Hence we can glean meaning for future words/tokens, but we still using previous tokens. We keep the head of the snake meaning.

> This happens in parallel but keeps the head of the snake serialization behavior

> GPT is nothing more than stack of decoders, BERT is built on a stack of encoders. You do not have to us pair encoder-decoder, can use stacks of either.

#### Multi-headed Self Attention (7:41)

- The q, k, and v vectors are reshaped into matrices
- Then each row of the matrix can be processed in parallel
- The number of rows are the number of heads

So I think it works something like vectors (Q, K, V) become a matrix by multiplying by each (long time since I have done the math). This yields a matrix, with rows that can be processed in parallel.

### ⭐0171 Applications of Transformers (4:09)

> Chat - Chat bots are more than transformers they have to be further trained.

Used for

- Chat
- Question/Answer
- Text classification
  - ie, sentiment analysis
- Name Entity recommendation
- Summarization
- Translation
- Code Generation
- Tet generation
  - automated customer services (trained on previous conversation)

These transformer applications have no inherent sense of truth, right or wrong, personal experience, and will produce what 'sounds reasonable'

> We can do these things but must exercise caution because we are not guaranteed accuracy

### ⭐0172 Generative Pre-Trained Transformers - How they work Part I (12:00)

> We are expecting the exam will not go into so much details about how GPT works or transformers in general. Probably a little will be on the exam

#### From Transformers to GPT

**"Generative Pre Trained Transformers" (GPT)**

> You can import Chat GPT into AWS becaus GPT OpenAI, used to be open. He goes on to say can download from huggingface. This is because openAI used to be open, they closed it because they didn't want people to copy the details

> Can copy/import models into AWS

- Generative Pre-Trained Transform "GPT" (GPT-2 for this exampled)
- Decoder-only - stacks fo decoder blocks
  - Each consists of a masked self-attention layer, and a feed-forward neural network
  - As a side note, BERT consists only of encoders, T5 is an example that uses both encoder and decoder
- No concept of 'input' all it does is generate the next token over and over
  - Using attention to maintain relationship to previous works/tokens
  - You "prompt" it with tokens of your question or whatever
  - it then keeps generating given the previous tokens
- Getting rid of the idea of inputs and outputs is what allows us to train it on unlabelled piles of text
  - It's "Learning a language" rather than optimizing for specific task

> Basically the way GPTs work is they are 'training' on the prompt. Given a prompt, what is the next token. It will take the entire prompt and process in parallel (because FF-NN and decoders) it has the internal-state or 'self-attention' (masked FF) allowing it to know the positional context. It then just keeps repeating the prompt "I want", "I want an", "I want an apple". Making this 'solution' "Generalized" we are not training on classifications as example

> GPT-4 rumored to be more than a trillion parameters

Life of a prompt (Next token please)

- 1. Simple English "I want"
- 2. Token embedding (vectors)
- 3. Positional Encoding (in parallel)

#### Input

- Tokenization (word parts), token encoding (embeddings/vectors). Words to tokens is kinda of a mystery to the outside world. The model architects found a tokenization that "just works", you will end up with "indivisible"->[[indi][v][isible]], where the word parts don't really make sense to us, but it does to the model. It can and possible does the same technique in data compression, replacing common known strings with substitutions, "123" often seen together may get tokenized as a string that represent "123" and not 123 (number) or 1,2,3 (3 characters or 3 numbers). This is especially relevant for contractions " don't" [do][not]
- Token embedding (vector)
  - Capture 'semantic' relationships between tokens. "Embedding Space" I guess is the universe of all things and how 'near' two vectors determines how close they are within a embedding space (1000's of dimensions. We would expect humans to handle 2 or 3 dimensional space, hence humans just don't get it)
- Positional Encoding
  - Captures the position of the token in the input relative to other nearby tokens
  - uses an **`interleaved sinusoidal function` so it works on any length**

### ⭐0172 Generative Pre-Trained Transformers - How they work Part II (2:21)

#### Output Processing

> In the final stage of 'encoding' we have vectors (not tokens/words)

- The stack of decoders outputs a vector at the end
- The output vectored is multiplied with the token embeddings
- This gives you probabilities (logits) of each token being right next token (word) in the sequence
- You can randomize things a bit here "temperature" instead of always picking highest probability.

### ⭐0174 Key terms and controls (3:08)

- `tokens` - numerical representation of words or parts of words **numeric**
- `Embeddings` - Mathematical representations (vectors) the encode "meaning" of a token (hence, spanish, german, english may map to the same token because we are working with 'meaning')
- `Top P` - Threshold probability of a token inclusion (higher => greater randomness)
- `Top K` - Alterative to `top p` instead of "top probability" where "top K" candidates that exists for for inclusion. Higher K, higher randomness
- `temperature` - the level of randomness in selecting the next word in the output from those tokens
  - Higher temperature -> more random
  - Low temperature -> more consistent (less random)
- `Context window` - The number of tokens an LLM can process at once
- `Max tokens` - Limit for the total number of tokens (**on input or output**)

### ⭐0175 Fine-tuning and transfer learning with transformers

> Transfer learning is called Fine Tuning

Ways to do it it:

- Take a foundation model and add additional training data through the whole thing
- Freeze specific layers, re-train others
  - Train a new tokenizer to learn new language (Python, German, whatever)
- Add a layer on top of the pre-trained layer
  - Just a few may be all that is needed
  - Provide examples of prompts desired completions
    - "How's the weather" -> "What's it to you bucko"
  - Adapt it to classification of other task
    - "Wow, I love this course" -> "Positive" [sentiment]

> can train it on all our emails, then it can respond to emails just like I would

> Scripts of a movie, then it can act as a character from movie

### ⭐0176 Lab Tokenization and positional encoding

> New Studio Lab, not a lot of hardware. It's a free tool/toy

- `ml.t3.medium` a less expensive instance
- using defaults is probably ok for now
- jupyter3, amazon linux 2
- wait 5 minutes or it to be ready
- **import from course materials** (2:00)
- install transformer package, **we need source because we are fine tuning**
- install several 'nice have' packages (UI, etc)
- installs pytorch (not tensor flow)
- install BERT packages (transformers/attention)

> Tokenization, a word can be more than one token. Also we tokenize punctuation (hence periods will add tokens). This may be the case for 'positional' encoding

**STOP NOTEBOOK INSTANCE** when finished

#### Huggingface.co (not .com)

- Repo of pre-trained models.
- Several transformer packages
- GPT2

### ⭐0177 - (Lab continued) Multi-headed, masked self-attention

### Self Attention

- Import BERT libraries (bert transformers).
- Import working bert model from Huggingface
  > You can see the 'strength' bonds of words associated. There appears to be high cohesion between "read" and "novel" as example
- You can view the q,k,v - dot product

### ⭐0178 Using GPT with a Sagemaker Notebook

Continue with Jupyter Notebook

Import GPT from huggingface

### ⭐0179 AWS Foundation Models and SageMaker (6:24)

> AWS Offers something called "Foundation Models"

- The giant pre-trained transformer models we are fine tuning for specific tasks, or applying to new applications

- Examples of Foundation Models
  - GPT-n (openAI, microsoft) - Not likely to be on AWS
  - BERT (Google) - not on AWS
  - DALL-E (OpenAI)
  - LLaMa (Meta, On AWS)
  - Segment Anything (Meta)

The key here is the competitor's offering Meta/Facebook does not offer cloud services, so its models (LLama, Segment Anything) may be found in AWS. Google (BERT)/Azure(GPT-n, DALL-E) compete directly with AWS and therefore not part of AWS's offerings.

- **AWS's Foundation Models**
  - Jurassic-2 (AI21Labs)
    - multilingual LLMS for text generation
    - Spanish, English, German, etc.
  - Claud (Anthropic)
    - LLMs for conversation
    - Question Answer
    - Workflow Automation
  - Stable Diffusion (stability.ai)
    - Image, art, logo, design generation
  - Amazon Titan
    - Text Summarization
    - Text generation
    - Q&A
    - Embeddings
      - Personalization
      - Search

> AWS doesn't seem interested in competing with models but rather tries to be an aggregator or repo of models (trying to be a huggingface)

> Amazon's newest model is **Nova**, this is a note made over the slide (3:38)

#### How to use

**Sagemaker Jump-Start**

> Sagemaker has some called "Jumpstart", to quickly launch a new notebook, comes pre-populated notebook to get you started

- **It actually offers many of the huggingface models**
  **EXAM HUGE**

- In addition to the huggingface models, jump-start offers access to

  - Stable diffusion (image generation)
  - Amazon Alexa (encoder/decoder multi-lingual LLM), he wasn't certain if this is the same Alexa as the Amazon service.

### ⭐0180 Lab -Using Amazon SM Jumpstart with huggingface

- Go to jumpstart
- go to foundation models
- Very expensive (for an hour not so bad, but if you forget something **VERY EXPENSIVE**)
- Recommends 'watch' not 'follow along'
- Bunches of really cool models, Meta, some others, models from huggingface
- **huggingface model are cheap**
- There are cheaper Alternative (google lab or something), but AWS's system offers greater flexibilities. (he didn't go into detail)
- Huggingface model details "card", will give more details about the model, one point is 'fine tuning' is supported or not
- Create SM domain (meta-data environment)
- setup for individual or organization (encryption, networking, etc)
- 5 minutes to get Domain set-up
  - Default: permissions, names, roles, user profiles
  - space manages (share resources), EFS
  - app configurations, reasonable defaults
  - env set-up
  - **PAY ATTENTION TO WHAT IS RUNNING** because of cost
- "Launch" from user profile. Starts "SM Studio"

- **It defaulted to super huge instance for running, hence the model we selected was a poor choice for learning/running** because of cost. Need to make sure the model we use is appropriate for our purposes

- Because of the cost of running the specified jumpstart model would be too great. Therefore we did a walk-through and not an actual running
- Goes on to log-out
  - tear-down resource
  - delete entire domain
  - **He accidentally started an instance**
  - remove shared space
  - Careful about tear-down. Resources will be lost, and possibly your co-workers
  - Do not assume it is all done - verify everything is shutdown

**The model/instance is not the only resources created, tear-down everything**
