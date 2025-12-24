# Section 7: Generative AI Model Fundamentals (Questions and Todos)

#### QUESTION X

#### ANSWER X

#### END QUESTION

## Questions

### ⭐0169 Attention

#### QUESTION 1

What is attention? Which network does it pertain to?

#### ANSWER 1

"Attention" is a 'hidden' state that gives an idea of meaning for the current token/word. As we encode/translate words we have the word meaning (probably a few), but we have the contextual meaning, what does this word mean in this sentence.

As we translate a word, we also hold on to a little contextual information "hidden" state that gets updated with each new word. Like the head of a snake the most current translate has the best meaning.

"hidden state" - is attention. The **attention** is the allocation for the 'hidden state', for \_each word\_\_.

This is a concept in RNN

#### END QUESTION

#### QUESTION 2

Discuss the similarity/difference between FFNN and RNN?

#### ANSWER 2

RNN run parallel, requires each token to be translated in order to gain a hidden/contextual meaning. This hidden meaning (`attention` or `weight`) is fed into the next translation. This is the `reoccurant` in RNN. (**parallel**)

FFNN - removes the need for previous state (attention/weight) and attempts to create `self-attention` so each word is aware of it's position and 'weight`. (**serializable**)

#### END QUESTION

#### QUESTION 3

How is `softmax` used to normalize weights/scores of FFNN?

#### ANSWER 3

After the score is computed for each token, `softmax` is used to normalized the scores.

#### END QUESTION

#### QUESTION 3

What are the `q`, `k`, `v` vectors -

#### ANSWER 3

- Q - Query vector
- K - Key vector
- V - Value Vector

These are used to calculate weights in FFNN.

#### END QUESTION

#### QUESTION 4

List some of the more common uses for "Transformer Applications".

#### ANSWER 4

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

#### END QUESTION

#### QUESTION 5

What is a major concern for "Transformer Applications"
(#0172)

#### ANSWER 5

These transformer applications have no inherent sense of truth, right or wrong, personal experience, and will produce what 'sounds reasonable'

> We can do these things but must exercise caution because we are not guaranteed accuracy

#### END QUESTION

#### QUESTION 6

Explain how GPT works. It uses only one... where other may use the other or both.

#### ANSWER 6

Chat GPT uses encoders only.
It implements layers

- Tokenization
- Positional Encoding
- Embedding
- Encoding (to get 'next word/token')

The encoding layer uses FF-NN and 'masked self attention' in the encoding layer so that it is doing is looking for the next logic token. Its able to do this in parallel because of FF-NN + positional encoding + masked self attention

#### END QUESTION

#### QUESTION 7

(0173)
How does "temperature" work
0 - just pick hightest probability
!0 - indication of 'creativity' or flexibility

#### ANSWER X

With things like GPT, I guess 'generative' where we are trying to 'get the next best token'. Several "probable" 'next tokens' are found. The 'next best' is determine by looking at the probabilities that any one of the 'possible next best'. "Temperature" of zero says give then next best, with highest probability. Where temperature greater than zero allow flexibility in determining 'next best' and not strictly a probability comparison.

#### END QUESTION

#### QUESTION 9

Explain Fine Tuning.

#### ANSWER 9

Fine tuning is a method to transfer learning. You start with a foundation model (GPT+, or whatever) then you train it further to customize use-case: customer service, my personal assistant, pretend to be a character from a movie

#### END QUESTION

#### QUESTION 10

What are two methods to transfer learning/fine-tuning model

#### ANSWER 10

- I. Freeze specific layers and retain others
- II. Fine-tuning. Give it more learning data (prompts) so it can learn how to handle specific or generalized prompt responses

#### END QUESTION

#### QUESTION 11

Contrast and compare Tensorflow vs PyTorch

#### ANSWER 11

I actually need to do this

#### END QUESTION

#### QUESTION 12

- What is amazons Model

#### ANSWER 12

- Nova
- Titan
- Alexa (maybe)

He goes on to talk about titan, then there was a message in the lecture that `Nova` is a new model offered by AWS, not details given. Later on in the lecture he mentions Alexa as a model maybe available in the SM Jump-start. He wasn't sure if it was the same model used with Alexa the services

#### END QUESTION

#### QUESTION 13

- Which models are you **not** likely to find on AWS

#### ANSWER 13

(Google/BERT, OpenAI/GPT-n, )
It seems AWS has taken the position that it will not offer models from its competitors. Competitor being company that offers cloud services

- BERT (google)
- GPT-n (OpenAI/Microsoft/Azure)
- Dall-E (OpenAI/Microsoft/Azure)

#### END QUESTION

#### QUESTION 14

What is `titan` (model)? What makes it so special

#### ANSWER 14

It's Amazon's model. Nothing so special about other than it's a competing model. It can do things like:

- Text Summarization
- Text generation
- Q&A
- Embeddings
  - Personalization
  - Search

#### END QUESTION

## Todo

- 0176 - do the lab
- 0176 - play with huggingface, get a model up and running
- 0177 - 2:30(ish) look at the link on huggingface to visualize attention on the web (not notebook necessary)
- 0179/06:20, 0180 - Use jumpstart notebook to utilized a model from huggingface
- 180 - setup "Sagemaker Domain"
- 180 - Find a less expensive hugging face model to run in Jumpstart
