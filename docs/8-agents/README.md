# Module 8 - Autonomous Systems 101

> An LLM alone is like a chef who can only describe recipes but never cook. Give it tools and agency, and suddenly it can search, schedule, calculate, and actually get things done. Welcome to the world of AI agents!

# 🧑‍🍳 Module Intro

This module takes you from understanding LLMs as text generators to building autonomous agents that can reason, plan, and take action. You'll discover how tools extend LLM capabilities beyond conversation, how MCP servers provide scalable tool ecosystems, and how agentic workflows like ReAct enable sophisticated multi-step reasoning.

At RDU, we're evolving Canopy from a smart chatbot into a true student assistant that can search knowledge bases, schedule meetings with professors, and autonomously help students navigate their academic journey. By the end of this module, you'll have deployed an agent that combines RAG, tool calling, and intelligent decision-making.

# 🖼️ Big Picture
![big-picture-agents](images/big-picture-agents.png)

# 🔮 Learning Outcomes

* Understand what tools are and how they extend LLM capabilities beyond text generation
* Deploy and use MCP (Model Context Protocol) servers to provide scalable tool collections
* Learn the ReAct (Reasoning and Acting) pattern for building autonomous agents
* Build agents using LangGraph with Llama Stack integration
* Deploy agentic features through GitOps pipelines to test and production environments
* Create intelligent assistants that combine RAG knowledge with tool-based actions

# 🔨 Tools used in this module

* **LLM Tools**: JSON-based interfaces that allow LLMs to interact with external services like calculators, databases, and APIs
* **MCP (Model Context Protocol) Servers**: Standardized servers that provide collections of tools for LLM consumption
* **ReAct Framework**: Reasoning and Acting pattern that enables LLMs to think, act, and observe in iterative loops
* **LangGraph**: Production-grade graph-based agent framework for building complex agentic workflows
* **Llama Stack Agent APIs**: Integration layer for building and orchestrating AI agents
* **Calendar MCP Server**: Example tool server providing scheduling and calendar management capabilities
* **OpenShift & Helm Charts**: To deploy agent infrastructure and MCP servers in development and production environments
