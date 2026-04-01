# 🧮 Understanding Quantization

## The Problem: Great Models, Expensive Hardware

You tried Tiny Llama, but you were not so happy. And earlier you had this shiny big model that answers student questions beautifully. Why can't we have it again? But it needs 14GB of GPU memory, and your deployment budget says "absolutely not." 😭😭😭

Welcome to quantization!! The art of making models smaller without making them dumber.

Think of it like compression for your model's brain. Instead of storing every weight as a precise 16-bit number, we round them to 8 or even 4 bits. It's like the difference between keeping exact change ($14.37) versus rounding to the nearest dollar ($14). You lose some precision, but your wallet gets a lot lighter.

For Canopy, this means we can serve more students with the same hardware, respond faster, and maybe even run on that "spare" GPU that IT forgot about.


# 🔧 LLM-Compressor: Your Model's Personal Trainer

[llm-compressor](https://github.com/vllm-project/llm-compressor) is the tool the vLLM team built to compress models for production. Think of it as a Swiss Army knife for quantization: one tool, multiple algorithms, works with HuggingFace, outputs models ready for vLLM serving. This is what we are going to use in this chapter.

But before, we need to beef up our workbench a bit, because compressing a model needs a bit more resources.

1. Go to OpenShift AI dashboard, and find your workbench under `<USER_NAME>-canopy` project. Click on the three dots > `Edit workbench`.

    ![edit-workbench.png](./images/edit-workbench.png)

2. Scroll down to `Deployment size` and increase the CPU and Memory requests & limits as below.

    ![cpu-memory.png](./images/cpu-memory.png)

3. You don't need to change anything else. Just hit `Update workbench`. 

4. This will restart your workbench. When it is up, open up **`experiments/10-model-optimization/1-intro-llm-compressor.ipynb`**

In this exercise, you'll take a small model and compress it on CPU (yes, CPU—no fancy hardware needed to learn).

**What you'll do:**

1. **Meet the oneshot API** — llm-compressor's main interface. One function call, compressed model.

2. **Write a recipe** — Configure `GPTQModifier` with parameters like `scheme`, `targets`, and `ignore`

3. **Compress a model** — We'll use `Qwen/Qwen2-0.5B-Instruct` as our guinea pig (compressing Llama 3.2 3B requires more compute power than you have in the workbench. That's why we are experiencing the topic with this Qwen model)

4. **See the difference** — Compare file sizes before and after (prepare to be impressed)

5. **Run a test** — Compare the response from the compressed model to the original model

## 🎯 Next Steps

Congrats you just compressed a model! Let's make sure it actually works.

Continue to **[Evaluation](./4-evaluation.md)** to learn how to validate quantized models before they hit production.
