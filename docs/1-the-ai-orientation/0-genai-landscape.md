# 🌐 GenAI Landscape & Foundation Models

## 📝 What is Generative AI?

Generative AI (GenAI) refers to models that can create new content — text, images, audio, video, or even code — by learning patterns from large datasets.

Think of it like a master chef who has tasted thousands of dishes. The chef might not have invented every recipe but can whip up a new dish based on flavor combinations they've learned. Similarly, GenAI models don’t "think" like humans; instead, they generate outputs based on common patterns learned during training.

You might have seen:

* A chatbot answering questions like a friendly assistant
* An AI tool creating realistic images from just a sentence
* Music composed by an AI in the style of a famous artist

These are all examples of GenAI in action!

> 🎯 **Teaser:** We'll explore how you can "talk" to these models effectively — a practice called **prompting** — in the next chapter.

---

## 🏗️ Foundation Models — The Backbone of GenAI

Before a GenAI model can do anything impressive, it needs a strong foundation — and that’s exactly what **Foundation Models (FMs)** provide. These are massive models trained on a wide variety of data, making them versatile for countless tasks with minimal additional training.

If GenAI is like playing a song, Foundation Models are like well-made instruments that can be used for different genres. Once you have the instrument, you just need to know the right tune (or prompt) to play.

### Some notable Foundation Models:

* **GPT Series (OpenAI)** — Creates human-like text (e.g., ChatGPT)
* **Stable Diffusion (Stability AI)** — Generates images from text descriptions
* **Whisper (OpenAI)** — Converts speech into text with high accuracy
* **Gemini (Google DeepMind)** — Processes and understands text, images, audio, and more
* **Code LLaMA (Meta)** — Generates and explains code in various programming languages

> 🗣️ **Fun fact:** Many models today are "multimodal," meaning they can handle multiple types of data at once — like understanding a picture **and** having a conversation about it.

---

## 📊 Open vs Closed Models

Just like software, GenAI models come in **open** and **closed** varieties.

| Feature  | Open Models                             | Closed Models               |
| -------- | --------------------------------------- | --------------------------- |
| Access   | Free/Source-available                   | API-only/Commercial         |
| Control  | Full control over weights & fine-tuning | Limited control / black-box |
| Examples | LLaMA 3, Mistral, Stable Diffusion      | GPT-4, Claude, Gemini       |

**Open Models** give you freedom to experiment, deploy on your infrastructure, or even fine-tune on your data.

**Closed Models** offer polished experiences and easy access via APIs but are limited in transparency and customization.

> 💡 **Tip:** In practice, many organizations use a mix of both, depending on their needs for privacy, control, or performance. And we'll tackle these topics as well.

---

## 🔄 Pretraining, Fine-tuning & Prompting

You can think of training a model like preparing an athlete:

* **Pretraining** is the general workout — building stamina and strength (this is what produces your foundation/base model).
* **Fine-tuning** is specialized coaching for a specific sport.
* **Prompting** is giving instructions right before the game.

| Stage       | What Happens                                     | Example                                         |
| ----------- | ------------------------------------------------ | ----------------------------------------------- |
| Pretraining | Model learns general patterns from huge datasets | Training GPT-4 on diverse internet data         |
| Fine-tuning | Model adapts to specific tasks or domains        | Fine-tuning LLaMA 3 for legal document analysis |
| Prompting   | Guiding a pretrained model to perform a task     | Asking ChatGPT to write a product pitch         |

> 🗝️ **Sneak peek:** Prompting may sound simple — just asking the model for what you want — but crafting the right prompt can feel like writing a magic spell. We'll dive deeper into prompting strategies in the next chapter!

---

## 🌟 Some Examples of GenAI in Action

* **Claude (Anthropic)** — Known for safer, controllable AI chat experiences
* **Suno AI** — Creates AI-generated music from simple text prompts
* **LLaVA (Large Language and Vision Assistant)** — Combines text and image understanding
* **Gemini 2.5 Pro (Google)** — Multimodal, can process huge contexts (up to 1M tokens!)

> 🚀 The landscape of GenAI is evolving fast — what seems like cutting-edge today may become standard tomorrow!

---

## 📝 Quick Check!

<!-- 🔍 Foundation Model Identification -->

<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quiz 1: Foundation Model Identification</h3>

<p style="color:#495057; font-weight:500;">
Which of the following is an example of a Foundation Model?
</p>

<style>
.quiz-container-next-easy{position:relative}
.quiz-option-next-easy{display:block;margin:4px 0;padding:8px 16px;background:#f8f9fa;border-radius:6px;cursor:pointer;transition:.2s;border:2px solid #e9ecef;color:#495057}
.quiz-option-next-easy:hover{background:#fff;transform:translateY(-1px);border-color:#dee2e6}
.quiz-radio-next-easy{display:none}
.quiz-radio-next-easy:checked+.quiz-option-next-easy[data-correct="true"]{background:#d4edda;color:#155724;border-color:#c3e6cb}
.quiz-radio-next-easy:checked+.quiz-option-next-easy:not([data-correct="true"]){background:#f8d7da;color:#721c24;border-color:#f5c6cb}
.feedback-next-easy{display:none;margin:4px 0;padding:8px 16px;border-radius:6px}
#foundation-correct:checked~.feedback-next-easy[data-feedback="correct"],
#foundation-wrong1:checked~.feedback-next-easy[data-feedback="wrong1"],
#foundation-wrong2:checked~.feedback-next-easy[data-feedback="wrong2"]{display:block}
.feedback-next-easy[data-feedback="correct"]{background:#d1f2eb;color:#0c5d56;border:1px solid #a3d9cc}
.feedback-next-easy[data-feedback="wrong1"], .feedback-next-easy[data-feedback="wrong2"]{background:#fce8e6;color:#58151c;border:1px solid #f5b7b1}
</style>

<div class="quiz-container-next-easy">
  <input type="radio" name="quiz-foundation-1" id="foundation-wrong1" class="quiz-radio-next-easy">
  <label for="foundation-wrong1" class="quiz-option-next-easy" data-correct="false">📊 Random Forest</label>

  <input type="radio" name="quiz-foundation-1" id="foundation-correct" class="quiz-radio-next-easy">
  <label for="foundation-correct" class="quiz-option-next-easy" data-correct="true">📝 GPT-4</label>

  <input type="radio" name="quiz-foundation-1" id="foundation-wrong2" class="quiz-radio-next-easy">
  <label for="foundation-wrong2" class="quiz-option-next-easy" data-correct="false">📈 Logistic Regression</label>

  <div class="feedback-next-easy" data-feedback="correct">✅ Correct! GPT-4 is a foundation model.</div>
  <div class="feedback-next-easy" data-feedback="wrong1">❌ Random Forest is a traditional machine learning algorithm, not a foundation model. Foundation models are large neural networks trained on diverse data.</div>
  <div class="feedback-next-easy" data-feedback="wrong2">❌ Logistic Regression is a statistical method for classification, not a foundation model. Foundation models are massive neural networks like GPT, LLaMA, etc.</div>
</div>
</div>

---
<!-- 
## 🧩 Activities for Peer Learning

### 🗺️ Activity 1 — **Model Map**

* Form small groups
* Each group picks a model type: LLM, Diffusion Model, Speech Model, Multimodal Model
* Research (or use provided materials) to fill out:

  * Model Name
  * Open or Closed
  * Known Use Case
  * Example Product using it
* Share with the class using sticky notes / whiteboard / Miro

---

### 🗣️ Activity 2 — **Open vs Closed Debate**

* Split into two teams
* Scenario: "You need to build a secure customer support chatbot for a bank."
* One team argues for Open Models, the other for Closed Models
* Discuss trade-offs on:

  * Privacy
  * Cost
  * Control
  * Performance
* End with a group reflection

---

## 💬 Discussion Prompt

> What are some risks of relying only on prompting with closed models in your industry?
> *(Share in small groups and report back)* -->

<!-- 🎯 Open vs Closed -->

<div style="background:linear-gradient(135deg,#e8f2ff 0%,#f5e6ff 100%);padding:20px;border-radius:10px;margin:20px 0;border:1px solid #d1e7dd;">

<h3 style="margin:0 0 8px;color:#5a5a5a;">📝 Quiz 2: Open vs Closed</h3>

<p style="color:#495057; font-weight:500;">
Which of the following statements about Open Foundation Models is correct?
</p>

<div class="quiz-container-next-easy">
  <input type="radio" name="quiz-open-closed" id="open-wrong1" class="quiz-radio-next-easy">
  <label for="open-wrong1" class="quiz-option-next-easy" data-correct="false">💰 They are always free to use for commercial purposes</label>

  <input type="radio" name="quiz-open-closed" id="open-correct" class="quiz-radio-next-easy">
  <label for="open-correct" class="quiz-option-next-easy" data-correct="true">🔍 They allow you to access and modify the model weights</label>

  <input type="radio" name="quiz-open-closed" id="open-wrong2" class="quiz-radio-next-easy">
  <label for="open-wrong2" class="quiz-option-next-easy" data-correct="false">🗣️ They perform better than closed models in all cases</label>

  <div class="feedback-next-easy" data-feedback="correct">✅ Spot on! Open models allow access to their weights, giving you more control.</div>
  <div class="feedback-next-easy" data-feedback="wrong1">❌ Not always! "Open" refers to model weights being accessible, not commercial licensing. Many open models have restrictions on commercial use.</div>
  <div class="feedback-next-easy" data-feedback="wrong2">❌ Not necessarily! Performance depends on many factors including model size, training data, and specific use cases. Closed models often outperform open ones.</div>
</div>

<style>
#open-correct:checked~.feedback-next-easy[data-feedback="correct"],
#open-wrong1:checked~.feedback-next-easy[data-feedback="wrong1"],
#open-wrong2:checked~.feedback-next-easy[data-feedback="wrong2"]{display:block}
</style>
</div>

---

## 📌 Summary

* GenAI uses Foundation Models trained on vast datasets
* Pretraining, fine-tuning, and prompting are key adaptation strategies
* Open vs Closed models have trade-offs — no one-size-fits-all
* Collaboration and discussion help in understanding real-world implications
