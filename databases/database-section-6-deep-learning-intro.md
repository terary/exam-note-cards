# Section 6: Model Training, Tuning, and Evaluation

**THE MOST WEIGHT ON THE EXAM**
-- ### ⭐01

### ⭐0142 - Intro

- No notes

### ⭐0143 - Intro to Deep Learning

- Longer Introduction Same material

### (done) ⭐0144 Activation Functions (11:00)

Several Kinds of Activation functions. Several to chose from and have significant impact of the quality of the Neural Network

- Define the output of a node / neuron give its input signal. "Given a set of inputs what is my output."

- Simplest Activation Function is a

- **Linear Function**.

  > Think `f(x) = x+1` or similar linear functions - and boring

- **Binary Step Function**

  - it is on or off
  - Can't handle multiple classification, it's binary
  - Vertical Slopes don't work with calculus
    > Typical Step function, graph looks like stairs

- **non-linear activation functions** (2:52)

  - This can create complex mappings between inputs and outputs `standard function stuff`
  - Allow `backpropagation` (because they have useful derivative)
  - Allow for multiple layers (linear functions degenerate to a single layer) think `calculus derivative` and probably integration, that we're studying alternative dimensions

- `Sigmoid` `Logistic` `TanH`
  - Scales everything from 0-1 (Sigmoid/Logistic) or -1 to 1 (tanH or hyperbolic tangent)
  - But: changes slowly for high or low values (The `vanishing gradient`)
  - Computationally Expensive
  - tanH is generally preferred of sigmoid

> ML It's nice to have a function with a mean around zero

- **Rectified Linear Unit(ReLU)**

  - Now we're talking
  - **Very Popular Choice**
  - Easy and fast to compute
  - But when inputs are zero or negative, we have a linear function and all of its problems, `The "Dying ReLU" problem`
    > Nice because it's line, easier to compute than curve

- **Leaky ReLU**
  - Solves the "dying ReLU" by introducing a negative slope below 0 (usually no as steep as this)

`![Alt text](https://miro.medium.com/v2/1*y1Gri2Hlk6X465Sfs_34zg.png "Optional title")

- **Parametric ReLu (PReLU)**

  - ReLu, but the slope in the negative part is learned via backpropagation
  - Complicated YMMV
    > Different kinds of problems will be impacted different, eg the effectiveness is determined by the kinda of problem.
    > Computationally intensive so you loose some of the benefit of ReLU

- **Other ReLU variants**

  - Exponential Linear Unit (ELU)
  - Swish
    - From Google, performs really wall but it is from Google and Amazon
    - Mostly a benefit with very deep networks (40+ layers) (not likely on exam)
  - Maxout
    - Outputs the max of the inputs
    - Technically ReLU is a special maxout
    - But doubles parameters that need to be trained

- **Softmax**

  - Used on the final output layer of a multi-class classification problem
  - Basically converts outputs to probabilities of each classification (confidence score, in my own words)
  - Can't produce more than one label for something (Sigmoid can)
  - Don't worry about the actual function for the **EXAM**, just know what it is used for

- Choosing an activation function **EXAM**
  - For multiple classification, use softmax on the output layer
  - RNNs do well with tanH
  - For everything else
    - Start with ReLU
    - if yo need to do better, try Leaky ReLU
    - Last resort: PReLU, Maxout
    - Swish for really deep networks
    - > Sigmoid for multi label (his comments not on the slide)

### ⭐0145 Convolutional Neural Networks (CNN) (12:00)

#### Question 1

**Question**: What use-case characteristics suggest use of CNN

**Answer**
Convolutional Neural Networks (CNN)

> The whole of CNN, find things where you wouldn't expect them "Feature Location Invariant"

- When you have data that doesn't neatly align into columns
  - Images you want to find features with
  - Machine translations
  - Sentence classification
  - Sentiment analysis
- They can find features that aren't in a specific spot
  - Like a stop sign in a picture
  - Words with sentence
- They are "feature-location invariant"
  **EXAM** Want to know purpose of CNN

#### Question 2

**QUESTION**
These characteristics describe an problem to solve with which type of network?

- When you have data that doesn't neatly align into columns
  - Images you want to find features with
  - Machine translations
  - Sentence classification
  - Sentiment analysis
- They can find features that aren't in a specific spot
  - Like a stop sign in a picture
  - Words with sentence
- They are "feature-location invariant"
  **EXAM** Want to know purpose of CNN

**ANSWER**:
Convolutional Neural Networks (CNN)

#### How they work (1:48)

#### Question 1

Describe the biological phenomenon that inspired CNN?

#### Answer 1

- Inspired by the biology of the visual cortex
  - `Local receptive fields` are groups of neuron that only respond to a part of the eyes see (`subsampling`)
  - They overlap each other to cover the `entire visual field (convolutions)`
  - They feed into higher layers that identify increasingly complex images
    - Some receptive fields identify horizontal lines, lines at different angels, etc (filters)
    - These would feed into a layer that identifies shapes
    - Which might feed into a layer of identifies objects
  - For color images, extra layers for red, green, blue

#### QUESTION 2

The following describes which Neural Network

- Inspired by the biology of the visual cortex
  - `Local receptive fields` are groups of neuron that only respond to a part of the eyes see (`subsampling`)
  - They overlap each other to cover the `entire visual field (convolutions)`
  - They feed into higher layers that identify increasingly complex images
    - Some receptive fields identify horizontal lines, lines at different angels, etc (filters)
    - These would feed into a layer that identifies shapes
    - Which might feed into a layer of identifies objects
  - For color images, extra layers for red, green, blue

#### ANSWER 2

Convolutional Neural Networks (CNN)

#### How does the brain "Know" that's a stop sign (03:50)

#### QUESTION 3

In regards to CNN's `How does the brain 'know'`?

#### ANSWER 3

- Individual local receptive fields scan the image looking for edges, and picks up the edges of the stop sign in a layer
- Those edges in turn get picked up by a higher level convolution that identifies the stop sign's shape (and letters, too)
- This shape then gets matched against your pattern of what a stop sign looks like, also using the strong red signal coming from your red layers
- That information keeps getting processed upward until your foot hits the brake
- A CNN works the same way

> Brain naturally detects contrast (letter on a page)

#### QUESTION 4

The following describes which network's underlying stop pattern?

- Individual local receptive fields scan the image looking for edges, and picks up the edges of the stop sign in a layer
- Those edges in turn get picked up by a higher level convolution that identifies the stop sign's shape (and letters, too)
- This shape then gets matched against your pattern of what a stop sign looks like, also using the strong red signal coming from your red layers
- That information keeps getting processed upward until your foot hits the brake
- A CNN works the same way

> Brain naturally detects contrast (letter on a page)

#### ANSWER 4

Convolutional Neural Networks (CNN)

#### CNN's with Keras / Tensor flow

#### QUESTION 5

The following describes how to build what type of network using `Keras / Tensor flow`

- Source data must be appropriate dimensions
  - ie `width` \* `length` \* `color` channels
- Conv2D layer type does the actual convolution on a 2D image
  - Conv2D and Conv3D also available - doesn't have to be image data - > different \*d for dimensions (eg text data)
- MaxPooling2D layers can be used to reduce a 2D layer down by taking the maximum value in a given block (said there is *1D and *3D)
- Flatten layers will convert the 2D layer to a 1D layer for passing into a flat hidden layer of neurons
- Typical usage:
  - `Conv2D - MaxPooling2D -> Dropout -> Flatten -> Dense -> Dropout -> Softmax`

> Dropout are used to reduce/avoid overfitting

#### ANSWER 5

Convolutional Neural Networks (CNN)

#### CNN's are hard

#### QUESTION 6

List some of the downsides of a CNN

#### ANSWER 6

- Very resource-intensive (CPU, GPU, RAM)
- Lots of hyperparameters
  - Kernel sizes, many layers with different numbers of units, amount of pooling... in addition to the usual stuff like number of layers, choice optimizer
- Getting the training data is often the hardest part! (As well as storing and accessing)

> Gives example of Tesla's AutoPilot AI. Tesla is cars are always sending images to data center. Car slams breaks. Tesla will process the anomaly looking for patterns, is there a new pot hole? was it a cat? was it bad GPS/map?

#### Specialized CNN architectures

#### QUESTION 7

List specialized CNN Architectures (4) and their various characteristics

#### ANSWER 7

- `LeNet-5`
  - Good for handwriting recognition
- `AlexNet`
  - IMage classification, deeper than LeNet
- `GoogLeNet`
  - Even deeper, but with better performance
  - Introduces inception modules(groups of convolution layers)
- `ResNet` (Residual Network)
  - Even deeper - Maintains performance vis _skip connections_

`Deeper` -> more layers
**EXAM Probably** Know each of the networks and what makes them special (more deep)

#### QUESTION 8

The following are examples of what?

- `LeNet-5`
  - Good for handwriting recognition
- `AlexNet`
  - IMage classification, deeper than LeNet
- `GoogLeNet`
  - Even deeper, but with better performance
  - Introduces inception modules(groups of convolution layers)
- `ResNet` (Residual Network)
  - Even deeper - Maintains performance vis _skip connections_

#### ANSWER 8

Alternative CNN Architectures

### ⭐0146 Recurrent Neural Networks

#### QUESTION 1

The following use-case is best case for which network

> For sequences of data

- Time-series data
  - When you want to predict future behavior based on past behavior
  - Web logs, sensors, stock trades
  - Where ot drive your self-driving car based on past trajectories.
- Data that consists of sequences of arbitrary length
  - Machine Translation
  - Image captions
  - Machine-generated music

> He goes on to talk about languages. They're series of words, close caption as example. Word order in a sentence can change the meaning. Music, sequence of notes - can extend a music piece

#### ANSWER 1

Recurrent Neural Networks (RNN)
**RECURRENT** same same as **REOCCURRING**

#### QUESTION 2

Describe the use-case best suited for RNN

#### ANSWER 2

> For sequences of data

- Time-series data
  - When you want to predict future behavior based on past behavior
  - Web logs, sensors, stock trades
  - Where ot drive your self-driving car based on past trajectories.
- Data that consists of sequences of arbitrary length
  - Machine Translation
  - Image captions
  - Machine-generated music

> He goes on to talk about languages. They're series of words, close caption as example. Word order in a sentence can change the meaning. Music, sequence of notes - can extend a music piece

#### Recurrent neuron (3:35)

#### QUESTION 3

What makes the Recurrent Neuron 'Recurrent'

#### ANSWER 3

> Past behavior influences future behavior

The output of the `Recurrent Activation Function`, is stored and combined with future input. There was a diagram of a node with 3 arch, 1 input, 1 output, 2 loop output back into output (feedback) [I used my own terminology].

![alt text](https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdtgusKj4msh8UPNy4XJtmxkXSVjiOR8QxvQ&s "Recurrent Neuron - memory cell")

It is perhaps easier to think of the neuron as 'marbles testings' collection of nodes over time, where input is output for iteration 0, and iteration 1 input is output from 0 plus new. `memory cell`
(4:01)

> Consequence of memory cell, more recent input can have more influence than older input

![alt text](https://dataaspirant.com/wp-content/uploads/2020/11/3-Recurrent-Neural-Network-1024x758.png "Recurrent Neuron - layer")

Its not clear to me if, in the 'layer' output from one neuron is piped into another neuron.

#### RNN topologies (5:49)

#### QUESTION 4

Describe RNN Topology

#### ANSWER 4

> Four (4) combinations by chaining:

- sequence to sequence
  - ie predict stock prices based on series of historic data
- sequence to vector
  - ie words in a sentence to sentiment
- vector to sequence
  - ie create captions from an image
- Encoder -> decode
  - sequence -> vector -> sequence
  - sequence (french) -> vector (embedding layer) -> sequence (english)
  - ie, machine translation

#### QUESTION 5

The following describes which Neural Network?

> Four (4) combinations by chaining:

- sequence to sequence
  - ie predict stock prices based on series of historic data
- sequence to vector
  - ie words in a sentence to sentiment
- vector to sequence
  - ie create captions from an image
- Encoder -> decode
  - sequence -> vector -> sequence
  - sequence (french) -> vector (embedding layer) -> sequence (english)
  - ie, machine translation

#### ANSWER 6

Recurrent Neural Networks

#### Training RNNs (7:38)

#### QUESTION 7

Describe the process and challenges of training an RNN.

#### ANSWER 7

- Backpropagation through time
  - Just like a backpropagation on MLPs, but applied each step
- All those time steps add up fast
  - Ends up looking like really, really, deep neural network
  - Can limit backpropagation to a limited number of time steps (truncated backpropagation through time)

> Main twist is we need to backpropagation through all the layers but also through time. Each time step looks like another layer. The layers add up fast. Over time we end up with a Deep NN that we need to train. Const of gradient descent becomes increasingly large.

> To limit this we limit time steps. This is called `Truncated backpropagation through time`

- State from earlier time steps get diluted over time
  - This can be a problem, for example when learning sentence structures
  - > If data at the start may be as relevant as data towards the end. English sentence as example, the first words of the sentence can be more important than the end (use LTSM Cell)
- LSTM Cell
  - Long Short-Term memory cell
  - Maintains separate short-term and long-term states
- GRU Cell (popular in practice)
  - Gated Recurrent Unit (budget LSTM)
  - Simplified LSTM Cell that performs about as well

#### QUESTION 8

The following describes challenges of training which neural network?

- Backpropagation through time
  - Just like a backpropagation on MLPs, but applied each step
- All those time steps add up fast
  - Ends up looking like really, really, deep neural network
  - Can limit backpropagation to a limited number of time steps (truncated backpropagation through time)

> Main twist is we need to backpropagation through all the layers but also through time. Each time step looks like another layer. The layers add up fast. Over time we end up with a Deep NN that we need to train. Const of gradient descent becomes increasingly large.

> To limit this we limit time steps. This is called `Truncated backpropagation through time`

- State from earlier time steps get diluted over time
  - This can be a problem, for example when learning sentence structures
  - > If data at the start may be as relevant as data towards the end. English sentence as example, the first words of the sentence can be more important than the end (use LTSM Cell)
- LSTM Cell
  - Long Short-Term memory cell
  - Maintains separate short-term and long-term states
- GRU Cell (popular in practice)
  - Gated Recurrent Unit (budget LSTM)
  - Simplified LSTM Cell that performs about as well

#### ANSWER 8

Recurrent Neural Networks

#### QUESTION 9

Discuss some of the sensitivities of training RNN

#### ANSWER 9

#### It's really hard (10:00)

- It's really hard
  - very sensitive to topologies, choice of hyperparameters
  - Very resource intensive
  - A wrong choice can lead to a RNN that doesn't coverage at all
  - > Can train for hours and be useless. Important to use previous research where possible, extrapolate from other problems where possible

#### QUESTION 10

The following discusses sensitivities of training which neural network?

- It's really hard
  - very sensitive to topologies, choice of hyperparameters
  - Very resource intensive
  - A wrong choice can lead to a RNN that doesn't coverage at all
  - > Can train for hours and be useless. Important to use previous research where possible, extrapolate from other problems where possible

#### ANSWER 10

Recurrent Neural Networks

### ⭐0147 Tuning Neural Networks (4:48)

_EXAM_ for this section focus on real world experience, less theory

#### Learning Rate (Hyperparameter)

#### QUESTION 1

Describe the behavior/effects of `Learning Rate` on training.

#### ANSWER 1

- Neural networks are trained by gradient descent (or similar means)
- We start at some random point, and sample different solutions (weights) seeking to minimize some cost function, over many _epochs_
- How far apart these samples is the learning rate

> Many epochs iterations in-which we train, each epoch try different set of weights try to minimize some cost function which might me overall accuracy prediction on some validation set

> Trying to find the lowest point

**`Learning rate` is how far a part those samples are**
Basically we have weights represented as dots on a graph (math function x/y..), each dot represents a solution set (weights), we are trying to find the minimal y, by sampling different solution sets (1:34)
**EXAM** want to be well versed, want to actually be able to do this

#### QUESTION 2

The following describes the purpose of which hyperparameter?

Trained:

- Neural networks are trained by gradient descent (or similar means)
- We start at some random point, and sample different solutions (weights) seeking to minimize some cost function, over many _epochs_
- How far apart these samples is the **hyperparameter**

> Many epochs iterations in-which we train, each epoch try different set of weights try to minimize some cost function which might me overall accuracy prediction on some validation set

> Trying to find the lowest point

**`__hyperparameter__` is how far a part those samples are**
Basically we have weights represented as dots on a graph (math function x/y..), each dot represents a solution set (weights), we are trying to find the minimal y, by sampling different solution sets (1:34)
**EXAM** want to be well versed, want to actually be able to do this

#### ANSWER 2

`learning rate`

#### Effect of learning rate

#### QUESTION 3

The the follow effects describe which hyperparameter?

- Too high a **hyperparameter** means you might overshoot the optimal solution! (sparse)
- Too small a **hyperparameter** will take too long to find the optional solution (Cost would be a concern probably) (dense)
- **hyperparameter** is an example of hyperparameter

> **hyperparameter**--- Like any "sample rate", the more of them (dense) the greater accuracy and expense, fewer (sparse) samples less accurate

_TMC_ I think for each hyper parameter we will want to do what adjusting one way or the other will do (quiz database)

#### ANSWER 3

`learning_rate`

#### QUESTION 4

Describe the effects of the `learning rate` hyperparameter

#### ANSWER 4

The the follow effects describe which hyperparameter?

- Too high a `learning rate` means you might overshoot the optimal solution! (sparse)
- Too small a `learning rate` will take too long to find the optional solution (Cost would be a concern probably) (dense)
- `learning rate` is an example of hyperparameter

> `learning rate`--- Like any "sample rate", the more of them (dense) the greater accuracy and expense, fewer (sparse) samples less accurate

_TMC_ I think for each hyper parameter we will want to do what adjusting one way or the other will do (quiz database)

#### Batch Size (Hyperparameter)

- How many training samples are used within each batch epoch
- Somewhat **counter-intuitively**:
  - Smaller batch size cna work their way out of "local minima" more easily
  - Batch sizes that are too large can end up getting stuck in the wrong solution
  - Random shuffling at each epoch can make this look like very inconsistent results from run to run

**Local Minima** the low point between two high points on the graph

> So with larger batch size, its more likely to get stuck in the local minima where the better solution may be on the other side of the higher points. Shuffling the batch data will cause these less good solutions to change given inconsistent results. Smaller batch size help `sample-out` local minima

**EXAM**
**To Recap**:

- Small batch sizes tend to not get stuck in local minima
- Large batch sizes can converge on the wrong solution at random
- Large learning rates can overshoot the correct solution
- Small learning rates increase training time
  **EXAM** know - pro/con of each larger/smaller batch size, these is often learn from experience

### ⭐0148 NN Regularization Techniques (6:41)

#### Regularization

#### QUESTION 1

What are some characteristics of `overfitting`?

#### ANSWER 1

- Model that are good at making predictions on the data they were trained on, but not on new data it hasn't seen before.
- Overfitting models have learned patterns in the training data that don't generalize the real world
- Often seen as high accuracy on training data set, but lower accuracy on test or evaluation data set
  - When training and evaluating a model, we use training, evaluation and testing data sets

#### QUESTION 2

The following describes what training condition and what can be done about it?

- Model that are good at making predictions on the data they were trained on, but not on new data it hasn't seen before.
- Overfitting models have learned patterns in the training data that don't generalize the real world
- Often seen as high accuracy on training data set, but lower accuracy on test or evaluation data set
  - When training and evaluating a model, we use training, evaluation and testing data sets

#### ANSWER 2

Those are symptoms of overfitting. We use regularization to avoid/fix overfitting

#### QUESTION 3

How do we overcome overfitting?

#### ANSWER 3

**EXAM** touches on it

What is regularization?

- Preventing _overfitting_
- Model that are good at making predictions on the data they were trained on, but not on new data it hasn't seen before.
- Overfitting models have learned patterns in the training data that don't generalize the real world
- Often seen as high accuracy on training data set, but lower accuracy on test or evaluation data set
  - When training and evaluating a model, we use training, evaluation and testing data sets
- Regularization techniques are intended to prevent overfitting

Off topic a little. Three datasets

1. Training
2. Evaluating
3. Testing

**ExAM** this becomes important when reviewing accuracy failures. Which data set needs further tunning

**Exam** know what "overfitting to the training data", "overfitting to the evaluation data", not just what do they mean but how to determine them (2:13 good graphical representation).

#### Too many layers? Too many neuron

[slide]

Can have NN that is too deep

#### QUESTION 4

What is the simplest regularization technique?

#### ANSWER 4

Reduce the number of neurons, or fewer layers.

#### QUESTION 5

Of all the regularization technique what is special about the following?

> Reduce the number of neurons, or fewer layers.

#### ANSWER 5

The simplest regularization technique

**Simplest regularization technique is to reduce the number of neuron or fewer layers**

#### Dropout layer

#### QUESTION 6

What is the `dropout layer`, and describe it a little

#### ANSWER 6

`Regularization technique`

> Dropout layer removes neuron between iterations randomly. This causes it to 'spread out more' (I wonder if he means the sample points become less dens_e). Prevents any one neuron from overfitting a specific datapoint. **Counter-intuitive** smaller network reduces overfitting (see above). 50% drop out rate is considered aggressive

4:14 - graph

> Dropout layer removes neuron between iterations randomly. This causes it to 'spread out more' (I wonder if he means the sample points become less dense). Prevents any one neuron from overfitting a specific datapoint. **Counter-intuitive** smaller network reduces overfitting (see above). 50% drop out rate is considered aggressive

#### QUESTION 7

The following describes what, and when/how is it used?

> **\_\_\_** removes neuron between iterations randomly. This causes it to 'spread out more' (I wonder if he means the sample points become less dense). Prevents any one neuron from overfitting a specific datapoint. **Counter-intuitive** smaller network reduces overfitting (see above). 50% drop out rate is considered aggressive

#### ANSWER 7

`Dropout layer` and it is a Regulation Technique

#### Early Stopping

#### QUESTION 8

The following describes what and how is it used?

> (5:06) As we train we may find we get near to where we want (98% accuracy as example.). The accuracy may begin to oscillate between 92-98% so we may end up doing more harm that good. (starting to overfit).

\***\*\_\_\*\*** is automatically detecting when we are at the point of no further gains.

#### ANSWER 8

Early Stopping it is a regularization technique.

#### QUESTION 9

Describe what is meant by "early stopping" and how is it used.

#### ANSWER 9

> (5:06) As we train we may find we get near to where we want (98% accuracy as example.). The accuracy may begin to oscillate between 92-98% so we may end up doing more harm that good. (starting to overfit).

Early stopping is automatically detecting when we are at the point of no further gains.
**Eg, we want 10 epochs but we top-out after 6 epochs**

### ⭐0149 L1 and L2 Regularization

#### QUESTION 10

What is the difference between `L1` and `L2` regularization techniques. How and when to apply each

#### ANSWER 10

- L1 term is the sum of the weights, used as "feature selection"

  - When to use L1
  - ✅ You want automatic feature selection
  - ✅ You have many irrelevant or redundant features
  - ✅ Model interpretability matters
  - ✅ High-dimensional data (features ≫ samples)

- L2 term is the sum of the square of the weights, "Weight Loss, stability" reduce feature?

  - Use L2 when:
  - ✅ Most features are somewhat useful
  - ✅ Features are correlated
  - ✅ You want training stability
  - ✅ You’re training deep neural networks

**EXAM** will require to know the difference between the two and when to apply one over the other.

- Preventing overfitting in ML in general
- A regularization term is added as weights are learned
- L1 term is the sum of the weights
- L2 term is the sum of the square of the weights
- Same idea can be applied to loss function

`![Alt text](https://medium.com/data-science-365/how-to-apply-l1-and-l2-regularization-techniques-to-keras-models-da6249d8a469 "Optional title")

Instructor's slide has a much better graphic (0:45), Area graph depicts the L2 as square and L2 has circular
**EXAM TODO**

#### Practical Differences

#### QUESTION 11

Discuss some of the difference of L1 and L2, when would you use one or the other?

#### ANSWER 11

What is the differences

- L1: `Sum of weights`
  - Performs **feature selection** - entire features go to 0
  - Computationally inefficient
  - Sparse output (**because it is removing information**)
- L2: `sum of square of weights`
  - **All features remain considered**, just weighted
  - Computationally efficient
  - Dense output

#### Why would you want L1

> Combatting curse of dimensionality

- Feature select can reduce **dimensionality**
  - **Out of 100 features, maybe 10 end up with non-zero coefficients** (extreme example)
  - The resulting sparsity can make up for its computational inefficiency
  - > Compute is more expensive but the smaller feature set makes training faster
  - > If you think 'some' of the features are important - use L1
- **But, if you think all of your features are important, L2 is probably a better choice**

> L1 Reduces but L2 keeps them all around but weights them differently

### ⭐0150 Grief with Gradients

> \_various edge cases around training NN, some questions will deal with gradients **EXAM**

#### QUESTION 1

Describe the `vanishing gradient` problem and the opposite problem

#### ANSWER 1

- when the slope of the learning curve approaches zero, things can get stuck
- We end up working with very small numbers that slow down training, or even introduce numeric errors
- Becomes a problem with deeper networks and RNNs as these `Vanishing gradients` propagate to deeper layers
- Opposite problem: `Exploding Gradients`

[Graph of curve several high/lows]
Y = loss function
X = weights

> As slope approaches zero, "the bottom of the curve", `first derivative`

> `Vanishing Gradient` Slope approaches zero, could be a local minima or could be correct answer
> `Exploding Gradients` Slope approaches infinity (compete vertical/parallel to y)

#### QUESTION 2

What problem does the following describe:

- when the slope of the learning curve approaches zero, things can get stuck
- We end up working with very small numbers that slow down training, or even introduce numeric errors
- Becomes a problem with deeper networks and RNNs as these `Vanishing gradients` propagate to deeper layers
- Opposite problem: `Exploding Gradients`

[Graph of curve several high/lows]
Y = loss function
X = weights

> As slope approaches zero, "the bottom of the curve", `first derivative`

#### ANSWER 2

> `Vanishing Gradient` Slope approaches zero, could be a local minima or could be correct answer
> `Exploding Gradients` Slope approaches infinity (compete vertical/parallel to y)

#### QUESTION 3

What is the `Exploding Gradients` problem

#### ANSWER 3

> `Exploding Gradients` Slope approaches infinity (compete vertical/parallel to y)
> The opposite of `Vanishing Gradient`.

#### QUESTION 4

What is the `Vanishing Gradient` problem

#### ANSWER 3

> `Vanishing Gradient` Slope approaches zero, could be a local minima or could be correct answer
> The opposite of `Exploding Gradient`.

#### Fixing the Vanishing Gradient problem

#### QUESTION 4

List some techniques to deal with `Vanish Gradient` problem

#### ANSWER 4

- Multi-level hierarchy [network]
  - Break-up levels into their own sub-networks.
  - > train levels (subnetwork) independently
  - > limit how far the vanishing gradient can propagate
- Long short-term memory (LSTM)
- Residual Networks
  - ie ResNet
  - Ensemble of shorter networks
- Better choice of activation function
  - Choosing good activation function can help
  - ReLU is a good choice (45 degree angle when positive) **EXAM** ReLU is a solution to VGP

**TMC** Want to know or be able to categorize each of the above, he sometimes says 'network', 'activation function', 'algorithm' **EXAM**

#### QUESTION 5

The most common/useful method of dealing with `Vanishing Gradient` problem, and why?

#### ANSWER 5

- ReLU is a good choice (45 degree angle when positive) **EXAM** ReLU is a solution to VGP

#### Gradient Checking

#### QUESTION 6

What is meant by "Gradient Checking" how is it used?

#### ANSWER 6

Gradient Checking refers to checking the slope of the curve near some value

> First derivatives of the learning curve are as expected

> This happens under the hood, within the framework you're working with **EXAM**, suggested we would have to know what it means, not necessary expertise.

- A debugging technique
- Numerically check the derivatives computed during training
- Useful for validation code of neural network training
  - But you're probably not going to be writing this code

### ⭐0151 Confusion Matrix

**EXAM**

#### Sometimes accuracy doesn't tell the whole story

#### QUESTION 1

What is a Confusion Matrix?

#### ANSWER 1

A table where we have positive/negative outcome and false positive negatives.
fTrue fFalse  
| | fTrue | fFalse |
|--------|-------|--------|
| True | 1 | 3 |
| False | 5 | 10 |

\* Some tables will extend with sums

A table where we have positive/negative outcome and false positive negatives.
| | fTrue | fFalse | tally |
|--------|-------|--------|-------|
| True | 1 | 3 | [4] |
| False | 5 | 10 | [15] |
| tally | [6] | [13] | |

\* Rows and columns are not well defined, different matrix will do it differently

#### QUESTION 2

Describe the reasons a Confusion Matrix are necessary, what is there purpose?

#### ANSWER 2

- A test for rare disease can be 99.9% accurate by just guessing "no" all the time
  - A model like this, high accuracy but worse than useless
- We need negatives, as well as false positives and false negatives
  - > These are important, how good a model is at one of these cases
- A confusion Matrix shows this

`![Alt text](https://cdn.prod.website-files.com/660ef16a9e0687d9cc27474a/662c42677529a0f4e97e4f9c_644aec2628bc14d83ca873a2_class_guide_cm10.png "Optional title")

#### QUESTION 3

Describe some attributes of a Confusion Matrix

#### ANSWER 3

Predicated Yes/No
Actual Yes/No

> There 'Confusion Matrix" is more of a term and less of a protocol, each can be different - no X or Y conventions (predictions/actual can be row/column)

> There should be a 'diagonal` True-Negative, True-Positive (instead of false-positive, false-negative)

> Sometimes the Confusion Matrix may add the totals (horizontal/vertical) - not a big deal - spreadsheet sum(Row|Column)

> **EXAM** make sure to review/understand what the matrix is saying before answering any questions, because row/column can be reversed

#### Multi-class confusion matrix + heat map

#### QUESTION 4

What is a Confusion Matrix with Heat Map

#### ANSWER 4

`![Alt text](https://i.sstatic.net/Ycirx.png "Optional title")

- More than yes/no, there are multiple classifications so our row/columns are much bigger
- Heat Map to indicated how near some desired result, deeper more accurate lighter less accurate (each CM will be labeled differently do not count on X|Y / Row/Column)

#### Example (of Confusion Matrix) from the AWS Docs

> He goes on to say that the exam may contain the AWS style of Confusion Matrix, or maybe not. The AWS style is the same as multi-class + heat map, poor color choice and the row/columns have totals

- Number of in/correct predictions per class (infer from color coding)
- F1 scores per class
- True class frequencies: the "total" column
- Predicted class frequencies: the "total" row

May not be on the exam

### ⭐0152 Predictions, Recall, F1, AUC ... (7:53)

#### Measuring your Models

**EXAM** Super important

|                   | **Actual Yes**      | **Actual No**       |
| ----------------- | ------------------- | ------------------- |
| **Predicted Yes** | True Positive (TP)  | False Positive (FP) |
| **Predicted No**  | False Negative (FN) | True Negative (TN)  |

> Know the 'true' positive/negative
> Know the 'false' positive/negative

#### Recall (0:51)

#### QUESTION 1

What is the `recall` metric formula and what does it gauge?

#### ANSWER 1

Recall Formula
$ \frac{\text{True Positive}}{\text{True Positive} + \text{False Negative}} $

(True Positive)/((True Positive)+(False Negative))

(TP)/((TP)+(FN))

TP = True Positive
TP = True Positive
FN = False Negative
FP = False Negative

- AKA **sensitivity**, **True Positive rate**, **Completeness**
- Percent of positives rightly predicted
- **Good choice of metric when you care a lot about false negative**
  - **ie fraud detection** **Understand this Exam**

|                         | **Actual Fraud** | **Actual No Fraud** |
| ----------------------- | ---------------- | ------------------- |
| **Predicted Fraud**     | 5 (TP)           | 20 (FN)             |
| **Predicted Not Fraud** | 10               | 100                 |

> Recall = TP / (TP+FN)

> Recall = 5 / (5 + 10) = 1/3 = 33%

#### ######### END QUESTION

#### QUESTION 2

What is the `recall` metric? What does it gauge? When is it recommended

#### ANSWER 2

- AKA **sensitivity**, **True Positive rate**, **Completeness**
- Percent of positives rightly predicted
- **Good choice of metric when you care a lot about false negative**
  - **ie fraud detection** **Understand this Exam**

#### ######### END QUESTION

**Recall** formula will be on the exam **EXAM**

**EXAM** Memorize this **EXAM**

$ \frac{\text{True Positive}}{\text{True Positive} + \text{False Negative}} $

- AKA **sensitivity**, **True Positive rate**, **Completeness**
- Percent of positives rightly predicted
- **Good choice of metric when you care a lot about false negative**
  - **ie fraud detection** **Understand this Exam**

|                         | **Actual Fraud** | **Actual No Fraud** |
| ----------------------- | ---------------- | ------------------- |
| **Predicted Fraud**     | 5 (TP)           | 20 (FN)             |
| **Predicted Not Fraud** | 10               | 100                 |

> Recall = TP / (TP+FN)

> Recall = 5 / (5 + 10) = 1/3 = 33%

#### Precision

#### QUESTION 3

What does `precision` measure?

#### ANSWER 3

> Measure of relevancy

#### ######### END QUESTION

#### QUESTION 4

What is the `precision` formula?

#### ANSWER 4

Precision Formula

$ \frac{\text{True Positive}}{\text{True Positive} + \text{False Positive}} $

(True Positive) / (True Positive) + (False Positive)

(TP) / (TP) + (FP)

TP = True Positive
TP = True Positive
FN = False Negative
FP = False Negative

#### ######### END QUESTION

#### QUESTION 5

How are the `precision` and `recall` formula related?

#### ANSWER 5

Recall:
(True Positive)/((True Positive)+(False Negative))

Precision:
(True Positive) / (True Positive) + (False Positive)

We're swapping `False Positive` and `False Negative`

#### ######### END QUESTION

#### QUESTION 6

What does `precision` measure?

#### ANSWER 6

> Measure of relevancy

- AKA Correct Positives
- Percent of relevant results
- **Good choice of metric when you care a lot about false positives**
  - **ie, medical screening, drug testing**

#### ######### END QUESTION

#### QUESTION 7

What is are good use for precision metric?

#### ANSWER 7

- AKA Correct Positives
- Percent of relevant results
- **Good choice of metric when you care a lot about false positives**
  - **ie, medical screening, drug testing**

#### ######### END QUESTION

> Measure of relevancy

$ \frac{\text{True Positive}}{\text{True Positive} + \text{False Positive}} $
**TMC** Notice we're just swapping one term

- AKA Correct Positives
- Percent of relevant results
- **Good choice of metric when you care a lot about false positives**
  - **ie, medical screening, drug testing**

|                         | **Actual Fraud** | **Actual No Fraud** |
| ----------------------- | ---------------- | ------------------- |
| **Predicted Fraud**     | 5 (TP)           | 20 (FN)             |
| **Predicted Not Fraud** | 10               | 100                 |

Precision = TP / (TP + FP)
Precision = 5 /(5+20) = 1 /5 = 20%

#### Other Metrics

#### QUESTION 8

What are the `other` metrics

#### ANSWER 8

- Specificity = TN / (TN + FP) = "True negative rate"
- F1 Score
  - (2TP)/ (2TP + FP + FN)
  - 2 \* (Precision \* Recall) / (Precision + Recall)
  - Harmonic mean of precision and sensitivity
  - Whe you care about precision AND recall
- RMSE (Doesn't consider recall or precision, just right or wrong answers)
  - `Root mean Square Error` exactly what it sounds like
  - Accuracy measurement
  - Only cares about right and wrong answers

> Seems to be a trade off precision AND/OR recall.. You will want to know 'if recall is important' 'if false rate is

**EXAM** Memorize ALL of these formulas

#### ######### END QUESTION

**EXAM** Memorize ALL of these formuals

- Specificity = TN / (TN + FP) = "True negative rate"
- F1 Score
  - (2TP)/ (2TP + FP + FN)
  - 2 \* (Precision \* Recall) / (Precision + Recall)
  - Harmonic mean of precision and sensitivity
  - Whe you care about precision AND recall
- RMSE (Doesn't consider recall or precision, just right or wrong answers)
  - `Root mean Square Error` exactly what it sounds like
  - Accuracy measurement
  - Only cares about right and wrong answers

> Seems to be a trade off precision AND/OR recall.. You will want to know 'if recall is important' 'if false rate is important (drug tests/fraud protection etc)'

#### ROC Curve

#### QUESTION 9

What is the `ROC Curve`? How to read it? What does it tell use? What is it used for?

#### ANSWER 9

> Another way to evaluate model

- Receiver Operating Characteristics Curve
- Plot of true positive rate (recall) vs. false positive rate at various threshold settings.
- Points above the diagonal represents good classification (better than random)
- Ideal curve would just be a point in the upper-left corner
- The more it's "bent" toward the upper-left the better **Important**

`![Alt text](https://i0.wp.com/sefiks.com/wp-content/uploads/2020/12/roc-curve-original.png?fit=726%2C576&ssl=1 "Optional title")

> We are looking at the 'bend' in the curve - towards the perfect dot

**EXAM** Need to be able visualize 'precision' 'recall'

#### ######### END QUESTION

#### QUESTION 10

The following describes what metric?

- Plot of true positive rate (recall) vs. false positive rate at various threshold settings.
- Points above the diagonal represents good classification (better than random)
- Ideal curve would just be a point in the upper-left corner
- The more it's "bent" toward the upper-left the better **Important**

`![Alt text](https://i0.wp.com/sefiks.com/wp-content/uploads/2020/12/roc-curve-original.png?fit=726%2C576&ssl=1 "Optional title")

> We are looking at the 'bend' in the curve - towards the perfect dot

**EXAM** Need to be able visualize 'precision' 'recall'

#### ANSWER 10

> ROC Curve

#### ######### END QUESTION

> Another way to evaluate model

- Receiver Operating Characteristics Curve
- Plot of true positive rate (recall) vs. false positive rate at various threshold settings.
- Points above the diagonal represents good classification (better than random)
- Ideal curve would just be a point in the upper-left corner
- The more it's "bent" toward the upper-left the better **Important**

`![Alt text](https://i0.wp.com/sefiks.com/wp-content/uploads/2020/12/roc-curve-original.png?fit=726%2C576&ssl=1 "Optional title")

> We are looking at the 'bend' in the curve - towards the perfect dot

**EXAM** Need to be able visualize 'precision' 'recall'

#### AUC Curve

#### QUESTION 11

What is the AUC curve? How to read the graph? What does it tell us?

#### ANSWER 11

> Area Under the ROC Curve

- The area under the ROC curve is... wait for it
- Are Under the Curve (AUC)
- Equal probability that a classifier will rand randomly chosen positive instance higher than randomly chosen negative one
- **ROC AUC of 0.5 is useless, 1.0 is perfect** (Hence the 0.5 is the diagonal)
- Commonly used metric for comparing classifier

> Used to evaluate one classifier over another

#### ######### END QUESTION

> Area Under the ROC Curve

- The area under the ROC curve is... wait for it
- Are Under the Curve (AUC)
- Equal probability that a classifier will rand randomly chosen positive instance higher than randomly chosen negative one
- **ROC AUC of 0.5 is useless, 1.0 is perfect** (Hence the 0.5 is the diagonal)
- Commonly used metric for comparing classifier

> Used to evaluate one classifier over another

#### QUESTION 12

The following describes what metric?

- Equal probability that a classifier will rand randomly chosen positive instance higher than randomly chosen negative one
- **ROC AUC of 0.5 is useless, 1.0 is perfect** (Hence the 0.5 is the diagonal)
- Commonly used metric for comparing classifier

> Used to evaluate one classifier over another

#### ANSWER 12

> AUC Curve

#### ######### END QUESTION

#### Summary

Metrics for **evaluating Classifiers**

- Precision
- Recall
- F1
- ROC
- AUC
- P - R Curve (lecture added after completion, new on exam, no formula, will want to know how to read graph)
  **EXAM** Will need to memorize each formula, how to read graph (what is better than the other), How various factor influence the graph (think about it, not just reproduce it)

#### QUESTION 13

What are the metrics for evaluating classifiers?

#### ANSWER 13

Metrics for **evaluating Classifiers**

- Precision
- Recall
- F1
- ROC
- AUC
- P - R Curve (lecture added after completion, new on exam, no formula, will want to know how to read graph)
  **EXAM** Will need to memorize each formula, how to read graph (what is better than the other), How various factor influence the graph (think about it, not just reproduce it)

#### ######### END QUESTION

#### P-R Curve

- Precision / Recall curve
- Good = higher area under the curve
- Similar to ROC curve
  - but **better suited for information retrieval problems**
  - ROC can result in very small values if you are searching large number of documents for a tine number that are relevant

**EXAM** Used for information retrieval problem

#### QUESTION 14

What is the `P-R` curve and what does it evaluate?

#### ANSWER 14

- Precision / Recall curve
- Good = higher area under the curve
- Similar to ROC curve
  - but **better suited for information retrieval problems**
  - ROC can result in very small values if you are searching large number of documents for a tine number that are relevant

**EXAM** Used for information retrieval problem

#### ######### END QUESTION

#### QUESTION 15

What are the difference between `ROC` and `P-R`? When to use which?

#### ANSWER 15

- Good = higher area under the curve
- Similar to ROC curve
  - but **better suited for information retrieval problems**
  - ROC can result in very small values if you are searching large number of documents for a tine number that are relevant

#### ######### END QUESTION

### ⭐0153 - RMSE, R-Squared, MAE

#### QUESTION 1

What are the metrics to evaluate numeric models (not classification)

#### ANSWER 1

- What if you are predicting values (numbers) and not discrete classifications
  - R<sup>2</sup> (R-Squared), square of the correlation coefficient between observed outcomes and predicted
  - Measuring error between actual and predicted values:
    - **RMSE** (Root Mean-Squared Error)
    - **MAE** (Mean Absolute Error)

#### ######### END QUESTION

#### QUESTION 2

The following describes what group of evaluation metrics?

- R<sup>2</sup> (R-Squared), square of the correlation coefficient between observed outcomes and predicted
- Measuring error between actual and predicted values:
  - **RMSE** (Root Mean-Squared Error)
  - **MAE** (Mean Absolute Error)

#### ANSWER 2

Numeric model evaluation metrics

#### ######### END QUESTION

> for non categorical predictions (the above)

- We have been talking about measuring **CLASSIFICATION** problems so far
  - Accuracy, precision, recall, F1, etc
- What if you are predicting values (numbers) and not discrete classifications
  - R<sup>2</sup> (R-Squared), square of the correlation coefficient between observed outcomes and predicted
  - Measuring error between actual and predicted values:
    - **RMSE** (Root Mean-Squared Error)
    - **MAE** (Mean Absolute Error)

**For Numeric Predictions** instead of classification predictions

### ⭐0154 Ensemble Methods, Bagging and Boosting

#### QUESTION 1

Describe "Random Cut Forest" in general terms.

#### ANSWER 1

The core idea behind the Random Cut Forest (RCF) algorithm is that anomalies are data points that are isolated more quickly (require fewer random cuts) than normal data points. It is an unsupervised machine learning method primarily used for anomaly detection in large-scale and streaming data.
How the Idea is Implemented
The RCF algorithm works by building an ensemble of binary search trees (a "forest") using random subsets of the input data.

1. Forest Construction: Multiple trees are constructed. For each tree, a random subsample of the data is selected.
2. Random Cuts: Each tree is built by recursively partitioning the data space with random cuts (hyperplanes). At each step, a feature dimension is chosen, and a cut-point within the range of that dimension is selected randomly.
3. Isolation: This partitioning continues until each data point is isolated in its own leaf node.
4. Anomaly Scoring: When a new data point is introduced, the algorithm calculates how many cuts (or its depth in the tree) are required to isolate it. This is done across all the trees in the forest.
5. Averaging: The final anomaly score for a point is based on its average isolation depth across the entire forest.

Key Principle:

- Normal points are typically part of dense clusters and require many cuts to be isolated, resulting in a low anomaly score.
- Anomalous points (outliers) are located in sparse regions of the data space and are isolated quickly with only a few initial cuts, resulting in a high anomaly score

#### ######### END QUESTION

#### QUESTION 2

What do they mean by `ensemble`

#### ANSWER 2

> `Ensemble` - takes many models and makes them vote on final result. Each model slightly different (bagging/boosting)

#### ######### END QUESTION

#### QUESTION 3

> **\_** takes many models and makes them vote on final result. Each model slightly different (bagging/boosting)

#### ANSWER 3

> `Ensemble` - takes many models and makes them vote on final result. Each model slightly different (bagging/boosting)

#### ######### END QUESTION

> `Ensemble` - takes many models and makes them vote on final result. Each model slightly different (bagging/boosting)

- Common example: **random forest**
  - **Decision trees are prone to overfitting**
  - **So, make lots of decision trees and let them all vote on result**
  - This is **random forest**
  - How do they differ

#### QUESTION 4

What is a `random forest`

#### ANSWER 4

- Common example: **random forest**
  - **Decision trees are prone to overfitting**
  - **So, make lots of decision trees and let them all vote on result**
  - This is **random forest**
  - How do they differ

#### END QUESTION

#### Bagging

#### QUESTION 5

Describe 'bagging'

#### ANSWER 5

- Generate N new training sets by random sampling with replacement
- Each resample model can be trained parallel

#### END QUESTION

#### QUESTION 5

The following describes which `boosting` or `bagging`

- Generate N new training sets by random sampling with replacement
- Each resample model can be trained parallel

#### ANSWER 5

Describes `bagging`

#### END QUESTION

> models trains slightly different

- Generate N new training sets by random sampling with replacement
- Each resample model can be trained parallel

#### Boosting

#### QUESTION 6

Describe what they mean by `boosting`

#### ANSWER 6

- Observations are weighted
- Some will take part in new training sets more often
- Training is sequential; **each classification takes into account the previous one's success**

> Can not be trained in parallel

> Training is sequential, getting better and better weights each iteration. Previous values are considered for new inputs (hence the need for parallel)

##### END QUESTION

#### QUESTION 7

The following describes `boosting` or `bagging`?

- Observations are weighted
- Some will take part in new training sets more often
- Training is sequential; **each classification takes into account the previous one's success**

> Can not be trained in parallel

> Training is sequential, getting better and better weights each iteration. Previous values are considered for new inputs (hence the need for parallel)

#### ANSWER 7

Describe what they mean by `boosting`

##### END QUESTION

- Observations are weighted
- Some will take part in new training sets more often
- Training is sequential; **each classification takes into account the previous one's success**

> Can not be trained in parallel

> Training is sequential, getting better and better weights each iteration. Previous values are considered for new inputs (hence the need for parallel)

#### Bagging vs Boosting

#### QUESTION 8

How to choose between `boosting` and `bagging`?

#### ANSWER 8

> How to chose one over the other **EXAM**

- **XGBoost is the latest hotness** (really works well)
- Boosting generally yields better accuracy **serializing**
- But bagging avoids overfitting
- Bagging is easier to **parallelize**
- So, depends on your goal

#### ######### END QUESTION

> How to chose one over the other **EXAM**

- **XGBoost is the latest hotness** (really works well)
- Boosting generally yields better accuracy **serializing**
- But bagging avoids overfitting
- Bagging is easier to **parallelize**
- So, depends on your goal

### ⭐0155 Automatic Model Tunning <--- HERE

#### Hyperparameter Tuning

#### QUESTION 1

What is the objective of `Hyperparameter Tuning`?

#### ANSWER 1

- How do you know the best values of learning rate, batch size, depth, etc?
- Often you have to experiment
- Problem blows up quickly when you have many different hyperparameters; need to try every combination of every possible value somehow, train a model, and evaluate it every time.

> we don't really know what happens under the hood. We have to do trial and error. This can cause the problem to blow-up quickly as adding more hyperparameters, X and Y, X*Y, X and Y and Z, X*Y\*Z (X<sup>3</sup>)

> That is why Automatic Model Tuning is important

#### ######### END QUESTION

#### QUESTION 2

The following activity describes what:

- How do you know the best values of learning rate, batch size, depth, etc?
- Often you have to experiment
- Problem blows up quickly when you have many different hyperparameters; need to try every combination of every possible value somehow, train a model, and evaluate it every time.

> we don't really know what happens under the hood. We have to do trial and error. This can cause the problem to blow-up quickly as adding more hyperparameters, X and Y, X*Y, X and Y and Z, X*Y\*Z (X<sup>3</sup>)

What is the objective of `Hyperparameter Tuning`?

#### ANSWER 2

Hyperparameter tuning

#### ######### END QUESTION

- How do you know the best values of learning rate, batch size, depth, etc?
- Often you have to experiment
- Problem blows up quickly when you have many different hyperparameters; need to try every combination of every possible value somehow, train a model, and evaluate it every time.

> we don't really know what happens under the hood. We have to do trial and error. This can cause the problem to blow-up quickly as adding more hyperparameters, X and Y, X*Y, X and Y and Z, X*Y\*Z (X<sup>3</sup>)

> That is why Automatic Model Tuning is important

#### Automatic Model Tuning (1:49)

#### QUESTION 3

Describe in basic terms SageMaker's Auto Hyperparameter tuning.

#### ANSWER 3

- Define the hyperparameter you care about and the ranges you want to try, and the metrics you are optimizing for
- SageMaker spins up a **"HyperParameter Tuning Job"** that trains as many combinations as you'll allow, Training instances are spun up as needed, **potentially a lot of them**
- The set of hyperparameters producing the best results can then deployed as a model
- **it learns as it goes so it doesn't have to try every possible combination**

> Heavy on compute power.

Learn as it goes. He described it as a web-graph (intellectual graph), that adjusting one parameter one way takes it one direction and another parameter in another direction.

#### END QUESTION

- Define the hyperparameter you care about and the ranges you want to try, and the metrics you are optimizing for
- SageMaker spins up a **"HyperParameter Tuning Job"** that trains as many combinations as you'll allow, Training instances are spun up as needed, **potentially a lot of them**
- The set of hyperparameters producing the best results can then deployed as a model
- **it learns as it goes so it doesn't have to try every possible combination**

> Heavy on compute power.

Learn as it goes. He described it as a web-graph (intellectual graph), that adjusting one parameter one way takes it one direction and another parameter in another direction.

#### Best Practices (3:24)

#### QUESTION 4

Describe Auto Hyperparameter tuning best practices (5)

#### ANSWER 4

**EXAM**

- Don't optimize too many hyperparameters at once, each parameter is one additional dimension space
- Limit your ranges to as small a range as possible
- Use logarithmic scales when appropriate (when dealing with range 0.0001 - 0.3, use log functions)
- Don't run too many training jobs concurrently
  - This limits how well the process can learn as it goes
- Make sure training jobs running on multiple instance report the correct objective metric in the end

> Basically, Use your head. This can be expensive time/compute - want to try to minimize job while maximizing accuracy

> Can learn so well if running training jobs in parallel

#### END QUESTION

**EXAM**

- Don't optimize too many hyperparameters at once, each parameter is one additional dimension space
- Limit your ranges to as small a range as possible
- Use logarithmic scales when appropriate (when dealing with range 0.0001 - 0.3, use log functions)
- Don't run too many training jobs concurrently
  - This limits how well the process can learn as it goes
- Make sure training jobs running on multiple instance report the correct objective metric in the end

> Basically, Use your head. This can be expensive time/compute - want to try to minimize job while maximizing accuracy

> Can learn so well if running training jobs in parallel

### ⭐0156 Hyperparameter Tuning in AMT

#### QUESTION 1

List 3 things Amazon Machine Training (AMT) can do to reduce cost and increase accuracy?

Also mention what each mean. (2 -4 line items each)

#### ANSWER 1

> I guess AMT Amazon Machine Training, but not sure

- `Early Stopping`
  - Stop training ina tuning job early if it is not improving the objective significantly
  - Reduces computing time, avoids overfitting
  - **Set "early stopping" to "Auto"**
  - Depends on algorithms that emit object metrics after each epoch
- `Warm start`
  - Uses one or more previous tuning jobs as a starting point
  - Informs which hyperparameter combinations to search next.
  - Can be a way to start where you left off from a stopped hyperparameter job
  - two types: `IDENTICAL_DATA_AND_ALGORITHM`, `TRANSFER_LEARNING`
- Resource Limits
  - There are default limits for number of parallel tuning jobs, number of hyperparameters, number of training jobs per tuning job, etc
    -Increasing these requires requesting a quota increase from AWS Support

#### END QUESTION

#### QUESTION 2

What is `warm start`?

#### ANSWER 2

- `Warm start`
  - Uses one or more previous tuning jobs as a starting point
  - Informs which hyperparameter combinations to search next.
  - Can be a way to start where you left off from a stopped hyperparameter job
  - two types: `IDENTICAL_DATA_AND_ALGORITHM`, `TRANSFER_LEARNING`

#### END QUESTION

#### QUESTION 3

What is `Early Stop`?

#### ANSWER 3

- `Early Stopping`
  - Stop training ina tuning job early if it is not improving the objective significantly
  - Reduces computing time, avoids overfitting
  - **Set "early stopping" to "Auto"**
  - Depends on algorithms that emit object metrics after each epoch

#### END QUESTION

> I guess AMT Amazon Machine Training, but not sure

- `Early Stopping`
  - Stop training ina tuning job early if it is not improving the objective significantly
  - Reduces computing time, avoids overfitting
  - **Set "early stopping" to "Auto"**
  - Depends on algorithms that emit object metrics after each epoch
- `Warm start`
  - Uses one or more previous tuning jobs as a starting point
  - Informs which hyperparameter combinations to search next.
  - Can be a way to start where you left off from a stopped hyperparameter job
  - two types: `IDENTICAL_DATA_AND_ALGORITHM`, `TRANSFER_LEARNING`
- Resource Limits
  - There are default limits for number of parallel tuning jobs, number of hyperparameters, number of training jobs per tuning job, etc
    -Increasing these requires requesting a quota increase from AWS Support

#### Hyperparameter Tuning Approaches

#### QUESTION 4

**EXAM**
What are the 4 Hyperparameter Approaches? Give a sentence or two describing each

#### ANSWER 4

- `Grid Search`
  - **Limit to categorical parameters**
  - Brute force; tries every possible combination (!)
- `Random Search`
  - Choose a random combination of hyperparameter values on each job
  - No dependence on prior runs, so
    they **can all run parallel**
- `Bayesian optimization`
  - Treats tuning as a regression problem
  - Learns from each run to converge on optimal values
- `Hyperband` (Best), Specific for results that are published iteratively
  - Appropriate for algorithms that publish results iteratively (like training a neural network over several epochs)
  - Dynamically allocates resources, early stopping, parallel
  - Much faster than random search Bayesian
    **EXAM** want to know how these work and how to select between them.

#### END QUESTION

#### QUESTION 5

What is the `Grid Search` Hyperparameter tuning approach?

#### ANSWER 5

- `Grid Search`
  - **Limit to categorical parameters**
  - Brute force; tries every possible combination (!)

#### END QUESTION

#### QUESTION 6

What is the `Grid Search` Hyperparameter tuning approach?

#### ANSWER 6

- `Grid Search`
  - **Limit to categorical parameters**
  - Brute force; tries every possible combination (!)

#### END QUESTION

#### QUESTION 7

The following describes which Hyperparameter tuning approach?

- **Limit to categorical parameters**
- Brute force; tries every possible combination (!)

#### ANSWER 7

- `Grid Search`
  - **Limit to categorical parameters**
  - Brute force; tries every possible combination (!)

#### END QUESTION

- `Grid Search`
  - **Limit to categorical parameters**
  - Brute force; tries every possible combination (!)

#### QUESTION 8

What is the `Random Search` Hyperparameter tuning approach?

#### ANSWER 8

- `Random Search`
  - Choose a random combination of hyperparameter values on each job
  - No dependence on prior runs, so
    they **can all run parallel**

#### END QUESTION

#### QUESTION 9

What Hyperparameter tuning approach does the following describe?

- Choose a random combination of hyperparameter values on each job
- No dependence on prior runs, so
  they **can all run parallel**

#### ANSWER 9

- `Random Search`
  - Choose a random combination of hyperparameter values on each job
  - No dependence on prior runs, so
    they **can all run parallel**

#### END QUESTION

- `Random Search`
  - Choose a random combination of hyperparameter values on each job
  - No dependence on prior runs, so
    they **can all run parallel**

#### QUESTION 10

What Hyperparameter tuning approach does the following describe?

- Treats tuning as a regression problem
- Learns from each run to converge on optimal values

#### ANSWER 10

- `Bayesian optimization`
  - Treats tuning as a regression problem
  - Learns from each run to converge on optimal values

#### END QUESTION

#### QUESTION 11

Describe the `Bayesian optimization` Hyperparameter tuning approach

#### ANSWER 11

- `Bayesian optimization`
  - Treats tuning as a regression problem
  - Learns from each run to converge on optimal values

#### END QUESTION

- `Bayesian optimization`
  - Treats tuning as a regression problem
  - Learns from each run to converge on optimal values

#### QUESTION 12

What Hyperparameter tuning approach does the following describe?

- Appropriate for algorithms that publish results iteratively (like training a neural network over several epochs)
- Dynamically allocates resources, early stopping, parallel
- Much faster than random search Bayesian
  **EXAM** want to know how these work and how to select between them.

#### ANSWER 12

- `Hyperband` (Best), Specific for results that are published iteratively
  - Appropriate for algorithms that publish results iteratively (like training a neural network over several epochs)
  - Dynamically allocates resources, early stopping, parallel
  - Much faster than random search Bayesian
    **EXAM** want to know how these work and how to select between them.

#### END QUESTION

#### QUESTION 13

Describe the `Hyperband` Hyperparameter tuning approach.

#### ANSWER 13

- `Hyperband` (Best), Specific for results that are published iteratively
  - Appropriate for algorithms that publish results iteratively (like training a neural network over several epochs)
  - Dynamically allocates resources, early stopping, parallel
  - Much faster than random search Bayesian
    **EXAM** want to know how these work and how to select between them.

#### END QUESTION

#### QUESTION 14

What is the best Hyperparameter Tuning Approach?

#### ANSWER 14

- `Hyperband` (Best), Specific for results that are published iteratively
  - Appropriate for algorithms that publish results iteratively (like training a neural network over several epochs)
  - Dynamically allocates resources, early stopping, parallel
  - Much faster than random search Bayesian
    **EXAM** want to know how these work and how to select between them.

#### END QUESTION

- `Hyperband` (Best), Specific for results that are published iteratively
  - Appropriate for algorithms that publish results iteratively (like training a neural network over several epochs)
  - Dynamically allocates resources, early stopping, parallel
  - Much faster than random search Bayesian
    **EXAM** want to know how these work and how to select between them.

### ⭐0157 SageMaker Autopilot

#### QUESTION 1

Describe briefly `SageMaker Autopilot`

#### ANSWER 1

> Wrapper around "AutoML"

- Automates
  - Algorithm Selection
  - Data preprocessing
  - Model tuning
  - All infrastructure
- It does all the trial & error for you
- More broadly this is called AutoML

> Provides a wizard for you, click your away through

#### END QUESTION

#### QUESTION 2

What AWS services does the following describe?

> Wrapper around "AutoML"

- Automates
  - Algorithm Selection
  - Data preprocessing
  - Model tuning
  - All infrastructure
- It does all the trial & error for you
- More broadly this is called AutoML

> Provides a wizard for you, click your away through

#### ANSWER 2

`SageMaker Autopilot`

> Wrapper around "AutoML"

- Automates
  - Algorithm Selection
  - Data preprocessing
  - Model tuning
  - All infrastructure
- It does all the trial & error for you
- More broadly this is called AutoML

> Provides a wizard for you, click your away through

#### END QUESTION

> Wrapper around "AutoML"

- Automates
  - Algorithm Selection
  - Data preprocessing
  - Model tuning
  - All infrastructure
- It does all the trial & error for you
- More broadly this is called AutoML

> Provides a wizard for you, click your away through

#### SageMaker Autopilot Workflow (1:22)

#### QUESTION 3

Describe the `SageMaker Autopilot Workflow`

#### ANSWER 3

- Load data from S3 for training
- Select your target column for prediction
- Automatic Model Creation
- Model notebook is available for visibility & control
- Model leaderboard
  - Ranked list of recommended models
  - You can pick one
- Deploy & monitor the model, refine via notebook via needed

#### END QUESTION

#### QUESTION 4

The following describes what workflow?

- Load data from S3 for training
- Select your target column for prediction
- Automatic Model Creation
- Model notebook is available for visibility & control
- Model leaderboard
  - Ranked list of recommended models
  - You can pick one
- Deploy & monitor the model, refine via notebook via needed

#### ANSWER 4

`SageMaker Autopilot Workflow`

- Load data from S3 for training
- Select your target column for prediction
- Automatic Model Creation
- Model notebook is available for visibility & control
- Model leaderboard
  - Ranked list of recommended models
  - You can pick one
- Deploy & monitor the model, refine via notebook via needed

#### END QUESTION

- Load data from S3 for training
- Select your target column for prediction
- Automatic Model Creation
- Model notebook is available for visibility & control
- Model leaderboard
  - Ranked list of recommended models
  - You can pick one
- Deploy & monitor the model, refine via notebook via needed

#### SM Autopilot (2:49)

#### QUESTION 5

List some of the SM Autopilot capabilities

#### ANSWER 5

- Can add-in human guidance
- With or without code in SM Studio or AWS SDKs
- Problem types (3):
  - Binary Classification
  - Multi-class classification
  - Regression (prediction base on pass data points)
- Algorithm Types
  - Linear Learner
  - XGBoost
  - Deep Learning (MLPs)
  - Ensemble mode (combines the other three )
- **Data must be tabular, CSV or Parguet**#### END QUESTION

- Can add-in human guidance
- With or without code in SM Studio or AWS SDKs
- Problem types (3):
  - Binary Classification
  - Multi-class classification
  - Regression (prediction base on pass data points)
- Algorithm Types
  - Linear Learner
  - XGBoost
  - Deep Learning (MLPs)
  - Ensemble mode (combines the other three )
- **Data must be tabular, CSV or Parguet**

#### Training Modes

#### QUESTION 6

List the 3 SM Autopilot training modes

#### ANSWER 6

- `HPO` (hyperparameter optimization)

  - Selects algorithm most relevant to your dataset
    - Linear Learner, XGBoost, or Deep Learning **(notice its only 3)**
  - Selects best range of hyperparameters to tune your models
    - Runs up to **100 trials** to find optimal hyperparameters in the range
  - **Bayesian optimization used if dataset is < 100MB**
  - **Multi-fidelity optimization > 100MB** - Early stopping if trial is performing poorly

- `Ensembling`

  - Trains several base models using **AutoGluon** library
    - Wider range of models, including more tree based and neural network algorithm
  - **Runs 10 trials with different **model and parameter settings
  - Models are combined with a stacking method

- `Auto`
  - HPO if > 100MB
  - Ensemble < 100MB
  - **Autopilot needs to be able to read the size of your dataset or will default to HPO**
    - S3 bucket hidden in a VPC
    - S3DataType is ManifestFile
    - S3Uri contains more than 1000 items

**EXAM** know when it will use `auto`

#### END QUESTION

#### QUESTION 7

Describe `HPO` SM AutoPilot Training Mode?
Which is the best training method?

#### ANSWER 7

- `HPO` (hyperparameter optimization)

  - Selects algorithm most relevant to your dataset
    - Linear Learner, XGBoost, or Deep Learning **(notice its only 3)**
  - Selects best range of hyperparameters to tune your models
    - Runs up to **100 trials** to find optimal hyperparameters in the range
  - **Bayesian optimization used if dataset is < 100MB**
  - **Multi-fidelity optimization > 100MB** - Early stopping if trial is performing poorly

#### END QUESTION

- `HPO` (hyperparameter optimization)

  - Selects algorithm most relevant to your dataset
    - Linear Learner, XGBoost, or Deep Learning **(notice its only 3)**
  - Selects best range of hyperparameters to tune your models
    - Runs up to **100 trials** to find optimal hyperparameters in the range
  - **Bayesian optimization used if dataset is < 100MB**
  - **Multi-fidelity optimization > 100MB** - Early stopping if trial is performing poorly

- `Ensembling`
  - Trains several base models using **AutoGluon** library
    - Wider range of models, including more tree based and neural network algorithm
  - **Runs 10 trials with different **model and parameter settings
  - Models are combined with a stacking method

#### QUESTION 7.1

What is the `Ensembling` SM AutoPilot Training Mode

#### ANSWER 7.1

- `Ensembling`
  - Trains several base models using **AutoGluon** library
    - Wider range of models, including more tree based and neural network algorithm
  - **Runs 10 trials with different **model and parameter settings
  - Models are combined with a stacking method

#### END QUESTION

#### QUESTION 8

Describe the SM AutoPilot training mode `auto` also which is better, `auto` or the other one?

#### ANSWER 8

- `Auto`
  - HPO if > 100MB
  - Ensemble < 100MB
  - **Autopilot needs to be able to read the size of your dataset or will default to HPO**
    - S3 bucket hidden in a VPC
    - S3DataType is ManifestFile
    - S3Uri contains more than 1000 items

**EXAM** know when it will use `auto`

#### END QUESTION

- `Auto`
  - HPO if > 100MB
  - Ensemble < 100MB
  - **Autopilot needs to be able to read the size of your dataset or will default to HPO**
    - S3 bucket hidden in a VPC
    - S3DataType is ManifestFile
    - S3Uri contains more than 1000 items

**EXAM** know when it will use `auto`

#### QUESTION 9

When to use `Auto` or `HPO` SM Autopilot training mode?

#### ANSWER 9

#### END QUESTION

#### Autopilot Expandability (Clarify) (6:40)

#### QUESTION 10

What is `Autopilot Expandability`?

#### ANSWER 10

- Integrates with **SageMaker Clarify**
- Transparency on how models arrive at predictions
- Feature attribution
  - Uses SHAP Baselines /Shapely Values
  - Research from **cooperative game theory**
  - Assigns each feature an importance value for given prediction

> We have to worry about training data that may be **biased**, hence we need transparency (Explainability).

#### END QUESTION

#### QUESTION 11

The following describes what SM AutoPilot Service?

- Integrates with **SageMaker Clarify**
- Transparency on how models arrive at predictions
- Feature attribution
  - Uses SHAP Baselines /Shapely Values
  - Research from **cooperative game theory**
  - Assigns each feature an importance value for given prediction

> We have to worry about training data that may be **biased**, hence we need transparency (Explainability).

#### ANSWER 11

`Autopilot Expandability`

- Integrates with **SageMaker Clarify**
- Transparency on how models arrive at predictions
- Feature attribution
  - Uses SHAP Baselines /Shapely Values
  - Research from **cooperative game theory**
  - Assigns each feature an importance value for given prediction

> We have to worry about training data that may be **biased**, hence we need transparency (Explainability).

#### END QUESTION

- Integrates with **SageMaker Clarify**
- Transparency on how models arrive at predictions
- Feature attribution
  - Uses SHAP Baselines /Shapely Values
  - Research from **cooperative game theory**
  - Assigns each feature an importance value for given prediction

> We have to worry about training data that may be **biased**, hence we need transparency (Explainability).

### ⭐0158 New SageMaker Features

#### QUESTION 1

List some of `SageMaker` Features

#### ANSWER 1

> SageMaker Studio - IDE (I think browser based)

Presently SM Studio is only available as 'preview'

Notebooks (Jupyter)

- SM-Studio integrates with `Jupyter Notebooks` (crete/share)
- Switch between hardware configuration (no infrastructure to manage)

SM Experiments

- Organize, capture, compare, asn search your ML jobs
  > A more useful way to visualize ML jobs

#### END QUESTION

> SageMaker Studio - IDE (I think browser based)

Presently SM Studio is only available as 'preview'

Notebooks (Jupyter)

- SM-Studio integrates with `Jupyter Notebooks` (crete/share)
- Switch between hardware configuration (no infrastructure to manage)

SM Experiments

- Organize, capture, compare, asn search your ML jobs
  > A more useful way to visualize ML jobs

### ⭐0159 Debugger

#### QUESTION 1

List features of `SageMaker Debugger` (this is different from SM AutoPilot Features)

#### ANSWER 1

**EXAM**

- Saves internal model state at periodic intervals
  - Gradients/tensors over time as model is trained
  - Define rules for detecting unwanted conditions while training
  - A debug job to run for each rule you configure
  - Logs and files a `CloudWatch event` when the rule is hit
- SageMaker Studio debugger dashboard (visual)
- Auto-generated training report
- Built-in rule categories:
  - Monitor system bottlenecks
  - Profile model framework operations
  - Debug model parameters
- Supported Frameworks and Algorithms
  - Tensorflow
  - PyTorch
  - MXNet
  - XGBoost
  - SageMaker generic estimator (for use with custom training containers)
- Debugger APIs available in GitHub
  - construct hooks & rules for CreateTrainJob and DescribeTrainJob APIs
  - SMDebug client library lets you register hooks for accessing training data
- SageMaker Insights Dashboard
- Debugger `ProfileRule`
  - ProfilerReport
  - Hardware system metrics (CPUBottlenck, GPUMemoryIncrease, etc)
  - Framework Metrics (MaxInitializationTime, OverallFrameworkMetrics, StepOutlier)
- Built-in actions to receive notification or stop training
  - StopTraining(), Email(), or SMS()
  - in response to debugger Rules
  - Sends notification via SNS
- Profile system resources usage and training

**EXAM** probably want to know how all of these work. Not in depth, but at lease know what they are talking about

**EXAM** These are new features and may not be on exam

#### END QUESTION

**EXAM**

- Saves internal model state at periodic intervals
  - Gradients/tensors over time as model is trained
  - Define rules for detecting unwanted conditions while training
  - A debug job to run for each rule you configure
  - Logs and files a `CloudWatch event` when the rule is hit
- SageMaker Studio debugger dashboard (visual)
- Auto-generated training report
- Built-in rule categories:
  - Monitor system bottlenecks
  - Profile model framework operations
  - Debug model parameters
- Supported Frameworks and Algorithms
  - Tensorflow
  - PyTorch
  - MXNet
  - XGBoost
  - SageMaker generic estimator (for use with custom training containers)
- Debugger APIs available in GitHub
  - construct hooks & rules for CreateTrainJob and DescribeTrainJob APIs
  - SMDebug client library lets you register hooks for accessing training data
- SageMaker Insights Dashboard
- Debugger `ProfileRule`
  - ProfilerReport
  - Hardware system metrics (CPUBottlenck, GPUMemoryIncrease, etc)
  - Framework Metrics (MaxInitializationTime, OverallFrameworkMetrics, StepOutlier)
- Built-in actions to receive notification or stop training
  - StopTraining(), Email(), or SMS()
  - in response to debugger Rules
  - Sends notification via SNS
- Profile system resources usage and training

**EXAM** probably want to know how all of these work. Not in depth, but at lease know what they are talking about

**EXAM** These are new features and may not be on exam

### ⭐0160 Model Registry

#### QUESTION 1

Describe the SM `Model Registry`

#### ANSWER 1

**EXAM** cursory knowledge probably ok

- Catalog your models, manage model versions
- Associate metadata with models
- Manage approval status of a model
- Deploy models to production (pipeline)
- Can incorporate into CI/CD
- Share Models
- Integrate with SageMaker "Model Cards" (not in this course)

> Model Card webpage with details about the model, limitations, purpose, version

`![Alt text](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2021/08/03/ML-3798-image005.jpg "Optional title")
This is a generic diagram. The lecture provides a detailed diagram about approving models as part of the flow

#### END QUESTION

**EXAM** cursory knowledge probably ok

- Catalog your models, manage model versions
- Associate metadata with models
- Manage approval status of a model
- Deploy models to production (pipeline)
- Can incorporate into CI/CD
- Share Models
- Integrate with SageMaker "Model Cards" (not in this course)

> Model Card webpage with details about the model, limitations, purpose, version

`![Alt text](https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2021/08/03/ML-3798-image005.jpg "Optional title")
This is a generic diagram. The lecture provides a detailed diagram about approving models as part of the flow

### ⭐0161 Analyzing Training Jobs with Tensor-board

#### QUESTION 1

Describe briefly "Analyzing Training Jobs with Tensor-board"

#### ANSWER 1

> Tensorboard is a third party tool to visualize Tensforflow

- TensorBoard is a visualization toolkit for Tensorflow or PyTorch
- Visualize model `loss and accuracy`
- Visualize `model graph`
- View `histogram of weight, biases over time`
- Project `embedding to lower dimensions` (can have 100's of dimensions, this can reduce for human understanding of fewer dimensions)
- Profiling

**EXAM** You can integration Tensorboard with SageMaker console or via URL

- Integrating into SM will require some modifications to training script. He provided a url but said the details not likely to be on exam.

#### END QUESTION

> Tensorboard is a third party tool to visualize Tensforflow

- TensorBoard is a visualization toolkit for Tensorflow or PyTorch
- Visualize model `loss and accuracy`
- Visualize `model graph`
- View `histogram of weight, biases over time`
- Project `embedding to lower dimensions` (can have 100's of dimensions, this can reduce for human understanding of fewer dimensions)
- Profiling

**EXAM** You can integration Tensorboard with SageMaker console or via URL

- Integrating into SM will require some modifications to training script. He provided a url but said the details not likely to be on exam.

### ⭐0162 Training at Large Scale (4:02)

> Large Scale Millions/Billions of parameters

#### SageMaker Training Compiler

#### QUESTION 1

Describe briefly "SageMaker Training Compiler"

#### ANSWER 1

> Legacy. Being phased out but possible on **EXAM**

- Integrated into AWS Deep Learning Containers (DLCs)
  - Can't bring our own container
  - DLC are pre-made docker images for:
    - Tensorflow: PyTorch MXNet
- Just use `compiler_config=TrainingCompilerConfig()` in your estimator class
- Compile & optimize training jobs on GPU instances
- Can accelerate training up to 50%
- Covert models into hardware-optimized instructions
- Tested with Hugging Face transformers library or bring your own model
- Incompatible with `SageMaker Distributed training libraries`
- Best Practices:
  - Ensure GPU instances are used (`ml.p3, ml.p4, ml.g4dn, ml.g5`)
  - PyTorch Models must use PyTorch/XLAs model save function
  - Enable debug flag in compiler_config to enable debugging

#### Warm Pools

> Avoids overhead of provisioning infrastructure

- Retain and re-use provisioned infrastructure
- Useful if repeatedly training a model to speed things up
- Use by setting `KepAlivePeriodInSeconds` in your training job's resource config
- Requires a service limit increase request
- Use a persistent cache to store data across training jobs to reduce costs (**Thing CI/CD artifacts**)
  Can be found in Sagemaker

#### END QUESTION

> Legacy. Being phased out but possible on **EXAM**

- Integrated into AWS Deep Learning Containers (DLCs)
  - Can't bring our own container
  - DLC are pre-made docker images for:
    - Tensorflow: PyTorch MXNet
- Just use `compiler_config=TrainingCompilerConfig()` in your estimator class
- Compile & optimize training jobs on GPU instances
- Can accelerate training up to 50%
- Covert models into hardware-optimized instructions
- Tested with Hugging Face transformers library or bring your own model
- Incompatible with `SageMaker Distributed training libraries`
- Best Practices:
  - Ensure GPU instances are used (`ml.p3, ml.p4, ml.g4dn, ml.g5`)
  - PyTorch Models must use PyTorch/XLAs model save function
  - Enable debug flag in compiler_config to enable debugging

#### Warm Pools

> Avoids overhead of provisioning infrastructure

- Retain and re-use provisioned infrastructure
- Useful if repeatedly training a model to speed things up
- Use by setting `KepAlivePeriodInSeconds` in your training job's resource config
- Requires a service limit increase request
- Use a persistent cache to store data across training jobs to reduce costs (**Thing CI/CD artifacts**)
  Can be found in Sagemaker

### ⭐0163 Checkpoint, Cluster Health Check, Automatic Restarts

#### QUESTION 1

Describe briefly "Checkpoint, Cluster Health Check, Automatic Restarts"

#### ANSWER 1

#### Checkpointing

- Creates snapshots during your training
  - you can re-start from these points if necessary
  - Or use them for troubleshooting, to analyze the model at different points
  - Automatic synchronization with S3 (from /opt/ml/checkpoint, can be changed)
- To use, define `checkpoint_s3_uri` and `checkpoint_local_path` in your SageMaker estimator (Can be done in the UI as well)

#### Cluster Health Checks and Automatic Restarts

> Runs automatically when **using ml.g or ml.pl types**

- Runs automatically when using `ml.g` or `ml.p` types
- Replace any faulty instances
- Runs GPU health checks
- Ensures NVidia Collective Communication Library (`NCCL`) is working
- SageMaker internal service errors will result in an automatic restart of your training job.
  - Replaces bad instances
  - Restarts healthy one (**MISPRINT I think**)
  - Restarts the job

> As you training increasingly larger models, the more instances used, the more likely of a failed instance.

#### END QUESTION

#### Checkpointing

- Creates snapshots during your training
  - you can re-start from these points if necessary
  - Or use them for troubleshooting, to analyze the model at different points
  - Automatic synchronization with S3 (from /opt/ml/checkpoint, can be changed)
- To use, define `checkpoint_s3_uri` and `checkpoint_local_path` in your SageMaker estimator (Can be done in the UI as well)

#### Cluster Health Checks and Automatic Restarts

> Runs automatically when **using ml.g or ml.pl types**

- Runs automatically when using `ml.g` or `ml.p` types
- Replace any faulty instances
- Runs GPU health checks
- Ensures NVidia Collective Communication Library (`NCCL`) is working
- SageMaker internal service errors will result in an automatic restart of your training job.
  - Replaces bad instances
  - Restarts healthy one (**MISPRINT I think**)
  - Restarts the job

> As you training increasingly larger models, the more instances used, the more likely of a failed instance.

### ⭐0164 SageMaker Distributed Training Library and Distributed Data Parallelism

#### Distributed Training

#### QUESTION 1

Discuss the 3 points of parallelism/distributed training.

What is better for big data, big compute, big expense?

When to use each?

#### ANSWER 1

3 "Parallelism"

- Job
- Data
- Model

- You can, of course, run multiple training jobs in parallel `job parallel` (0:28)
- Individual training can also be parallelized
  - **Distributed data parallelism**
  - **Distributed model parallelism** (because to many feature/parameters - `very larger model`)
- Use larger instance types before multiple, parallel instances
  - ie a `ml.p4d.24xlarge` gives you 8 GPU
  - Max that out before moving to two 8-GPU instances
  - **EXPENSIVE**

#### END QUESTION

- You can, of course, run multiple training jobs in parallel `job parallel` (0:28)
- Individual training can also be parallelized
  - **Distributed data parallelism**
  - **Distributed model parallelism** (because to many feature/parameters - `very larger model`)
- Use larger instance types before multiple, parallel instances
  - ie a `ml.p4d.24xlarge` gives you 8 GPU
  - Max that out before moving to two 8-GPU instances
  - **EXPENSIVE**

#### SM's Distributed Training Libraries

#### QUESTION 2

What are the two main Distributed Training Libraries?
When to use each?

#### ANSWER 2

- `AllReduce` collective (Similar in purpose as MapReduce but for processing - I guess)
- `AllGather` collective

#### END QUESTION

#### QUESTION 3

The following are libraries for what AWS Service

- `AllReduce` collective (Similar in purpose as MapReduce but for processing - I guess)
- `AllGather` collective

#### ANSWER 3

SageMaker Distributed Training Libraries

#### END QUESTION

- Built on AWS Custom Collective Library for EC2
- Solves a similar problem for MapReduce / Spark

  - but for distributed computation of gradients and gradient descent

- `AllReduce` collective (Similar in purpose as MapReduce but for processing - I guess)

#### QUESTION 4

Discuss the `AllReduce` Distributed Training Library

- How to specify `distribution` (how do you use it)?
- What is it used for?

#### ANSWER 4

- `AllReduce` collective (Similar in purpose as MapReduce but for processing - I guess)

  - Distributed computation of gradient updates to/from GPUs
  - Implemented in the `SageMaker Distributed Data Parallelism Library`
  - Specify a backend of `smdpp` to `torch.distributed.in_process_group` in your training scripts
  - Then specify distribution=**SEE_JSON_BELOW**

#### END QUESTION

- Distributed computation of gradient updates to/from GPUs
- Implemented in the `SageMaker Distributed Data Parallelism Library`
- Specify a backend of `smdpp` to `torch.distributed.in_process_group` in your training scripts
- Then specify distribution=**SEE_JSON_BELOW**

- `AllGather` collective

#### QUESTION 5

Discuss the `AllGather` Distributed Training Library

#### ANSWER 5

- Manages communication between nodes to improve performance
- Offloads communication overhead to the CPU, freeing GPUs

- **NOT COMPATIBLE with SageMaker Training Compiler** (SM Compiler is legacy I believe)

#### END QUESTION

- Manages communication between nodes to improve performance
- Offloads communication overhead to the CPU, freeing GPUs

- **NOT COMPATIBLE with SageMaker Training Compiler** (SM Compiler is legacy I believe)

```json
distribution= {
  "smdistributed":  {
    "dataparallel": {
    "enabled":
    True
    }
  }

}
```

> MapReduce / Spark distributes data processing, DTLs distribute gradients and gradient descents

#### Other Training Libraries

- You don't have to use what SageMaker provides
- `PyTorch DistributedDataParallel` (DDP)
  - `distribution=_SEE_JSON_BELOW_`
  ```json
  distribution={"pytorchddp": {"enabled":True}}
  ```
- `torchrun`
  - distribution
  ```json
  distribution={"torch_distribution": {"enabled":True}}
  ```
  - requires `p3`, `p4`, or `trn`' instances
- `mpirun`
- `DeepSpeed`
  - Open source from Microsoft
  - For PyTorch **SPECIFIC**
- `horovod`
  > Many solutions are `PyTorch` specific

#### QUESTION 6

What are the non Sage Maker (probably OpenSource) Paralel/distribution libraries (5)?

#### ANSWER 6

PyTorch DistributedDataParallel
torchrun
mpirun
DeepSpeed
horovod

- You don't have to use what SageMaker provides
- `PyTorch DistributedDataParallel` (DDP)
  - `distribution=_SEE_JSON_BELOW_`
  ```json
  distribution={"pytorchddp": {"enabled":True}}
  ```
- `torchrun`
  - distribution
  ```json
  distribution={"torch_distribution": {"enabled":True}}
  ```
  - requires `p3`, `p4`, or `trn`' instances
- `mpirun`
- `DeepSpeed`
  - Open source from Microsoft
  - For PyTorch **SPECIFIC**
- `horovod`
  > Many solutions are `PyTorch` specific

#### END QUESTION

#### QUESTION 7

The following are libraries for what service?

PyTorch DistributedDataParallel
torchrun
mpirun
DeepSpeed
horovod

#### ANSWER 7

They are training Paralel/Distribution libraries that are not part of SageMaker (Probably OpenSource)

#### END QUESTION

### ⭐0165 SM Model Parallelism Library (in depth)

> More in depth SageMakers Parallel capabilities

> There are two sides, Model and Data

##

When the model doesn't fit on a one GPU you need to distribute across several machines.

#### Sagemaker's Model Parallelism Library

- A larger Language Model won't fit on a single machine
  - Need to distribute the model itself to overcome GPU memory limits
  - Or you can use extra GUP memory to increase batch size
  - > You may not have enough mem for your model, that is where SM `interleaved pipeline`
- SM's `interleaved pipelines` offers some benefits
  - For both Tensorflow and PyTorch
- SM `MPP` goes further (3 important)
  - **PyTorch only**
  - `Optimization state sharding` (SHARDING)
    - `Optimizing state` is just it's weights
    - Requires stateful optimizer (`adam`, `fp16`)
    - **Generally useful for >1B parameters**
  - `Activation Checkpointing`
    - Reduces memory usage by clearing activations of certain layers and recomputing them during backward pass
    - Saves memory and expense of computation
  - `Activation Offloading`
    - Swaps checkpointed activation in a micro-batch to/from CPU

To use:
`import torch.sagemaker as tsm \ tsm.init()`

- Requires a few modification to your training job launcher object
- Wrap your model and optimizer, split up your data set
- Train with mpi and mpp in your estimator

#### Sharded Data Parallelism

- Combines parallel data and models
- `Parallel models means optimizer states are sharded`
  - Into `sharding groups`
- Sharded data Parallelism
  - Also shards the trainable parameters
  - And the associated gradients
  - ... across those optimizer sharding group GPU's
- This is implemented in the SageMaker parallel library
- And MPP is there by default in a Deep Learning Container for PyTorch

### ⭐0166 Elastic Fabric (EFA) and MiCS (3:44)

#### Elastic Fabric Adapter (EFA)

- Network device attached to your SageMaker instances
- Makes better use of your bandwidth
  - Promises performance of **on-premise** `High Performance Computing` cluster in the cloud
- Use with NCCL (NVidia Collective Communication Library)
  - **requires NVidia GPU's of course**
- To use EFA:
  - Include NCCL, EFA, and the AWS OFI NCCL plugin in your container
  - Set several environment variables (such as `FI_PROVIDER="efa"`)

#### MiCS

> An even larger framework

- What if billions of parameters aren't good enough? We want trillions.
- Amazon came up with `Minimize the Communication Scale` (MiCS)
- This is basically another name for what SageMaker `sharded parallelism provides`
- You just need to know all the this distributed training stuff, is what enables models with 1TG
- Bigger instances helps too
  - Minimize communication overhead
  - EC2 `P4de` GPU instances -`400 Gbps networking`
    - `80GB GPU memory`

**EXAM** Question: How do I support training for more than 1 trillion parameters - `MiCS`

> The more you can minimize communication between instances the better

**EXAM** probably on the exam, one or two questions
