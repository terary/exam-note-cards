##

### Learning Rate

- Learning rate controls how much the model updates its weights during training.
- The learning rate (self.lr) is multiplied by the error/gradient to determine how much to change each weight:
- Analogy:
  - Imagine finding the bottom of a valley:
    - High learning rate (0.01): take big steps — fast but may overshoot
    - Low learning rate (0.001): take small steps — slower but more precise
  - The problem with 0.01:
    - Your model becomes overconfident (probabilities near 0.0 or 1.0). This happens because:
      - Large updates cause weights to grow quickly
      - The model becomes too certain about predictions
      - Probabilities become extreme (0.000001 or 0.999999)

### Random State

`random_state` is a seed value that initializes the random number generator. It makes results reproducible.

What it does:

    - With random_state = 42: same seed → same random numbers → same initial weights → reproducible results
    - Without a fixed seed: different random numbers each run → different initial weights → different results

Why it matters:

    - Reproducibility: same seed → same results
    - Debugging: easier to compare runs
    - Fair comparison: compare hyperparameters with the same starting point

**ensure the model starts with the same initial weights each time**

### lambda_reg (Regularization Parameter)

`lambda_reg` (also called lambda or regularization strength) controls how much the model is penalized for having large weights. It helps prevent overfitting.

What it does:

    - Without regularization (lambda_reg = 0): weights can grow very large → overfitting
    - With regularization (lambda_reg = 0.01): weights are penalized for being large → more stable

Analogy:

    - Think of weights as a spring:
    	- High lambda_reg (0.1): strong spring, keeps weights small
    	- Low lambda_reg (0.01): weak spring, allows larger weights
    	- No regularization (0.0): no spring, weights can grow unbounded

Both work together:

    - `learning_rate` = 0.01 (too high) → weights grow fast
    - `lambda_reg` = 0.01 (too low) → insufficient penalty

Result: weights become too large → overconfidence
Better combination:

    - `learning_rate` = 0.001 (smaller steps)
    - `lambda_reg` = 0.1 (stronger penalty)

Result: more balanced, calibrated probabilities

### num_factors (k)

## Core FM-specific hyperparameters

### 1. `num_factors` (k) — most important

- What: Rank of the factorization matrix V (latent dimension for interactions)
- Current: `10`
- Impact: Very high
- What it controls:
  ```python
  # Line 148-151: This is THE FM interaction term
  for f in range(self.n_factors):  # ← This loops over factors
      sum_f = np.sum(self.V[:, f, c] * x)
      interactions += 0.5 * (sum_f**2 - sum_sq)
  ```
- Effect:
  - Lower (5-8): Simpler, closer to linear, faster, less overfitting, but fewer interactions
  - Higher (15-30): Richer interactions, more complex, slower, higher overfitting risk
- Typical range: 5-50 (often 8-20)
- AWS SageMaker note: "Making this value smaller provides a more parsimonious model, closer to a linear model... Making it larger provides a higher-dimensional representation of feature interactions, but adds computational complexity and can lead to overfitting."

---

## Currently not implemented (could be added)

### 2. `mini_batch_size` (batch size)

- Current: 1 (online SGD - one sample at a time)
- AWS SageMaker default: 200
- What: Number of samples processed before updating weights
- Effect:
  - Batch size = 1 (current): Online learning, more updates, noisier gradients
  - Batch size = 32-200: Smoother gradients, faster training (matrix operations), more memory
- Impact: Medium (affects speed and stability)
- Your code (line 178): Currently processes one sample at a time
  ```python
  for i in indices:  # ← One sample at a time
      x = X_dense[i]
      # ... update weights immediately
  ```

### 3. Separate regularization for different weights

- Current: Single `lambda_reg` for all weights
- FM structure: Three weight types:
  - `w0` (bias) - currently no regularization (line 201)
  - `w` (linear) - uses `self.reg` (line 204)
  - `V` (factors) - uses `self.reg` (line 211)
- Could add:
  ```python
  lambda_w0: float = 0.0   # Bias regularization (usually 0)
  lambda_w: float = 0.01   # Linear term regularization
  lambda_v: float = 0.01   # Factor matrix regularization (often different!)
  ```
- Impact: Medium (can help fine-tune)

### 4. Weight initialization strategy

- Current: `np.random.normal(0, 0.1, ...)` (line 136)
- Options:
  - Standard deviation scale: `0.01`, `0.05`, `0.1`, `0.2`
  - Xavier/Glorot initialization
  - He initialization
- Impact: Low-Medium (affects early training)

### 5. Optimizer type

- Current: SGD (Stochastic Gradient Descent)
- Other options:
  - Adam: Adaptive learning rate, often faster convergence
  - AdaGrad: Adaptive per-parameter learning rates
  - RMSProp: Adaptive learning rate
- Impact: High (can speed up training)
- Your code (lines 201, 204, 211): Uses basic SGD
  ```python
  self.w0[c] -= self.lr * error_c  # ← Fixed learning rate
  ```

### 6. Learning rate schedule/decay

- Current: Constant learning rate
- Options:
  - Exponential decay: `lr = lr0 * decay^epoch`
  - Step decay: Reduce at specific epochs
  - Inverse scaling: `lr = lr0 / (1 + decay * epoch)`
- Impact: Medium-High
- AWS SageMaker: Often uses decay

### 7. Loss function type (for multi-class)

- Current: Cross-entropy (softmax)
- Alternatives:
  - Focal loss (handles class imbalance)
  - Weighted cross-entropy (if classes are imbalanced)
- Impact: Low-Medium (only if you have class imbalance)

---

## FM hyperparameter summary

| Hyperparameter           | Current  | FM-Specific?      | Impact     | Priority  |
| ------------------------ | -------- | ----------------- | ---------- | --------- |
| `num_factors`            | 10       | Yes (core)        | Very High  | Very High |
| `learning_rate`          | 0.01     | No (general)      | Very High  | Very High |
| `lambda_reg`             | 0.01     | No (general)      | High       | High      |
| `epochs`                 | 10       | No (general)      | High       | High      |
| `mini_batch_size`        | 1        | Yes (FM tuning)   | Medium     | Medium    |
| `lambda_w` vs `lambda_v` | Same     | Yes (FM-specific) | Medium     | Low       |
| Weight init scale        | 0.1      | Yes (FM tuning)   | Low-Medium | Low       |
| Optimizer type           | SGD      | No (general)      | High       | Medium    |
| LR schedule              | Constant | No (general)      | Medium     | Medium    |

---

## Recommended FM tuning strategy

### Phase 1: Core FM parameter

```python
num_factors: int = 8   # Start simple
# Then try: 12, 15, 20
```

### Phase 2: Standard hyperparameters (learning rate, regularization)

```python
learning_rate: float = 0.001  # Your best so far
lambda_reg: float = 0.1       # Stronger regularization
```

### Phase 3: Batch size (if you add it)

```python
mini_batch_size: int = 32  # Or 64, 128, 200
```

### Phase 4: Fine-tuning

```python
# Separate regularization
lambda_w: float = 0.01   # Linear term
lambda_v: float = 0.05   # Factor matrix (often higher)
```

---

## Bottom line

The most important FM-specific hyperparameter is:

1. `num_factors` — controls interaction complexity

Next most impactful additions: 2. `mini_batch_size` — can improve speed/stability 3. Separate regularization (`lambda_w` vs `lambda_v`) — fine-tuning

Other hyperparameters (`learning_rate`, `lambda_reg`, `epochs`) are general ML, but critical for FM performance.

Would you like me to:

1. Add `mini_batch_size` as a tunable hyperparameter?
2. Implement separate regularization for `w` and `V`?
3. Add an optimizer option (like Adam)?
