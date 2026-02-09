# 🔄 Feedback Loops: Closing the GenAIOps Circle

Metrics tell you *how fast* your system runs. Logs tell you *what happened*. Traces tell you *where time was spent*. But none of them answer the most important question: **are your users actually satisfied with the AI's responses?**

User feedback is the missing piece that closes the GenAIOps loop. By collecting thumbs up/down signals from users, you get direct evidence of where your AI succeeds and where it fails -- and you can feed that evidence back into your evaluation pipeline to systematically improve your system.

## Why Feedback Matters

Consider this scenario: your Canopy summarization feature has great latency (metrics look healthy), no errors in the logs, and clean traces through LlamaStack. Everything *looks* fine from an infrastructure perspective. But users are consistently getting poor summaries because the system prompt isn't well-tuned for certain types of input.

Without user feedback, you'd never know. The observability pillars you've learned (metrics, logs, traces) monitor **system health**. Feedback monitors **output quality** -- and that's what ultimately matters for AI applications.

The feedback loop connects observability to action:

1. **Deploy** your AI application
2. **Observe** its behavior (metrics, logs, traces)
3. **Collect feedback** from users
4. **Evaluate** using negative feedback as test cases
5. **Improve** prompts or models based on evaluation results
6. **Redeploy** and repeat

## Enable the Feedback Feature

The feedback feature is behind a feature flag, just like the other Canopy capabilities you've enabled throughout this course.

1. In your gitops repo, update the Canopy backend values to enable feedback:

   ```yaml
   feedback:
     enabled: true
   ```

2. Commit and push your changes. Wait for ArgoCD to sync the deployment.

3. Verify the feature flag is active:

   ```bash
   curl -s http://<CANOPY_BACKEND_ROUTE>/feature-flags | jq
   ```

   You should see `"feedback": true` in the response alongside your other feature flags.

## Try It Out

1. Open your Canopy UI and navigate to **Summarization**
2. Paste some text and click **Summarize**
3. After the summary appears, you should see a **"Was this summary helpful?"** prompt with thumbs up and thumbs down buttons
4. Click thumbs down on a summary you find unsatisfactory
5. Click thumbs up on a summary that works well
6. Try a few more to generate some data

## Review Feedback in the Dashboard

The Canopy UI includes a dedicated Feedback Dashboard accessible at `/feedback`. This gives you a product-level view of how users are responding to the AI.

1. In your browser, navigate to your Canopy UI URL and append `/feedback` to the path (or click **feedback** in the sidebar page navigation)

2. You should see:
   - **Metrics** at the top: total feedback count, positive count, negative count
   - **Filter controls** to view all, positive only, or negative only
   - **Collapsible entries** for each feedback submission -- click to expand and see the full prompt and response

3. Expand a few entries and review the full text. Notice how the dashboard gives you immediate visibility into which prompts produced unsatisfactory results.

4. At the bottom, you'll find an **Export for Evaluation** section (if there are any negative feedback entries). We'll use this in the next steps.

## See Feedback in Logs (LokiStack)

Every feedback submission is logged as structured JSON on STDOUT -- which means LokiStack automatically collects it. Let's find the feedback events.

1. Navigate to **OpenShift Console -> Observe -> Logs**

2. Click **Show Query** and paste this LogQL query to find all feedback events:

   ```logql
   { log_type="application", kubernetes_pod_name=~"canopy-backend.*", kubernetes_namespace_name="<USER_NAME>-canopy" } |= `feedback_submitted` | json
   ```

3. You should see structured JSON entries for each feedback submission with fields like:
   - `rating`: `"thumbs_up"` or `"thumbs_down"`
   - `feature`: `"summarize"`
   - `input_length` and `response_length`: size of the text
   - `timestamp`: when the feedback was submitted

4. Filter for only negative feedback to find problem areas:

   ```logql
   { log_type="application", kubernetes_pod_name=~"canopy-backend.*", kubernetes_namespace_name="<USER_NAME>-canopy" } |= `feedback_submitted` | json | rating="thumbs_down"
   ```

   This is the query an operations team would use to monitor user satisfaction in real-time.

## See Feedback in Traces (Tempo)

Since Canopy Backend has OpenTelemetry auto-instrumentation enabled (via the `instrumentation.opentelemetry.io/inject-python` annotation), every `POST /feedback` request automatically generates a trace span.

1. Open the **Canopy Distributed Traces** dashboard in Grafana
2. Look for traces containing `POST /feedback` operations
3. Click a trace to see the span details including timing and HTTP status

No extra code was needed for this -- the auto-instrumentation you configured in the earlier tracing section handles it automatically. This demonstrates the power of the OpenTelemetry approach: new endpoints get observability for free.

## See Feedback in Metrics (Prometheus)

The auto-instrumented OpenTelemetry SDK also emits HTTP server metrics for every FastAPI endpoint. You can track feedback submission volume in Prometheus.

1. Navigate to **OpenShift Console -> Observe -> Metrics**

2. Query for feedback request count:

   ```promql
   http_server_request_count{http_route="/feedback", namespace="<USER_NAME>-canopy"}
   ```

   This shows the total number of feedback submissions over time.

## From Feedback to Evaluations

Collecting feedback is only half the story. The real value comes from using negative feedback to improve your AI system. Let's export the thumbs-down feedback as an evaluation dataset.

1. In the Feedback Dashboard (`/feedback`), scroll to the **Export for Evaluation** section and click **Download feedback-eval-dataset.yaml**.

   You can also export from the terminal:

   ```bash
   curl -s http://<CANOPY_BACKEND_ROUTE>/feedback/export -o feedback-eval-dataset.yaml
   cat feedback-eval-dataset.yaml
   ```

2. The output matches the same `summary_tests.yaml` format used by the Canopy evaluation suite:

   ```yaml
   name: feedback_eval_tests
   description: Tests generated from negative user feedback on summarization.
   endpoint: /summarize
   scoring_params:
     llm-as-judge::base:
       judge_model: llama32
       prompt_template: judge_prompt.txt
       type: llm_as_judge
       judge_score_regexes:
       - 'Answer: (A|B|C|D|E)'
     basic::subset_of: null
   tests:
   - prompt: "the text that got a thumbs down"
     expected_result: ""
   ```

3. A human reviewer fills in the `expected_result` field with what a good summary should look like for each case. This turns real user dissatisfaction into concrete test cases.

4. Place the file alongside your existing `summary_tests.yaml` in `canopy-evals/Summary/` and run it through the evaluation pipeline (from Module 4). This tells you whether prompt changes or model updates actually improve results on the cases where users were dissatisfied.

## A/B Testing: Data-Driven Prompt Engineering

Collecting thumbs up/down feedback tells you *whether* users are satisfied -- but it doesn't tell you *which prompt is better*. A/B testing solves this by running the same user input through two different system prompts simultaneously and letting the user pick the better response.

Instead of guessing which prompt produces better summaries, you let real users decide -- just like how production ML systems compare model variants.

### Configure Prompt B

1. In your gitops repo, add an alternative prompt and enable A/B testing in the Canopy backend values:

   ```yaml
   summarize:
     enabled: true
     model: llama32
     prompt: "Summarize the following text in a clear and detailed manner:"
     prompt_b: "Provide a brief, concise summary:"

   ab_testing:
     enabled: true
   ```

   Make sure `feedback: enabled: true` is also set -- A/B testing builds on the feedback infrastructure.

2. Commit and push your changes. Wait for ArgoCD to sync the deployment.

3. Verify the feature flag is active:

   ```bash
   curl -s http://<CANOPY_BACKEND_ROUTE>/feature-flags | jq
   ```

   You should see `"ab_testing": true` alongside your other feature flags.

### Try It

1. Open your Canopy UI and navigate to **Summarization**
2. Paste some text into the text area
3. Click **Summarize** -- with A/B testing enabled, the same button now runs both prompts
4. Two columns appear: **Response A** and **Response B** -- both stream simultaneously from different prompts
5. After both responses complete, two buttons appear: **A is better** and **B is better**
6. Pick your preference -- the system records which actual prompt won
7. After submitting, the UI reveals which prompt was behind each response (the assignment is randomized on every request to avoid position bias)

### Review A/B Results

1. Navigate to the Feedback Dashboard (`/feedback` page in the sidebar)
2. Scroll down to the **A/B Prompt Comparison Results** section
3. You'll see win-rate metrics: how many times Prompt A won, Prompt B won, and ties
4. Expand individual entries to see both responses side-by-side along with the user's preference

### Act on the Data

When one prompt consistently wins across multiple comparisons:

1. Promote the winning prompt to `summarize.prompt` in your gitops config
2. Remove or replace `summarize.prompt_b` with a new candidate to test
3. Commit, push, and let ArgoCD redeploy -- then run another round of A/B tests

This creates a continuous improvement cycle driven by real user preferences rather than subjective judgment.

## The GenAIOps Lifecycle

What you've built in this section completes the GenAIOps lifecycle:

```
  Deploy AI App
       |
       v
  Observe (Metrics, Logs, Traces)    <-- Module 6.1-6.4
       |
       v
  Collect User Feedback              <-- This section
       |
       v
  Export as Eval Dataset
       |
       v
  Run Evaluations (Module 4)
       |
       v
  Improve Prompts / Models
       |
       v
  Redeploy (GitOps)                  <-- Module 3
       |
       '-------> back to Observe
```

This is the fundamental difference between a demo AI project and a production AI system: production systems **learn from their users** and **improve systematically**. Observability gives you the infrastructure to make that possible.
