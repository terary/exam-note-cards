## ML Exam Cheat Sheet (Memorize This)

| Letter  | Meaning         | ML Usage                 |
| ------- | --------------- | ------------------------ |
| **C**   | Compute         | CPU ML, preprocessing    |
| **M**   | Mixed           | Dev, small ML            |
| **R**   | RAM             | Large datasets           |
| **P**   | GPU (Training)  | Deep learning training   |
| **G**   | GPU (Inference) | DL inference             |
| **Inf** | Inferentia      | Cost-optimized inference |
| **Trn** | Trainium        | Cost-optimized training  |

---

## SageMaker Mapping (Exam Gold)

- **Training jobs** → `P*` or `Trn*`
- **Inference endpoints** → `G*` or `Inf*`
- **Processing jobs** → `C*` or `M*`

## Core EC2 Instance Families (ML-Relevant)

### **C – Compute Optimized**

**Examples:** `C5`, `C6i`, `C7g`
**CPU-focused**

- High clock speed, low memory per vCPU
- Best for:

  - Data preprocessing
  - Feature engineering
  - Traditional ML (XGBoost, linear models)
  - CPU-based inference

🧠 _Think:_ fast math, not big models

---

### **M – General Purpose**

**Examples:** `M3`, `M5`, `M6i`

- Balanced CPU + memory
- Best for:

  - Development
  - Small training jobs
  - Light inference
  - Orchestrators (Airflow, notebooks)

🧠 _Think:_ “default choice”

---

### **R – Memory Optimized**

**Examples:** `R5`, `R6i`

- Large RAM per vCPU
- Best for:

  - Large datasets in memory
  - Feature stores
  - In-memory analytics (Spark ML)
  - Classical ML with big matrices

🧠 _Think:_ data-heavy ML, not deep learning

---

## GPU & Accelerator Families (Very Important for ML Exam)

### **P – GPU Compute (Training)**

**Examples:** `P2`, `P3`, `P4d`

👉 **P = Powerful GPU for training**

- NVIDIA GPUs (V100, A100)
- Best for:

  - Deep learning **training**
  - Large neural networks
  - Distributed training (multi-GPU)

**Exam keyword:** _training at scale_

🧠 _Think:_ backpropagation, long training jobs

---

### **G – GPU Graphics / Inference**

**Examples:** `G4`, `G5`

- Cheaper GPUs than P-family
- Best for:

  - **Inference**
  - Computer vision
  - NLP serving
  - Video / image workloads

🧠 _Think:_ “GPU, but inference-first”

---

### **Inf – Inferentia (Inference ASIC)**

**Examples:** `Inf1`, `Inf2`

- AWS custom silicon
- Optimized for:

  - **Low-latency**
  - **High-throughput inference**

- Used heavily with **SageMaker endpoints**

🧠 _Think:_ cheapest inference at scale

---

### **Trn – Trainium (Training ASIC)**

**Examples:** `Trn1`

- AWS custom silicon for **training**
- Lower cost vs GPUs for large models
- Best for:

  - Transformer models
  - Large-scale DL training
  - SageMaker distributed training

🧠 _Think:_ “AWS’s GPU alternative for training”

---

## Storage-Heavy (Occasionally ML Relevant)

### **I – Storage Optimized (IOPS)**

**Examples:** `I3`, `I4`

- NVMe SSDs
- Best for:

  - Data ingestion
  - Feature generation pipelines
  - Logging massive datasets

---

### **D / H – Dense Storage**

- Large HDD-based storage
- Rarely used directly for ML compute
- More for data lakes / preprocessing

---

## ML Exam Cheat Sheet (Memorize This)

| Letter  | Meaning         | ML Usage                 |
| ------- | --------------- | ------------------------ |
| **C**   | Compute         | CPU ML, preprocessing    |
| **M**   | Mixed           | Dev, small ML            |
| **R**   | RAM             | Large datasets           |
| **P**   | GPU (Training)  | Deep learning training   |
| **G**   | GPU (Inference) | DL inference             |
| **Inf** | Inferentia      | Cost-optimized inference |
| **Trn** | Trainium        | Cost-optimized training  |

---

## SageMaker Mapping (Exam Gold)

- **Training jobs** → `P*` or `Trn*`
- **Inference endpoints** → `G*` or `Inf*`
- **Processing jobs** → `C*` or `M*`
