<!-- 
## Why Should You Care?

| Benefit | What It Means for You |
|---------|----------------------|
| **Memory** | That 14GB model? Now it's 3.5GB. Hello, cheaper GPUs! |
| **Speed** | Smaller numbers = faster math = snappier responses |
| **Cost** | Fit more models on fewer GPUs = happy finance team |
| **Accuracy** | The catch: you might lose some quality (but less than you'd think) |

The question isn't *whether* to quantize. It's *how much* you can get away with before students start noticing.

## The Precision Menu

Think of precision formats like coffee sizes. You can pick what matches your latency, cost, and quality needs.

| Format | Bits | Memory vs FP32 | When to Use It |
|--------|------|----------------|----------------|
| FP32 | 32 | 100% | Rare in practice; debugging or numerically sensitive ops. Not the default for modern LLM training. |
| FP16/BF16 | 16 | 50% | Default for most training + inference on modern GPUs |
| FP8 | 8 | 25% | Throughput-focused training/inference on fancy new GPUs |
| INT8 | 8 | 25% | Production inference "safe bet" (aka good quality/latency/memory tradeoff) |
| INT4 | 4 | 12.5% | Aggressive compression (living dangerously) |

Most production deployments land somewhere between INT8 and INT4. Let's understand what we're actually compressing.

-->

## What Can Be Quantized?

An LLM has three things we can squeeze down, each with its own risk/reward:

### 1. Weight Quantization (The Easy One)
Weights are the model's learned parameters—billions of numbers that encode everything the model knows stored on disk/VRAM. Fixed at inference time, predictable, and usually quantize well.

- **Most common and safest** approach
- Do it once, save forever
- Example: W8A16 means 8-bit weights, 16-bit activations

### 2. Activation Quantization (The Tricky One)
activations are the intermediate values produced while processing your prompt/tokens. Dynamic, input-dependent, and can spike with outliers. So they’re more sensitive to quantization.

- **More challenging**—activations can spike unexpectedly
- Requires calibration data to get right
- Example: W8A8 means both weights AND activations are quantized

### 3. KV Cache Quantization (The Memory Hog)
Attention is the mechanism that lets the model “look back” at earlier tokens to decide what matters for the next token. When students write essays or ask follow-up questions, the model often stores attention state in a cache called the KV-cache so they don't need to be re-calculated.  
For long conversations, this KV-cache can eat more memory than the model itself.

- Particularly useful for chatbots (like Canopy!)
- Reduces memory for long conversations
- Often overlooked, but can be a game-changer

<!-- 🧠 Quiz 2: KV Cache scenario -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);
            padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Scenario Check</h3>

<p style="color:#495057;font-weight:500;">
You're deploying Canopy and students are having <strong>long conversations</strong> with follow-up questions. Memory usage keeps growing throughout each chat session.<br><br>
<strong>Which quantization target would help most?</strong>
</p>

<style>
.quiz-container-kv-cache{position:relative}
.quiz-option-kv-cache{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;
  cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-kv-cache:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.quiz-radio-kv-cache{display:none}
.quiz-radio-kv-cache:checked+.quiz-option-kv-cache[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-kv-cache:checked+.quiz-option-kv-cache:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-kv-cache{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#kv-cache-correct:checked~.feedback-kv-cache[data-feedback="correct"],
#kv-cache-wrong1:checked~.feedback-kv-cache[data-feedback="wrong1"],
#kv-cache-wrong2:checked~.feedback-kv-cache[data-feedback="wrong2"]{display:block}
.feedback-kv-cache[data-feedback="correct"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.feedback-kv-cache[data-feedback="wrong1"], .feedback-kv-cache[data-feedback="wrong2"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div class="quiz-container-kv-cache">
  <input type="radio" name="quiz-kv-cache" id="kv-cache-wrong1" class="quiz-radio-kv-cache">
  <label for="kv-cache-wrong1" class="quiz-option-kv-cache" data-correct="false">
    🏋️ Weight quantization
  </label>

  <input type="radio" name="quiz-kv-cache" id="kv-cache-wrong2" class="quiz-radio-kv-cache">
  <label for="kv-cache-wrong2" class="quiz-option-kv-cache" data-correct="false">
    ⚡ Activation quantization
  </label>

  <input type="radio" name="quiz-kv-cache" id="kv-cache-correct" class="quiz-radio-kv-cache">
  <label for="kv-cache-correct" class="quiz-option-kv-cache" data-correct="true">
    💾 KV cache quantization
  </label>

  <div class="feedback-kv-cache" data-feedback="correct">
    ✅ <strong>Exactly!</strong> The KV cache stores attention state for the entire conversation and grows with each message. For long chats, it can exceed the model's weight memory. Quantizing it directly addresses your growing memory problem.
  </div>
  <div class="feedback-kv-cache" data-feedback="wrong1">
    ❌ Weights are loaded once and stay constant. They don't grow with conversation length—your problem is something that accumulates over the chat.
  </div>
  <div class="feedback-kv-cache" data-feedback="wrong2">
    ❌ Activations are computed per-token but don't accumulate across the conversation. The growing memory is from storing attention state.
  </div>
</div>
</div>

## Quantization Techniques

### Symmetric vs. Asymmetric

Think of it like a thermometer:

- **Symmetric** is like a thermometer centered at 0°C—it measures equally in both directions (-50° to +50°). Great when your data is balanced around zero, like model weights typically are.

- **Asymmetric** is like a thermometer for body temperature (35°C to 42°C)—it has an offset (zero-point) to focus precision where the data actually lives. Better for activations that might all be positive or skewed to one side.

| Approach | Method | Formula | Best For |
|----------|--------|---------|----------|
| **Symmetric** | Scale only | `q = round(x / scale)` | Weights (centered around 0) |
| **Asymmetric** | Scale + zero-point | `q = round(x / scale) + zero_point` | Activations (non-centered) |

Quantization maps an original float `x` (e.g., FP32) to a small integer `q` (e.g., INT8/INT4) so the model is faster and uses less memory. `scale` sets the step size, and `zero_point` shifts the range when zero isn’t in the middle.

**When to use each:**
- Symmetric is simpler and faster
- Asymmetric handles non-zero-centered distributions better
- Most weight quantization uses symmetric
- Activation quantization often needs asymmetric

<!-- ⚖️ Quiz 3: Symmetric vs Asymmetric -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);
            padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quick Check</h3>

<p style="color:#495057;font-weight:500;">
Model <strong>weights</strong> are typically centered around zero: <code>[-0.5, 0.3, -0.1, 0.4]</code><br>
<strong>Activations</strong> after ReLU are always positive: <code>[0.0, 0.7, 0.2, 1.3]</code><br>
<i>ReLU is a basic rule many neural nets use: if a number is negative, turn it into 0; if it’s positive, keep it.
That’s why activations “after ReLU” are always zero or positive. Example: [-0.8, 0.7, -0.1, 1.3] → [0.0, 0.7, 0.0, 1.3]</i><br><br>
<strong>Which statement is correct?</strong>
</p>

<style>
.quiz-container-sym-asym{position:relative}
.quiz-option-sym-asym{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;
  cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-sym-asym:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.quiz-radio-sym-asym{display:none}
.quiz-radio-sym-asym:checked+.quiz-option-sym-asym[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-sym-asym:checked+.quiz-option-sym-asym:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-sym-asym{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#sym-asym-correct:checked~.feedback-sym-asym[data-feedback="correct"],
#sym-asym-wrong1:checked~.feedback-sym-asym[data-feedback="wrong1"],
#sym-asym-wrong2:checked~.feedback-sym-asym[data-feedback="wrong2"]{display:block}
.feedback-sym-asym[data-feedback="correct"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.feedback-sym-asym[data-feedback="wrong1"], .feedback-sym-asym[data-feedback="wrong2"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div class="quiz-container-sym-asym">
  <input type="radio" name="quiz-sym-asym" id="sym-asym-correct" class="quiz-radio-sym-asym">
  <label for="sym-asym-correct" class="quiz-option-sym-asym" data-correct="true">
    ⚖️ Use symmetric for weights, asymmetric for activations
  </label>

  <input type="radio" name="quiz-sym-asym" id="sym-asym-wrong1" class="quiz-radio-sym-asym">
  <label for="sym-asym-wrong1" class="quiz-option-sym-asym" data-correct="false">
    🔄 Use asymmetric for both
  </label>

  <input type="radio" name="quiz-sym-asym" id="sym-asym-wrong2" class="quiz-radio-sym-asym">
  <label for="sym-asym-wrong2" class="quiz-option-sym-asym" data-correct="false">
    ➡️ Use symmetric for both
  </label>

  <div class="feedback-sym-asym" data-feedback="correct">
    ✅ <strong>Correct!</strong> Symmetric works well for zero-centered data (weights). Asymmetric handles non-centered distributions (ReLU activations are always ≥0) by using a zero-point offset to focus precision where the data actually lives.
  </div>
  <div class="feedback-sym-asym" data-feedback="wrong1">
    ❌ Asymmetric adds overhead (storing zero-points). It's not needed when data is already centered around zero—symmetric is faster and works great for weights.
  </div>
  <div class="feedback-sym-asym" data-feedback="wrong2">
    ❌ Symmetric wastes precision on always-positive data because half the range (negative values) is unused. For ReLU activations, asymmetric lets you focus all your bits on the positive range.
  </div>
</div>
</div>

### Granularity

Imagine that you’re measuring lots of things:

* some are **tiny** (like paperclips)
* some are **big** (like tables)

If everyone must use the **same ruler** with big markings (say, only centimeters), you’ll lose detail when measuring small things.

That’s what happens in quantization:

* **The integer `q`** is like writing down a measurement using only a small set of allowed numbers (e.g., 0–15 for INT4).
* **The scale** is the ruler that says what “1 step” means (like “one step = 1 cm” or “one step = 1 mm”).

#### How granularity changes it?

Inside a Neural Network you store information such as weights inside of "Tensors" (multi-dimensional lists/arrays of numbers).

You can visualize a Neural Network as many of these tensors put together: 

![neural-network.png](images/neural-network.png)

And each tensor can be broken into smaller parts:

![per-channel.png](images/per-channel.png)

Granularity is simply: **how many values share the same ruler (scale)**.

* **Per-tensor:** *one ruler for everything*

  Like measuring paperclips and tables with the same “centimeter-only” ruler → fast, but small details get lost.

* **Per-channel:** *one ruler per channel*

  Like giving each group (paperclips vs tables) their own ruler → much more accurate.

* **Group (g128/g64/g32):** *one ruler per small chunk inside a channel*

  Like splitting even further (each drawer gets its own ruler) → best fit, but you now have to keep track of many rulers (overhead/metadata).

#### Why smaller groups help (g32 > g64 > g128 for quality)

Smaller groups = fewer items forced to share one ruler, so each ruler can “fit” its chunk better → **less rounding error**.

**Group quantization** (e.g., group_size=128) is the sweet spot for INT4:
- `g128`: Good compression, acceptable accuracy
- `g64`: Better accuracy, slightly larger size
- `g32`: Best accuracy, most overhead

### How Quantization Data is Stored

A quantized model doesn't just store the quantized (low-precision) weights. It also stores the metadata needed to reconstruct the original values during inference.

**What gets saved:**
- **Quantized weights**: The actual INT4/INT8 values
- **Scales**: One per tensor, channel, or group (depending on granularity)
- **Zero-points**: For asymmetric quantization only
- **Quantization config**: Algorithm used, group size, which layers were quantized

**Example structure** (simplified):
```
model.safetensors
├── model.layers.0.self_attn.q_proj.weight      # INT4 packed weights
├── model.layers.0.self_attn.q_proj.weight_scale # FP16 scales (one per group)
├── model.layers.0.self_attn.q_proj.weight_zp   # Zero-points (if asymmetric)
└── ...
```

**The overhead trade-off:**
- Finer granularity (smaller groups) = more scales to store = larger file
- INT4 with g128 on a 7B model: ~3.5GB weights + ~50MB scales
- INT4 with g64: slightly larger due to 2x more scale values

This is why group size affects both accuracy *and* final model size.

## When Things Go Wrong

Quantization isn't magic 🪄 Sometimes it breaks things. 🫣 Here are the usual suspects:

### The Outlier Problem

Imagine you're grading on a curve, and one student scores 10,000%. Now everyone else looks like they got zero. That's what outlier activations do to quantization.

```
Normal activations: [-1.0, 0.5, -0.3, 0.8, ...]
That one outlier:       [..., 127.5, ...]  ← Ruins everything!
```

**How we fix it:**

There are some techniques or methods we can apply: 

* **SmoothQuant:** *Make activations less “spiky”* by shifting some of that extreme range into the weights, so activations are easier to quantize.
* **AWQ:** *Be extra careful with the most important parts* (the “busy” features that strongly affect output) and quantize those more gently.
* **Mixed precision:** *Don’t quantize everything* — keep the sensitive bits in FP16 and quantize the rest.

<!-- 📊 Quiz 4: Outlier Problem -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);
            padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Think About It</h3>

<p style="color:#495057;font-weight:500;">
Your INT8 model has one internal value that sometimes jumps to <strong>500</strong>, while almost all other internal values stay between <strong>-2 and 2</strong>.<br><br>
<strong>What happens to the normal values when you quantize?</strong>
</p>

<style>
.quiz-container-outlier{position:relative}
.quiz-option-outlier{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;
  cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-outlier:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.quiz-radio-outlier{display:none}
.quiz-radio-outlier:checked+.quiz-option-outlier[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-outlier:checked+.quiz-option-outlier:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-outlier{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#outlier-correct:checked~.feedback-outlier[data-feedback="correct"],
#outlier-wrong1:checked~.feedback-outlier[data-feedback="wrong1"],
#outlier-wrong2:checked~.feedback-outlier[data-feedback="wrong2"]{display:block}
.feedback-outlier[data-feedback="correct"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.feedback-outlier[data-feedback="wrong1"], .feedback-outlier[data-feedback="wrong2"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div class="quiz-container-outlier">
  <input type="radio" name="quiz-outlier" id="outlier-wrong1" class="quiz-radio-outlier">
  <label for="outlier-wrong1" class="quiz-option-outlier" data-correct="false">
    ✨ They get more precise
  </label>

  <input type="radio" name="quiz-outlier" id="outlier-correct" class="quiz-radio-outlier">
  <label for="outlier-correct" class="quiz-option-outlier" data-correct="true">
    📉 They lose precision because the scale is stretched
  </label>

  <input type="radio" name="quiz-outlier" id="outlier-wrong2" class="quiz-radio-outlier">
  <label for="outlier-wrong2" class="quiz-option-outlier" data-correct="false">
    🤷 Nothing, INT8 handles this fine
  </label>

  <div class="feedback-outlier" data-feedback="correct">
    ✅ <strong>Exactly!</strong> The scale must accommodate the outlier (500), so values like 1.5 and 1.7 might round to the same integer. You lose the ability to distinguish small differences in the normal range. This is why algorithms like SmoothQuant exist—to tame those outliers before quantization.
  </div>
  <div class="feedback-outlier" data-feedback="wrong1">
    ❌ Actually the opposite happens. With a wider scale to accommodate the outlier, the "step size" between quantized values increases, making normal values less precise.
  </div>
  <div class="feedback-outlier" data-feedback="wrong2">
    ❌ INT8 has only 256 possible values. When the scale stretches from -500 to +500 to fit the outlier, each "step" is about 4 units wide. Values like 0.5 and 1.5 both become 0. That's a problem!
  </div>
</div>
</div>

### Saturation (The Clipping Problem)

When values exceed what our format can represent, they get clipped. It's like trying to fit a giraffe in a phone booth.

```
INT8 can hold: [-128, 127]
Your value:    150 → gets squished to 127 (oops)
```

**How we fix it:**
* **Calibrate with real data:** you pick scales based on realistic value ranges, not weird edge cases.
* **Pick scales that minimize clipping:** choose a mapping where most values fit inside [-128, 127].
* **Finer granularity (smaller groups):** different parts of the model can have different typical ranges. Giving each group its own scale means a “big-range” group doesn’t force a “small-range” group to use the same scale.


## The Decision Tree

Not sure what to pick? Here's the cheat sheet:

| If this describes your situation…                 | Choose this…          |
| ------------------------------------------------- | --------------------- |
| “Keep accuracy high”                              | INT8 (W8A16)          |
| “Give me a balanced middle ground”                | INT4 with g128        |
| “I need more compression, accuracy is negotiable” | INT4 with a larger group g256 | 
| “Long chats are eating GPU memory”                | KV cache quantization |



# 🔧 LLM-Compressor

## Why LLM-Compressor?

| Feature | Why You Care |
|---------|--------------|
| **Production-tested** | Built by the vLLM team. They use it themselves |
| **HuggingFace native** | Load any Transformers model, compress, save |
| **All the algorithms** | GPTQ, AWQ, SmoothQuant, SparseGPT in one place |
| **vLLM ready** | Output models just work with your serving stack |

## The PTQ Workflow (Post-Training Quantization)

Post-Training Quantization (PTQ) compresses a model *after* it's been trained. No expensive retraining required. It's like tailoring a suit: the fabric (knowledge) is already there, you're just making it fit better.

Here's what happens under the hood:

1. **Load the model** — Start with your FP16/FP32 model
2. **Feed it calibration data** — Show the model representative inputs
3. **Learn the ranges** — Algorithm figures out typical activation values
4. **Compress with compensation** — Quantize weights while minimizing error
5. **Save the result** — Export your shiny compressed model

**Why calibration matters:** Imagine compressing a photo without knowing what's in it. You might crush the important details. Calibration data teaches the algorithm what "normal" looks like, so it knows what to preserve.

<!-- 🧮 Quiz 1: Calibration Understanding -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">
<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quick Check: Why Calibration?</h3>
<p style="margin:0 0 12px;color:#666;">Your team is quantizing a model for Canopy. Someone suggests skipping calibration data to save time. Why is this a bad idea?</p>
<style>
.quiz-container-calib{position:relative}
.quiz-option-calib{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-calib:hover{background:#e9ecef}
.quiz-radio-calib{display:none}
.quiz-radio-calib:checked+.quiz-option-calib[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-calib:checked+.quiz-option-calib:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-calib{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#calib-correct:checked~.feedback-calib[data-feedback="correct"]{display:block;background:#d4edda;color:#155724}
#calib-wrong1:checked~.feedback-calib[data-feedback="wrong1"],#calib-wrong2:checked~.feedback-calib[data-feedback="wrong2"],#calib-wrong3:checked~.feedback-calib[data-feedback="wrong3"]{display:block;background:#f8d7da;color:#721c24}
</style>
<div class="quiz-container-calib">
<input type="radio" name="quiz-calib" id="calib-wrong1" class="quiz-radio-calib">
<label for="calib-wrong1" class="quiz-option-calib" data-correct="false">📊 The model will be larger without calibration</label>
<input type="radio" name="quiz-calib" id="calib-wrong2" class="quiz-radio-calib">
<label for="calib-wrong2" class="quiz-option-calib" data-correct="false">⏱️ Inference will be slower</label>
<input type="radio" name="quiz-calib" id="calib-correct" class="quiz-radio-calib">
<label for="calib-correct" class="quiz-option-calib" data-correct="true">🎯 The algorithm won't know which values to preserve, crushing important details</label>
<input type="radio" name="quiz-calib" id="calib-wrong3" class="quiz-radio-calib">
<label for="calib-wrong3" class="quiz-option-calib" data-correct="false">🔒 Security vulnerabilities will be introduced</label>
<div class="feedback-calib" data-feedback="correct">✅ <strong>Exactly!</strong> Calibration data teaches the algorithm what "normal" looks like. Without it, the algorithm might crush the values that matter most—like compressing a photo blind.</div>
<div class="feedback-calib" data-feedback="wrong1">❌ Model size is determined by the target precision (INT4, INT8), not calibration. Calibration affects <em>quality</em>, not <em>size</em>.</div>
<div class="feedback-calib" data-feedback="wrong2">❌ Inference speed depends on the quantization scheme and hardware, not whether calibration was used.</div>
<div class="feedback-calib" data-feedback="wrong3">❌ Calibration is about accuracy preservation, not security. The real risk is crushing important information.</div>
</div>
</div>

## Pick Your Algorithm

Not all compression algorithms are created equal. Here are the main contenders each with its own personality.

### GPTQ: The Perfectionist 🎯

GPTQ stands for GPT Quantization aka a quantization approach designed for GPT models. It is the gold standard for INT4 weight quantization. If accuracy is your top priority, start here.

Imagine packing a suitcase where everything needs to fit perfectly. Naive packing just squishes everything. So some items get damaged. GPTQ is like a master packer who, after compressing one item, carefully rearranges nearby items to compensate. The result? Everything fits, nothing's crushed.

**Under the hood:**
- Processes weights layer by layer
- Uses math (Hessian matrices) to figure out which weights matter most 🧠
- After quantizing each weight, tweaks the remaining weights to compensate
- Slower, but worth it for quality

**Use it when:** Accuracy is non-negotiable!

### AWQ: The Speed Demon 🏎️

AWQ (Activation-aware Weight Quantization) is faster than GPTQ, and nearly as accurate. Won the MLSys 2024 Best Paper Award. It's not just fast, it's clever!

Imagine editing a sunset photo. If you apply the same settings everywhere, you'll either blow out the sun or lose the landscape. AWQ identifies the "highlight" channels; the weights that matter most based on activation patterns, and protects them during compression.

**Under the hood:**
- Finds "salient" channels by looking at activation magnitudes
- Scales important weights up before quantization (protects them)
- Scales activations down to balance things out
- No expensive backpropagation needed

**Use it when:** You need results today, not tomorrow

### SmoothQuant: The Equalizer ⚖️

Quantize *both* weights AND activations to INT8. This is how you get true W8A8.

**The problem:** Weights are well-behaved and easy to compress. Activations are wild—they have outliers that ruin everything.

Picture two people on a seesaw: one heavyweight (difficult activations with outliers), one lightweight (easy weights). SmoothQuant transfers some weight from the heavy side to the light side, balancing the seesaw so both can be handled equally.

**Under the hood:**
- Mathematically shifts the quantization difficulty from activations to weights
- Multiplies activations by a smoothing factor (tames the outliers)
- Divides weights by the same factor (they can absorb it)

**Use it when:** You need W8A8 for maximum throughput on INT8 hardware

### SparseGPT: The Marie Kondo 🗑️

Why just compress when you can delete? SparseGPT removes entire weights that don't contribute to accuracy, allowing you to compress what's left with GPTQ.

Like editing a novel: first cut the filler paragraphs entirely (pruning), then tighten the prose (quantization). You end up with something that's both shorter AND better.

**Under the hood:**
- Identifies weights that can be zeroed without hurting accuracy
- Uses GPTQ-style compensation to maintain quality
- Can combine sparsity + quantization for extreme compression

**Use it when:** You're going for maximum compression and have the patience to tune it

<!-- 🧮 Quiz 3: Algorithm Matching -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">
<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quick Check: The Outlier Problem</h3>
<p style="margin:0 0 12px;color:#666;">Your model has activation outliers causing quantization issues. Which algorithm specifically addresses this by "smoothing" the difficulty between weights and activations?</p>
<style>
.quiz-container-outlier{position:relative}
.quiz-option-outlier{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-outlier:hover{background:#e9ecef}
.quiz-radio-outlier{display:none}
.quiz-radio-outlier:checked+.quiz-option-outlier[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-outlier:checked+.quiz-option-outlier:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-outlier{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#outlier-correct:checked~.feedback-outlier[data-feedback="correct"]{display:block;background:#d4edda;color:#155724}
#outlier-wrong1:checked~.feedback-outlier[data-feedback="wrong1"],#outlier-wrong2:checked~.feedback-outlier[data-feedback="wrong2"],#outlier-wrong3:checked~.feedback-outlier[data-feedback="wrong3"]{display:block;background:#f8d7da;color:#721c24}
</style>
<div class="quiz-container-outlier">
<input type="radio" name="quiz-outlier" id="outlier-wrong1" class="quiz-radio-outlier">
<label for="outlier-wrong1" class="quiz-option-outlier" data-correct="false">🎯 GPTQ</label>
<input type="radio" name="quiz-outlier" id="outlier-wrong2" class="quiz-radio-outlier">
<label for="outlier-wrong2" class="quiz-option-outlier" data-correct="false">🏎️ AWQ</label>
<input type="radio" name="quiz-outlier" id="outlier-correct" class="quiz-radio-outlier">
<label for="outlier-correct" class="quiz-option-outlier" data-correct="true">⚖️ SmoothQuant</label>
<input type="radio" name="quiz-outlier" id="outlier-wrong3" class="quiz-radio-outlier">
<label for="outlier-wrong3" class="quiz-option-outlier" data-correct="false">🗑️ SparseGPT</label>
<div class="feedback-outlier" data-feedback="correct">✅ <strong>Correct!</strong> SmoothQuant transfers quantization difficulty from activations (with outliers) to weights (which are well-behaved). Like balancing a seesaw!</div>
<div class="feedback-outlier" data-feedback="wrong1">❌ GPTQ is great for accuracy but only quantizes weights. It doesn't address activation outliers directly.</div>
<div class="feedback-outlier" data-feedback="wrong2">❌ AWQ protects "salient" channels but is a weight-only method. SmoothQuant is the one that handles activation outliers.</div>
<div class="feedback-outlier" data-feedback="wrong3">❌ SparseGPT removes weights entirely (pruning), but doesn't address the activation outlier problem.</div>
</div>
</div>

## The Cheat Sheet

Still not sure? Here's the quick decision guide:

| Your Situation | Algorithm | Why |
|----------------|-----------|-----|
| "I need the best accuracy possible" | GPTQ (g128) | Gold standard error compensation |
| "I needed this done yesterday" | AWQ | Fast and good enough |
| "I want W8A8 for max throughput" | SmoothQuant | Only game in town for activation quantization |
| "Squeeze it as much as possible" | SparseGPT + GPTQ | Pruning + quantization combo |
| "Just tell me what to use" | GPTQ or AWQ | Battle-tested, vLLM loves them |

<!-- 🧮 Quiz 2: Pick the Right Algorithm -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">
<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quick Check: Algorithm Selection</h3>
<p style="margin:0 0 12px;color:#666;">It's finals week and Canopy is getting slammed with requests. You need to maximize throughput: serving as many students as possible per GPU. Which approach should you use?</p>
<style>
.quiz-container-throughput{position:relative}
.quiz-option-throughput{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-throughput:hover{background:#e9ecef}
.quiz-radio-throughput{display:none}
.quiz-radio-throughput:checked+.quiz-option-throughput[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-throughput:checked+.quiz-option-throughput:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-throughput{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#throughput-correct:checked~.feedback-throughput[data-feedback="correct"]{display:block;background:#d4edda;color:#155724}
#throughput-wrong1:checked~.feedback-throughput[data-feedback="wrong1"],#throughput-wrong2:checked~.feedback-throughput[data-feedback="wrong2"],#throughput-wrong3:checked~.feedback-throughput[data-feedback="wrong3"]{display:block;background:#f8d7da;color:#721c24}
</style>
<div class="quiz-container-throughput">
<input type="radio" name="quiz-throughput" id="throughput-wrong1" class="quiz-radio-throughput">
<label for="throughput-wrong1" class="quiz-option-throughput" data-correct="false">🎯 GPTQ with W4A16</label>
<input type="radio" name="quiz-throughput" id="throughput-wrong2" class="quiz-radio-throughput">
<label for="throughput-wrong2" class="quiz-option-throughput" data-correct="false">🏎️ AWQ</label>
<input type="radio" name="quiz-throughput" id="throughput-correct" class="quiz-radio-throughput">
<label for="throughput-correct" class="quiz-option-throughput" data-correct="true">⚖️ SmoothQuant with W8A8</label>
<input type="radio" name="quiz-throughput" id="throughput-wrong3" class="quiz-radio-throughput">
<label for="throughput-wrong3" class="quiz-option-throughput" data-correct="false">🗑️ SparseGPT</label>
<div class="feedback-throughput" data-feedback="correct">✅ <strong>Exactly!</strong> W8A8 (both weights AND activations in INT8) gives you maximum throughput because INT8 math is blazing fast on modern hardware. SmoothQuant is how you get W8A8. More students served per GPU!</div>
<div class="feedback-throughput" data-feedback="wrong1">❌ GPTQ with W4A16 is great for memory savings and latency, but for maximum throughput you want W8A8. Weight-only quantization doesn't speed up the actual computations as much.</div>
<div class="feedback-throughput" data-feedback="wrong2">❌ AWQ is fast to <em>run</em> (the compression process), but like GPTQ it's weight-only. For maximum serving throughput, you want W8A8.</div>
<div class="feedback-throughput" data-feedback="wrong3">❌ SparseGPT gives great compression, but sparsity support varies by hardware. For reliable high-throughput serving, W8A8 via SmoothQuant is the proven choice.</div>
</div>
</div>

# ⚡ Advanced Quantization: The Deployment Playbook

You've compressed a model. Now comes the real question: *which* compression for *your* situation?

This is where quantization gets strategic. The right choice depends on your hardware, your traffic patterns, and how much accuracy you're willing to trade.

## Decoding the Notation

You'll see notation like "W4A16" everywhere. Here's the decoder ring:

**WxAy** = x-bit **W**eights, y-bit **A**ctivations

| Scheme | Translation | Size Reduction | Sweet Spot |
|--------|-------------|----------------|------------|
| W8A16 | 8-bit weights, 16-bit activations | ~2x smaller | Safe choice, balanced |
| W4A16 | 4-bit weights, 16-bit activations | ~3.5x smaller | Edge devices, latency-critical |
| W8A8 | 8-bit everything | ~2x smaller | High-throughput servers |

## Weight-Only vs. Full Quantization

Here's where it gets interesting. There are two philosophies:

### The "Just Compress the Weights" Approach (W4A16 / W8A16)

Store weights as INT4/INT8, but run math in FP16. It's like storing your photos as compressed JPEGs but editing them in RAW.

**Why it works:**
- Weights are static—compress once, benefit forever
- Activations stay precise—no accuracy hit from math errors
- Memory savings unlock bigger KV caches = more parallel requests

**The numbers:** Up to ~1.5–2.5× depending on model and GPU. Perfect for "one student at a time" scenarios.

### The "Compress Everything" Approach (W8A8)

Both weights AND activations in INT8. This is the throughput play.

**Why it works:**
- INT8 math is *fast* on modern hardware
- More students per GPU at peak hours
- INT8 models often deliver ~1.8–2× throughput over FP16, allowing large models to run on fewer GPUs.

**The catch:** You need SmoothQuant to tame those activation outliers.

### When to Use Which?

Here's the decision framework:

| Traffic Pattern | Best Choice | Why |
|-----------------|-------------|-----|
| Single student, fast response needed | W4A16 | Memory-bound, latency wins |
| Lots of students, peak hours | W8A8 | Compute-bound, throughput wins |
| "I don't know yet" | W8A16 | Safe default, good balance |

**The crossover point:** At low batch sizes, weight-only wins. At high batch sizes, W8A8 wins. Your mileage varies by hardware.

## Group Size: The Precision Dial

Remember how we mentioned scales—those little numbers that help reconstruct the original values? Group size determines how many weights share a single scale.

**Smaller group = more scales = better accuracy = bigger file**

Think of it like resolution in an image:

| Group Size | Quality | Overhead | When to Use |
|------------|---------|----------|-------------|
| 32 | 🏆 Best | Highest | Rarely worth it |
| 64 | ⭐ Better | Higher | Math-heavy tasks, code generation |
| **128** | ✅ Good | Balanced | **Start here (the default)** |
| 1024 | 🔽 Lower | Minimal | When speed trumps everything |

**From the research:** Smaller groups (e.g., per-channel or g32) give the best accuracy. g128 is the standard balance point.
Larger groups like g1024 reduce metadata but typically increase perplexity by ~0.1–0.3 depending on model.

**The rule:** Start with g128. Only go to g64 if your benchmarks scream for mercy on math or code tasks.

## Output Formats: Where Will This Model Live?

You've compressed the model. Now: what file format?

This isn't just about file extensions—it's about *where* and *how* you'll serve the model.

### SafeTensors: The GPU Standard 🖥️

Created by HuggingFace for production GPU serving. This is what vLLM expects.

| Why It's Good | The Details |
|---------------|-------------|
| **Secure** | No vulnerabilities (your security team will thank you) |
| **Fast loading** | Lazy-loading and memory mapping |
| **Ecosystem** | HuggingFace, vLLM, TensorRT-LLM all speak it |

**Use it for:** Anything running on GPUs in your cluster.

### GGUF: The Edge Format 📱

Created by Georgi Gerganov for llama.cpp. This is how you run models on laptops, phones, and that Raspberry Pi in the corner.

| Why It's Good | The Details |
|---------------|-------------|
| **CPU-optimized** | Built for inference without GPUs |
| **Flexible quantization** | Q4_K_M, Q5_K_M, Q8_0—lots of options |
| **Single file** | One file = easy to distribute |

**Use it for:** Ollama, llama.cpp, edge devices, offline deployments.

### The Quick Reference

| Where's the Model Going? | Format |
|--------------------------|--------|
| vLLM on Kubernetes | SafeTensors |
| TensorRT-LLM | SafeTensors |
| Ollama / llama.cpp | GGUF |
| Edge device (CPU) | GGUF |
| Future fine-tuning | SafeTensors |

**The workflow:** Compress with llm-compressor → SafeTensors for GPU. Only convert to GGUF if you're deploying to CPU/edge.

<!-- 📦 Quiz: Output Format Selection -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">
<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quick Check: Format Selection</h3>
<p style="margin:0 0 12px;color:#666;">Your team has quantized a model for Canopy. One developer wants to use GGUF because "it's a single file and easier to manage." But Canopy runs on vLLM in your Kubernetes cluster. What should you tell them?</p>
<style>
.quiz-container-format{position:relative}
.quiz-option-format{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-format:hover{background:#e9ecef}
.quiz-radio-format{display:none}
.quiz-radio-format:checked+.quiz-option-format[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-format:checked+.quiz-option-format:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-format{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#format-correct:checked~.feedback-format[data-feedback="correct"]{display:block;background:#d4edda;color:#155724}
#format-wrong1:checked~.feedback-format[data-feedback="wrong1"],#format-wrong2:checked~.feedback-format[data-feedback="wrong2"],#format-wrong3:checked~.feedback-format[data-feedback="wrong3"]{display:block;background:#f8d7da;color:#721c24}
</style>
<div class="quiz-container-format">
<input type="radio" name="quiz-format" id="format-wrong1" class="quiz-radio-format">
<label for="format-wrong1" class="quiz-option-format" data-correct="false">📱 GGUF is fine—single file is easier to deploy</label>
<input type="radio" name="quiz-format" id="format-correct" class="quiz-radio-format">
<label for="format-correct" class="quiz-option-format" data-correct="true">🖥️ Use SafeTensors—it's what vLLM expects for GPU serving</label>
<input type="radio" name="quiz-format" id="format-wrong2" class="quiz-radio-format">
<label for="format-wrong2" class="quiz-option-format" data-correct="false">🤷 Either works, just pick one</label>
<input type="radio" name="quiz-format" id="format-wrong3" class="quiz-radio-format">
<label for="format-wrong3" class="quiz-option-format" data-correct="false">📦 Convert to both and let vLLM choose</label>
<div class="feedback-format" data-feedback="correct">✅ <strong>Exactly!</strong> GGUF is optimized for CPU inference (llama.cpp, Ollama). vLLM on Kubernetes expects SafeTensors. Using the wrong format means either it won't load or you'll lose performance benefits.</div>
<div class="feedback-format" data-feedback="wrong1">❌ GGUF is great for llama.cpp and Ollama, but vLLM expects SafeTensors. You'd lose GPU optimizations or fail to load entirely.</div>
<div class="feedback-format" data-feedback="wrong2">❌ Format matters! GGUF is CPU-optimized, SafeTensors is GPU-optimized. Wrong choice = wrong performance or incompatibility.</div>
<div class="feedback-format" data-feedback="wrong3">❌ vLLM won't auto-select—it expects SafeTensors. Extra formats just waste storage.</div>
</div>
</div>