# Section 6: Model Training, Tuning, and Evaluation

**THE MOST WEIGHT ON THE EXAM**
-- ### ⭐01

### ⭐0142 - Intro

- No notes

### ⭐0143 - Intro to Deep Learning

- Longer Introduction Same material

### ⭐0144 Activation Functions (11:00)

Several Kinds of Activation functions. Several to chose from and have significant impact of the quality of the Neural Network

- Define the output of a node / neuron give its input signal. "Given a set of inputs what is my output."

- Simplest Activation Function is a **Linear Function**.

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

06:30 - Need to google some graphs to put in each of these
