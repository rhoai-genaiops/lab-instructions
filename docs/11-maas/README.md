# Module 11 - Supply & Demand 101

> Giving everyone a GPU is like giving everyone their own power plant. What if we just... shared the electricity instead? ⚡

# 🧑‍🍳 Module Intro

Remember how Canopy started? A simple chatbot experiment in Module 2. Fast forward through GitOps deployments, RAG-powered document intelligence, guardrails for academic integrity, and agentic capabilities... and now everyone at Redwood Digital University wants their own Canopy.

**The Computer Science department wants one. The Business School wants one. The Library wants one.**

And here's the problem: each team is deploying their own Llama model. Three identical models. Three GPUs. Sitting idle 90% of the time. Meanwhile, students can't get GPU access for their projects because there are "no available resources."

*Sound familiar?*

This module introduces **Models as a Service (MaaS)** — a pattern that transforms how organizations provide AI access. Instead of everyone deploying their own models (and hoarding precious GPUs), you deploy each model **once** and provide access through a managed API gateway.

Think of it as the difference between everyone digging their own well vs. building a shared water system. 🚰

---

# 👥 Meet the Personas

This module is unique because different people care about different aspects of MaaS. We'll explore it through four lenses:

| Persona | Emoji | They Care About... | Primary Lessons |
|---------|-------|-------------------|-----------------|
| **The Owner** | 🎩 | Cost, efficiency, ROI, "Why are we spending so much on GPUs?" | 1, 5 |
| **The AI Engineer** | 🔧 | Infrastructure, deployment, "How do we set this up right?" | 2 |
| **The Service Admin** | 👩‍💼 | User management, configuration, "Who needs access to what?" | 3, 5 |
| **The Consumer** | 👤 | API access, building apps, "Just give me an endpoint!" | 4, 6 |

As you go through each lesson, you'll "wear different hats" to understand MaaS from multiple perspectives. By the end, you'll appreciate why each role matters — and maybe even realize which hat fits you best! 🎭

---

# 🖼️ Big Picture

![Before and After MaaS comparison showing resource consolidation](images/before-after-maas.svg)

---

# 🔮 Learning Outcomes

By the end of this module, you will be able to:

* **Explain** why MaaS is essential for scaling AI adoption in organizations
* **Deploy** LiteMaaS on OpenShift using GitOps principles
* **Configure** user roles, model access, and budgets as a service administrator
* **Consume** AI models through API keys and the OpenAI-compatible interface
* **Monitor** usage, track costs, and implement chargeback models
* **Integrate** existing applications (like Canopy!) with a MaaS backend

---

# 🔨 Tools Used in This Module

* **LiteMaaS** — A lightweight Models as a Service platform built by Red Hat AI Services
  * React + PatternFly 6 frontend for beautiful, accessible UIs
  * Fastify + PostgreSQL backend for robust API management
  * LiteLLM integration for OpenAI-compatible API proxy
  * OAuth2/JWT authentication with OpenShift integration

* **LiteLLM** — An OpenAI-compatible proxy that provides a unified API across different model backends

* **PostgreSQL** — Database for storing users, API keys, usage data, and audit logs

* **OpenShift OAuth** — Enterprise authentication integration for seamless user onboarding

* **Your favorite HTTP client** — curl, Postman, or Python requests to make API calls

---

# 🎬 Ready to Start?

Let's begin by understanding *why* MaaS exists in the first place. Spoiler: it involves a lot of frustrated IT folks and some very expensive paperweights (GPUs).

Continue to [Understanding MaaS](12-maas/1-understanding-maas.md).
