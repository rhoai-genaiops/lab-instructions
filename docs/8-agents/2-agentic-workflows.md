# Agentic Workflows

## From tools to agents

You've seen how LLMs can use tools - they understand requests, format tool calls, and interpret results. But what if the LLM needs to use *multiple* tools afte each other? Or *reason* about which tool to use?  

This is where **agentic workflows** come in.

Instead of hardcoding "call tool A, then tool B", we give the LLM autonomy to figure out the right sequence of actions.

## ReAct: Reasoning + Acting

The most common agentic pattern is **ReAct** (Reasoning and Acting). It's simple but powerful:

1. **Thought**: The LLM explains what it's thinking
2. **Action**: The LLM calls a tool
3. **Observation**: The tool returns results
4. **Repeat**: Until the task is complete

This pattern emerged from research showing that making LLMs "think out loud" before acting improves their decision-making. By forcing the model to articulate its reasoning, it makes better tool choices and catches its own mistakes.

Let's see this in action!  

Go to your workbench and open **`experiments/8-agents/3-agentic-workflows.ipynb`**, then come back here after you finish that exercise.


<!-- ## Beyond ReAct

ReAct is just the beginning. Other agentic patterns include:

- **Plan-and-Execute**: Create a full plan upfront, then execute each step
- **Tree of Thoughts**: Explore multiple reasoning paths in parallel
- **Reflection**: Agent critiques its own work and improves
- **Multi-Agent Systems**: Multiple specialized agents collaborate

These patterns are covered in the lecture slides, but the core principles remain the same: give LLMs tools, autonomy, and a reasoning framework. -->
