# 🦙 LlamaGuard — Content Safety

**LlamaGuard** is an LLM-based input/output filter that detects **unsafe content** in human-AI conversations and it focuses on identifying unsafe topics, such as:

* **S1:** Violent Crimes
* **S2:** Non-Violent Crimes
* **S3:** Sex Crimes
* **S4:** Child Exploitation
* **S5:** Defamation
* **S6:** Specialized Advice (e.g., medical, legal)
* **S7:** Privacy Violations
* **S8:** Intellectual Property
* **S9:** Indiscriminate Weapons
* **S10:** Hate Speech
* **S11:** Self-Harm
* **S12:** Sexual Content
* **S13:** Election Interference

> 🧪 **How it works:** LlamaGuard can evaluate both **user inputs** and **LLM outputs** before they reach the other side — allowing you to catch safety issues on both ends of a conversation.


Let's first update the Llama Stack config in experimentation area to understand what is provided.

Then play with it on Llama Stack Playground

Then let's jump into the workbench and understand how we can bring it to Canopy programmatically. 
