# Section 7: Generative AI Model Fundamentals (Vocab)

- `Transformer Architecture` - Neural network architecture that LLMs are built on, using self-attention mechanisms instead of sequential RNN processing to enable parallel computation
- `self-attention` - FFNN concept. For RNN we have 'attention' awareness of previous tokens translated. This is a sequential process. "Self Attention" move that 'previous tokens' or hidden state into its own memory space 'self attention' making parallel processing possible
- `Attention Weight` - The weight or score that determines how much focus is allocated to each word/token when computing attention relationships between tokens
- `Scaled dot-product attention` - A similarity function used in self-attention that computes attention scores by taking the dot product of query and key vectors, then scaling them (0170/3:28)
- `Scaled data product attention` - Same as scaled dot-product attention; alternative naming for the dot product similarity function used to compute attention scores
- `q`, `k`, `v` vectors - Q (Query), K (Key), and V (Value) vectors used to calculate attention weights in transformers and feed-forward neural networks. Each token gets these three vectors by multiplying its embedding against learned weight matrices
- `interleaved sinusoidal function` - Mathematical function used for positional encoding that captures the position of tokens relative to others and works on inputs of any length
- `logits` - The output probabilities for each token being the right next token in the sequence, computed by multiplying the decoder output vector with token embeddings (0173)
- `tokens` - numerical representation of words or parts of words **numeric**
- `Embeddings` - Mathematical representations (vectors) the encode "meaning" of a token (hence, spanish, german, english may map to the same token because we are working with 'meaning')
- `Top P` - Threshold probability of a token inclusion (higher => greater randomness)
- `Top K` - Alterative to `top p` instead of "top probability" where "top K" candidates that exists for for inclusion. Higher K, higher randomness
- `temperature` - the level of randomness in selecting the next word in the output from those tokens
  - Higher temperature -> more random
  - Low temperature -> more consistent (less random)
- `Context window` - The number of tokens an LLM can process at once
- `Max tokens` - Limit for the total number of tokens (**on input or output**)
- `Embedding Space` - The high-dimensional vector space (often thousands of dimensions) where embeddings exist. The distance between vectors in this space determines how semantically close or related tokens are to each other
