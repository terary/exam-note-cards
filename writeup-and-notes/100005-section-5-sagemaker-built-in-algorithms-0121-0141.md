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

### ⭐0121 (Intro)

It was 1:00 only

### ⭐0122 Introduction to SageMaker

The heart of Amazon's Machine Learning Offering

- Manages entire Machine Learning Workflow.
- [Diagram - ] -
  1. Circular: fetch, clean, prepare data
  2. Train and Evaluate
  3. Deploy evaluate results in production
- 1 -> 2 -> 3 -> 1

It assists the full workflow (1:25):

- Notebooks to do data preparation
- Spin up instances for Training
- Spin up instances (and provide endpoint) to do inference

#### Training and Deployment

[Diagram]

S3- model/artifact
S3- Training Data

SageMaker

- endpoint
- Model/hosting/deploy
- Model Training

ECR

- inference code image
- training code image

SM pulls training data from S3, and a docker image from docker registry, will spin up instances and train. It will store the byproduct (artifacts) into different S3 bucket.

It will use the artifacts and pull a different (inference not training) model from Docker, it will spin up however instances necessary to provide however many endpoints are required (2:40).

Several ways to work with SM, most common Notebook

Notebook Instances on EC2 are spun up from the console
Notebooks:

- Has S3 Access
- Can use Scikit_learn, Spark, Tensorflow
- Wide variety of models
- Ability to spin up training instances
- Ability to deploy trained models for making predictions at scale \* much of this can also be done from the console (not notebook)

#### Data prep stage (4:39)

- Data Usually comes from S3
- Ideal format varies with algorithm but most common RecordIO-protobuf
- Can also can ingest from Athena, EMR, Redshift, and Amazon Keyspaces DB
- Apache Spark integrates with SageMaker
- Sciket_learn, numpy, panda, Jypter, all at your disposal within a Notebook

He say "Can use Sagemaker from within Spark" (5:45)

#### Processing

- Copy data from S3
- Spin up a processing container
  - Sagemaker built-in or user provided
- Output processed data to S3

#### Training (6:30)

- Create a Training Job

  - URL of S3 bucket with training data
  - ML compute resources
  - URL of S3 bucket for output
  - ECR path to training code

- Training Options
  - Built in training algorithms
  - Spark MLLib
  - Custom Python Tensorflow/MXNet code
  - PyTorch, Scikit_Learn, RLEstimator
  - XGBoost, Hugging Face, Chainer
  - Your own Docker Image
  - Algorithm purchased from AWS Marketplace

#### Deploying Trained Models (7:48)

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

Data sources:

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

## Algorithm will be on the exam. Will need to know the quarks of each

### ⭐0124 Linear Learner

- Simple, Linear Regression, one of the first things you learn about machine learning

[Diagram ]
Graph of a line (y = x\*2) with plots/dots near the line.
Trying to find the line equation of the average of the dots

#### How it is used (What it is for)

- Linear Regression
  - Fit a line to your training data
  - Predictions base on that Line
- Can handle regression (numeric) prediction and classification predictions
  - For classification, linear threshold function is used
  - Can do binary or multi-class

> Regression and Prediction

> It is linear. Will need to determine if a line is appropriate, it could be data points are better represented as curve

If the **data can be represented as linear then Linear Learner** should be considered

#### Inputs

- RecordIO-`wrapped` protobuf
  - `Float32` data only!
- CSV
  - First column is assumed to be the label, followed by feature data
- File or Pipe mode are both supported

#### How it Used (2:27)

(Slide says How it Used but presented in this order)

- Preprocessing
  - Training data must be **normalized** so all features are weighted the same **exam**
  - **Linear Learner can do this for you automatically**
  - **Input dat should be shuffled** **exam**
- Training
  - Uses **stochastic gradient descent**
  - Choose an optimization algorithm (`Adam`, `AdaGrad`, `SGD`, etc)
  - Multiple Models are optimized in parallel
  - Tune L1, L2 regularization (to avoid over-fitting)
- Validation
  - Most optimal model is selected

#### How it works

see above, the slides/sections seem a little out of order

#### Hyper Parameters

- `Balance_multiclass_weights`
  - Gives each class equal importance in loss function
- `Learning_rate`, `mini_batch_size`
- `L1`
  - Regulation
- `Wd`
  - Weight Decay (L2 Regulation)
- `target_precision`
  - use with `binary_classifier_model_selection_criteria` set to `recall_at_target_precision`
  - holds precision at this value while maximizing recall
- `target_recall`
  - Use with `binary_classifier_model_selection_criteria` set to `precision_at_target_recall`
  - Holds recall at this value while maximizing precision

> Note the relationship between `target_recall` and `target_precision`

> Not a Neural Network

#### Instance Types

- Training
  - Single or Multi Machine CPU or GPU
  - **Multi-GPU does not help**
  - > Does help to have multi-machine, does not help to have multi-gpu/(cpu?) on one machine **exam maybe**

#### Notes

Exam will likely give you an an example of Linear Learner to classify Handwriting Recognizer. Stream-in pixel data

### ⭐0125 XGBoost

> Real hot these days **exam**, We talked about 'boosting' early. It is a boosted group of decisions trees

#### How it is used (What it is for)

- eXtreme Gradient Boosting
  - Boosted group of decision trees
  - New trees made to correct the errors of previous trees
  - Uses `Gradient Descent` to minimize loss as new trees are added
- It's been wing a lot of Kaggle Competitions **exam**
  - and its fast too (lower computational cost)
- Can be used for classification
- And also for regression
  - using `regression tree` (as opposed to decision trees)

> Regression and Classification

#### Inputs

> Little bit of an odd duck, in that it originated from OpenSource...

- XGBoost is weird, since its not made for SageMaker. Its just open source XGBoost.
- So it takes CSV or `libsvm` input
- AWS recently extended it to accept `recordIO-protobuf` and `Parguet`

#### How it works (How it used)

- Models are serialized/deserialized with `Pickle` (Python)
- Can use as a framework within notebooks
  - Sagemaker.xgboost
- Or as built-in SageMaker algorithm

#### Hyper Parameters

> Has a lot of hyper-parameters. We cover a few

- `Subsample`
  - Prevents Overfitting
- `Eta`
  - step size shrinkage, prevents overfitting
- `Gamma`
  - Minimum loss reduction to create partition; larger => more conservative
- `Alpha`
  - L1 regulation term; larger => more conservative
- `Lambda`
  - L2 regularization term; larger => more conservative
- `eval_metric`
  - set to the following depending on priority
  - Optimizes on AUC, error, rmse, etc
  - For example, if you care about false positives more than accuracy you might use AUC here.
- `scale_pos_weight`
  - Adjust balance of positive and negative weights
  - Helpful for unbalanced classes
  - Might set to: `sum(negative class) / sum(positive class)`
- `max_depth`
  - max depth of tree
  - too high and you may overfit **EXAM (maybe)**
  - Deeper the tree, the more complex the model. The more complex the model higher overfitting probability

\* notice the pattern Gamma, Alpha, Lambda, increase makes them more conservative

#### Instance Types

XGBoost is `Memory Bound` not `Compute Bound`

- M5 is good choice (CPU I assume)
- XGBoost 1.2 allows single instance GPU
  - for example P2, P3
  - **MUST** set `tree_method` hyperparameter to `gpu_hist`
  - trains more quickly and can be more cost effective
- XGBoost 1.2-2
  - P2, P3, Gfdn, G5
- XGBoot 1.5 distributed GPU training now available
  - must set `use_dask_gpu_training` to true
  - set distribution to fully_replicated in trainingInput
  - only works with csv or parquet input

### ⭐0126 LightGBM

Gradient Boosting Decision Tree Algorithm

Classification, Regression, or Ranking

#### How it is used (What it is for)

- Gradient Boosting Decision Tree Algorithm
  - Kinda like XGBoost
  - Even more like `CatBoost` (it is offered but not covered in these lectures)
  - Extended with Gradient-based, One-side Sampling and Exclusive Feature Bundling
- Predicts target variable with an ensemble of estimate from simpler models
- Classification, Regression, or Ranking

#### Inputs

- **Requires** text/csv for training and inference
- Same format for training and validation

#### How it works

#### Hyper Parameters

- `Learning_rate`
- `Num_leaves`
  - Max leaves per tree
- `Feature_fraction`
  - Subset of features per tree
- `Bagging_fraction`
  - Similar to feature_fraction but **randomly sampled**
- `Bagging_freq`
  - How often bagging is done
- `Max_depth`
- `Min_data_in_leaf`
  - Minimum amount of data in one leaf; can address **overfitting**

#### Instance Types

CPU only, however it can be distributed

- Single or Multi-instance CPU training
  - Define instances with `instance_count`
- Memory-Bound Algorithm
  - Choose general purpose over compute optimize
  - `M5` NOT `C5`
  - Be sure to have enough memory

> Memory Bound algorithm so you will want to to choose memory optimized over compute optimizeoptimize

### ⭐0127 - Seq2Seq

"Sounds familiar from discussions with RNN's, ... You take a sequence of tokens and output another sequence of tokens."

#### How it is used (What it is for)

- Input is a sequence of tokens and output is a sequence of tokens.
- Machine Translation
  - He said maybe Audio had been converted to tokens, hence this should work for audio too?
- Text summations
- Speech to Text (s2t)
- Implemented with RNNs and CNNs with attention.

#### Inputs

- RecordIO-protobuf (does not mention CSV)
  - Tokens must be integers (**this is unusual, since most algorithms want floating point**)
- Start with tokenized text files
- Convert protobuf using sample code
  - Packs into integer tensors with vocabulary files
  - A lot like TF/IDF lab we did
- **Must provide training data, validation data and vocabulary files**

#### How it works

- Training for machine translations can take days even on SageMaker
- Pre-trained models are available
  - see example notebook
- Public training datasets are available for specific translation tasks

**\* Point is that instead of 'from scratch' use pre-train if possible (EXAM)**
Given the example English to German, or Spanish to Thai

#### Hyper Parameters

Common for Neural Network

- `Batch_size`
- `Optimize_type` (adam, sgd, rmsprop)
- `Learning_rate` (how many layers do I have)
- `Num_layers_encoder`
- `Num_layers_decoder`
- Can optimize on: (How well did I translate this natural language sentence, this answer is not always simple)
  - Accuracy
    - Vs. provided validation dataset
  - BLEU score (will suited for machine learning translation problems **EXAM**)
    - Compares against
  - Perplexity (will suited for machine learning translation problems **EXAM**)
    - Cross entropy

#### Instance Types

"Obviously as a Deep Learning Algorithm, it takes advantage of GPU"

- Can only use GPU instances (P3 for example)
- Can only use single machine for training
  - but can use multi-GPU on one machine

"Single Machine / Multi-GPU" can not support Multi Machine

### ⭐0128 DeepAR

"For forecasting one-dimensional time series data"

Maybe trying to predict future stock prices - contrived example but that's the idea

#### How it is used (What it is for)

- Forecasting one-dimensional time series data
- Uses RNN's
- Allows you to train the same model over several related time series **at once**, (this was the idea I had to try to associate weather patterns with the price of gold). **Can learn from the relationships**
- Find frequencies and seasonality

#### Inputs

- JSON line format (`jsonl`)
  - gzip or parquet
- Each record **MUST** contain
  - start: the starting timestamp, followed by time series values
  - target: the time series values
- Each record **CAN** contain
  - `Dynamic_feat`, such as "was a promotion applied"
  - `Cat` categorical features

```
{
  "start" "2025-05-03 00:00:01", target: [4.3, "NaN"], cat: [1, 3], dynamic_feat" [[1.2, 1.9, 0.5,...]]
}
```

#### How it works (How it used, what is quark about it)

- **Always** include entire time series for training, test, inference (it learns better with all data)
- Ues entire dataset as test set, remove last time points for training. Evaluate on withheld values
- Don't use vary large values for prediction (length > 400 data point, things get weird with more than 400 data points (per series?))
- **Train on many time series and not just one when possible**

#### Hyper Parameters

"What you would expect for a neural network of any sort"

- `Context_length`
  - Number of time-points the model sees before making prediction
  - Can be smaller than seasonalities; **the model will lag one year anyhow**.
- `Epochs` (common for time series?)
- `mini_batch_size`
- `Learning_rate`
- `Num_cells` (number of neurons)

#### Instance Types

- Training
  - CPU or GPU
  - Single Machine or Multi-Machine (highly scalable can deploy across cluster)
  - However, CPU is recommended, start with CPU, (ml.c4.2xlarge, ml.c4.4xlarge)
  - Move up to GPU if necessary (GPU only helps with larger models)
    - Only helps with larger models
    - Or with large mini-batch sizes (>512)
- Inference
  - **ONLY CPU** are supported
- Tuning, maybe need larger instances

### ⭐0129 BlazingText

Not a thing, its fairly constrained in what it can do

- Text (word) Classification
- Word2Vec

#### How it is used (What it is for)

- Text Classification
  - Predict labels for a sentence (if you train it, eg: **supervised learning** system)
  - Useful in web searches, information retrieval (maybe RAG?)
- Word2vec

  - Creates vector representation of words
  - Semantically similar words are represented by vectors close (near) to each other (sentiment analysis, other embedding, search for orange, citrus, fruit, )
  - This is called **word embedding**
  - It is useful for NLP but it is **NOT an NLP** algorithm itself
  - Remember it only works on individual words, not sentences or documents

  **\* We'll likely see, embedding for word, sentence and document... this is word**

#### Inputs

- For supervised mode (text classification) Training??
  - One sentence per line
  - First "word" in the sentence is the string \_\_Label\_\_ followed by the label
- Also "augmented manifest text format"
- Word2Vec just wants a text file with one training sentence per line.

\* I am a little confused he goes from word to sentence. I am not sure if the sentence is necessary to derived context? (Semantic)

I assume this is `supervised/text"

```
__label__4 linux ready for prime time, intel...
__label__5 bowled by , the slower one . again
```

\*Notice, space around each word, punctuation too, all lower case. They are calling this _tokenized_

I assume this is `word2vec` (this is the augmented manifest format)

```
{
  "source": "linux ready , for prime time ...", "label": 1
  "source": "bowled by the slower ...", "label": 2
}
```

\*Notice, space around each word, punctuation too, all lower case. They are calling this _tokenized_,

#### How it works

- Word2Vec has multiple modes of operations
  - `Cbow` (Continuous bag of words) (order does not matter )
  - Skip-gram (n-nodes, order does matter)
  - Batch skip-gram
    - Distributed computation over many CPU nodes

\* Lecture doesn't goe into 'how it works' for Text, just word2vec

#### Hyper Parameters

- Word2Vec
  - `Mode` (`batch_skipgram`, `skipgram`, `cbow`)
  - `Learning_rate`
  - `Window_size`
  - `Negative_samples`
- Text classification (usual suspects for neural networks)
  - `Epochs`
  - `Learning_rate`
  - `Word_ngrams`
  - `Vector_dim` (vector dimension - how many words we look at together)

#### Instance Types

- For `cbow` and `skipgram` recommended a single ml.p3.2xlarge
  - Any single CPU or single GPU instance will work
- For `batch_skipgram` can use single or multiple CPU instances
- For text classification, **C5 recommended** if less that 2GB training data. For larger datasets, use a single GPU instance (ml.p2.xlarge or ml.p3.2xlarge)

Not sure, can use multiple machines? multiple core?

### ⭐0130 Object2Vec

`word2vec` - Finding relationship of individual word within a sentence. `object2vec` does similarly except the objects are abstract, documents, 'things'.

#### How it is used (What it is for)

- Works like `word2vec` but on arbitrary objects
- Creates low-dimensional dense embeddings of high-dimensional objects
  - > Taking features/dimensions of your object and reducing to find common/nearest
- Basically `word2vec`, generalized to hand things other than words
- computer nearest neighbor of objects
- visualize clusters
- genre prediction (recommendation prediction)
- Recommendations

#### Inputs

Have to tokenize

> What is odd about object2vet is that it consists of pairs of tokens, or sequence of tokens

- Data must be tokenized into integers
- Training data consists of **pairs** of tokens and/or sequence of tokens
  - Sentences - sentence
  - Label-sequence (genre to description)
  - Customer-Customer
  - Product-product
  - User-item

```
{
  "label": 0, "in0": [1, 3, 17, ...], "in1": [3, 9, 17, ...]
}
```

#### How it works

Two input Channels

- Each has it's own encoder and input path
- The two channels feed into a **comparitor** which generates the label.
- For each input path you can choose your own encoder
  - Average-pooled embeddings
  - CNN's
  - Bidirectional LSTM
- Comparator followed by feed-forward-network

#### Hyper Parameter

- ... All the deep learning one

  - `dropout`, `early stopping`, `epochs`, `learning_rate`, `batch_size`, `layers`, `activation function`, `optimizer`, `weight decay`

- `Enc1_network`, `Enc2_network`
  - Choose `hcnn`, `bilstm`, `pooled_embeddings`

#### Instance Types

Currently only train on a single machine

- Training
  - Can only train on a single machine (CPU or GPU, **multi-GPU OK**)
    - ml.m5.x2large
    - ml.p2.xlarge
    - if needed, go up to ml.m5.4xlarge
    - GPU options: P2, P3, G4dn, G5
    - Recommended start with CPU
- Inference
  - use ml.p3.2xlarge - use `INFERENCE_PREFERRED_MODE` env variable to **optimize for encoder embeddings rather than classification or regression** (**EXAM**)

### ⭐0131 Object Detection

#### What it is for

- Identify all object in an image with bounding boxes
- Detects and classifies object with a single deep neural network
- Classes are accompanied by confidence scores
- Can train from scratch or use pre-trained models based on ImageNet

[Image of Office, thin line boxes (bounding rectangles) around office things, phone, chair, laptop, etc]

"Classes" Items that have been "Classified"

#### How it is used

- Two variants: `MXNet` and `Tensorflow`
- Takes an image as input, outputs all instances of objects in the image with categories and confidence scores.
- `MXNet` (maybe the older original algorithm)
  - Uses a CNN with the Single shot multi-box Detector (SSD) algorithm
  - Has both Transfer learning mode / increment learning-training
    - uses a pre-trained model for the base network weights instead of random initial weights
  - Uses flip, rescale, and jitter internally to avoid overfitting
- `Tensorflow`
  - Uses ResNet, EfficientNet, MobileNet models from the TensorFlow Model Garden

#### Inputs

- `MXNet`: RecordIO or Image format (jpg, png) (131/3:44)
- With image format, supply a JSON file for annotation data for each image

- `Tensorflow` - Inputs our determined by the underlying model and not covered in the lecture

#### Hyper Parameters

- `Mini_batch_size`
- `Learning_rate`
- `Optimizer`
  - `sgd`, `adam`, `rmsprop`, `adadelta`

#### Instance Types

- (training) Uses GPU instance for training (multi-GPU and multi-machine OK)

  - ml.p2.xlarge, ml.p2.16xlarge, gfdn, G5

- (inference) Uses CPU or GPU for inference: M5, P2, P3, g4dn - all ok

Multi-GPU, Multi-Machine - OK

### ⭐0132 Imagine Classification

"Close cousin of the Object Detection algorithm are the Imagine classification Algorithms"

**Exam** expect a question about the differences between the two

**Object Detection** tells you where within the image objects are
**Image Detection** tells classifies the image. Assigns one or more label to an image

#### What it is for

- Assign one or more labels to an image
- Does not tell you where the object are, just what objects are in the image

#### How is it Used

- Separate algorithms, `MXNet` and `Tensorflow`
- `MXNet`:
  - Full training mode
    - Network initialized with random weights
  - Transfer Learning mode
    - Initialized with pre-trained weights
    - The top fully-connected layer is initialized with random weights
    - Network is fine-tuned with new training data
  - Default image size is `3-channel 224x224` (IMageNets dataset)
- `Tensorflow`: Uses various Tensorflow Hub models (MobileNet, Inception, ResNet, EfficientNet)
  - Top classification layer is available for fine-tuning or further training

\*Can take any of these pre-trained models and extend them, because the 'classification layer' is available for fine tuning (no clue what that means)

#### Inputs

- He seemed to skip this

#### Hyper Parameters

- The usual suspects: `batch_size`, `learning_rate`, `optimizer`
- `Optimizer-specific` parameters
  - Weight decay, beta 1, beta 2, eps, gamma
  - Slightly different between `MXNet` and `Tensorflow`

#### Instance Types

- Training (you're going to want GPU) ml.p2, p3, g4dn, g5 **Multi-GPU ok, and Multi-machine Ok**
- Inference CPU and GPU ok (m5, p2, p3, g4dn, g5)

### ⭐0133 Semantic Segmentation in SageMaker

2. Image Classification - only detects what object are in an image
1. Object Classification - Went further with bounding boxes to where in the images the objects are
1. Semantic Segmentation expands on that to do pixel level labeling/classification. Think of this as High Resolution, where maybe a you can see two objects overlap - a donut and the hole you can see the napkin.

> He calls this "visual computation" or similar in reference to the image processing

#### What it is for

- Pixel-level object classification
- Different from image classification that assigns labels to whole images
- Different from object detection that assigns labels to bounded boxes
- Useful for **self-driving vehicles, medical imaging diagnostics, robot sensing**
- Produces a **segmentation mask**

Segmentation Mask Example
![Alt text describing the image](https://weijiawu.github.io/DiffusionMask/resources/fig7.png)

#### Inputs

- Expects `jpg` or `png` with annotations
- For both training and validation
- Label maps to describe annotations
- **Augmented manifest image format supported for Pipe Mode**
- JPG images accepted for inference ( Think that means it will only accept jpg for inference - they would need to get converted)

#### How it works

- Built on MXNet Gluon and Gluon CV
- Choice of 3 algorithms:
  - Fully Convolutional Network (FCN)
  - Pyramid Scene Parsing (PSP)
  - DeepLabV3
- Chose of backbones
  - ResNet50
  - ResNet101
  - Both trained on ImageNet
- Incremental training or training from scratch supported too

#### Hyper Parameters

Usual suspects for Deep learning

- `Epochs`, `learning_rate`, `batch_size`, `optimizer` , etc
- `Algorithm`
- `Backbone`

#### Instance Types

- For Training ONLY GPU (P2, P3, G4dn, G5) instances are supported on a single machine-only

- For Inference CPU (C5, M5) OR GPU (P3, g4dn)

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
