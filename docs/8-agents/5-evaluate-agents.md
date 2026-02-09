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
    pip install -r app/requirements.txt
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

This shows the actual search results and helps you understand what data your tools are working with.

## 2. Add Unit Tests to CI/CD Pipeline

Now that we've verified the unit tests work locally, let's automate them in our CI/CD pipeline! This ensures every code change is tested before being promoted to production.

### Enable Unit Tests in the Tekton Pipeline

The evaluation pipeline can run unit tests alongside the other evaluations. Let's enable this step:

1. Go to `genaiops-gitops/toolings/evaluation-pipeline/config.yaml` in your workbench and update the config file to enable a unit test step:

    ```yaml
    chart_path: charts/canopy-evals-pipeline
    USER_NAME: <USER_NAME>
    CLUSTER_DOMAIN: <CLUSTER_DOMAIN>
    kfp:
      llsUrl: http://llama-stack-service.<USER_NAME>-test.svc.cluster.local:8321
      backendUrl: http://canopy-backend.<USER_NAME>-test.svc.cluster.local:8000
    testing:                    # 👈 Add this
      enableUnitTests: true     # 👈 Add this
    ```

2. Push it to git:

    ```bash
    cd /opt/app-root/src/genaiops-gitops
    git pull
    git add .
    git commit -m "1️⃣ Enabled unit tests 1️⃣"
    git push
    ```

3. To make sure it was added, go to OpenShift Console -> Pipelines -> canopy-evals-pipeline and see that `tool-unit-tests` is in there.  

    ![unit-test-step.png](images/unit-test-step.png)

We will see it action soon, but first, let's make sure that our end-to-end tests works for our agent as well.

### Adding Agent E2E Tests

1. Go to your workbench and navigate to the `evals` repository:

    ```bash
    cd /opt/app-root/src/evals
    ```

2. Create a new folder for the student assistant tests:

    ```bash
    mkdir student-assistant
    ```

3. Create the test configuration file. Open a new file `student-assistant/student_assistant_tests.yaml` and paste this:

```yaml
name: student_assistant_tests
description: End-to-end tests for the student assistant agent with tool choice validation
model: llama32
endpoint: /student-assistant
scoring_params:
    "llm-as-judge::base":
        "judge_model": llama32
        "prompt_template": e2e_judge_prompt.txt
        "type": "llm_as_judge"
        "judge_score_regexes": ["Answer: (A|B|C|D|E)"]
    "basic::tool_choice": null
tests:
  - prompt: "What is a forest canopy?"
    expected_result: "A forest canopy is the upper layer of a forest, formed by the crowns of trees. It's an important ecosystem component that provides habitat for many species and plays a crucial role in photosynthesis and the forest's overall health."
    expected_tools: ["search_knowledge_base"]
  - prompt: "Who can help me with machine learning?"
    expected_result: "Dr. Sarah Chen from the Computer Science department can help you with machine learning. She specializes in Machine Learning, Neural Networks, AI Ethics, and Agentic Workflows. You can reach her at s.chen@university.edu."
    expected_tools: ["find_professors_by_expertise"]
```

4. Notice the `expected_tools` field in the tests - this tells the evaluator which tools the agent should call. The eval pipeline will check:
- Did the agent call `search_knowledge_base` for the canopy question?
- Did it call `find_professors_by_expertise` for the professor question?

6. Commit and push your changes:

    ```bash
    cd /opt/app-root/src/evals/student-assistant
    git add .
    git commit -m "🤖 Agent E2E tests added 🤖"
    git push
    ```

7. The eval pipeline should trigger automatically. Go to **OpenShift Pipelines** to watch it run!


After it has compeleted you can see the evaluation results in minio or through the prompt tracker 🎉
