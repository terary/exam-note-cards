## The Hierarchy

### 1. **AWS SageMaker "Image Classification" (Service/Wrapper)**

This is a managed service, not an algorithm in the mathematical sense. It:

- Handles data loading, training, deployment
- Uses MXNet or TensorFlow under the hood
- Provides a high-level API

Think of it as a wrapper that manages the ML pipeline.

### 2. **Deep Learning Frameworks**

- **MXNet** — framework AWS uses
- **TensorFlow** — framework AWS uses
- **PyTorch** — used in the Studio Lab notebooks (not the AWS managed service)

These are tools/libraries for building neural networks.

### 3. **Model Architectures (the actual algorithms)**

These are the specific neural network designs:

- **ResNet** (Residual Networks)
- **Inception**
- **MobileNet**
- **EfficientNet**
- **DenseNet** (DenseNet-161 is used in the weather notebook)

Each is a different architecture with different design choices.

### 4. **CNN (Convolutional Neural Network)**

This is a general technique/architecture type, not a specific model. ResNet, DenseNet, Inception, etc. are all types of CNNs.

## What the Notebooks Actually Use

**KMNIST notebook:**

- Framework: PyTorch
- Architecture: Custom simple CNN (2 conv layers + fully connected layers)
- Not using AWS managed service or pre-trained models

**Weather notebook:**

- Framework: PyTorch
- Architecture: DenseNet-161 (pre-trained, then fine-tuned)
- Not using AWS managed service

## The Confusion Explained

Your lecture is about:

```
AWS Image Classification Service
  └── Uses MXNet or TensorFlow
       └── Can use pre-trained models like ResNet, Inception, MobileNet, EfficientNet
```

The notebooks are:

```
PyTorch (different framework)
  └── Custom CNN or DenseNet-161 (specific architecture)
```

## Analogy

Think of it like this:

- **AWS Image Classification** = A restaurant (service)
- **MXNet/TensorFlow/PyTorch** = Kitchen equipment (tools)
- **ResNet/DenseNet/MobileNet** = Recipes (algorithms/architectures)
- **CNN** = Cooking technique (general approach)

The notebooks are cooking at home with PyTorch, while AWS Image Classification is the managed restaurant service.

## Summary

- "Image Classification" in AWS = managed service/wrapper
- ResNet, DenseNet, MobileNet, etc. = specific neural network architectures (the algorithms)
- CNN = general architecture type (all of the above are CNNs)
- The notebooks use PyTorch directly, not the AWS managed service

Does this clarify the distinction?
