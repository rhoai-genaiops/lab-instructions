# 📊 Evaluation: Prove It Works

You've compressed your model. Your gut says it's fine.

But "gut feeling" doesn't fly in production. You need numbers. You need benchmarks. You need *evidence*.

Enter [lm-evaluation-harness](https://github.com/EleutherAI/lm-evaluation-harness)—the same tool that powers HuggingFace's Open LLM Leaderboard. If it's good enough for NVIDIA and Cohere, it's good enough for us.

## The Two-Stage Testing Philosophy

Here's the thing about quantized models: they can pass standardized tests with flying colors and still break your application in weird ways. So we test twice.

| Stage | What You're Testing | How |
|-------|---------------------|-----|
| **Stage 1** | Does the model still *know* things? | Benchmarks (this section) |
| **Stage 2** | Does it work in *your* application? | Test Canopy flows (next section) |

This section covers Stage 1. You'll run Stage 2 when you update Canopy to use the quantized model.

## Stage 1: Does the Model Still Know Things? 📚

First, verify the model didn't lose its mind during compression.

| What to Test | Why It Matters | How to Test |
|--------------|----------------|-------------|
| Perplexity | Basic language competence | lm-evaluation-harness |
| Task benchmarks | Knowledge retention | MMLU, HellaSwag, GSM8K |
| Your domain | Performance on *your* data | Custom eval sets |

### Perplexity: The Sanity Check

Perplexity measures how "surprised" a model is by text. Given a sequence of words, how well does it predict what comes next?

- **Lower perplexity = better model** (less surprised by real text)
- **How it works:** The model sees text and predicts each word. If it assigns high probability to the correct word, perplexity goes down.
- **What it catches:** Severe compression damage. If perplexity spikes after quantization, something fundamental broke.

Think of it like a reading comprehension baseline—if the model can't predict common word sequences, it's probably not going to answer questions well either.

### The Benchmark Menu

These are the tests that matter—the same ones used on the Open LLM Leaderboard:

| Benchmark | What It Tests | Why It Matters for Quantization |
|-----------|---------------|--------------------------------|
| **MMLU** | 57 academic subjects | Did the model forget what it learned? |
| **HellaSwag** | Commonsense inference | Humans ace this (~95%), models struggle |
| **ARC-Challenge** | Grade-school science | Can it still reason under compression? |
| **Winogrande** | Pronoun resolution | Basic language understanding intact? |
| **GSM8K** | Math word problems | Most sensitive to quantization |
| **TruthfulQA** | Factual accuracy | Still avoiding hallucinations? |
| **HumanEval** | Python coding problems | Generate code |
| **MBPP** | Basic Python programming tasks | Generate code |

#### How Benchmarks Actually Work

For **multiple-choice** benchmarks, the model doesn't "pick A, B, C, or D." Instead, you feed each possible completion to the model and measure which one has the lowest perplexity. The model essentially rates how natural each answer sounds given the question.

For **generative** benchmarks (like GSM8K), the model produces an answer, and you check if it matches the correct solution—usually with some parsing to extract the final number.

For **coding** benchmarks (like HumanEval), the model generates a function body, and the test harness runs it against test cases. If the code executes correctly and produces the right output, it passes.

### Which Tasks Feel the Pain?

Not all benchmarks are created equal when it comes to quantization sensitivity:

| Sensitivity | Benchmarks | Why |
|-------------|------------|-----|
| 🔴 **High** | GSM8K, math tasks | Numeric precision matters—compression hurts |
| 🟡 **Medium** | MMLU, ARC | Knowledge retrieval—some degradation |
| 🟢 **Low** | HellaSwag, Winogrande | Pattern matching—pretty robust |

**The warning:** If you're doing math tutoring with Canopy, watch GSM8K like a hawk. It's usually the first to show cracks.

## What the Research Actually Says

Here's the good news: large-scale studies show quantization works better than you'd fear.

### The Headlines

All quantization schemes recover **over 99%** of baseline accuracy on OpenLLM Leaderboard benchmarks. Here's the breakdown:

| Precision | What to Expect |
|-----------|----------------|
| **INT8** | Nearly lossless—less than 0.5% drop |
| **INT4** | 1-3% degradation is typical |
| **70B+ models** | More resilient (bigger = better cushion) |
| **8B models** | More variability, but still usable |

### The Plot Twist: Answer Flipping

Here's something that'll keep you up at night. Even when aggregate accuracy stays within 1% of baseline:

- Some correct answers become *incorrect*
- Some incorrect answers become *correct*
- On math tasks, 12-30% of answers "flip"

**What this means:** The average looks fine, but individual questions behave differently. Don't just check the summary score—test your actual use cases.

### Which Algorithm Wins?

| Algorithm | Accuracy Retention | The Verdict |
|-----------|-------------------|-------------|
| AWQ | Higher | More stable across tasks |
| GPTQ | Slightly lower | More variability on GSM8K, ARC |
| Q5_K_M (GGUF) | Sweet spot | Best trade-off for most use cases |
| Q3_K_M (GGUF) | Risky | Significant degradation—use carefully |

### About Those "Emergent Abilities"

The upside: Studies show that key capabilities—such as in-context learning, chain-of-thought reasoning, and instruction following—remain intact under INT4 quantization.

The downside: At 2 bits, these abilities degrade severely. Anything below 4-bit isn't viable for meaningful workloads.

## Running Your Own Evaluations

### 🧪 Time to Get Your Hands Dirty

Enough theory—let's actually compare a quantized model against its baseline.

Go to your workbench and open up **`experiments/10-model-optimization/4-evaluation.ipynb`**

In this exercise, you'll use `lm-evaluation-harness` to run the same benchmark against two deployed models and compare the results.

**What you'll do:**

1. **Configure endpoints** — Point lm_eval at both the unquantized and FP8 quantized Llama models
2. **Run MMLU benchmarks** — Test both models on the same academic questions
3. **Compare results** — See the actual accuracy difference side-by-side
4. **Interpret the impact** — Understand what the numbers mean for your deployment decision

**What you'll learn:**

- How `lm_eval` works with remote OpenAI-compatible APIs (like vLLM)
- Why we limit concurrency when multiple users share endpoints
- How to read benchmark results and calculate accuracy deltas

When you're done, come back and we'll cover the decision framework for shipping.

### Testing a Deployed Model

lm-evaluation-harness can hit your model's API endpoint directly:

```bash
lm_eval --model local-completions \
        --model_args base_url=https://llama32-fp8-ai501.<CLUSTER_DOMAIN>/v1/completions,tokenizer=RedHatAI/Llama-3.2-3B-Instruct-FP8 \
        --tasks hellaswag,winogrande,arc_easy \
        --limit 100
```

### Don't Have All Day? Use tinyBenchmarks

Full benchmarks have tens of thousands of questions. tinyBenchmarks cherry-picks the most informative ones:

| Benchmark | Full Size | tinyBenchmarks |
|-----------|-----------|----------------|
| MMLU | 14,000+ questions | ~100 questions |
| All 6 benchmarks | 50,000+ questions | <3% of the total |

Same accuracy estimates, fraction of the time. Perfect for quick validation during development.

## The Decision Framework

### General Thresholds

When should you ship? Here's the rule of thumb:

| Accuracy Drop | Verdict | What to Do |
|---------------|---------|------------|
| <1% | ✅ **Ship it** | Deploy with confidence |
| 1-3% | ⚠️ **Acceptable** | Deploy, but monitor closely |
| 3-5% | 🔍 **Marginal** | A/B test with real users |
| >5% | ❌ **Too much** | Try INT8 or smaller group size |

### Task-Specific Thresholds

If Canopy is helping with specific tasks, apply stricter standards:

| What Canopy Does | Max Acceptable Drop |
|------------------|---------------------|
| Math tutoring | <2% on GSM8K |
| Code help | <2% on HumanEval |
| General chat | <5% average |
| Summarization | <3% on MMLU |

<!-- 📊 Quiz: Ship or Not? -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">
<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quick Check: Ship or Not?</h3>
<p style="margin:0 0 12px;color:#666;">Your team quantized a model to INT4. Benchmark results show: 4% drop on GSM8K, 1% drop on MMLU, 1% drop on HellaSwag. Canopy is being used as a math tutoring assistant. Should you ship this model?</p>
<style>
.quiz-container-ship{position:relative}
.quiz-option-ship{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-ship:hover{background:#e9ecef}
.quiz-radio-ship{display:none}
.quiz-radio-ship:checked+.quiz-option-ship[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-ship:checked+.quiz-option-ship:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-ship{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#ship-correct:checked~.feedback-ship[data-feedback="correct"]{display:block;background:#d4edda;color:#155724}
#ship-wrong1:checked~.feedback-ship[data-feedback="wrong1"],#ship-wrong2:checked~.feedback-ship[data-feedback="wrong2"],#ship-wrong3:checked~.feedback-ship[data-feedback="wrong3"]{display:block;background:#f8d7da;color:#721c24}
</style>
<div class="quiz-container-ship">
<input type="radio" name="quiz-ship" id="ship-wrong1" class="quiz-radio-ship">
<label for="ship-wrong1" class="quiz-option-ship" data-correct="false">✅ Ship it—the average drop is only ~2%, which is acceptable</label>
<input type="radio" name="quiz-ship" id="ship-wrong2" class="quiz-radio-ship">
<label for="ship-wrong2" class="quiz-option-ship" data-correct="false">⚠️ Ship and monitor—1-3% overall is within acceptable range</label>
<input type="radio" name="quiz-ship" id="ship-correct" class="quiz-radio-ship">
<label for="ship-correct" class="quiz-option-ship" data-correct="true">❌ Don't ship—4% GSM8K drop exceeds the 2% threshold for math tutoring</label>
<input type="radio" name="quiz-ship" id="ship-wrong3" class="quiz-radio-ship">
<label for="ship-wrong3" class="quiz-option-ship" data-correct="false">🔍 Run more benchmarks before deciding</label>
<div class="feedback-ship" data-feedback="correct">✅ <strong>Correct!</strong> Task-specific thresholds matter more than averages. For math tutoring, GSM8K is the critical benchmark—and 4% exceeds your 2% threshold. Try INT8 or a smaller group size (g64) to recover accuracy on math tasks.</div>
<div class="feedback-ship" data-feedback="wrong1">❌ Averaging hides the problem! For math tutoring, GSM8K is the benchmark that matters—and 4% is double your acceptable threshold.</div>
<div class="feedback-ship" data-feedback="wrong2">❌ The general thresholds don't apply here. Since Canopy is specifically for math tutoring, GSM8K's 4% drop exceeds the task-specific 2% limit.</div>
<div class="feedback-ship" data-feedback="wrong3">❌ You already have the data you need. GSM8K is the right benchmark for math tutoring—and it's clearly above threshold. More benchmarks won't change the decision.</div>
</div>
</div>

## The Decision Matrix

Put it all together in a comparison table:

| Model Variant | Size | GSM8K | MMLU | HellaSwag | Avg Drop | Ship It? |
|---------------|------|-------|------|-----------|----------|----------|
| FP16 (baseline) | 6.4 GB | 0.412 | 0.654 | 0.762 | — | Reference |
| INT8 | 3.2 GB | 0.405 | 0.651 | 0.759 | -0.8% | ✅ Yes |
| INT4 g128 | 1.8 GB | 0.389 | 0.640 | 0.751 | -2.5% | ⚠️ Monitor |
| INT4 g64 | 2.0 GB | 0.398 | 0.647 | 0.755 | -1.5% | ✅ Yes |

## But Wait—Stage 1 Isn't Enough

<!-- 🧪 Quiz: The Testing Trap -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">
<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quick Check: The Testing Trap</h3>
<p style="margin:0 0 12px;color:#666;">Your quantized model scores 98% on MMLU and passes all standard benchmarks. You deploy it to production. A week later, students complain that Canopy is ignoring their prompts and returning malformed JSON. What went wrong?</p>
<style>
.quiz-container-testing{position:relative}
.quiz-option-testing{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-testing:hover{background:#e9ecef}
.quiz-radio-testing{display:none}
.quiz-radio-testing:checked+.quiz-option-testing[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-testing:checked+.quiz-option-testing:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.feedback-testing{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#testing-correct:checked~.feedback-testing[data-feedback="correct"]{display:block;background:#d4edda;color:#155724}
#testing-wrong1:checked~.feedback-testing[data-feedback="wrong1"],#testing-wrong2:checked~.feedback-testing[data-feedback="wrong2"],#testing-wrong3:checked~.feedback-testing[data-feedback="wrong3"]{display:block;background:#f8d7da;color:#721c24}
</style>
<div class="quiz-container-testing">
<input type="radio" name="quiz-testing" id="testing-wrong1" class="quiz-radio-testing">
<label for="testing-wrong1" class="quiz-option-testing" data-correct="false">📊 The benchmarks were too easy—you should have used harder tests</label>
<input type="radio" name="quiz-testing" id="testing-correct" class="quiz-radio-testing">
<label for="testing-correct" class="quiz-option-testing" data-correct="true">🧪 You only tested Stage 1 (knowledge) but skipped Stage 2 (application flows)</label>
<input type="radio" name="quiz-testing" id="testing-wrong2" class="quiz-radio-testing">
<label for="testing-wrong2" class="quiz-option-testing" data-correct="false">🔢 The model needed a smaller group size</label>
<input type="radio" name="quiz-testing" id="testing-wrong3" class="quiz-radio-testing">
<label for="testing-wrong3" class="quiz-option-testing" data-correct="false">⏱️ You deployed too quickly—should have waited longer</label>
<div class="feedback-testing" data-feedback="correct">✅ <strong>Exactly!</strong> Benchmark scores test knowledge retention, but quantization can break instruction-following and output formatting in ways benchmarks don't catch. Always test your actual application flows—system prompts, tool calling, JSON output—before deploying.</div>
<div class="feedback-testing" data-feedback="wrong1">❌ MMLU is already challenging. The problem isn't test difficulty—it's that benchmarks measure different things than application behavior.</div>
<div class="feedback-testing" data-feedback="wrong2">❌ Group size affects accuracy, but the issue here is <em>what</em> you tested, not <em>how</em> you quantized.</div>
<div class="feedback-testing" data-feedback="wrong3">❌ Timing isn't the issue. You could wait a year and still hit this problem if you only run benchmark tests.</div>
</div>
</div>

**The takeaway:** Benchmarks verify the model still *knows* things. But you also need to verify it still *works* in your application. That's Stage 2—and you'll do it in the next section when you update Canopy to use the quantized model.
