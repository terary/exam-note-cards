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

### ⭐0138 K-Means

Common algorithm, AWS takes it to the next level

#### How it is used

- Unsupervised clustering (I think(?) this is contrast to K-nearest-neighbor, which maybe supervised.), Why does labeling make a difference
- Divide data into K groups (feature-space), where members of a group are as similar as possible to each other.
  - You define what 'similar' means
  - Measured by Euclidean Distance
- Web-scale K-Means clustering (this is what makes the algorithm special, doing this at-scale)

#### Inputs

- Train channel, optional test
  - Train ShardedByS3Key, test FullyReplicated **sharded** not shared, this is related to training in parallel
- recordIO-protobuf or csv
- File or Pipe on either

#### How it works

- Every observation mapped to n-dimensional space (n = number of features)
  > how similar to features are, within that dimensional space
- Works with optimized the center of K clusters
  - "extra cluster centers" may be specified to im\*prove accuracy (which ends up getting reduced to k) -
    > To help improve accuracy.
  - `K = k*n` (starts withe 'more' clusters and tries to reduce over time, we are looking for little k, this is a SM 'improvement'/'extension')
- Algorithm:
  - Determine initial cluster centers
    - Random or `k-means++` approach (results is clustering too close together. To remedy it uses `k-means++`)
    - `k-means++` tries to make initial clusters far apart
      > just means tries to make clusters as far apart as possible
  - iterate over training data and calculate cluster centers
  - reduce clusters from k to k
    - using `loayds method` with `kmeans++`

#### Hyper Parameters

- K!
  - Choosing `K` is tricky
  - Plot within-cluster sum of squares as function of `K`
  - Use "Elbow Method"
  - Basically optimize for tightness of cluster (**this is probably not on the exam** just nice to know, and I want to know but I don't need to sweat remember)
- `Mini_batch_size`
- `Extra_center_factor`
- `Init_method`

#### Instance Types

- CPU (recommend) or GPU
  - Only one GPU per instance used on GPU
  - So use `ml.g4dn.xlarge` if you use GPU
  - `p2`, `p3`, `g4dn`, and `g4` supported (training and inference)

### ⭐0139 Principle Component Analysis (PCA)

#### How it is used

- Dimensionality reduction (_think_ this helps make data more tight I think)
  - Project higher-dimensional data (lots of features), into lower dimensional (like 2D plot) while minimizing **loss of information** (probably huge)
  - The reduced dimensions are called `components`
    - first component has largest possible variability
    - second component has next larger (increases component => increase variability)
    - > to distill
- Unsupervised

> Projecting the higher dimensionality into lower dimensional space, that is what PCA does
> That quote is what you want to remember for **EXAM**, this is not likely on the exam, but knowing what that means suggests you have an understanding of the algorithm.

**to reduce the curse of dimensionality**

#### Inputs

- recordIO-protobuf or csv
- file or pipe on either

#### How it works

- `Covariance Matrix` is created, then singular value decomposition (SVD)
- Two modes
  - Regular
    - For sparse data and moderate number of observations and features
  - Randomized
    - for large number of observations and features
    - uses approximation algorithm

#### Hyper Parameters

- `Algorithm_mode` I assume `regular` | `Randomized`
- `Subtract_mean`
  - unbiased data

#### Instance Types

- GPU or CPU
  - It depends "on the specifics of the input data"

### ⭐0140 Factorization Machines

Classification/Regression

#### How it is used

- Dealing with sparse data
  - Click Prediction
  - Item recommendations
  - Since individual user doesn't interact with most pages / products the data is spars
- Supervised
  - Classification or Regression
- Limited to pair-wise interaction
  - > Matrix, requires two dimensions (pair-wise). I assume we send "couplings" to determine next coupling
  - User -> item for example

Example 'Recommender system' What pages/products a user might like "recommended for you". Looking at the few pages they click to determine what (of the vast many) pages they may want to see next.

#### Inputs

- recordIO-protobuf with Float32
  - Sparse data means csv is not available

#### How it works

- Finds factors we can use to predict a classification (click or no? purchase or not?) or value (predicate rating?) given a matrix representing some pair of things (users and items?)
- Usually used in the context of recommender systems

**EXAM** if you are asked what are good algorithm for recommendations, factor machines is a good choice.

To note, visualization. Think matrix multiplication. Taken the smaller (known) matrix to multiple unknown to determine likely of next click. It kinda makes sense but my understanding is weak.

#### Hyper Parameters

- Initialization methods for bias, factors and linear terms
  - Uniform, normal, or constant
  - Can tune properties of each method

#### Instance Types

- CPU or GPU
  - CPU **recommended**
  - GPU only worse with **dense data** and our data is sparse

If you have dense data - you should not be looking at factorization machines. This would be good to know. Like "my data is sparse" what algorithms are best

### ⭐0141 IP Insights

Finding fishy behavior in weblogs

#### How it is used (What is for)

- Unsupervised learning of IP address usage patterns
- Identifies suspicious behavior from IP address
  - Identify logins from anomalous IPs
  - Identify accounts creating resources from anomalous IPs (oh no, this IP is creating a resources when it should only 'view'?)

#### Inputs

Training input

- User names, account IDs can be fed in directly, no pre-process
- Training channel, optional validation (Computes AUC score) Area Under the Curve (AUC)

He said 'because unsupervised' validation channel is optional

**CSV ONLY**

- entity IP

#### How it works

- Uses a neural network to learn latent vector representation of entities and IP addresses.
- Entities are hashed and embedded
  - need sufficiently large hash size
- Automatically generates negative sample during training by randomly pairing entities and IPs

#### Hyper Parameters

- `Num_entity_vectors`
  - Hash size
  - Set to twice the number of unique entity identifiers
- `Vector_dim`
  - Size of embedding vectors
  - Scales model size
  - too larger results in over-fitting
- `Epochs`, `learning rate`, `batch size` (the usual suspects)

#### Instance Types

- CPU or GPU
  - GPU **recommend** because its a neural network (\*nn)
  - ML.p3.2xlarge or higher
  - Can use multiple GPUs
  - Size of CPU instance depends on `vector_dim` and `num_entity_vectors`

### ⭐ Quiz

# ---------------------------

### Questions/Todo

- "Because it is a neural network" GPU are recommended - Understand why
- `Epochs`, `learning rate`, `batch size` (the usual suspects) What are the usual suspects. This is specific to "Neural Networks"

- He said 'because unsupervised' validation channel is optional (0141/0:46)
- For each of these he give 1 or 2 sentence at the very beginning "what its about"
- "Sparse data means csv is not available" (0140/2:01)
- In terms of classification/regression what does each algorithm do? I know there is more than classification/regression but I should be able to ascribe one or more to each algorithm - that is probably what you need for exam
- The last 20-30 seconds gives summary of each algorithm, 3 or 4 sentences. Those summaries are probably what you want to be most familiar
- 0138/0:11 - says un/supervised, un/labeled. Determine if there is a relationship between labeled/supervised, and what is that relationship
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
