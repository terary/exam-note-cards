# Section 5: SageMaker Built-In Algorithms

## Notes

## Algorithm Sections outline

- what it is
- how it works
- expected input
- hyper parameters
- instance types
- Notes/Comments

## Key Terms

## Links

### ⭐0134 Random Cut Forest (RCF)

- Algorithm for Anomaly detection
- Unsupervised
- Detect unexpected spike in Time Series
- Breaks in Periodicity
- Unclassifiable Data Points
- Assigns an **anomaly score to each Datapoint**
- based on algorithm developed by **Amazon that they seem to be very proud of** **\*Exam**

#### Expected Input

- RecordIO-protobuf or CSV
- can use **File or Pipe** mode
- Optional Test channel for computing accuracy, precision, recall, and F1 on labeled data (Anomaly or not). This is because there is no training so can use the test channel to gauge accuracy

#### How's it Work

- Create a forest of trees where each tree is a partition of the training data; looks at expected change in complexity of the tree as a result of adding a point into it.
- Data is sampled randomly
- Then trained
- RCF Shows up in **Kinesis Analytics** as well, it can work on **streaming data** too.

#### Hyper Parameters

- `Num_trees` - increases reduces noise
- `Num_samples_per_tree` - should be chosen such that a `1/num_samples_per_tree` approximates the ratio of anomalous to normal data ()

#### Instance Types

- Does not take advantage of GPUs
- Uses M4, C4, or C5 for training
- ml.c5.xl for inference

#### Notes

- He said "Just remember RCF is for Anomaly Detection and you should be Ok"

### ⭐0135 Neural Topic Model

#### What it is

- What is a document About
- Organize documents into topics
- \*Topic is not traditional 'topic' but rather arbitrarily defined topics devised by the algorithm (I assume its similar to 'nearness')
- Classify or Summarize documents based on topics
- It's not just TF/IDF
  > Example: "bike", "car", "train", "milage" and "speed" make classify a document as "transportation" for example although it would know to call it that.
- Unsupervised
  - Algorithm is "Neural Variational Inference"

#### Expected Input

- 4 data channels
  - 'train' is **required**
  - 'validation', 'test', and 'auxiliary' **option**
- RecordIO-protobuf or CSV
- **Words must be tokenized**
  - Every docuemnt must contain a count for every word in the vocabulary in CSV (where have I seen this before)
  - The Auxiliary channel is for vocabulary
- File or Pipe mode (how many of these SM Algorithms support both, or smaller number, how many do not)

#### How it works

- You defined how many topics you want
- These topics are **latent representation** based on top ranking words
- **one of two topic modelling algorithms in Sage maker you can try them both** (**EXAM**)

#### Hyper Parameters

- `mini_batch_size` and `learning_rate`, lowering these can reduce validation loss at the expense of training time
- `num_topics`

#### Instance Types

- GPU or CPU
  - GPU Recommended for for training
  - CPU Ok for Inference
  - CPU is cheaper

#### Comments/Notes

- have a better understanding of the word usage "Topic"
- What is TF/IDF again?
- Think Soundex
- It is untrained which is why it doesn't not what "name" to give a topic. Just a arbitrary name, similar to Soundex is 'like'
- tokenize words (how many of these SM algorithm require words tokenized)
- one of two topic modelling algorithms in Sage maker you can try them both - **couple these in your head** know the 'sister' algorithm

### ⭐0136 - LDA - Latent Dirichlet Allocation

- Another Topic Modeling algorithm (Not Deep Learning)
  > He said there are two of these - what to know/understand the relationship
- Unsupervised
  - The topics themselves are unlabeled; they are just groupings of documents shared a shared subset of words
- Can be used for other than words
  - **Cluster customers based on purchases**
  - Harmonic Analysis in music
  - Can be general purposed (commonality within documents)

#### Inputs

- Train channel, optional test channel
- RecordIO-protobuf or CSV
- Each document has counts for every words in vocabulary (in CSV format) **tokenized**
- **Pipe Mode only supported with recordIO**

#### How it is used

- Unsupervised; generates however many topics you specify
- Optional test channel can be used for scoring results
  - per-word log likelihood
- Functionally similar to NTM (what is that), but CPU-based
  - **therefore maybe cheaper/more efficient**

#### Hyper Parameters

- `Num_topics`
- `Alpha0` (**concentration parameter**)
  - initial guess for concentration parameter
  - **Smaller values generate sparse topic mixtures**
  - Larger values (> 1.0) produce uniform mixtures **what does that mean**

**Not human readable topics** (assume arbitrary)

#### Instance Types

- Single Instance CPU - Training
  Did not say anything about inference

### ⭐0137 - KNN - K-nearest-neighbor (notes it's not neural network)

Worlds simplest Machine Learning Algorithm

#### How it is used

- K-Nearest-Neighbors
- Simple Classification or regression algorithm
- Classification
  - Find the K closest points to a sample point and return the most frequent label
- Regression
  - Find the K closest points to a sample point and return the average value
- **My notes are missing the diagram** (0:41)

- Hey said it ... twist and that instead of returning a value it returns an average value for whatever feature you are trying to predict (STD)?

#### Inputs

- `Train` channel contains your data
- `Test` channel emits accuracy or MSE (Accuracy Metrics??)
- recordIO-protobuf or CSV training (first column is label data??)
  - First column is label
- File or Pipe mode on either

#### How it is used

- Data is first sampled
- SageMaker includes dimensionality reduction stage (**next level shit right here**)
  - Avoid sparse data ("Curse of Dimensionality")
  - At Cost of noise/accuracy
  - "sign" or "fjlt" methods
- Build index for looking up neighbors
- Serialize the Model
- Query the model for a given K

\* will try to 'boil-down' features to avoid "Curse of Dimensionality", comes at the cost of noise/accuracy (sign or fjlt)

#### Hyper Parameters

- `K!`
- `Sample_size`

"Otherwise it is KNN and you know what it is about" (2:34)

#### Instance Types

- Training on CPU or GPU
  - Ml.m5.2xlarge
  - Ml.ps.xlarge
- Inference
  - CPU for lower latency
  - GPU for higher throughput on large batches

### 0138 K-Means

# ---------------------------

### Questions/Todo

- We're doing math? Why can't we do circular reference with look-up tables
- "File or Pipe mode on either" do we have cases where one channel (?) will accept one but not the other, while other channels do it differently (0137, 1:08)?

- He said, "with the case of [non neural network] algorithm we don't have the NN parameters for tuning, only the alpha. Does that mean that NN have one set of common parameters and Non-NN parameters have a different set? Can we infer which is NN and which is not by looking at their parameters. As always look at commonality with each set of parameters

- try At least one of the document commonality algorithm with the tokenization and word counts <--- What is that.

- Which are un/supervised? What does that mean exactly (how is that different than serverless). Probably obvious be if you are informed it is an easy question
  -What is this test channel. When there is no Training how do we use it.

- Have a better understanding of the concept of RCF, not just how it fits in with other algorithm but what is under the hood. He talks about a data points that creates further branches (more trees) indicates a likely anomaly.
- What the heck is:
  > `Num_samples_per_tree` - should be chosen such that a `1/num_samples_per_tree` approximates the ratio of anomalous to normal data ()
- What is **latent representation**
- `learning_rate`
- CPU is Cheaper than GPU, get an idea of pricing differences (if possible maybe comparing apples to oranges)

- Be able to name all the algorithm and the purpose. Identify the 'common' input, instance, (all/any commonality), then know the algorithms that vary from this (most use RecordIo-protobuf, so which ones do not?)
