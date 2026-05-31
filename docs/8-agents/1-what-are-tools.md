# What are tools?

## Tool basics

You've just seen it live in the playground: the model paused, called the weather tool, and returned real data instead of guessing. But how does that actually work under the hood?

A **tool** is any service wrapped with a simple JSON interface so an LLM can interact with it — calculators, databases, ERP systems, weather APIs, you name it. The LLM acts as a **coordinator**: it decides which tool to call and how to interpret the result. The actual execution is handled by the surrounding application, runtime, or backend system, not by the model itself.

Let's dig into the mechanics:  

Go to your workbench and run through the notebook: **`experiments/8-agents/1-intro-to-tools.ipynb`**

## MCP servers

Now that you've seen how a tool works in practice, let's scale it up!

**MCP (Model Context Protocol) servers** are collections of tools that can be called either remotely or locally. Instead of defining tools one-by-one, MCP servers provide entire suites of functionality - like a toolbox instead of a single tool.

Before we can use an MCP server, we need to deploy one, let's start with that!

1. Go to the OpenShift UI -> Helm -> Releases as before and click Create Helm Release.

    ![helm-release.png](./images/helm-release.png)


2. Select `Canopy Helm Charts` in the left menu and then click on Canopy MCP Calendar:

    ![helm-calender.png](./images/helm-calender.png)

3. You don't need to change anything here so just click `Create` right away.

    ![helm-calender-2.png](./images/helm-calender-2.png)

4. After everything has been deployed, you can access the [Calendar website](https://canopy-mcp-calendar-frontend-<USER_NAME>-canopy.<CLUSTER_DOMAIN>), go see what it looks like by clicking the little arrow when the circles are all blue 🔵

    ![helm-calender-3.png](./images/helm-calender-3.png)

    You should see something like this:

    ![calender-app.png](./images/calender-app.png)

5. Go to your workbench and open up the notebook **`experiments/8-agents/2-mcp-servers.ipynb`** to see how to use the MCP server and its tools. When you are done, come back here for more!

Now that you know what tools are, how they work, and how to use them, let's see how we can create even more powerful agents.
