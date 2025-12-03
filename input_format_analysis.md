# SageMaker Built-in Algorithms: Input Format Grouping

## Summary

- **Total Algorithms**: 18
- **Format Groups**: 10
- **Most Common Format**: CSV + RecordIO-protobuf (8 algorithms)

---

## FORMAT GROUP 1: CSV + RecordIO-protobuf (8 algorithms)

**Most Common Format Combination**

### File Mode + Pipe Mode (6 algorithms)

1. **Linear Learner**

   - RecordIO-wrapped protobuf (Float32 data only!)
   - CSV (first column is label, followed by feature data)
   - File or Pipe mode both supported

2. **Random Cut Forest (RCF)**

   - RecordIO-protobuf or CSV
   - File or Pipe mode
   - Optional Test channel

3. **Neural Topic Model (NTM)**

   - RecordIO-protobuf or CSV
   - File or Pipe mode
   - **Requires tokenization** (words must be tokenized, document contains count for every word in vocabulary)
   - 4 data channels: 'train' (required), 'validation', 'test', 'auxiliary' (optional)

4. **KNN (K-nearest-neighbor)**

   - RecordIO-protobuf or CSV
   - File or Pipe mode
   - First column is label

5. **K-Means**

   - RecordIO-protobuf or CSV
   - File or Pipe mode
   - Train channel (ShardedByS3Key), optional test (FullyReplicated)

6. **Principal Component Analysis (PCA)**
   - RecordIO-protobuf or CSV
   - File or Pipe mode

### Pipe Mode Only (1 algorithm)

1. **LDA (Latent Dirichlet Allocation)**
   - RecordIO-protobuf or CSV
   - **Pipe Mode only supported with recordIO-protobuf**
   - **Requires tokenization** (each document has counts for every word in vocabulary)
   - Train channel, optional test channel

### Mode Not Specified (1 algorithm)

1. **Factorization Machines**
   - RecordIO-protobuf with Float32
   - **Sparse data means CSV is not available** (only RecordIO-protobuf in practice)
   - Designed for sparse data (click prediction, recommendations)

---

## FORMAT GROUP 2: CSV + RecordIO-protobuf + LIBSVM + Parquet (1 algorithm)

**XGBoost - Extended Format Support**

### Mode Not Specified (1 algorithm)

1. **XGBoost**
   - CSV or libsvm (original open source formats)
   - AWS extended to accept RecordIO-protobuf and Parquet
   - XGBoost 1.5 distributed GPU training: only works with CSV or Parquet input

---

## FORMAT GROUP 3: CSV Only (2 algorithms)

**Text/CSV Only Algorithms**

### Mode Not Specified (2 algorithms)

1. **LightGBM**

   - **Requires** text/CSV for training and inference
   - Same format for training and validation

2. **IP Insights**
   - **CSV ONLY**
   - Entity and IP address data
   - User names, account IDs can be fed in directly, no preprocessing
   - Training channel, optional validation

---

## FORMAT GROUP 4: RecordIO-protobuf Only (1 algorithm)

**Seq2Seq - Unique Integer Token Requirement**

### File Mode Only (1 algorithm)

1. **Seq2Seq**
   - RecordIO-protobuf (does not mention CSV)
   - **Tokens must be integers** (unusual - most algorithms want floating point)
   - Must provide training data, validation data, and vocabulary files
   - Start with tokenized text files, convert to protobuf

---

## FORMAT GROUP 5: JSONL + Parquet (1 algorithm)

**DeepAR - Time Series Format**

### Mode Not Specified (1 algorithm)

1. **DeepAR**
   - JSON line format (jsonl)
   - Can be gzipped or parquet
   - Each record MUST contain: start (timestamp), target (time series values)
   - Each record CAN contain: dynamic_feat, cat (categorical features)

---

## FORMAT GROUP 6: Augmented Manifest Text Format (1 algorithm)

**BlazingText - Text Classification**

### File Mode Only (1 algorithm)

1. **BlazingText**
   - For supervised mode (text classification): One sentence per line, first "word" is **Label** followed by label
   - Also "augmented manifest text format"
   - Word2Vec: text file with one training sentence per line
   - **Requires tokenization** (space around each word, punctuation, all lowercase)

---

## FORMAT GROUP 7: Image + RecordIO (1 algorithm)

**Object Detection - Computer Vision**

### File Mode Only (1 algorithm)

1. **Object Detection**
   - MXNet: RecordIO or Image format (jpg, png)
   - With image format, supply a JSON file for annotation data for each image
   - Tensorflow: Inputs determined by underlying model (not covered in lecture)

---

## FORMAT GROUP 8: Image + Augmented Manifest (1 algorithm)

**Semantic Segmentation - Computer Vision**

### Mode Not Specified (1 algorithm)

1. **Semantic Segmentation**
   - Expects jpg or png with annotations
   - For both training and validation
   - Label maps to describe annotations
   - **Augmented manifest image format supported for Pipe Mode**
   - JPG images accepted for inference

---

## FORMAT GROUP 9: Image Format Only (1 algorithm)

**Image Classification - Computer Vision**

### Mode Not Specified (1 algorithm)

1. **Image Classification**
   - Input format not explicitly covered in lecture
   - Likely similar to Object Detection (images with labels)

---

## FORMAT GROUP 10: Tokenized Integer Pairs (1 algorithm)

**Object2Vec - Pair-based Embeddings**

### Mode Not Specified (1 algorithm)

1. **Object2Vec**
   - Data must be tokenized into integers
   - Training data consists of **pairs** of tokens and/or sequence of tokens
   - Examples: sentence-sentence, label-sequence, customer-customer, product-product, user-item
   - Format: {"label": 0, "in0": [1, 3, 17, ...], "in1": [3, 9, 17, ...]}

---

## File/Pipe Mode Support Summary

### Algorithms Supporting Both File + Pipe Mode (6 algorithms)

1. Linear Learner
2. Random Cut Forest (RCF)
3. Neural Topic Model (NTM)
4. KNN
5. K-Means
6. PCA

### Algorithms Supporting Pipe Mode Only (1 algorithm)

1. LDA (with RecordIO-protobuf only)

### Algorithms Supporting File Mode Only (3 algorithms)

1. Seq2Seq
2. BlazingText
3. Object Detection

### Algorithms with Mode Not Specified (8 algorithms)

1. Factorization Machines
2. XGBoost
3. LightGBM
4. IP Insights
5. DeepAR
6. Semantic Segmentation
7. Image Classification
8. Object2Vec

---

## Format Compatibility Matrix

| Algorithm              | CSV      | RecordIO             | JSONL | Image | LibSVM | Parquet | Augmented Manifest | File Mode | Pipe Mode |
| ---------------------- | -------- | -------------------- | ----- | ----- | ------ | ------- | ------------------ | --------- | --------- |
| Linear Learner         | ✓        | ✓ (Float32)          |       |       |        |         |                    | ✓         | ✓         |
| XGBoost                | ✓        | ✓                    |       |       | ✓      | ✓       |                    | ?         | ?         |
| LightGBM               | ✓ (only) |                      |       |       |        |         |                    | ?         | ?         |
| Seq2Seq                |          | ✓ (only, int tokens) |       |       |        |         |                    | ✓         |           |
| DeepAR                 |          |                      | ✓     |       |        | ✓       |                    | ?         | ?         |
| BlazingText            |          |                      |       |       |        |         | ✓                  | ✓         |           |
| Object2Vec             |          |                      |       |       |        |         |                    | ?         | ?         |
| Object Detection       |          | ✓                    |       | ✓     |        |         |                    | ✓         |           |
| Image Classification   |          |                      |       | ✓     |        |         |                    | ?         | ?         |
| Semantic Segmentation  |          |                      |       | ✓     |        |         | ✓                  | ?         | ?         |
| RCF                    | ✓        | ✓                    |       |       |        |         |                    | ✓         | ✓         |
| NTM                    | ✓        | ✓                    |       |       |        |         |                    | ✓         | ✓         |
| LDA                    | ✓        | ✓ (Pipe only)        |       |       |        |         |                    |           | ✓         |
| KNN                    | ✓        | ✓                    |       |       |        |         |                    | ✓         | ✓         |
| K-Means                | ✓        | ✓                    |       |       |        |         |                    | ✓         | ✓         |
| PCA                    | ✓        | ✓                    |       |       |        |         |                    | ✓         | ✓         |
| Factorization Machines |          | ✓ (Float32, sparse)  |       |       |        |         |                    | ?         | ?         |
| IP Insights            | ✓ (only) |                      |       |       |        |         |                    | ?         | ?         |

---

## Key Takeaways

1. **Most Common Format**: CSV + RecordIO-protobuf (8 algorithms)

   - 6 support both File + Pipe mode
   - 1 supports Pipe mode only (LDA with RecordIO)
   - 1 mode not specified (Factorization Machines)

2. **File/Pipe Mode Patterns**:

   - **Both modes**: 6 algorithms (Linear Learner, RCF, NTM, KNN, K-Means, PCA)
   - **Pipe only**: 1 algorithm (LDA with RecordIO-protobuf)
   - **File only**: 3 algorithms (Seq2Seq, BlazingText, Object Detection)
   - **Mode not specified**: 8 algorithms

3. **Unique Formats**:

   - DeepAR: JSONL (only algorithm)
   - Seq2Seq: RecordIO-protobuf only with integer tokens
   - BlazingText: Augmented manifest text format
   - Object2Vec: Tokenized integer pairs (format not fully specified)

4. **Restrictions**:

   - LightGBM & IP Insights: CSV only
   - Factorization Machines: RecordIO-protobuf only (sparse data, CSV not available)
   - LDA: Pipe mode only with RecordIO-protobuf

5. **Tokenization Required**: 5 algorithms

   - Seq2Seq (integer tokens)
   - BlazingText
   - Object2Vec (integer tokens, pairs)
   - Neural Topic Model (NTM)
   - LDA

6. **Image Formats**: 3 computer vision algorithms
   - Object Detection (RecordIO or Image)
   - Image Classification (Image format)
   - Semantic Segmentation (Image + Augmented manifest)
