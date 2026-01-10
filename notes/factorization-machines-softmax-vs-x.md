# Compare Factorization Machine, Softmax vs One-vs-Rest

> Yes. Both are Factorization Machines. The difference is the multi-class classification strategy, not the model architecture.
> Yes. Both are Factorization Machines. The difference is the multi-class classification strategy, not the model architecture.

## Factorization Machine architecture (same for both)

Both use the same FM formula:

```
Prediction = w₀ + (linear term) + (interaction term)

where:
- w₀ = bias
- linear term = Σ wᵢ × xᵢ  (simple weighted sum)
- interaction term = ΣΣ (factorized interactions) using V matrix
```

Both models have:

- `w0` (bias term)
- `w` (linear weights for each feature)
- `V` (factor matrix for feature interactions)

Both compute the same FM prediction internally. The code that calculates this is identical:

```python
# This FM calculation is the SAME in both:
linear = np.dot(self.w, x) + self.w0
interactions = 0.5 * (sum_f² - sum_sq)  # Using V matrix
prediction = linear + interactions
```

---

## What's different: classification strategy

The difference is how they handle multiple classes:

### One-vs-Rest FM

- Uses 3 separate FM models
- Each FM model does binary classification
- Each uses sigmoid: `P(class) = 1/(1 + exp(-prediction))`

### Softmax FM

- Uses 1 FM model that outputs scores for all classes
- Does multi-class classification
- Uses softmax: `P(all classes) = softmax([score₀, score₅, scoreₙ])`

---

## Think of it like this:

| Component                 | One-vs-Rest             | Softmax                  |
| ------------------------- | ----------------------- | ------------------------ |
| **Model Architecture**    | Factorization Machine ✓ | Factorization Machine ✓  |
| **Number of FM models**   | 3 separate FMs          | 1 FM                     |
| **Output per FM**         | 1 score (binary)        | 3 scores (one per class) |
| **Classification method** | Sigmoid (3x)            | Softmax (1x)             |
| **Training loss**         | Logistic loss           | Cross-entropy loss       |

---

## Bottom line

Yes, both are Factorization Machines. They share the same architecture (w₀, w, V) and the same interaction calculation. The difference is:

- One-vs-Rest: 3 binary FM models
- Softmax: 1 multi-class FM model

It's like having:

- 3 separate binary calculators (OvR) vs
- 1 calculator that can handle all classes at once (Softmax)

Both use the same "Factorization Machine" calculator; they just use it differently.

## Simple flow: image → prediction

### Step 1: Image preprocessing (same for both)

```
Your PNG file (0.png, 5.png, etc.)
    ↓
1. Resize to 28×28 pixels
2. Convert to grayscale
3. Normalize pixels to 0-1 range
4. Invert if needed (white background → black digits)
    ↓
Result: 784 numbers (28×28 = 784 features)
```

### Step 2: What happens differently

---

## ONE-VS-REST approach

```
784 numbers (your image)
    ↓
┌─────────────────────────────────┐
│ Send to 3 SEPARATE models:      │
└─────────────────────────────────┘
    ↓
    ├─→ Model "0":    "Is this a 0?"     → Output: 0.85 (85% yes)
    ├─→ Model "5":    "Is this a 5?"     → Output: 0.19 (19% yes)
    └─→ Model "neither": "Is this neither?" → Output: 0.29 (29% yes)
    ↓
Pick the highest: 0.85 > 0.29 > 0.19
    ↓
Prediction: "0" ✓
```

What each model does:

- Model "0" learns patterns that indicate "this looks like a 0"
- Model "5" learns patterns that indicate "this looks like a 5"
- They don't interact; each gives an independent score

---

## SOFTMAX approach

```
784 numbers (your image)
    ↓
┌─────────────────────────────────┐
│ Send to 1 SINGLE model:         │
│                                 │
│ Model calculates scores for:    │
│   - Class "0": score = 2.1      │
│   - Class "5": score = -0.5     │
│   - Class "neither": score = 3.2│
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│ Apply SOFTMAX (normalize):      │
│                                 │
│ Convert scores to probabilities:│
│   - P(0) = 0.06 (6%)            │
│   - P(5) = 0.03 (3%)            │
│   - P(neither) = 0.91 (91%)     │
│                                 │
│ ✓ These MUST sum to 1.0 (100%)  │
└─────────────────────────────────┘
    ↓
Pick the highest: 0.91 > 0.06 > 0.03
    ↓
Prediction: "neither" ✗
```

What the single model does:

- Computes scores for all classes at once
- Softmax forces them to sum to 1.0, so classes compete
- If one score is high, others get pushed down

---

## Difference in simple terms

### One-vs-Rest:

- 3 separate models, each answers a yes/no question
- Each gives a probability independently (they can all be high)
- Like asking 3 different experts separately

### Softmax:

- 1 model answers all 3 questions at once
- Probabilities are normalized (if one is high, others drop)
- Like asking one expert to rank all 3 options

---

## Why they gave different answers for 0.png

One-vs-Rest:

- Model "0" said: "85% chance this is a 0" → correct
- Model "5" said: "0.07% chance this is a 5" → correct
- Model "neither" said: "29% chance this is neither" → reasonable

Softmax:

- Model said: "6% chance this is 0, 91% chance this is neither"
- The "neither" class dominated, pushing other probabilities down

**The key difference: OvR models vote independently; Softmax forces probabilities to compete and normalize to 1.0.**
