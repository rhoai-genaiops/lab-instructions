# 🧪 Extra Credit: Prompt Optimization

You've closed the observability loop — metrics, logs, traces, and user feedback all flowing into MLflow. Now let's put that data to work. Instead of manually tweaking your summarization prompt and hoping for the best, you'll use **automated prompt optimization** to systematically improve it based on real evaluation results.

This is fully optional, but if you're curious about where GenAIOps meets automated ML, this is it.

## What is GEPA?

GEPA (Generate, Evaluate, Predict, Adapt) is MLflow's automated prompt optimization algorithm. You give it:

- A prompt to improve
- An evaluation dataset with expectations
- A set of scorers that define "good"

It runs your dataset through the model, analyses which cases failed and why, generates a rewritten prompt that addresses those weaknesses, and registers the result as a new version in the Prompt Registry. All automatically.

So instead of guessing what makes a better prompt, you let the failure cases tell you.

## Prerequisites

Before running this notebook you should have:

- Completed the [Feedback Loops](5-feedback-loops.md) section — ideally with a few 👍 and 👎 collected
- Access to your MLflow dashboard
- Your workbench running (the notebook runs there)

Thumbs-down traces from Canopy are the ideal input. If you don't have enough yet, the notebook includes simulated feedback as a fallback — you'll still see the full optimization loop in action.

## The Notebook

Open your workbench and navigate to:

```
experiments/6-prompt-optimization/prompt_optimization.ipynb
```

The notebook walks through seven steps:

| Step | What happens |
|------|-------------|
| 1. Register Prompt | The current Canopy summarization prompt is registered in MLflow as v1 |
| 2. Run Queries | Five sample texts are summarized, each trace linked to the prompt version |
| 3. Attach Feedback | Pull real thumbs-down traces from Canopy, or attach simulated feedback |
| 4. Build Dataset | Annotated traces become a reusable MLflow evaluation dataset |
| 5. Evaluate v1 | Score the baseline prompt against `contains_keyword` and `is_concise` |
| 6. Optimize | GEPA rewrites the prompt to fix the failing cases |
| 7. Compare | Run the same eval on the optimized prompt and see the improvement |

## What You Get

By the end of the notebook you'll have:

- A versioned prompt history in MLflow showing exactly what changed and why
- Quantified before/after scores — not just a feeling that it's better
- An evaluation dataset you can reuse every time you want to improve the prompt
- A concrete path to promoting the winning prompt back to Canopy (via config or the Prompt Registry)

The loop that started with a user clicking 👎 ends with a measurably better AI application.
