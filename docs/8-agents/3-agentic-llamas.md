# Agentic Frameworks: Llama Stack & LangGraph

## From Scratch to Production

You just built a ReAct agent from scratch, complete with manual parsing, loop management, state handling, and error recovery. That's the hard way and has a lot of boilerplate code! But now you understand *how* agents work under the hood.

In production, nobody builds agents from scratch. Instead, we use **agentic frameworks** that handle all that complexity for us.  
Agentic frameworks abstract away so you can focus on **what** your agent should do, not **how** it does it.

## Popular Agentic Frameworks

There are multiple agentic frameworks available, amongst them are:

- **LangGraph**: Production-grade graph-based agent framework (by LangChain)
- **CrewAI**: Multi-agent collaboration framework
- **AutoGen**: Microsoft's multi-agent conversation framework
- **Haystack**: End-to-end LLM orchestration

Today we'll use **LangGraph** because it's powerful yet approachable, and it integrates cleanly with Llama Stack through OpenAI-compatible endpoints.

## The Use Case

We'll build a **knowledge-based chatbot** that can:
1. Search documents for information (RAG)
2. Schedule meetings with professors if it can't answer the question

This requires the agent to reason about when to search vs. when to schedule - perfect for demonstrating LangGraph's simplicity!

## Enable MCP in LlamaStack

Before we start, we need to enable MCP support in your Llama Stack instance:

1. Go to **OpenShift Console** → **Helm** → **Releases**

    ![helm-release-2.png](images/helm-release-2.png)

2. Find `llama-stack-operator-instance`, click the **three dots** → **Upgrade**

    ![upgrade-lls](images/upgrade-lls.png)

3. In the Form view, open the **MCP section**, select **`enabled`**, and click **Upgrade**

    ![enable-mcp](images/enable-mcp.png)

This enables our MCP Calendar tool that LangGraph will use.

## Why Llama Stack?

Llama Stack does three things here that make the difference: it serves the model, manages the RAG vector store, and ✨crucially✨ exposes a **Responses API** that goes beyond standard Chat Completions. With standard Chat Completions, you'd have to write a Python wrapper function for every tool an MCP server exposes (the same manual approach you used when building the ReAct agent from scratch). The Responses API skips all of that: you pass it an MCP server binding, and it discovers the available tools and handles execution automatically. Llama Stack knows about the calendar server because the Helm upgrade you just did registered it as a `tool_group` at startup.

LangGraph does have its own MCP support and could connect directly to the model without Llama Stack. The reason we use it here is that it's already the platform underneath everything: the model, the vector store, the MCP connections. So infrastructure concerns stay in one place rather than scattered across your application code. Swapping a model or MCP server becomes a config change, not a code change.

## Let's Build It!

Ready to see how much easier this gets? You'll build the same agentic capabilities with **~70% less code**. Just clean, declarative agent definitions.  
Go to your workbench and open **`experiments/8-agents/4-agentic-llamas.ipynb`**