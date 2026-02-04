# 📊 LLM Performance and Hardware

## 📚 Contents
- [📊 LLM Performance and Hardware](#-llm-performance-and-hardware)
  - [📚 Contents](#-contents)
  - [📊 Key Performance Metrics](#-key-performance-metrics)
  - [📦 Model Sizes and Requirements](#-model-sizes-and-requirements)
  - [� How to Understand Model Resource Requirements from Model Cards](#-how-to-understand-model-resource-requirements-from-model-cards)
  - [👀 Let's see this in practice](#-lets-see-this-in-practice)
  - [✅ Summary](#-summary)

## 📊 Key Performance Metrics

Before we jump into hardware and sizes, it's helpful to understand how we measure a model's responsiveness and efficiency. These key metrics help us see how fast a model can start talking, how quickly it produces each word, and how much resource it uses.

| Metric                  | Meaning                                                      |
|-------------------------|--------------------------------------------------------------|
| **TTFT**                | Time to First Token – how quickly the model starts giving its first token after you ask something. |
| **TPOT**                | Time Per Output Token – the speed at which each next token is generated once the response has started. |
| **Throughput**          | How many requests the system can handle at the same time without slowing down. |
| **VRAM Usage**          | The amount of GPU memory the model needs (bigger models or longer conversations need more memory). |

These metrics help you balance latency vs. cost in OpenShift AI deployments.

<!-- 📏 Latency root-cause quiz -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);
            padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">📏 Quiz</h3>

<p style="color:#495057;font-weight:500;">
Your demo streams an LLM answer and then appends a <b>~900 KB</b> PNG chart
at the very end.<br>
Telemetry shows:
</p>

<ul style="margin-left:1.2em;color:#5a5a5a;">
  <li>~4 s TTFT</li>
  <li>~30 ms TPOT</li>
  <li>PNG transfer time is ~3 s</li>
</ul>

<p style="color:#495057;font-weight:500;">
Which single change will <b>most directly</b> improve what users feel?
</p>

<style>
.latOpt{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;
       border:2px solid #e9ecef;color:#495057;transition:.2s}
.latOpt:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.latRad{display:none}
.latRad:checked + .latOpt[data-good="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.latRad:checked + .latOpt[data-good="false"]{background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.latFeed{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#lat-good:checked ~ .latFeed[data-type="good"],
#lat-w1:checked  ~ .latFeed[data-type="bad1"],
#lat-w2:checked  ~ .latFeed[data-type="bad2"]{display:block}
.latFeed[data-type="good"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.latFeed[data-type="bad1"], .latFeed[data-type="bad2"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div>
  <input type="radio" id="lat-w1" name="lat" class="latRad">
  <label for="lat-w1" class="latOpt" data-good="false">
    🖼️ Compress the PNG from 900 KB → 150 KB.
  </label>

  <input type="radio" id="lat-good" name="lat" class="latRad">
  <label for="lat-good" class="latOpt" data-good="true">
    ⚡ Move the model to a faster, always-warm GPU (weights & cache pre-loaded).
  </label>

  <input type="radio" id="lat-w2" name="lat" class="latRad">
  <label for="lat-w2" class="latOpt" data-good="false">
    ✏️ Reduce response length by 20 %.
  </label>

  <div class="latFeed" data-type="good">
    ✅ The biggest pain is the 4 s silence <em>before</em> any text streams.
    Shortening model start-up on a warm GPU tackles that gap directly.
  </div>
  <div class="latFeed" data-type="bad1">
    ❌ Compressing PNG helps but only for a small delay gain at the end.
  </div>
  <div class="latFeed" data-type="bad2">
    ❌ Shorter responses reduce overall time but there is something even more frustrating than watching text stream to us for a few seconds.
  </div>
</div>
</div>

---

## 📦 Model Sizes and Requirements

Models come in different sizes. The bigger the model (measured in billions of parameters), the smarter and more detailed its responses can be. But bigger models need more powerful GPUs and more memory, which can make them slower or more expensive to run.

The biggest bottleneck for loading and running a model is GPU memory.  
An easy way to think of it is: Number of parameters x 4 = GPU memory needed.  
For example, a 3B parameter model requires ~12GB of GPU memory to load and run.  

| Model Size     | Parameters | GPU Requirement            | Notes                            |
|----------------|------------|-----------------------------|----------------------------------|
| **<3B**         | Small      | 8–12GB VRAM                | Lightweight, fast, and easy to deploy             |
| **7B–13B**      | Medium     | ≥24GB VRAM or quantized*     | Balanced power and cost          |
| **>30B**        | Large      | Multi-GPU or high-end cards | Better at understanding context but slower and costly |

🧠 Larger models may be smarter, but smaller ones are often faster and easier to deploy.

_* Quantization makes models take up less space, so they can run faster and fit on smaller GPUs. It slightly reduces quality but often works well enough._


## 📃 How to Understand Model Resource Requirements from Model Cards


[Hugging Face](https://huggingface.co/) is a platform and model hub where developers share, explore, and deploy machine learning models — especially Large Language Models.  
Many of us use Hugging Face to browse and download models.

 When you browse large language models on Hugging Face, each model has a **model card** — a summary page with key information about the model’s architecture, training data, intended use cases, and often hardware requirements. For example, check out the [Llama-4-Scout-17B-16E-Instruct](https://huggingface.co/meta-llama/Llama-4-Scout-17B-16E-Instruct) model from the Llama 4 collection.

Where to look for resource hints:

* **Model size / number of parameters:** Usually listed in the “Model Details” or “Model Information” section. This gives a rough sense of the model’s scale (e.g., 7B, 13B, 70B parameters).
* **Hardware requirements:** Sometimes explicitly listed under sections like “Requirements” or “Inference Performance” — this may mention VRAM needs or recommended GPU types.
* **Quantization support:** Some cards specify if the model supports 4-bit or 8-bit quantization, which helps reduce VRAM usage.
* **Max Context length:** Longer context windows require more memory, and different models can handle different sizes of context windows, so this is important when estimating VRAM needs.

If these details aren’t directly stated, you can roughly estimate memory requirements based on model size as mentioned earlier: multiply the number of parameters by **4 bytes** (for FP32) or **2 bytes** (for FP16/half precision) to get a ballpark figure for VRAM needed to load the model’s weights. Don’t forget — you’ll also need extra VRAM for activation buffers or KV caches during inference.

By checking these details on Hugging Face and using the rough guidelines above, you can estimate the hardware needed to run a model smoothly.

<!-- 📦 model size / GPU trade-off -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);
            padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">📦 Quiz</h3>

<p style="color:#495057;font-weight:500;">
You need an assistant to <b>auto-tag support tickets</b> with one of 50 categories.<br>
Traffic target: ~20 requests / sec.<br>
GPU budget: single A10 24 GB.
</p>

<p style="color:#495057;font-weight:500;">Which model choice fits best?</p>

<style>
.szOpt{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;
       border:2px solid #e9ecef;color:#495057;transition:.2s}
.szOpt:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.szRad{display:none}
.szRad:checked + .szOpt[data-good="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.szRad:checked + .szOpt[data-good="false"]{background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.szFeed{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#sz-good:checked ~ .szFeed[data-type="good"],
#sz-w1:checked  ~ .szFeed[data-type="bad1"],
#sz-w2:checked  ~ .szFeed[data-type="bad2"]{display:block}
.szFeed[data-type="good"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.szFeed[data-type="bad1"], .szFeed[data-type="bad2"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div>
  <input type="radio" id="sz-w1" name="sz" class="szRad">
  <label for="sz-w1" class="szOpt" data-good="false">
    70 B quantized to 4-bit
  </label>

  <input type="radio" id="sz-good" name="sz" class="szRad">
  <label for="sz-good" class="szOpt" data-good="true">
    7 B quantized to 16-bit
  </label>

  <input type="radio" id="sz-w2" name="sz" class="szRad">
  <label for="sz-w2" class="szOpt" data-good="false">
    3 B unquantized (FP32) running on CPU
  </label>

  <div class="szFeed" data-type="good">
    ✅ 7 B @ 16-bit ≈ 7 B × 2 byte ≈ 14 GB → easily fits 24 GB with some space for the KV-cache (context window) and meets 20 req/s.
  </div>
  <div class="szFeed" data-type="bad1">
    ❌ Even quantized to 4-bit (~0.5 bytes/param), 70B ≈ 35 GB → exceeds your 24 GB budget. Plus, 4-bit quantization may hurt accuracy.
  </div>
  <div class="szFeed" data-type="bad2">
    ❌ 3B FP32 = ~12 GB might fit, but CPU inference is too slow for 20 req/s. You need GPU acceleration for this throughput requirement.
  </div>
</div>
</div>

## 👀 Let's see this in practice

Below you'll see two versions of Llama 3.2 3B side by side:

- **Model 1 (Llama 3.2 3B):** The original model in FP16 precision
- **Model 2 (Llama 3.2 3B FP8):** The same model, compressed to FP8 precision (we'll learn about what we mean with FP8 precision soon)

The FP8 version uses **half the memory**. But can you tell the difference in quality?

**Try these prompts and compare the responses:**

1. `Explain photosynthesis in simple terms`
2. `Write a haiku about debugging code`
3. `What are Ireland's chances in the upcoming Six Nations?`

<iframe
    src="https://ai-orientation-app-ai501.<CLUSTER_DOMAIN>/compare?embed"
    frameborder="0"
    width="850"
    height="1000"
    style="border: 1px solid #ccc; border-radius: 8px;"
    loading="lazy">
</iframe>


So what did you notice?

- **Quality:** Could you tell which response was "better"?
- **Consistency:** Did both give similar answers?
- **Speed:** Was one noticeably faster? (Note: they're on different GPUs, so speed isn't a fair comparison here)

If the responses seemed similar in quality... that's the point. The FP8 model uses **half the bits per parameter** while producing nearly identical outputs.

How does compressing a model to half its size *not* break it? That's what this module is about.

---


## ✅ Summary

Let's wrap up with a quick review of important concepts that you have seen through this chapter. These terms will help you understand how LLMs work under the hood and how to think about their performance and deployment.

| Concept                | Key Idea                                                            |
|------------------------|---------------------------------------------------------------------|
| **Token**              | The smallest piece of text an LLM processes at a time—like a word or part of a word. Think of tokens as the building blocks of language for the model. |
| **Next-token machine** | LLMs work by predicting one token at a time, based on what came before. They generate responses step-by-step. |
| **Attention**          | A method that lets the model focus on the important parts of the input when deciding what token to generate next. |
| **Context length**     | How much recent conversation or text the model can "remember" at once, usually measured in tokens. |
| **KV Cache**           | A memory shortcut that helps speed up generating tokens by remembering parts of previous calculations. |
| **Prompting**          | How we guide the model’s behavior by carefully designing the input text we give it. |
| **Hallucination**      | When the model makes up facts or details that sound real but are incorrect. |
| **Guardrails**         | Techniques and controls to keep the model’s output safe, accurate, and on-topic. |
| **TTFT & TPOT**        | Metrics showing how quickly the model starts responding and how fast it produces each next word. |
| **VRAM & Throughput**  | How much GPU memory is needed and how many users can be served simultaneously. |
| **Model size & GPU**   | Picking the right model size based on your hardware and needs ensures the best balance of performance and cost. |



[🔝 Back to Contents](#contents)
