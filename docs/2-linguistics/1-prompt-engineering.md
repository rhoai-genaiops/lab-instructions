# 🧠 What is Prompt Engineering?

<div class="terminal-curl"></div>

Prompt engineering is the practice of designing effective inputs (prompts) to elicit useful, relevant, and accurate outputs from a language model.

You can think of it like writing instructions for a very smart but very literal assistant. The way you phrase a prompt can drastically affect the tone, format, depth, or even the correctness of the model’s response.

There are typically two key parts to prompting:

* **System Prompt**: This sets the context or behavior for the model. It defines *how* the model should act (e.g., “You are a helpful teaching assistant for computer science students.”).
* **User Prompt**: This is the actual question or task you’re giving to the model (e.g., “Explain recursion to a beginner.”).

Together, they guide the model’s behavior and shape its response.

> ℹ️ **Reminder:** The System Prompt and User Prompt are not sent in seperately to the LLM, they are combined into a single prompt.  
Typically like this:  
\<System> *some system prompt*   
\<User> *some user prompt*  
and the model have just learned to treat the two parts differently.

## 🎯 Why Prompt Engineering Matters for RDU’s Canopy

At Redwood Digital University, we’re building **Canopy**, a platform designed to adapt to diverse student needs and teaching styles. That means that we not only need a good LLM, but also need to refine our prompts.

Let's explore how our LLM behaves under different prompting conditions.


## 🧪 Hands-On: The Prompt Playground

We’ve created a little prompt playground where you can experiment with different prompting strategies.  
Your goal is to find the best system prompt and configuration to **summarize** a given text.

Here’s what you can configure:

| Setting          | What it Does                                | Example                       |
| ---------------- | ------------------------------------------- | ----------------------------- |
| 🧾 System Prompt | Sets the AI’s role or behavior              | “You are a helpful tutor."     |
| 💬 User Prompt   | The task you give                           | “This text is about...”        |
| 🔥 Temperature   | How creative/varied the output will be (0 = serious and deterministic, 1 = creative and random) | “0.2 = strict, 0.8 = creative”  |
| 🔢 Max Tokens    | Limits response length                      | “50 = short, 200 = detailed”   |


And here is the text we ask you to summarize (in another word; the text you send into the User Prompt):

```
Tea preparation involves the controlled extraction of bioactive compounds from processed Camellia sinensis leaves. Begin by heating water to near 100°C to optimize solubility. Introduce a tea bag to a ceramic vessel, then infuse with hot water to initiate steeping—typically 3–5 minutes to allow for the diffusion of polyphenols and caffeine. Upon removal of the bag, optional additives like sucrose or lipid-based emulsions may be introduced to alter flavor profiles. The infusion is then ready for consumption.
```

![images/explain-like-8.jpg](images/explain-like-8.jpg)

Use the Prompt Playground to:

* Compare how different **system prompts** change the behavior of the same model.
* Adjust **temperature** and **max tokens** to explore how output varies.
* Decide on a system prompt template that will work well for Canopy’s Summarization feature.

📌 **Tip**: Try changing the tone, specificity, or format of your system prompt to see how much it shapes the output. Don’t be afraid to get creative!

The following info already entered to the playground:

- Model Name: 
```
llama32
```
- Model URL: 
```
https://llama32-ai501.<CLUSTER_DOMAIN>/
```

..now, it is up to what you feel like trying 🧪  

#### What is the best system prompt and settings you can find to summarize the above text?

<details>
<summary> 📜 Here are a few example System Prompts you can try.</summary>  
<br>

```
Write a short version of this.
```

```
Summarize the text in a few sentences.
```

```
Explain the given text as if I’m a 5-year-old.
```

```
Explain the given text using only emojis.
```

</details>

Can you come up with something that explains the text even better without loosing important info?


<iframe
	src="https://ai-orientation-app-ai501.<CLUSTER_DOMAIN>/playground"
	frameborder="0"
	width="1600"
	height="800"
	style="border: 1px solid transparent; border-radius: 1px;"
	loading="lazy">
></iframe>


Want more information about `Temperature` or `Max Tokens`? You have access to a Large Language Model that is quite knowledgeable, right? Feel free to ask 🙃