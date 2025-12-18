# Section 6: Vocab

- `backpropagation` (2:52)

  - > Backpropagation is the process of computing gradients and propagating them backward through the neural network to update weights. Non-linear activation functions allow backpropagation because they have useful derivatives. For RNNs, it's applied each time step, which can make the network look like a very deep neural network.

- `vanishing gradient`

  - > The vanishing gradient problem occurs when the slope of the learning curve approaches zero, causing training to get stuck. We end up working with very small numbers that slow down training, or even introduce numeric errors. This becomes a problem with deeper networks and RNNs as these vanishing gradients propagate to deeper layers. The slope approaches zero, which could be a local minima or could be the correct answer.

- `ReLU` (5:02)

  - > ReLU (Rectified Linear Unit) is a very popular activation function choice. It's easy and fast to compute. Nice because it's linear, easier to compute than curve. However, when inputs are zero or negative, we have a linear function and all of its problems - The "Dying ReLU" problem. ReLU is a good solution to the vanishing gradient problem (45 degree angle when positive).

- `The "Dying ReLU" problem`

  - > The "Dying ReLU" problem occurs when ReLU inputs are zero or negative, resulting in a linear function with all of its problems. When the neuron outputs zero for negative inputs, it can become "dead" and stop learning. Leaky ReLU solves this by introducing a negative slope below 0.

- `Feature Location Invariant`

  - > Feature Location Invariant is a property of CNNs (Convolutional Neural Networks) where they can find features that aren't in a specific spot. CNNs are "feature-location invariant" - they can find features like a stop sign in a picture regardless of where it appears in the image, or words within a sentence regardless of position.

- `subsampling` (0145/3:30)

  - > Subsampling refers to the process where local receptive fields (groups of neurons) only respond to a part of what the eyes see. In CNNs, this is part of how the network processes images - local receptive fields scan portions of the image looking for features like edges.

- `Local Receptive Field`

  - > Local Receptive Fields are groups of neurons that only respond to a part of what the eyes see (subsampling). They overlap each other to cover the entire visual field (convolutions). Individual local receptive fields scan the image looking for edges and features, which then feed into higher layers that identify increasingly complex patterns.

- `Convolutions`

  - > Convolutions refer to the overlapping of local receptive fields to cover the entire visual field. In CNNs, convolutions are the operations performed by convolutional layers (like Conv2D) that apply filters to detect patterns in the data. These convolutions allow the network to identify features at different locations.

- `entire visual field (convolutions)`

  - > The entire visual field (convolutions) is covered by overlapping local receptive fields. Individual local receptive fields scan portions of the image, and they overlap each other to ensure the complete image is processed. This allows CNNs to find features anywhere in the image.

- `memory cell`

  - > A memory cell in RNNs stores the output of the Recurrent Activation Function and combines it with future input. It's easier to think of the neuron as a collection of nodes over time, where input at iteration 0 becomes output, and iteration 1 input is output from 0 plus new input. The consequence is that more recent input can have more influence than older input. LSTM (Long Short-Term Memory) cells maintain separate short-term and long-term states.

- `Truncated backpropagation through time` (8:27)

  - > Truncated backpropagation through time is a technique to limit backpropagation to a limited number of time steps in RNNs. Since all time steps add up fast and end up looking like a really deep neural network, this technique limits how far back in time the gradients are computed, reducing computational cost while still allowing the network to learn from recent history.

- `local minima` (0147/2:50)

  - > Local minima are low points between two high points on the graph (loss function). When training neural networks, smaller batch sizes can work their way out of local minima more easily, while larger batch sizes can end up getting stuck in the wrong solution (a local minima) where a better solution may be on the other side of the higher points.

- `Vanishing gradients` (0150/0:12)

  - > Vanishing gradients occur when the slope of the learning curve approaches zero, causing things to get stuck. We end up working with very small numbers that slow down training, or even introduce numeric errors. This becomes a problem with deeper networks and RNNs as these vanishing gradients propagate to deeper layers. The slope approaches zero, which could be a local minima or could be the correct answer.

- `Exploding Gradients`

  - > Exploding Gradients is the opposite problem of vanishing gradients, where the slope approaches infinity (completely vertical/parallel to y-axis). This causes gradients to become extremely large, leading to unstable training and potential numeric overflow errors.

- `Root mean Square Error` (152 / 3:28)

  - > Root Mean Square Error (RMSE) is an accuracy measurement for non-categorical predictions (regression problems). It measures error between actual and predicted values. RMSE doesn't consider recall or precision, just right or wrong answers. It's exactly what it sounds like - the square root of the mean of squared errors.

- `correlation coefficient` (153 / 0:30)

  - > Correlation coefficient is used in R-Squared (R²), which is the square of the correlation coefficient between observed outcomes and predicted values. It's a metric for measuring regression model performance, indicating how well the model's predictions correlate with the actual outcomes.

- `Warm start` (155 / 1:02)

  - > Warm start uses one or more previous tuning jobs as a starting point in SageMaker Automatic Model Tuning. It informs which hyperparameter combinations to search next. Can be a way to start where you left off from a stopped hyperparameter job. Two types: IDENTICAL_DATA_AND_ALGORITHM and TRANSFER_LEARNING.

- `Checkpointing` (163 / 1:10)

  - > Checkpointing creates snapshots during training that you can restart from if necessary. These checkpoints can also be used for troubleshooting or to analyze the model at different points. Automatic synchronization with S3 occurs from /opt/ml/checkpoint (can be changed). To use, define checkpoint_s3_uri and checkpoint_local_path in your SageMaker estimator.

- `PyTorch DistributedDataParallel` (164/4:00)

  - > PyTorch DistributedDataParallel (DDP) is a distributed training library that doesn't require using SageMaker's provided libraries. It's a PyTorch-specific solution for parallel data training. To use in SageMaker, specify distribution={"pytorchddp": {"enabled":True}} in your estimator configuration.

- `MiCS` (166 / 1:51)

  - > MiCS stands for "Minimize the Communication Scale" - Amazon's solution for training models with more than 1 trillion parameters. This is basically another name for what SageMaker sharded parallelism provides. It minimizes communication overhead between instances. Bigger instances help too - EC2 P4de GPU instances provide 400 Gbps networking and 80GB GPU memory. **EXAM**: How do I support training for more than 1 trillion parameters - MiCS.

**Exam** know what "overfitting to the training data", "overfitting to the evaluation data", not just what they mean but how to determine them (2:13 good graphical representation).
