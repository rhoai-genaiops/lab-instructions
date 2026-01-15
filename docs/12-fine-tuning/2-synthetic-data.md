# 🧪 Synthetic Data Generation

You need training data. Lots of it. But where do you get hundreds of examples of perfect Socratic tutoring conversations?

You *generate* them.

> ⚠️ **Workshop Scope:** Generating a full training dataset takes time and API costs we don't have in this workshop. This section explains the *process* and shows the tools. In the notebook, you'll generate a small sample to see how it works—not enough for real training, but enough to understand the pipeline.

## The Data Problem

Fine-tuning needs examples. For our Socratic tutor, we need conversations where a student asks a math question and the tutor responds with a guiding question (not an answer).

You could manually write these. But you need 500-1000+ examples for effective fine-tuning. That's weeks of work.

**Synthetic Data Generation (SDG)** uses LLMs to generate training data from source documents. You provide course materials, and the pipeline produces conversations that demonstrate the behavior you want.

| What You Need | Workshop Demo | Production |
|---------------|---------------|------------|
| Training examples | 2-5 samples | 500-5000 |
| Generation time | ~2-5 minutes | Hours to days |
| API calls | Minimal | Thousands |

## The Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SYNTHETIC DATA PIPELINE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   Source     │     │   Docling    │     │   Markdown   │                │
│  │   PDFs       │────►│  Conversion  │────►│   Chunks     │                │
│  │              │     │              │     │              │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│                                                   │                         │
│                                                   ▼                         │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐                │
│  │   Training   │     │   Quality    │     │   SDG Hub    │                │
│  │   Dataset    │◄────│   Filter     │◄────│   Generate   │                │
│  │   (JSONL)    │     │              │     │   Q&A Pairs  │                │
│  └──────────────┘     └──────────────┘     └──────────────┘                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Step 1: Convert Documents with Docling

You've seen Docling in Module 5 (RAG). Now we'll use it to prepare source documents for SDG.

RDU has math course materials—PDFs with problems, explanations, and examples. Docling converts these to clean markdown that can be processed by the generation pipeline.

**Why Docling?**

| Raw PDF | After Docling |
|---------|---------------|
| Complex layouts break extraction | Clean structured text |
| Math formulas as images | LaTeX or readable text |
| Tables lose structure | Markdown tables preserved |
| Headers mixed with body | Semantic sections |

The cleaner the source, the better the synthetic data.

## Step 2: Generate Data with SDG Hub

[SDG Hub](https://github.com/Red-Hat-AI-Innovation-Team/sdg_hub) is a modular framework for synthetic data generation. It uses **blocks** (processing units) and **flows** (orchestrated pipelines) to transform documents into training data.

### SDG Hub Concepts

| Concept | Description |
|---------|-------------|
| **Blocks** | Individual processing units that transform data |
| **Flows** | YAML-configured pipelines that chain blocks together |
| **Registry** | Auto-discovery system for finding available flows and blocks |

### How It Works

SDG Hub flows are defined in YAML and orchestrate multiple steps:

1. **Chunk documents** — Break content into manageable pieces
2. **Generate student question** — LLM creates a realistic student question from the content
3. **Generate response** — LLM creates a response based on the content
4. **Format conversation** — Structure the Q&A pair for training

The flow calls your deployed LLM endpoint to generate data—this is an API call, not local inference, so it works fine from your CPU workbench.

### Flow Discovery

SDG Hub includes a registry system that auto-discovers available flows:

```python
from sdg_hub import FlowRegistry, Flow

# Discover available flows
FlowRegistry.discover_flows()

# Search for question-generation flows
qa_flows = FlowRegistry.search_flows(tag="question-generation")

# Load a specific flow
flow = Flow.from_yaml(FlowRegistry.get_flow_path(flow_id))
```

## Step 3: Quality Filtering

Not all generated data is good. A quality filter checks whether responses actually follow the Socratic method:

**Red flags (reject):**
- "the answer is"
- "the solution is"
- "therefore, x ="

**Green flags (accept):**
- "What do you notice..."
- "What operation would..."
- Ends with a question mark

Production pipelines filter aggressively—it's better to have 500 excellent examples than 5000 mediocre ones.

> **Note:** SDG Hub flows generate informative Q&A pairs by default, not Socratic responses. For production Socratic training, you would either customize the flow prompts or post-process the generated data. In our workshop, we use a pre-curated dataset for the actual training.

## What You'll Get

By the end of this process, you'll have training data in JSONL format (one JSON object per line), with conversations like:

- Student asks about linear equations → Tutor asks what operation would isolate x
- Student asks about parabolas → Tutor asks about vertex form
- Student expresses frustration → Tutor acknowledges and offers to break it down

## Scaling Up (Production)

| Dataset Size | Expected Quality |
|--------------|------------------|
| 100-500 examples | Noticeable behavior change |
| 500-1000 examples | Reliable behavior |
| 1000-5000 examples | Strong behavior, handles edge cases |
| 5000+ examples | Production quality |

**Pro tip:** Quality beats quantity. 500 excellent examples outperform 5000 mediocre ones.

## 🧪 Quick Demo

Go to your workbench and open up **`experiments/12-fine-tuning/1-synthetic-data-generation.ipynb`**

In this demonstration, you'll:
1. See how Docling converts the RDU PDF to markdown
2. Explore SDG Hub's flow discovery and configuration
3. Generate a **small sample** (2-5 examples) to understand the process
4. Apply quality filtering to the generated data
5. Examine the output format

> 💡 **Remember:** This is a taste of the process, not a full data generation run. Production datasets require hours of generation time and significant API costs.

When you're done, come back and we'll look at how training works.

## 🎯 Next Steps

Continue to **[Training with LoRA](./3-training.md)** to fine-tune the model on your synthetic data.
