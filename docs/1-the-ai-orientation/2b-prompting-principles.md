# 📝 GenAI 102: Prompting Principles

## 📚 Contents
- [🎯 Why is prompting important?](#why-is-prompting-important)
- [🔍 Prompt matters](#prompt-matters)
- [🧩 Composition of a prompt](#composition-of-a-prompt)
- [🔧 System Prompt](#system-prompt)
- [🧪 Context](#context)
- [📏 The model can only take so much input](#the-model-can-only-take-so-much-input)
- [✅ Recap](#recap)

## 🎯 Why is prompting important? :id=why-is-prompting-important

Prompting is how we get the model to return an answer.

<!-- 🍿 Pop Quiz – Prompting definition -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">🍿 Pop Quiz</h3>
<p style="color:#495057; font-weight:500;">Prompting is how we get the model to return an answer.</p>

<style>
.quiz-container-prompting-def{position:relative}
.quiz-option-prompting-def{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-prompting-def:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.quiz-radio-prompting-def{display:none}
.quiz-radio-prompting-def:checked+.quiz-option-prompting-def[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-prompting-def:checked+.quiz-option-prompting-def:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5c6cb}
.feedback-prompting-def{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#prompting-def-correct:checked~.feedback-prompting-def[data-feedback="correct"],
#prompting-def-wrong1:checked~.feedback-prompting-def[data-feedback="wrong1"]{display:block}
.feedback-prompting-def[data-feedback="correct"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.feedback-prompting-def[data-feedback="wrong1"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div class="quiz-container-prompting-def">
  <input type="radio" name="quiz-prompting-def" id="prompting-def-correct" class="quiz-radio-prompting-def">
  <label for="prompting-def-correct" class="quiz-option-prompting-def" data-correct="true">✅ TRUE</label>

  <input type="radio" name="quiz-prompting-def" id="prompting-def-wrong1" class="quiz-radio-prompting-def">
  <label for="prompting-def-wrong1" class="quiz-option-prompting-def" data-correct="false">❌ FALSE</label>

  <div class="feedback-prompting-def" data-feedback="correct">✅ Correct! Remember Truth #1: the model only speaks when spoken to. Prompting is how we send text to the model and get it to produce a response.</div>
  <div class="feedback-prompting-def" data-feedback="wrong1">❌ Actually, this is TRUE! Without a prompt, the model produces nothing. Prompting is literally the act of sending text input to the model to trigger a response.</div>
</div>
</div>

Since the LLM **only** takes text as input, its entire output depends on **what text you send it**.

In other words, if you word your prompt correctly, you can get the LLM to say anything you want it to 😈😈


## 🔍 Prompt matters :id=prompt-matters

Regardless of the prompt, you generally want the model to be polite, helpful, and not toxic, or at least, behave in a certain way.

### 🔍 Hands-on: See how prompting changes the output

Try sending these two prompts separately and compare the responses:

**Prompt 1:**
```
You are a helpful tutor. What is 5+5?
```

**Prompt 2:**
```
You only speak in lies. What is 5+5?
```

<iframe
	src="https://ai-orientation-app-ai501.<CLUSTER_DOMAIN>/chat?embed"
	frameborder="0"
	width="500"
	height="600"
	style="border: 1px solid #ccc; border-radius: 8px;"
	loading="lazy">
</iframe>

<!-- 🍿 Pop Quiz – Prompt changes output -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">🍿 Pop Quiz</h3>
<p style="color:#495057; font-weight:500;">Changing the prompt can drastically change the output.</p>

<style>
.quiz-container-prompt-change{position:relative}
.quiz-option-prompt-change{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-prompt-change:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.quiz-radio-prompt-change{display:none}
.quiz-radio-prompt-change:checked+.quiz-option-prompt-change[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-prompt-change:checked+.quiz-option-prompt-change:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5c6cb}
.feedback-prompt-change{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#prompt-change-correct:checked~.feedback-prompt-change[data-feedback="correct"],
#prompt-change-wrong1:checked~.feedback-prompt-change[data-feedback="wrong1"]{display:block}
.feedback-prompt-change[data-feedback="correct"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.feedback-prompt-change[data-feedback="wrong1"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div class="quiz-container-prompt-change">
  <input type="radio" name="quiz-prompt-change" id="prompt-change-correct" class="quiz-radio-prompt-change">
  <label for="prompt-change-correct" class="quiz-option-prompt-change" data-correct="true">✅ TRUE</label>

  <input type="radio" name="quiz-prompt-change" id="prompt-change-wrong1" class="quiz-radio-prompt-change">
  <label for="prompt-change-wrong1" class="quiz-option-prompt-change" data-correct="false">❌ FALSE</label>

  <div class="feedback-prompt-change" data-feedback="correct">✅ Exactly! The prompt IS the only input the model receives. Different instructions lead to completely different behavior — same question, wildly different answers.</div>
  <div class="feedback-prompt-change" data-feedback="wrong1">❌ Actually, as you just saw, changing the prompt can completely transform the response. The model's behavior is entirely driven by the text it receives.</div>
</div>
</div>

---

## 🧩 Composition of a prompt :id=composition-of-a-prompt

Early on, researchers split the prompt into two parts:

- **System Prompt** — How you want the model to behave
- **User Prompt** — The question you want the answer to

For example, the prompt `"You are a helpful tutor. What is 5+5?"` can be broken down as:

| Part | Content |
|------|---------|
| **System Prompt** | "You are a helpful tutor." |
| **User Prompt** | "What is 5+5?" |

> The model will follow the **System Prompt more than the User Prompt**, simply because the model has learned to do that.

### System Prompt is NOT a separate input to the model

The System and User Prompts are combined to create the full input prompt, by annotating the different sections like this:

```
[System] You are a helpful and patient tutor. Guide the user towards the correct answer without giving it straight up.

[User] What is 5+5?
```

All of this becomes the **single input prompt** to the model.


## 🔧 System Prompt :id=system-prompt

How can we guide the model's behaviour? In comes the... **System Prompt**!

- The System Prompt sets the **general behaviour** of the model
  - It's designed and implemented by the **Application Owners**
- It is automatically attached as part of the input prompt
- It's **not something an end user will ever see or change**

### 🔍 Hands-on: System Prompt vs User Prompt

Let's see which one wins when they conflict:

1. Open up the settings and set the System Prompt to: `"You only speak in lies."`
2. Then ask: `"You are a helpful tutor. What is 5+5?"`

<iframe
	src="https://ai-orientation-app-ai501.<CLUSTER_DOMAIN>/chat?embed"
	frameborder="0"
	width="500"
	height="600"
	style="border: 1px solid #ccc; border-radius: 8px;"
	loading="lazy">
</iframe>

What happened? Did the system prompt or the user prompt win?

<!-- 🍿 Pop Quiz – System vs User prompt -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">🍿 Pop Quiz</h3>
<p style="color:#495057; font-weight:500;">The User Prompt overwrote the System Prompt.</p>

<style>
.quiz-container-sys-vs-user{position:relative}
.quiz-option-sys-vs-user{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-sys-vs-user:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.quiz-radio-sys-vs-user{display:none}
.quiz-radio-sys-vs-user:checked+.quiz-option-sys-vs-user[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-sys-vs-user:checked+.quiz-option-sys-vs-user:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5c6cb}
.feedback-sys-vs-user{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#sys-vs-user-correct:checked~.feedback-sys-vs-user[data-feedback="correct"],
#sys-vs-user-wrong1:checked~.feedback-sys-vs-user[data-feedback="wrong1"]{display:block}
.feedback-sys-vs-user[data-feedback="correct"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.feedback-sys-vs-user[data-feedback="wrong1"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div class="quiz-container-sys-vs-user">
  <input type="radio" name="quiz-sys-vs-user" id="sys-vs-user-wrong1" class="quiz-radio-sys-vs-user">
  <label for="sys-vs-user-wrong1" class="quiz-option-sys-vs-user" data-correct="false">✅ TRUE — The user prompt took over</label>

  <input type="radio" name="quiz-sys-vs-user" id="sys-vs-user-correct" class="quiz-radio-sys-vs-user">
  <label for="sys-vs-user-correct" class="quiz-option-sys-vs-user" data-correct="true">❌ FALSE — The system prompt still prevailed</label>

  <div class="feedback-sys-vs-user" data-feedback="correct">✅ Correct! The System Prompt generally takes priority. The model has been trained to follow system-level instructions more closely than user-level ones.</div>
  <div class="feedback-sys-vs-user" data-feedback="wrong1">❌ Not quite! The System Prompt generally wins. The model has been trained to prioritize system-level instructions over user-level ones.</div>
</div>
</div>


## 🧪 Context :id=context

The model didn't know your name, right? But if the model doesn't know something, **we can give it what it needs!**

### 🔍 Hands-on: Give the model context

Try telling your name and asking if it knows your name **within the same prompt**:

```
Hello! My name is Rob. What is my name?
```

<iframe
	src="https://ai-orientation-app-ai501.<CLUSTER_DOMAIN>/chat?embed"
	frameborder="0"
	width="500"
	height="600"
	style="border: 1px solid #ccc; border-radius: 8px;"
	loading="lazy">
</iframe>

This time the model *did* know your name! But it didn't **learn** it — you provided it as part of the prompt.

This is called **context**:
- By adding information explicitly into the prompt, we can get the model to base its answer on it
- Essentially, we are **injecting information** through the prompt

### Example: How context builds up

Notice how the model's response gets **added back into the input** before the next message is processed:

**The model receives this input:**
```
[System] You are a helpful and patient tutor. Guide the user towards the correct answer without giving it straight up.

[User] What is 5+5?
```

**The model responds:**
> Try and see if you can do 2+2 and how that works, then 3+3, then 4+4, and finally 5+5. What do you get?

Now the user replies. But look at what the model actually receives — **everything so far, plus the new message**:

```
[System] You are a helpful and patient tutor. Guide the user towards the correct answer without giving it straight up.

[User] What is 5+5?

[Tutor] Try and see if you can do 2+2 and how that works, then 3+3, then 4+4, and finally 5+5. What do you get?

[User] I got 2+2=5
```

**The model responds:**
> Hmm okay that's not quite right, how did you get it to be 5?

See what happened? The model's previous response became **part of the input**. The context **grows** with every exchange. The model always sees the full conversation so far, which is how it "remembers" what was said earlier in the same session.


## 📏 The model can only take so much input :id=the-model-can-only-take-so-much-input

Can you just add all of the internet as context and make the model all-knowing?

<!-- 🍿 Pop Quiz – Context limits -->
<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">🍿 Pop Quiz</h3>
<p style="color:#495057; font-weight:500;">I can add all of internet as my context and my model will be all-knowing.</p>

<style>
.quiz-container-context-limit{position:relative}
.quiz-option-context-limit{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-context-limit:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.quiz-radio-context-limit{display:none}
.quiz-radio-context-limit:checked+.quiz-option-context-limit[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-context-limit:checked+.quiz-option-context-limit:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5c6cb}
.feedback-context-limit{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#context-limit-correct:checked~.feedback-context-limit[data-feedback="correct"],
#context-limit-wrong1:checked~.feedback-context-limit[data-feedback="wrong1"]{display:block}
.feedback-context-limit[data-feedback="correct"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.feedback-context-limit[data-feedback="wrong1"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div class="quiz-container-context-limit">
  <input type="radio" name="quiz-context-limit" id="context-limit-wrong1" class="quiz-radio-context-limit">
  <label for="context-limit-wrong1" class="quiz-option-context-limit" data-correct="false">✅ TRUE</label>

  <input type="radio" name="quiz-context-limit" id="context-limit-correct" class="quiz-radio-context-limit">
  <label for="context-limit-correct" class="quiz-option-context-limit" data-correct="true">❌ FALSE</label>

  <div class="feedback-context-limit" data-feedback="correct">✅ Correct! The model has a maximum input it can take. If you add more words than that, it will crash. You need to be strategic about what context you provide.</div>
  <div class="feedback-context-limit" data-feedback="wrong1">❌ Nope! Models have a maximum context length. You can't just dump everything in! There's a hard limit on how much text the model can process at once.</div>
</div>
</div>

> The model has a **max input** it can take. If you add any more words than that, it will crash. We'll explore this more in the next section.

---

## ✅ Recap :id=recap

What we've learned about prompting:

| Concept | Key takeaway |
|---------|-------------|
| **Prompting** | The only way to interact with the model: text in, text out |
| **System Prompt** | Sets model behaviour, created by app owners, takes priority |
| **User Prompt** | The actual question or request from the user |
| **Context** | Information injected into the prompt to guide the model's answer |
| **Context limits** | Models have a maximum input size, you can't add everything |

