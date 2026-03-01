# SageMaker Built-In Algorithms — Hyperparameters Reference

All hyperparameters from `100005-section-5-sagemaker-built-in-algorithms-0121-0141.md`, with type/shape, description, and algorithms that use them. Ordered by how many algorithms use each (most used first).

---

**Learning_rate** (float, often small, e.g. 0.1, 0.002)  
Step size used by the optimizer (e.g., gradient descent). Controls speed of convergence and final solution quality; too high can diverge, too low can be slow.

- Linear Learner  
- LightGBM  
- Seq2Seq  
- DeepAR  
- BlazingText (Word2Vec and text classification)  
- Object2Vec  
- Object Detection  
- Image Classification  
- Semantic Segmentation  
- Neural Topic Model (NTM)  
- IP Insights

---

**Batch_size** (integer)  
Number of samples per training step. Affects memory use, throughput, and often convergence.

- Seq2Seq  
- Object2Vec  
- Image Classification  
- Semantic Segmentation  
- IP Insights

---

**Mini_batch_size** (integer)  
Number of samples per mini-batch for one training step. Affects memory, speed, and stability.

- Linear Learner  
- DeepAR  
- Object Detection  
- Neural Topic Model (NTM)  
- K-Means

---

**Epochs** (integer)  
Number of full passes over the training dataset.

- DeepAR  
- BlazingText (text classification)  
- Object2Vec  
- Semantic Segmentation  
- IP Insights

---

**Optimizer** / **Optimize_type** (categorical: sgd, adam, rmsprop, adadelta, etc.)  
Optimization algorithm used for weight updates (e.g., SGD, Adam, RMSprop, Adadelta).

- Seq2Seq (Optimize_type)  
- Object Detection  
- Image Classification  
- Semantic Segmentation  
- Object2Vec (optimizer)

---

**Max_depth** (integer)  
Maximum depth of each tree. Deeper trees can overfit; limiting depth regularizes the model.

- XGBoost  
- LightGBM

---

**Num_topics** (integer)  
Number of topics (latent themes) to discover. Defines the size of the topic representation.

- Neural Topic Model (NTM)  
- LDA (Latent Dirichlet Allocation)

---

**K** (integer)  
Number of nearest neighbors (KNN) or number of clusters (K-Means). In KNN: number of neighbors used for classification/regression. In K-Means: number of clusters.

- KNN  
- K-Means

---

**Vector_dim** (integer)  
Dimensionality of embedding vectors. In BlazingText (text classification): context window / how many words are considered together. In IP Insights: size of entity/IP embeddings; too large can overfit.

- BlazingText (text classification)  
- IP Insights

---

*Single-algorithm hyperparameters below are grouped by algorithm (same order as in the source doc).*

---

**Linear Learner**

**binary_classifier_model_selection_criteria** (categorical: recall_at_target_precision, precision_at_target_recall, etc.)  
Selection criteria for the binary classifier. Use recall_at_target_precision with target_precision to fix precision and maximize recall; use precision_at_target_recall with target_recall to fix recall and maximize precision.

- Linear Learner

---

**Balance_multiclass_weights** (boolean/flag)  
Gives each class equal importance in the loss function; useful for imbalanced multi-class problems.

- Linear Learner

---

**L1** (float)  
L1 regularization strength; encourages sparsity and can reduce overfitting.

- Linear Learner

---

**target_precision** (float)  
Target precision value when using binary_classifier_model_selection_criteria = recall_at_target_precision. Holds precision at this value while maximizing recall.

- Linear Learner

---

**target_recall** (float)  
Target recall value when using binary_classifier_model_selection_criteria = precision_at_target_recall. Holds recall at this value while maximizing precision.

- Linear Learner

---

**Wd** (float)  
Weight decay (L2 regularization) strength.

- Linear Learner

---

**XGBoost**

**Alpha** (float, L1 regularization; larger ⇒ more conservative)  
L1 regularization term; increasing it makes the model more conservative and can reduce overfitting.

- XGBoost

---

**Eta** (float, step size shrinkage, e.g. 0.1, 0.3)  
Step size shrinkage (learning rate) for XGBoost; helps prevent overfitting.

- XGBoost

---

**eval_metric** (categorical: AUC, error, rmse, etc.)  
Metric to optimize (e.g., AUC, error, RMSE). Choose based on what you care about (e.g., false positives → AUC).

- XGBoost

---

**Gamma** (float; larger ⇒ more conservative)  
Minimum loss reduction required to create a new partition (split). Larger values make the model more conservative.

- XGBoost

---

**Lambda** (float; larger ⇒ more conservative)  
L2 regularization term; larger values make the model more conservative.

- XGBoost

---

**scale_pos_weight** (float)  
Weight for positive class to handle imbalanced data. Often set to (sum of negative class) / (sum of positive class).

- XGBoost

---

**Subsample** (float, 0–1)  
Fraction of training instances used per tree; helps prevent overfitting.

- XGBoost

---

**tree_method** (categorical; for GPU: gpu_hist)  
Tree construction method. Must set to gpu_hist for GPU training in XGBoost 1.2.

- XGBoost

---

**use_dask_gpu_training** (boolean)  
When true, enables distributed GPU training for XGBoost 1.5+; requires distribution set to fully_replicated and CSV or Parquet input.

- XGBoost

---

**LightGBM**

**Bagging_fraction** (float, 0–1)  
Fraction of data randomly sampled per iteration (similar to feature_fraction but for rows). Helps prevent overfitting.

- LightGBM

---

**Bagging_freq** (integer)  
Frequency (every N iterations) at which bagging is applied.

- LightGBM

---

**Feature_fraction** (float, 0–1)  
Fraction of features to use per tree; subset of features per split to reduce overfitting and speed up training.

- LightGBM

---

**Min_data_in_leaf** (integer)  
Minimum number of samples in a leaf node; can reduce overfitting by avoiding very small leaves.

- LightGBM

---

**Num_leaves** (integer)  
Maximum number of leaves per tree; main complexity knob in LightGBM.

- LightGBM

---

**Seq2Seq**

**Num_layers_encoder** (integer)  
Number of layers in the encoder network.

- Seq2Seq

---

**Num_layers_decoder** (integer)  
Number of layers in the decoder network.

- Seq2Seq

---

**DeepAR**

**Context_length** (integer)  
Number of time points the model sees before making a prediction. Can be smaller than seasonalities; the model can still capture lag (e.g., one year).

- DeepAR

---

**Num_cells** (integer)  
Number of cells/neurons in the RNN layers (model capacity).

- DeepAR

---

**BlazingText**

**Mode** (categorical: batch_skipgram, skipgram, cbow)  
Word2Vec mode: Continuous Bag of Words (order doesn’t matter), Skip-gram (order matters), or Batch Skip-gram (distributed over CPU nodes).

- BlazingText (Word2Vec)

---

**Negative_samples** (integer)  
Number of negative samples used in Word2Vec training (e.g., for negative sampling in skip-gram).

- BlazingText (Word2Vec)

---

**Window_size** (integer)  
Context window size: number of words to the left and right of the target word used in Word2Vec.

- BlazingText (Word2Vec)

---

**Word_ngrams** (integer)  
N-gram size for text classification (e.g., unigrams, bigrams); controls how many consecutive words are considered together.

- BlazingText (text classification)

---

**Object2Vec**

**Enc1_network**, **Enc2_network** (categorical: hcnn, bilstm, pooled_embeddings)  
Encoder architecture for each of the two input channels: hierarchical CNN, bidirectional LSTM, or average-pooled embeddings.

- Object2Vec

---

**dropout**, **early_stopping**, **layers**, **activation function**, **weight decay**  
Standard deep learning knobs for regularization (dropout, weight decay), architecture (layers, activation), and stopping (early stopping). Descriptions depend on the specific algorithm.

- Object2Vec (and commonly other neural algorithms)

---

**Image Classification**

**Optimizer-specific parameters** (e.g. weight_decay, beta_1, beta_2, eps, gamma)  
Parameters tied to the chosen optimizer (e.g., Adam: beta_1, beta_2, eps; weight decay; learning rate schedule gamma). Details differ between MXNet and TensorFlow.

- Image Classification

---

**Semantic Segmentation**

**Algorithm** (categorical: FCN, PSP, DeepLabV3)  
Selects the semantic segmentation algorithm: Fully Convolutional Network (FCN), Pyramid Scene Parsing (PSP), or DeepLabV3.

- Semantic Segmentation

---

**Backbone** (categorical: ResNet50, ResNet101)  
Backbone network for semantic segmentation; both options are trained on ImageNet.

- Semantic Segmentation

---

**Random Cut Forest (RCF)**

**Num_samples_per_tree** (integer)  
Number of samples used to build each tree. Should be chosen so that 1/num_samples_per_tree approximates the ratio of anomalous to normal data.

- Random Cut Forest (RCF)

---

**Num_trees** (integer)  
Number of trees in the forest. More trees generally reduce noise in anomaly scores.

- Random Cut Forest (RCF)

---

**LDA (Latent Dirichlet Allocation)**

**Alpha0** (float, concentration parameter; smaller ⇒ sparse topic mixtures, larger > 1.0 ⇒ uniform mixtures)  
Initial guess for the concentration parameter in LDA. Smaller values produce sparse topic mixtures; larger values (> 1.0) produce more uniform mixtures.

- LDA (Latent Dirichlet Allocation)

---

**KNN**

**Sample_size** (integer)  
Number of samples to use (e.g., for building the index or for dimensionality reduction). In KNN, relates to how much data is used before building the neighbor index.

- KNN

---

**K-Means**

**Extra_center_factor** (float/integer)  
Factor for specifying more than K initial cluster centers; SageMaker then reduces to K (e.g., K = k×n) to improve accuracy.

- K-Means

---

**Init_method** (categorical: random, k-means++)  
Method for initializing cluster centers. k-means++ spreads initial centers to avoid clusters starting too close.

- K-Means

---

**PCA (Principal Component Analysis)**

**Algorithm_mode** (categorical: regular, Randomized)  
PCA mode: Regular for sparse/moderate data; Randomized (approximation) for large numbers of observations and features.

- PCA (Principal Component Analysis)

---

**Subtract_mean** (boolean/flag)  
Whether to subtract the mean (center the data) before applying PCA; typically used for unbiased estimation.

- PCA (Principal Component Analysis)

---

**Factorization Machines**

**Initialization methods (bias, factors, linear terms)** (categorical: uniform, normal, constant)  
How to initialize bias, factor vectors, and linear terms. Can tune properties of each method separately.

- Factorization Machines

---

**IP Insights**

**Num_entity_vectors** (integer)  
Hash size for entity embeddings. Set to at least twice the number of unique entity identifiers.

- IP Insights

---

## Algorithms and their hyperparameters (names only)

**Linear Learner**
- Learning_rate
- Mini_batch_size
- binary_classifier_model_selection_criteria
- Balance_multiclass_weights
- L1
- target_precision
- target_recall
- Wd

**XGBoost**
- Learning_rate
- Max_depth
- Alpha
- Eta
- eval_metric
- Gamma
- Lambda
- scale_pos_weight
- Subsample
- tree_method
- use_dask_gpu_training

**LightGBM**
- Learning_rate
- Max_depth
- Bagging_fraction
- Bagging_freq
- Feature_fraction
- Min_data_in_leaf
- Num_leaves

**Seq2Seq**
- Learning_rate
- Batch_size
- Optimize_type
- Num_layers_encoder
- Num_layers_decoder

**DeepAR**
- Learning_rate
- Mini_batch_size
- Epochs
- Context_length
- Num_cells

**BlazingText**
- Learning_rate
- Epochs
- Vector_dim
- Mode
- Negative_samples
- Window_size
- Word_ngrams

**Object2Vec**
- Learning_rate
- Batch_size
- Epochs
- Optimizer
- Enc1_network
- Enc2_network
- dropout
- early_stopping
- layers
- activation function
- weight decay

**Object Detection**
- Learning_rate
- Mini_batch_size
- Optimizer

**Image Classification**
- Learning_rate
- Batch_size
- Optimizer
- Optimizer-specific parameters

**Semantic Segmentation**
- Learning_rate
- Batch_size
- Epochs
- Optimizer
- Algorithm
- Backbone

**Neural Topic Model (NTM)**
- Learning_rate
- Mini_batch_size
- Num_topics

**Random Cut Forest (RCF)**
- Num_samples_per_tree
- Num_trees

**LDA (Latent Dirichlet Allocation)**
- Num_topics
- Alpha0

**KNN**
- K
- Sample_size

**K-Means**
- K
- Mini_batch_size
- Extra_center_factor
- Init_method

**PCA (Principal Component Analysis)**
- Algorithm_mode
- Subtract_mean

**Factorization Machines**
- Initialization methods (bias, factors, linear terms)

**IP Insights**
- Learning_rate
- Batch_size
- Epochs
- Vector_dim
- Num_entity_vectors
