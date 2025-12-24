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
