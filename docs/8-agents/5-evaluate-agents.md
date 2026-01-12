# Evaluate Agents

Your agent is now live, helping students and scheduling meetings with professors. But here's the thing - how do you know it's actually working correctly?

Just like with testing in the earlier chapters, the same question gets answered differently every time. And that's fine... usually, but makes things a bit tricky.

## Three layers of agent testing

When evaluating agents, we will focus on three areas:

1. **Unit tests for individual tools** - Test each tool in isolation. Does the calendar API actually create events? Does the search return relevant results?
2. **Text-to-JSON validation** - Can the LLM format tool calls correctly, and does it choose the right tools? (Spoiler: malformed JSON is where most agents break)
3. **End-to-end evaluation** - Does the complete workflow help users?

We've already set up an eval framework earlier, so let's put it to work testing our agent!

## 1. Unit Testing Agent Tools

Before we test the whole agent, let's make sure each individual tool works correctly. Think of it like testing the ingredients before baking the cake.

The canopy backend already has unit tests set up for the student assistant tools. Let's run them!

1. We first need to install some dependencies:

    ```bash
    cd /opt/app-root/src/backend
    pip install -r tests/requirements-test.txt
    ```

2. And then we can run the unit tests:

    ```bash
    pytest tests/test_tools.py -v
    ```

You should see output like this:

```
tests/test_tools.py::test_search_knowledge_base PASSED                    [ 25%]
tests/test_tools.py::test_find_professors_by_expertise PASSED            [ 50%]
tests/test_tools.py::test_mcp_calendar_list_tools PASSED                 [ 75%]
tests/test_tools.py::test_mcp_calendar_list_events PASSED                [100%]

======================== 4 passed in 1.22s ========================
```

**What did we just test?**

- **search_knowledge_base** - Verified the tool can retrieve relevant content from the vector store
- **find_professors_by_expertise** - Checked that professor matching works correctly
- **MCP calendar tools** - Confirmed the MCP server is reachable and exposes the right tools

**Pro tip:** Want to see what the tools are returning? Run with the `-s` flag:

```bash
pytest tests/test_tools.py -v -s
```

