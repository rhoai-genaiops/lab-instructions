# 🏋️ Training with LoRA

You've seen how synthetic data generation works. Now let's actually train the model to be a Socratic tutor.

> ⚠️ **Workshop Scope:** We'll train a tiny model (`Qwen2-0.5B`) on CPU with pre-prepared training data. This demonstrates the *process*—production training uses larger models on GPU with more data.

## Why LoRA?

Full fine-tuning updates *every* parameter in the model. For a 3B model, that's 3 billion weights to modify, store, and serve.

**LoRA (Low-Rank Adaptation)** is smarter. It freezes the original model and trains small "adapter" matrices that modify the model's behavior. Think of it like adding a filter to a camera—the camera stays the same, but the output changes.

| Approach | Parameters Trained | Storage | Memory |
|----------|-------------------|---------|--------|
| Full fine-tuning | 3B (100%) | ~6 GB | 24+ GB GPU |
| LoRA | 15M (~0.5%) | ~30 MB | 8-16 GB GPU |
| QLoRA (4-bit) | 15M (~0.5%) | ~30 MB | 4-8 GB GPU |

**The payoff:**
- Train on smaller GPUs than full fine-tuning
- Store many adapters cheaply
- Switch adapters at runtime
- Keep the base model unchanged

## What Training Requires

| Resource | Workshop Demo | Production |
|----------|---------------|------------|
| Hardware | CPU (slow but works) | GPU (8-24GB VRAM) |
| Training data | 30 curated examples | 500-5000 examples |
| Time | 5-10 minutes | Hours for large datasets |
| Base model | Qwen2-0.5B (tiny) | 3B-7B models |

## Our Approach: Pre-Curated Data

The SDG notebook shows how to *generate* training data, but SDG Hub produces informative Q&A pairs—not Socratic responses. For effective training, we use a **pre-curated dataset** of 30 high-quality Socratic tutoring examples.

This is realistic: in production, you'd either:
1. Customize SDG prompts to generate Socratic responses
2. Post-process SDG output to make it Socratic
3. Hand-curate a high-quality seed dataset (what we do here)

Quality beats quantity. 30 excellent examples can teach basic patterns.

## Understanding LoRA Parameters

| Parameter | What It Does | Our Setting |
|-----------|--------------|-------------|
| `r` (rank) | Adapter capacity. Higher = more expressive, more memory | 8 (small for CPU demo) |
| `lora_alpha` | Scaling factor. Usually 2×r | 16 |
| `target_modules` | Which layers get adapters | Attention layers (q, k, v, o) |
| `lora_dropout` | Regularization | 0.1 |

## Training Configuration

For small datasets, we need to maximize learning signal:

| Setting | Value | Why |
|---------|-------|-----|
| Epochs | 10 | More passes over small data |
| Batch size | 2 | Small batches for CPU |
| Gradient accumulation | 4 | Effective batch size of 8 |
| Learning rate | 2e-4 | Higher for faster learning |
| LR scheduler | Cosine | Smooth decay works well |
| Data augmentation | 3x | Repeat examples to increase signal |

## Data Format

Training data is in **messages format**:

```json
{"messages": [
  {"role": "user", "content": "How do I solve 2x + 5 = 13?"},
  {"role": "assistant", "content": "Good question! What operation would help you isolate the x term?"}
]}
```

For training, we format this with a system prompt that reinforces the behavior:

```
<|im_start|>system
You are a Socratic math tutor. Never give direct answers. Instead:
- Ask guiding questions to help students discover the solution
- Encourage critical thinking and problem-solving
- Be supportive and patient<|im_end|>
<|im_start|>user
How do I solve 2x + 5 = 13?<|im_end|>
<|im_start|>assistant
Good question! What operation would help you isolate the x term?<|im_end|>
```

## What Happens During Training

During training, the model learns from your examples:
- To ask questions instead of giving answers
- Vocabulary patterns ("What do you notice...", "How might you...")
- When to give hints vs. when to push back

You'll see training loss decrease steadily over epochs—that's the model learning the patterns in your data.

## Monitor Training

When training runs, watch for these signals:

| Metric | Healthy Range | Warning Sign |
|--------|---------------|--------------|
| Training loss | Decreasing steadily | Flat or increasing |
| Learning rate | Warm up, then decay | N/A (automatic) |

**Common issues:**

| Problem | Cause | Fix |
|---------|-------|-----|
| Loss doesn't decrease | Learning rate too low | Increase to 5e-4 |
| Loss oscillates wildly | Learning rate too high | Decrease to 1e-4 |
| Overfitting | Too many epochs | Stop earlier, add dropout |

## What You Get

After training, you have a LoRA adapter:

```
./socratic-tutor-lora/
├── adapter_config.json        # LoRA configuration
├── adapter_model.safetensors  # The trained weights (~30MB)
└── tokenizer files            # Tokenizer for inference
```

This adapter is tiny compared to the full model. You can:
- Store dozens of adapters for different behaviors
- Version them in Git
- Switch between them at runtime

## 🧪 Train Your Own Adapter

Go to your workbench and open up **`experiments/12-fine-tuning/2-lora-training.ipynb`**

In this demonstration, you'll:
1. Load the pre-prepared Socratic training data (30 curated examples)
2. Load the base model (Qwen2-0.5B-Instruct)
3. Configure LoRA parameters
4. **Actually train** a LoRA adapter (~5-10 minutes on CPU)
5. Save the trained adapter

> ☕ Training takes about 5-10 minutes on CPU. Good time for a coffee break!

When you're done, come back and we'll look at how to evaluate whether training worked.

## 🎯 Next Steps

Continue to **[Evaluation](./4-evaluation.md)** to test whether your fine-tuned model actually behaves differently.
