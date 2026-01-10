## Why different architectures?

Each is optimized for different things:

1. Linear models: Simple, fast, interpretable

   - Good when patterns are simple

2. Neural Networks: Complex patterns, automatic feature learning

   - Good when you need to learn complicated relationships
   - CNNs are specifically designed for images

3. Tree models: Rules-based, interpretable, handles non-linear

   - Good when you need to understand why it made a decision

4. Factorization Machines: Efficient interactions, sparse data

   - Good for recommendation systems, sparse features
   - Less common for images (but works, as you've seen)

5. SVMs: Strong boundaries, kernel methods
   - Good for clear separation between classes
