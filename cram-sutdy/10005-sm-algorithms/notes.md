


### From notes
### Supplemental AI assisted

## Complete List of SageMaker Algorithms with Purpose

1. **Linear Learner** (SUPERVISED | PURPOSE: Classification, Regression) - Performs linear regression and classification by fitting lines to training data for numeric predictions or class assignments.

2. **XGBoost** (SUPERVISED | PURPOSE: Classification, Regression) - Extreme gradient boosting using boosted decision trees that correct errors sequentially, commonly used for classification and regression tasks.

3. **LightGBM** (SUPERVISED | PURPOSE: Classification, Regression, Ranking) - Gradient boosting decision tree algorithm optimized for classification, regression, or ranking with gradient-based one-side sampling and exclusive feature bundling.

4. **Seq2Seq** (SUPERVISED | PURPOSE: Machine Translation, Text Summarization, Speech-to-Text) - Converts sequences of tokens to other sequences of tokens using RNNs/CNNs with attention, primarily for machine translation, text summarization, and speech-to-text.

5. **DeepAR** (SUPERVISED | PURPOSE: Time Series Forecasting) - Forecasts one-dimensional time series data using RNNs, learning patterns across multiple related time series simultaneously to detect frequencies and seasonality.

6. **BlazingText** (MIXED - Supervised for text classification, Unsupervised for Word2Vec | PURPOSE: Text Classification, Word Embeddings) - Performs text classification (supervised label prediction) and Word2Vec word embeddings for creating vector representations where semantically similar words have similar vectors.

7. **Object2Vec** (SUPERVISED | PURPOSE: Embeddings, Recommendations, Nearest Neighbor Search) - Creates low-dimensional dense embeddings of arbitrary objects (like word2vec generalized), useful for recommendations, nearest neighbor search, and visualizing clusters.

8. **Object Detection** (SUPERVISED | PURPOSE: Object Detection) - Detects and classifies all objects in images with bounding boxes and confidence scores using deep neural networks (MXNet or TensorFlow variants).

9. **Image Classification** (SUPERVISED | PURPOSE: Image Classification) - Assigns one or more labels to entire images (unlike object detection which provides locations) using pre-trained models that can be fine-tuned.

10. **Semantic Segmentation** (SUPERVISED | PURPOSE: Semantic Segmentation) - Performs pixel-level object classification creating segmentation masks, useful for self-driving vehicles, medical imaging, and robot sensing.

11. **Random Cut Forest (RCF)** (UNSUPERVISED | PURPOSE: Anomaly Detection) - Unsupervised anomaly detection algorithm that assigns anomaly scores to data points, detecting unexpected spikes in time series and breaks in periodicity.

12. **Neural Topic Model (NTM)** (UNSUPERVISED | PURPOSE: Topic Modeling) - Unsupervised topic modeling using neural variational inference to organize documents into topics based on latent representations of word usage patterns.

13. **LDA (Latent Dirichlet Allocation)** (UNSUPERVISED | PURPOSE: Topic Modeling) - CPU-based unsupervised topic modeling algorithm that groups documents sharing similar word subsets, can also cluster customers or perform harmonic analysis.

14. **KNN (K-Nearest Neighbors)** (SUPERVISED | PURPOSE: Classification, Regression) - Simple classification or regression algorithm that finds the K closest points to a sample and returns the most frequent label or average value.

15. **K-Means** (UNSUPERVISED | PURPOSE: Clustering) - Unsupervised clustering algorithm that divides data into K groups where members are as similar as possible, optimized for web-scale clustering operations.

16. **PCA (Principal Component Analysis)** (UNSUPERVISED | PURPOSE: Dimensionality Reduction) - Dimensionality reduction algorithm that projects higher-dimensional data into lower dimensions while minimizing information loss to reduce the curse of dimensionality.

17. **Factorization Machines** (SUPERVISED | PURPOSE: Classification, Regression, Recommendations) - Classification and regression algorithm designed for sparse data (like user-item interactions) commonly used for click prediction and item recommendations in recommender systems.

18. **IP Insights** (UNSUPERVISED | PURPOSE: Anomaly Detection) - Unsupervised learning algorithm that identifies suspicious IP address usage patterns in weblogs, detecting anomalous logins or resource creation from unusual IPs.

The document notes these are commonly tested on the AWS exam, so understanding each algorithm's purpose, input formats, and instance type requirements is important.

**IMPORTANT**
SageMaker Algorithms → ML Architectures:

**LINEAR:**

- Linear Learner (pure linear)
- Factorization Machines (linear + interactions) ← YOU ARE HERE

**TREE-BASED:**

- XGBoost (gradient boosting)
- LightGBM (gradient boosting)
- KNN (similarity-based)

**NEURAL NETWORKS:**

- **CNNs:** Object Detection, Image Classification, Semantic Segmentation
- **RNNs:** Seq2Seq, DeepAR
- **Feedforward:** BlazingText, Object2Vec, NTM

**UNSUPERVISED:**

- K-Means (clustering)
- PCA (dimensionality reduction)
- RCF, IP Insights (anomaly detection)
- LDA, NTM (topic modeling)

## Comparison for your MNIST task

| Architecture                     | Typical MNIST Accuracy  | Complexity   | Speed     |
| -------------------------------- | ----------------------- | ------------ | --------- |
| **Logistic Regression**          | ~92%                    | Very Simple  | Very Fast |
| **Factorization Machines**       | ~94-96% (what you have) | Medium       | Fast      |
| **Random Forest**                | ~96-97%                 | Medium       | Fast      |
| **Support Vector Machine**       | ~98-99%                 | Medium       | Medium    |
| **Neural Network (MLP)**         | ~98%                    | Medium       | Medium    |
| **Convolutional Neural Network** | **~99%+**               | Complex      | Medium    |
| **Deep CNN (ResNet, etc.)**      | **99.5%+**              | Very Complex | Slow      |

---

## Why different architectures?

Each is optimized for different things:

1. Linear models: Simple, fast, interpretable

   - Good when patterns are simple

2. Neural Networks: Complex patterns, automatic feature learning

   - Good when you need to learn complicated relationships
   - CNNs are specifically designed for images

3. Tree models: Rules-based, interpretable, handles non-linear

   - Good when you need to understand why it made a decision

4. Factorization Machines: Efficient interactions, sparse data

   - Good for recommendation systems, sparse features
   - Less common for images (but works, as you've seen)

5. SVMs: Strong boundaries, kernel methods
   - Good for clear separation between classes
###

---

Several ways to work with SM, most common Notebook

Notebooks:

- Has S3 Access
- Can use Scikit_learn, Spark, Tensorflow
- Wide variety of models
- Ability to spin up training instances
- Ability to deploy trained models for making predictions at scale \* much of this can also be done from the console (not notebook)

- Save your trained models to S3
- Can deploy two ways
  - Persistent endpoint for making individual predictions on demand
  - SageMaker Batch Transform to get predictions for entire dataset **This is big. eg, get single prediction or transform training data( find missing values or other cleanup)**
- Lots of options
  - Inference Pipeline for more complex processing
  - Sagemaker **Neo** for deploying to **edge devices**
  - Elastic Inference for accelerating deep learning models
  - Automatic scaling (increase # of endpoints as needed)
  - Shadow Testing **evaluates new models** against current deployment model to catch errors **kinda safety net**


### ⭐0123 Input Modes **Exam**

- S3 File Mode
  - Default **copies** training data from S3 to local directory in docker container.
    - BAD: requires space available within the docker image
    - BAD: Time to copy
    - This is the **default** mode something to consider, probably ALWAYS want to consider better options
- S3 Fast File Mode
  - Akin to "Pipe Mode" training can begin without
    waiting to download data
  - Can do random access, but **works best with sequential access**
  - it streams from S3.
  - it can do random access but sequential is better
  - **This maybe the preferred mode** but maybe not widely supported
- Pipe Mode
  - Streams data directly from S3
  - **Mainly replaced by Fast File**

### Data sources:

- S3-1Z Not necessarily an "Input Mode" but **Amazon S3 Express One Zone**. But it provides very fast access but limited to one AZ **EXAM** how/why this is good, it's limitations

  - High-performance storage class one AZ
  - Works with file, fast file, and pipe modes
  - No backups its very temporary

- FSx for Luster
  - Scales to 100's of GB of throughput and millions of IOPS with low latency
  - Single AZ, requires VPC
  - **EXAM** if you are training Massive Amounts of Data, Luster is probably the best option
- Amazon EFS
  - Requires data to be in EFS already
  - Requires VPC
  - Not said hear but EFS should support multiple instances? and multiped AZ (see the EFS section to verify)
