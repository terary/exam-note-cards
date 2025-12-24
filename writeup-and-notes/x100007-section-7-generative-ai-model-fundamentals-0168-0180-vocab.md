# Section 7: Generative AI Model Fundamentals (Vocab)

- `Transformer Architecture`
- `self-attention` - FFNN concept. For RNN we have 'attention' awareness of previous tokens translated. This is a sequential process. "Self Attention" move that 'previous tokens' or hidden state into its own memory space 'self attention' making parallel processing possible
- `Attention Weight`
- `Scaled dot-product attention` (0170/3:28)
- `Scaled data product attention`
- `q`, `k`, `v` vectors -
- `interleaved sinusoidal function`
- `logits` (0173)
- `tokens` - numerical representation of words or parts of words **numeric**
- `Embeddings` - Mathematical representations (vectors) the encode "meaning" of a token (hence, spanish, german, english may map to the same token because we are working with 'meaning')
- `Top P` - Threshold probability of a token inclusion (higher => greater randomness)
- `Top K` - Alterative to `top p` instead of "top probability" where "top K" candidates that exists for for inclusion. Higher K, higher randomness
- `temperature` - the level of randomness in selecting the next word in the output from those tokens
  - Higher temperature -> more random
  - Low temperature -> more consistent (less random)
- `Context window` - The number of tokens an LLM can process at once
- `Max tokens` - Limit for the total number of tokens (**on input or output**)
- `Embedding Space`
