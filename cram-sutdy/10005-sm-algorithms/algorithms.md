| # | Algorithm | # | Algorithm |
|---|-----------|---|-----------|
| 1 | Linear Learner | 10 | Semantic Segmentation |
| 2 | XGBoost | 11 | Random Cut Forest RCF |
| 3 | LightGBM | 12 | Neural Topic Model NTM |
| 4 | seq2seq | 13 | Latent Dirichlet Allocation LDA |
| 5 | DeepAR  | 14 | K-Nearest |
| 6 | BlazingText | 15 | K-Means |
| 7 | Object2Vec | 16 | Principle Analysis Component PCA |
| 8 | Object Detection | 17 | Factorization Machine |
| 9 | Image Classification | 18 | IP Insights |




### By group

<table>
  <tr>
    <td>
      <strong>Linear</strong>
      <ul>
        <li>Linear Learner</li>
        <li>Factorization Machine</li>
      </ul>
    </td>
    <td>
      <strong>Tree</strong>
      <ul>
        <li>XGBoost</li>
        <li>LightGBM</li>
        <li>K-Nearest</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>
      <strong>Neural</strong>
      <ul>
        <li>CNN: Object Detect, Image Class., Semantic Seg.</li>
        <li>RNN: Seq2Seq, DeepAR</li>
        <li>FF: Blazing Text, Object2Vec, NTM (first)</li>
      </ul>
    </td>
    <td>
      <strong>Unsupervised</strong>
      <ul>
        <li>K-Means</li>
        <li>PCA</li>
        <li>RCF (Random Cut Forest)</li>
        <li>IP Insights</li>
        <li>LDA</li>
        <li>NTM (second)</li>
      </ul>
    </td>
  </tr>
</table>


### Tips Choosing Activation Function (little off topic)

- Multiple Classification choose SoftMax on output layer
- RNN do well with `tanh`
- For everything else
    - start with `Relu`
    - if you need better, `leaky ReLu`
    - last resort `pRelu` and `max out`
    - swish for really deep network

-- 
Great question — these three are basically “shapes” of neural networks optimized for different kinds of data.

### **FF (Feed-Forward / MLP)**

**Best for:** *structured/tabular data* and simple pattern mapping

* Input → hidden layers → output (no memory, no time component)
* Works great when each input is independent of the previous one

**Typical uses:**

* Predicting house prices from features
* Credit risk / fraud scoring
* Basic classification/regression on feature vectors

---

### **CNN (Convolutional Neural Network)**

**Best for:** *spatial data* (things where nearby pixels/values matter)

* Learns local patterns (edges, textures, shapes)
* Uses convolution filters that slide across the input

**Typical uses:**

* Image recognition (cats vs dogs)
* Object detection (finding faces, cars, etc.)
* Medical imaging (tumors in scans)
* Also works well for some 1D signals: audio, sensor data

---

### **RNN (Recurrent Neural Network)**

**Best for:** *sequential / time-based data* (where order matters)

* Has “memory” of previous inputs
* Designed for sequences (though LSTMs/GRUs are the improved versions)

**Typical uses:**

* Speech recognition
* Time series prediction (stock, weather, sensors)
* Language modeling / text generation (older approach vs Transformers)
* Sequence classification (sentiment across a sentence)

---


### **Decision Trees**

**Best for:** **structured/tabular data** (same space where FF/MLPs often compete)

They work by asking a sequence of if/then questions like:

> “Is age > 35?”
> “Is income < 50k?”
> “Is num_logins > 12?”

### **Where they shine**

* **Very interpretable** (you can literally see the rules)
* Handle **mixed data types** well (numbers + categories)
* Often work great with **small-to-medium datasets**
* Need less feature scaling than neural nets

### **Typical use cases**

* Credit scoring / underwriting
* Fraud detection
* Customer churn prediction
* Medical decision support
* Any “business dataset in rows and columns”

### **Important note**

Most of the time in real-world ML, people don’t use a single tree — they use:

* **Random Forests**
* **Gradient Boosted Trees** (XGBoost, LightGBM, CatBoost) k-nearest (maybe)

Those are *insanely strong* for tabular data and often beat neural nets there.



### **Quick mental rule**

* **FF:** “rows of features”
* **CNN:** “grids and spatial structure”
* **RNN:** “ordered sequences over time”

If you want, I can also explain where **Transformers** fit into this (they’ve replaced RNNs for most NLP).
