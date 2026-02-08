# 🧮 Understanding Quantization

## The Problem: Great Models, Expensive Hardware

You tried Tiny Llama, but you were not so happy. And earlier you had this shiny big model that answers student questions beautifully. Why can't we have it again? But it needs 14GB of GPU memory, and your deployment budget says "absolutely not." 😭😭😭

Welcome to quantization!! The art of making models smaller without making them dumber.

Think of it like compression for your model's brain. Instead of storing every weight as a precise 16-bit number, we round them to 8 or even 4 bits. It's like the difference between keeping exact change ($14.37) versus rounding to the nearest dollar ($14). You lose some precision, but your wallet gets a lot lighter.

For Canopy, this means we can serve more students with the same hardware, respond faster, and maybe even run on that "spare" GPU that IT forgot about.

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

<!-- 🧮 Quiz 1: Memory calculation -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);
            padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quick Check</h3>

<p style="color:#495057;font-weight:500;">
A 7B parameter model in FP32 uses <strong>28GB</strong> of memory.<br>
How much memory would the <strong>INT4</strong> version need?
</p>

<style>
.quiz-container-mem-calc{position:relative}
.quiz-option-mem-calc{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;
  cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-mem-calc:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.quiz-radio-mem-calc{display:none}
.quiz-radio-mem-calc:checked+.quiz-option-mem-calc[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-mem-calc:checked+.quiz-option-mem-calc:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-mem-calc{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#mem-calc-correct:checked~.feedback-mem-calc[data-feedback="correct"],
#mem-calc-wrong1:checked~.feedback-mem-calc[data-feedback="wrong1"],
#mem-calc-wrong2:checked~.feedback-mem-calc[data-feedback="wrong2"]{display:block}
.feedback-mem-calc[data-feedback="correct"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.feedback-mem-calc[data-feedback="wrong1"], .feedback-mem-calc[data-feedback="wrong2"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div class="quiz-container-mem-calc">
  <input type="radio" name="quiz-mem-calc" id="mem-calc-wrong1" class="quiz-radio-mem-calc">
  <label for="mem-calc-wrong1" class="quiz-option-mem-calc" data-correct="false">
    📊 14GB
  </label>

  <input type="radio" name="quiz-mem-calc" id="mem-calc-wrong2" class="quiz-radio-mem-calc">
  <label for="mem-calc-wrong2" class="quiz-option-mem-calc" data-correct="false">
    📊 7GB
  </label>

  <input type="radio" name="quiz-mem-calc" id="mem-calc-correct" class="quiz-radio-mem-calc">
  <label for="mem-calc-correct" class="quiz-option-mem-calc" data-correct="true">
    📊 3.5GB
  </label>

  <div class="feedback-mem-calc" data-feedback="correct">
    ✅ <strong>Correct!</strong> INT4 is 12.5% of FP32 (4 bits vs 32 bits), so 28GB × 0.125 = 3.5GB. That's a 8x reduction!
  </div>
  <div class="feedback-mem-calc" data-feedback="wrong1">
    ❌ That's FP16 (half of FP32). INT4 is even smaller—it's only 4 bits vs FP32's 32 bits!
  </div>
  <div class="feedback-mem-calc" data-feedback="wrong2">
    ❌ That would be INT8. Keep going! INT4 is half of INT8.
  </div>
</div>
</div>

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



## 🎯 Ready to Actually Do This?

Enought background, let's look at some specific methods and get hands-on!

Continue to the next chapter to see how we can implement this 🪄
