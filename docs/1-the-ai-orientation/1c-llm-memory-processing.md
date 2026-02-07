# 🧠 Memory and Processing in LLMs :id=memory-and-processing-in-llms

## 📚 Contents :id=contents
- [🧠 Memory and Processing in LLMs](#memory-and-processing-in-llms)
  - [📚 Contents](#contents)
  - [👀 Attention Mechanism](#attention-mechanism)
  - [⚡ KV Cache and Performance](#kv-cache-and-performance)

## 👀 Attention Mechanism :id=attention-mechanism

How does a language model know which part of a sentence matters most? That’s where **attention** comes in.

Attention is like a spotlight — it helps the model focus on the most important words when generating a response.

Example:
> "When the student finished the exam, they felt relieved."

To understand “they,” the model pays attention to “the student.”

It doesn’t just look at the last word — it looks back and figures out which word makes the most sense.

That’s what makes LLMs feel smart: they can keep track of meaning across long stretches of text.

<img src="https://huggingface.co/datasets/agents-course/course-images/resolve/main/en/unit1/AttentionSceneFinal.gif" alt="Visual Gif of Attention" width="60%">

Let’s try a quiz to see how this works:

<!-- 👀 Attention – who gets the weight? -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);
            padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">👀 Quiz</h3>

<p style="color:#495057;font-weight:500;">
The model is about to generate the <em>underlined</em> word:<br>
“<u>surprised</u> the crowd with a thunderous drum roll.”<br>
Prompt so far:
</p>

<p style="border-left:3px solid #bbb;padding-left:10px;margin:8px 0;color:#444;">
“The <b>drummer</b> practiced quietly backstage while the <b>singer</b> warmed up.  
Just before the <b>finale</b>, the <b>drummer</b> nodded and then..."
</p>

<p style="color:#495057;font-weight:500;">
Which earlier token will the attention mechanism give the <b>highest weight</b> to when predicting “surprised”?</p>

<style>
.attnOpt{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;
        border:2px solid #e9ecef;color:#495057;transition:.2s}
.attnOpt:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.attnRadio{display:none}
.attnRadio:checked + .attnOpt[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.attnRadio:checked + .attnOpt[data-correct="false"]{background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.attnFeed{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#attn-good:checked ~ .attnFeed[data-type="good"],
#attn-w1:checked  ~ .attnFeed[data-type="bad1"],
#attn-w2:checked  ~ .attnFeed[data-type="bad2"]{display:block}
.attnFeed[data-type="good"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.attnFeed[data-type="bad1"], .attnFeed[data-type="bad2"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div>
  <input type="radio" id="attn-w1" name="attn" class="attnRadio">
  <label for="attn-w1" class="attnOpt" data-correct="false">
    🎤 “singer”
  </label>

  <input type="radio" id="attn-good" name="attn" class="attnRadio">
  <label for="attn-good" class="attnOpt" data-correct="true">
    🥁 “drummer”
  </label>

  <input type="radio" id="attn-w2" name="attn" class="attnRadio">
  <label for="attn-w2" class="attnOpt" data-correct="false">
    🏟️ “crowd”
  </label>

  <div class="attnFeed" data-type="good">
    ✅ Correct — attention focuses on the token that makes the sentence coherent: the <b>drummer</b> is the one doing the surprising.
  </div>
  <div class="attnFeed" data-type="bad1">
    ❌ The "singer" was mentioned earlier but isn't the active subject in this context.
  </div>
  <div class="attnFeed" data-type="bad2">
    ❌ "Crowd" appears later in the sentence and isn't the actor.
  </div>
</div>
</div>

---

## ⚡ KV Cache and Performance :id=kv-cache-and-performance

Generating answers can take time — especially for long responses. So how do LLMs stay fast?

They use something called a **KV cache** — short for *Key-Value cache*.

Instead of starting from scratch for every word it generates, the model saves what it already computed (its “thinking so far”) and reuses it. Like keeping notes on a scratchpad.

This saves a huge amount of time.

![KV Cache Autoregression Diagram](https://huggingface.co/datasets/huggingface/documentation-images/resolve/main/blog/kv-cache/autoregression.png)

Benefits:

- Faster responses
- Less repeated work
- Smoother experience in chat apps
- Makes streaming outputs possible (like showing text word-by-word)

These benefits comes at the cost of more GPU memory required though, as we now need to save all these computations somewhere.

However, calculating how much extra memory we need for the KV Cache can be a bit tricky.  
Luckily for us, there are tools we can use to calculate it for some specific models, try out this one for example:  [https://lmcache.ai/kv_cache_calculator.html](https://lmcache.ai/kv_cache_calculator.html)

<!-- ⚡ KV cache – concept focus -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);
            padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">⚡ Quiz</h3>

<p style="color:#495057;font-weight:500;">
With KV-cache ON, 1 000 tokens stream in 2 s.  
Cache OFF → 6 s.<br>
<strong>What was actually cached, and why does it speed things up?</strong>
</p>

<style>
.kvOpt{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;
       border:2px solid #e9ecef;color:#495057;transition:.2s}
.kvOpt:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.kvRadio{display:none}
.kvRadio:checked + .kvOpt[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.kvRadio:checked + .kvOpt[data-correct="false"]{background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.kvFeed{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#kv-good:checked ~ .kvFeed[data-type="good"],
#kv-w1:checked  ~ .kvFeed[data-type="bad1"],
#kv-w2:checked  ~ .kvFeed[data-type="bad2"]{display:block}
.kvFeed[data-type="good"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.kvFeed[data-type="bad1"], .kvFeed[data-type="bad2"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div>
  <input type="radio" id="kv-w1" name="kv" class="kvRadio">
  <label for="kv-w1" class="kvOpt" data-correct="false">
    📝 A copy of every output token so they don’t need to be regenerated.
  </label>

  <input type="radio" id="kv-good" name="kv" class="kvRadio">
  <label for="kv-good" class="kvOpt" data-correct="true">
    🔑 The results of attention for earlier tokens, so each new step reuses them instead of recalculating.
  </label>

  <input type="radio" id="kv-w2" name="kv" class="kvRadio">
  <label for="kv-w2" class="kvOpt" data-correct="false">
    📉 Compressed token-embeddings that only reduce memory, not compute.
  </label>

  <div class="kvFeed" data-type="good">
    ✅ Exactly, KV-cache keeps a "cheat-sheet" of attention results for all internal parts of the model. With it, every new token is almost free; without it, the model re-does heavy math for <em>all</em> previous tokens.
  </div>
  <div class="kvFeed" data-type="bad1">
    ❌ Storing and picking between every possible variation/combinations of tokens seem more expensive than just generating them 😩
  </div>
  <div class="kvFeed" data-type="bad2">
    ❌ While KV-cache does use memory, the main benefit is computational speed, not just memory efficiency.
  </div>
</div>
</div>

[🔝 Back to Contents](#contents)