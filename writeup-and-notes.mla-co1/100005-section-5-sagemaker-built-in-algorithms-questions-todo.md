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
- "100's of GB of throughput and millions of IOPS" understand the relationship between IOPS and Throughput

- Usually when we think of regression we think of numeric??? (124/1:09)

- (124/4:09) - `Learning_rate`, `mini_batch_size`, `L1`, `L2` it mentions are standard Neural Network Hyper Parameters, I am sure there are others - what are they?
- (125/0:50) "Although you tend to think of decision trees to being classification" can also use with regression (numeric values)
- `Pickle` (Python) (0125/1:30)

- Will want to group all the 'like' algorithms. It seems there is a trend to offer two or three similar algorithms. We'll want these to help with memorization

- How do we do validation?
- He said "This is memory bound algorithm" so will want to choose general purpose over compute optimize (0126/2:42)
  - We want to list all algorithm for X bound time (are there others than Compute/Memory)
  - If that means we need to choose Instance Type of XYZ, How do we figure on our own. Meaning Giving Algorithm X, which is Y bound, we want instances of type Z (M5 not C5). We covered the instance types (though I don't remember), M, C? What about `G` or `P`
- How many and which algorithm require floats, text-token, integer, vocab files, validation file,

- At 0127/2:02 - gives example code to convert float to int, or text to int- do that - just to see what/why/how it works
- > - Training for machine translations can take days even on SageMaker, Pre-trained models are available **see example notebook** (0127/2:22)

- "jsonl format as gzip or parquet" how does parquet format work? that its different than jsonl but supports jsonl

- (128/4:16) He says "Tuning" stage, in comparison to Training. There are few of these stages - what are ALL of them, and in order, training?, validation?, inference?, tuning? others? is this correct? Would it be an advantage to know all stages and build truth table for each algorithm and which uses what? Is there a pattern to understand? RNN use Tu, I, Ti, but not V?

- `Classification/Regression` Compare Contrast, used through out

  - Supervised Learning Models
    - Regression Models
    - Classification Models
    - When to use:
      - Fraud detection
      - Churn prediction
      - Detecting anomalies as "normal/abnormal"
      - Image classification (ResNet, VGG, etc.)
    - Key characteristics:
      - Output: class label or class probabilities
      - Loss: cross-entropy
      - Metrics: accuracy, F1 score, precision/recall/AUC
  - Unsupervised Learning Models
    - Clustering Models
    - Dimensionality Reduction Models
    - Topic Modeling
  - Reinforcement Learning Models
  - Deep Learning Models
  - Time-Series Models
    | Type | Supervision | Output | Key Use Cases |
    | ----------------------------- | -------------------- | ------------------------------ | ------------------------- |
    | **Regression** | Labeled | Number | Forecasting, pricing |
    | **Binary Classification** | Labeled | 0 or 1 | Fraud, churn |
    | **Multiclass Classification** | Labeled | Category | Image/text classification |
    | **Multilabel Classification** | Labeled | Multiple categories per sample | Tagging documents |
    | **Clustering** | Unlabeled | Groups | Segmentation |
    | **Dimensionality Reduction** | Unlabeled | Fewer features | Preprocessing |
    | **Topic Modeling** | Unlabeled | Topics | Text mining |
    | **Reinforcement Learning** | Rewards | Policy | Robotics, games |
    | **Deep Learning** | Labeled or unlabeled | Flexible | Images, NLP |
    | **Time-Series** | Labeled | Sequence forecast | Demand, capacity |

- Convolutional
- What is the one algorithm that require tokenized as float (are there others)?
- Want to build several of these types of question (the one thing, the one algorithm, etc) "What is odd about object2vet is that it consists of pairs of tokens, or sequence of tokens" (0130/1:48)

- What is 'Tensorflow' '... from the Tensorflow Garden'
- How does RecordIO handle image files. Object detection input RecordIO or Image format (jpg, png) (131/3:44)
- Will want to categorize which algorithm can support single instance, GPU, CPU multi machine, multi-core

- What is "Augmented manifest image format" (0133/1:26)
