# 🧠 Memory and Processing in LLMs

## 📚 Contents
- [🧠 Memory and Processing in LLMs](#-memory-and-processing-in-llms)
  - [📚 Contents](#-contents)
  - [👀 Attention Mechanism](#-attention-mechanism)
  - [🧠 Context Length and Window](#-context-length-and-window)
  - [⚡ KV Cache and Performance](#-kv-cache-and-performance)

## 👀 Attention Mechanism

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
#attn-w1:checked  ~ .attnFeed[data-type="bad"],
#attn-w2:checked  ~ .attnFeed[data-type="bad"]{display:block}
.attnFeed[data-type="good"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.attnFeed[data-type="bad"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
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
  <div class="attnFeed" data-type="bad">
    ❌ Remember: attention gives the highest weight to the token most relevant to the word being generated, not just the most recent or random noun.
  </div>
</div>
</div>


---

## 🧠 Context Length and Window

  LLMs don’t have infinite memory. When you send a message, the model needs room to:

  - Read your prompt
  - Think through it
  - And generate a response

  That whole process happens inside a fixed space called the **context window**.

  Think of it like a whiteboard. If you write too much — either in your question or in the answer you expect — the board runs out of space. The model might give up or cut things off.

  Typical context window sizes:

  - Small models: 2,000–4,000 tokens
  - Bigger models: 8,000–128,000 tokens
  - Some cutting-edge models: even more!

  So when you send a really long prompt, or ask for a really long answer, you can run into the model’s limits.

  There’s also something you can control yourself called `max_tokens`. This tells the model “Only give me up to this many tokens in your answer.”

  It’s like giving the model a writing limit. Let's try this:

  Ask the model `I need a Spanish tortilla recipe.` and change the `max_token` until you get a delicious recipe 🇪🇸

<div class="iframe-scroll-container">
  <iframe 
    src="https://gradio-app-ai501.<CLUSTER_DOMAIN>/context-demo"  
    width="600px" 
    height="700px" 
    frameborder="0"
    style="border: 1px solid transparent; border-radius: 1px;">
  </iframe>
</div>

  What is the number you are happy with?

  But remember — the model’s total capacity doesn’t change. The context window is fixed, and it includes both:

  - The input (your prompt)
  - The output (the model’s response, up to max_tokens)

  So if you set `max_tokens` too high, and your input is already long, the model might not have enough room — and it could return an error.

  So maybe you want to be more sophisticated and ask the model with a bit more details. Send this next and see what happens:

  ```
  I'm interested in learning how to make an authentic Spanish tortilla de patatas, also known as a Spanish omelette. 
  Could you please provide a step-by-step recipe, including ingredients, preparation tips, and cooking techniques that reflect the traditional way it's made in Spain?
  ```

<div class="iframe-scroll-container">
  <iframe 
    src="https://gradio-app-ai501.<CLUSTER_DOMAIN>/max-length-demo"  
    width="600px" 
    height="700px" 
    frameborder="0"
    style="border: 1px solid transparent; border-radius: 1px;">
  </iframe>
</div>

 Uh-oh. You probably got an error message. Why?

  The model has a limited memory space — a fixed number of tokens it can handle per request. That space has to fit:

  - Your prompt (the question or instruction), plus

  - The answer it’s going to generate

  In this case, your longer question already took up a big chunk of that space. On top of that, the model was asked to generate a long, detailed recipe — and it simply didn’t have room to do both. So it gave up and returned an error.

  Again, this space limit is called the maximum context length. It's something set when the model is started, and it affects how much input and output the model can handle together.

  Setting it too high might waste memory; setting it too low might truncate outputs or fail to serve longer prompts.


<!-- 🧠 Context window – chunking strategy -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);
            padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">🧠 Quiz</h3>

<p style="color:#495057;font-weight:500;">
You need Q&amp;A over a 90-page contract (~45 000 tokens).  
Available model window: 8 000 tokens.
</p>

<p style="color:#495057;font-weight:500;">
Which approach is the <em>most practical</em>?</p>

<style>
.ctxOpt{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;
       border:2px solid #e9ecef;color:#495057;transition:.2s}
.ctxOpt:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.ctxRadio{display:none}
.ctxRadio:checked + .ctxOpt[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.ctxRadio:checked + .ctxOpt[data-correct="false"]{background:#f8d7da;color:#721c24;border-color:#f5b7b1}
.ctxFeed{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#ctx-good:checked ~ .ctxFeed[data-type="good"],
#ctx-w1:checked  ~ .ctxFeed[data-type="bad"],
#ctx-w2:checked  ~ .ctxFeed[data-type="bad"]{display:block}
.ctxFeed[data-type="good"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.ctxFeed[data-type="bad"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div>
  <input type="radio" id="ctx-w1" name="ctx" class="ctxRadio">
  <label for="ctx-w1" class="ctxOpt" data-correct="false">
    📚 Fine-tune a new model overnight with the entire contract baked in.
  </label>

  <input type="radio" id="ctx-good" name="ctx" class="ctxRadio">
  <label for="ctx-good" class="ctxOpt" data-correct="true">
    🔍 Split the contract into ~1000-token chunks and  
    insert only the chunks relevant to each question.
  </label>

  <input type="radio" id="ctx-w2" name="ctx" class="ctxRadio">
  <label for="ctx-w2" class="ctxOpt" data-correct="false">
    ⛓️ Chain multiple 6K prompts in one request; the backend will stitch them automatically.
  </label>

  <div class="ctxFeed" data-type="good">
    ✅ Right — on-demand retrieval of multiple 1K chunks respects the 8K limit and allows for some extra context to be added outside the cunks.
  </div>
  <div class="ctxFeed" data-type="bad">
    ❌ Fine-tuning is slow/expensive, and context resets between separate 6K prompts.
  </div>
</div>
</div>


---

## ⚡ KV Cache and Performance

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
#kv-w1:checked  ~ .kvFeed[data-type="bad"],
#kv-w2:checked  ~ .kvFeed[data-type="bad"]{display:block}
.kvFeed[data-type="good"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.kvFeed[data-type="bad"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
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
    ✅ Exactly, KV-cache keeps a “cheat-sheet” of attention results for all internal parts of the model. With it, every new token is almost free; without it, the model re-does heavy math for <em>all</em> previous tokens.
  </div>
  <div class="kvFeed" data-type="bad">
    ❌ The cache isn’t about repeating text or mere memory savings—it skips expensive attention math.
  </div>
</div>
</div>

[🔝 Back to Contents](#contents)