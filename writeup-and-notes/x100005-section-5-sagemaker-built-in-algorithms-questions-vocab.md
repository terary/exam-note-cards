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

- Convultional
- What is the one algorithm that require tokenized as float (are there others)?
- Want to build several of these types of question (the one thing, the one algorithm, etc) "What is odd about object2vet is that it consists of pairs of tokens, or sequence of tokens" (0130/1:48)

- What is 'Tensorflow' '... from the Tensorflow Garden'
- How does RecordIO handle image files. Object detection input RecordIO or Image format (jpg, png) (131/3:44)
- Will want to categorize which algorithm can support single instance, GPU, CPU multi machine, multi-core

- What is "Augmented manifest image format" (0133/1:26)

### Vocab

## Vocabulary

- `convolutional neural network (CNN)`
- > A convolutional neural network (CNN) is a type of deep learning model primarily used for image recognition and processing by automatically learning and extracting features from data. CNNs use specialized layers like convolutional layers (with filters to detect patterns), activation layers (like ReLU), and pooling layers to reduce data dimensions. These features are then processed through fully connected layers to perform classification or other tasks.

- `latent representation`
  - > A latent representation is a compressed, simplified version of complex data that captures its most essential features in a lower-dimensional "latent space. (Think, field definitions vs the key elements that make up the logic equations)
- `learning_rate` (hyperparameter)
  - > The learning rate is a crucial hyperparameter in machine learning that determines the step size an optimization algorithm (like gradient descent) takes when adjusting model parameters to minimize the loss function. It is widely considered the single most important hyperparameter to tune for a neural network.
- `Dirichlet`
  - > German Sir Name
- `Latent Dirichlet Allocation (LDA)`
  - > Latent Dirichlet Allocation (LDA) is a machine learning technique for unsupervised topic modeling that identifies hidden thematic structures in a collection of documents. It operates on the assumption that documents are a mixture of topics, and each topic is a mixture of words, and uses these assumptions to discover the underlying topics and their distribution within documents. LDA is a probabilistic model that can be used for tasks like text summarization and content analysis, by revealing the topics and how much each topic contributes to a document.
- `Harmonic Analysis`
  - > Harmonic analysis is a branch of mathematics and engineering that studies how to decompose a complex, periodic signal into a sum of simpler sine and cosine waves. This process is used to analyze periodic phenomena like sound waves and electrical currents by breaking them down into fundamental frequencies and their harmonics. The most common application is using Fourier series, which represent a function as an infinite sum of sines and cosines.
- `Curse of Dimensionality` - 0137/1:29
  - > The "curse of dimensionality" in machine learning refers to various challenges that arise when working with high-dimensional data, where the number of features is large. As dimensions increase, the volume of the data space grows exponentially, causing data points to become sparse and distances between them to become less meaningful, which can lead to increased risk of overfitting and decreased model performance.
- `Euclidean distance` - 0138/0:11
  - > Euclidean distance isthe shortest straight-line distance between two points in space, calculated using the Pythagorean theorem. It can be extended to any number of dimensions, and the formula for two dimensions\((x*{1},y*{1})\)and\((x*{2},y*{2})\)is\(d=\sqrt{(x*{2}-x*{1})^{2}+(y*{2}-y*{1})^{2}}\). This metric is widely used in fields like physics, machine learning, and computer science to measure the direct distance between points
- `K-means Clustering`
  - > K-Means is an unsupervised machine learning algorithm that groups unlabeled data into a pre-defined number of clusters, 'k'. It works by iteratively assigning data points to the nearest cluster centroid and then recalculating the centroids based on the new cluster assignments until the clusters stabilize. This is a common method for tasks like market segmentation, document clustering, and image compression.
- `Web-scale K-Means clustering` - 0138/0:11
  - I have no idea. I **think** I may have gotten terms mixed up
- `lloyds method` with `kmeans++` - (0138/2:14)
  - > Lloyd's algorithm, also known as the standard k-means algorithm, is an iterative method for partitioning a dataset into \(k\) clusters. It involves two main steps that are repeated until convergence: <u>Assignment Step</u>: Each data point is assigned to the cluster whose centroid is closest to it. <u>Update Step</u>: The centroids of the clusters are re-calculated as the mean of all data points assigned to that cluster. K-means++ is an intelligent initialization method for Lloyd's algorithm. The primary limitation of standard k-means (Lloyd's algorithm) is its sensitivity to the initial placement of cluster centroids. Random initialization can often lead to suboptimal clustering results or slow convergence. K-means++ addresses this by providing a more strategic way to select the initial centroids.
- `Elbow Method` (0138/4:04)

  - > The elbow method is a technique used in machine learning to find the optimal number of clusters (\(k\)) for a clustering algorithm like K-Means. It works by plotting the Within-Cluster Sum of Squares (WCSS) against different values of \(k\), and then identifying the "elbow" point where the rate of decrease in WCSS slows down significantly. This "elbow" represents the point where adding more clusters provides diminishing returns in terms of better fits ![Alt text describing the image](https://media.licdn.com/dms/image/v2/D4D12AQF-yYtbzPvNFg/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1682277078758?e=2147483647&v=beta&t=BWIfjY3GR82JytDIAg9d8F8AYnzZdOD6ZmFOOYSmkE8)

- `Projecting the higher dimensionality into lower dimensional space` - (0139/0:37)

  - > Projecting high-dimensional data to a lower-dimensional space is a technique called dimensionality reduction, which uses linear or nonlinear transformations to reduce the number of features while preserving as much original information as possible. This process helps with data visualization, reduces storage and computational costs, and can reveal underlying patterns by combining original features. Popular methods include Principal Component Analysis (PCA) for linear reduction and techniques like UMAP for nonlinear reduction that preserves both local and global structure. ![Alt text describing the image](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6G4Zs1FHcFuW7F58yLGypKCLSurbUKyw8yf8jXdmqPm71DFtlCQRjXobjdJU17gZ8gnrLvmlJ)

- `Covariance Matrix` - (0139/2:03)
  - > A covariance matrix is a square matrix that shows the covariance between each pair of variables in a dataset. The diagonal elements are the variances of individual variables, while the off-diagonal elements represent the covariance between different pairs of variables. This matrix is symmetric, meaning its value is the same when flipped across the diagonal. (**symmetric graph**)
- `singular value decomposition (SVD)` (0139/2:03)
  - > Singular Value Decomposition (SVD) is a factorization of a matrix into three matrices: an orthogonal matrix \(U\), a diagonal matrix \(S\) containing the singular values, and another orthogonal matrix \(V^{T}\). It can be applied to any rectangular matrix and is a fundamental tool for analyzing data, finding matrix inverses, and many applications like image compression, facial recognition, and recommendation systems.
- `Area Under the Curve (AUC)` (0141/1:00)
  - > Area Under the Curve (AUC) in machine learning is a performance metric for binary classification models that measures how well the model distinguishes between positive and negative classes across all possible thresholds. A higher AUC value indicates a better model, with \(1.0\) representing a perfect model and \(0.5\) representing a model that is no better than random chance.
- `latent vector representation` (0141/1:10)
  - > A latent vector representation is a compressed, lower-dimensional representation of high-dimensional data, where similar data points are mapped closer together in a "latent space". Machine learning models create these vectors to capture the essential features of the data, making it more efficient for analysis, comparison, and generation, and reducing the risk of overfitting. These latent vectors are fundamental to tasks like image recognition, natural language processing, and generative AI, where they enable models to understand and manipulate complex patterns at an abstract level.
- `Over fitting` - its used through out but he defines it early
  - > Overfitting is when a machine learning model learns the training data too well, including its noise, causing it to perform poorly on new, unseen data because it cannot generalize
- `stochastic gradient descent` - (0124/2:27)
  - > Stochastic Gradient Descent (SGD) is an optimization algorithm widely used in machine learning to train models efficiently, especially with large datasets. It is a variant of the traditional Gradient Descent algorithm
- `eXtreme Gradient Boosting` or `Gradient Boosting` Mentioned throughout but at (0125/0:14)
  - > See below code quote

```
How it works:
Objective Function and Loss: In machine learning, models are trained to minimize a "loss function" (or "cost function") that quantifies the error between the model's predictions and the true data.

Gradient Descent: Gradient Descent iteratively adjusts the model's parameters (weights and biases) in the direction that minimizes this loss function. It does this by calculating the gradient of the loss function with respect to the parameters, which indicates the direction of steepest ascent. The parameters are then updated in the opposite direction (downhill).
Stochastic Nature: The key difference with SGD is that instead of computing the gradient over the entire dataset (as in batch gradient descent), SGD computes the gradient and updates parameters using either:

A single data sample: In its purest form, SGD processes one data point at a time.
A small subset of data (mini-batch): This is the more common and practical approach, known as mini-batch SGD, where a small batch of samples is used to compute the gradient.
Advantages of SGD:

Efficiency with Large Datasets: Processing data in smaller batches or individually makes SGD computationally much more efficient and memory-friendly, especially for massive datasets where computing gradients over the entire dataset would be infeasible.
Faster Updates: More frequent updates (per sample or mini-batch) can lead to faster initial convergence.

Escape Local Minima: The stochastic nature introduces some randomness, which can help the algorithm escape shallow local minima and potentially find better global minima in complex loss landscapes
```

- `Decision Trees` Mentioned throughout but at (0125/0:14)

  - > A Decision Tree in machine learning is a supervised learning algorithm used for both classification and regression tasks. It operates by constructing a model that resembles a flowchart, where each internal node represents a test on an attribute, each branch represents the outcome of that test, and each leaf node represents a class label (for classification) or a predicted value (for regression).
  - **NOTICE "supervised"**

- `Regression Trees` Mentioned throughout but at (0125/0:14)
  - > Regression trees are a type of supervised machine learning algorithm used to predict a continuous numerical output by recursively partitioning the data based on predictor variables. They are a variant of decision trees, where each terminal node (leaf) contains a predicted value, often the mean of the training data points in that leaf, and the tree structure explains which features were used and how they led to the prediction.
- `Kaggle Competitions` - What is is
  - > These competitions allow data scientists, machine learning engineers, and researchers from all over the world to compete against each other to solve complex problems and create the best predictive models.
- `recordIO-protobuf` -
  - > `RecordIO-Protobuf` is a data format that combines the RecordIO container format with Google's Protocol Buffers (Protobuf) for data serialization
  - > `RecordIO RecordIO`: This acts as a simple container format that wraps individual data records. It typically uses a length-prefixed structure, allowing for efficient streaming and processing of records without needing to load the entire dataset into memory.
  - > `protobuf` Protocol Buffers (Protobuf): This is a language-neutral, platform-neutral, extensible mechanism for serializing structured data. Protobuf defines a schema using a .proto file, which then generates code for various programming languages to easily serialize and deserialize data according to that schema.
  - > ```
    > Combined Benefits:
    > *Streaming Capability: The RecordIO wrapper enables streaming data directly from sources like Amazon S3, especially in SageMaker's Pipe mode. This avoids the need to download entire datasets, saving time and memory.
    > *Memory Efficiency: Data is processed record by record, reducing memory footprint, which is crucial for large datasets.
    > *Speed: Protobuf's binary serialization is generally faster to parse than text-based formats like CSV, leading to quicker data loading and potentially faster training times.
    > *Strong Typing and Schema Evolution: Protobuf provides a strongly typed schema, ensuring data consistency and allowing for safe schema evolution over time.
    > ```
- `seasonality` as in "Find frequencies and seasonality" (128/0:07)
  - > Seasonality in machine learning refers to the repeating, cyclical patterns within time series data that occur at regular, fixed intervals, such as daily, weekly, or yearly fluctuations. Machine learning uses techniques to identify, model, and forecast these seasonal patterns alongside trends and residuals to improve accuracy in tasks like forecasting. This is achieved by using models that can capture these periodic behaviors, often through feature engineering or by using models designed for time series analysis
- `Bag of words` used through out but found in (129/2:59)
  - > Bag of disconnected words order the words appear are not relevant (hence those that support this are doing what?)
- `skip-gram`
  - > Skip-gram is a machine learning technique for learning word embeddings, which are dense vector representations of words that capture semantic relationships. It works by training a neural network to predict the surrounding context words given a single center word within a defined window. This process allows the model to learn the meaning of words based on their neighbors, making it effective for tasks in natural language processing (NLP).
- `feed-forward-network` (0130/2:51)
  - > A Feedforward Neural Network (FFNN) is a fundamental type of artificial neural network in machine learning. Its defining characteristic is the unidirectional flow of information, meaning data travels only forward from the input layer, through any hidden layers, and finally to the output layer, without any loops or feedback connections.
- `weight decay` (0130/3:08)
  - > Weight decay is a regularization technique used in machine learning to prevent overfitting by penalizing large weights, which keeps the model simpler and improves its ability to generalize. It works by adding a penalty term to the loss function that is proportional to the magnitude of the weights, effectively shrinking them toward zero during training. This encourages the model to find a solution where many parameters have small, non-zero values instead of a few having very large values
