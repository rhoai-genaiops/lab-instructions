# 🚀 Deploy to Canopy

Your fine-tuned model passed evaluation. Time to put it in front of students.

> 💡 **Workshop vs Production:** In this module, you trained a small model (Qwen2-0.5B) on CPU for learning purposes. For production deployment, you'd train a larger model (Llama 3.2 3B+) on GPU and deploy that. The deployment *process* is identical—only the model changes.

## Deployment Options

You have two paths:

| Option | Pros | Cons |
|--------|------|------|
| **Merged model** | Simple deployment, one artifact | Larger storage, can't switch adapters |
| **Base + LoRA adapter** | Multiple adapters, easy A/B testing | Slightly more complex setup |

For Canopy, we'll use **Base + LoRA adapter**. This lets us:
- Run multiple tutoring styles (Socratic, direct instruction)
- A/B test against the prompt-engineered version
- Roll back instantly by disabling the adapter

## Serving LoRA Adapters with vLLM

vLLM supports dynamic LoRA loading. One base model, multiple adapters.

You can define available adapters and switch between them per-request. This means the same GPU memory serves multiple behaviors:

```
Base Model (Llama 3.2 3B): Loaded once
├── LoRA Adapter: socratic-tutor    ← Math tutoring mode
├── LoRA Adapter: direct-assistant  ← Regular assistant mode
└── LoRA Adapter: code-reviewer     ← Code review mode
```

## Package the Adapter

For deployment, package your adapter as a ModelCar (from Module 10). The adapter is only ~30MB—much smaller than a full model image.

Build a container with just the adapter files, tag it with a version, and push to your registry.

## Configure vLLM for Adapters

Update your vLLM deployment to enable LoRA support:

| Configuration | What It Does |
|---------------|--------------|
| `enableLora: true` | Enables LoRA adapter loading |
| `maxLoraRank: 16` | Must match your adapter's rank |
| `loraModules` | List of adapters to load at startup |

You can also specify adapters at runtime via the API—just include the adapter name in your request.

## Update Canopy

Modify Canopy to request the LoRA adapter. Map tutoring modes to adapter names:

| Mode | Adapter | Behavior |
|------|---------|----------|
| Socratic | `socratic-tutor` | Asks guiding questions |
| Direct | `direct-tutor` | Explains solutions |
| Default | None | Uses base model + long prompt |

### Add Mode Selection to UI

Let students choose their tutoring style with a simple toggle. "Socratic (Guided)" vs "Direct (Explanations)" gives students control over their learning experience.

## The Token Savings

Remember why we did this:

| Before (Prompt Engineering) | After (Fine-Tuned) |
|----------------------------|-------------------|
| 700-token system prompt | 20-token system prompt |
| Sent with every message | Sent with every message |
| 9M tokens/day | 2.2M tokens/day |
| Jailbreakable | Resistant |
| Drifts over long conversations | Stable |

**75% reduction in input tokens.** At scale, that's real money.

## GitOps Deployment

Deploy through your existing Argo CD pipeline. Your Helm values define:

- Which adapters to load
- Which adapter image to use for each
- Which adapter is the default

Commit, push, let Argo CD sync.

## Rollback Strategy

If something goes wrong:

**Quick rollback (disable adapter):**
Set the default to `null` to fall back to base model + long prompt.

**Full rollback (revert to prompt engineering):**
1. `git revert` the Canopy changes
2. Argo CD syncs automatically
3. Students are back on the prompt-engineered version

## Monitor in Production

Watch these metrics after deployment:

| Metric | What to Look For |
|--------|------------------|
| Response latency | Should decrease (fewer input tokens) |
| Token usage | Should drop ~70% |
| User satisfaction | Student feedback, complaints |
| Jailbreak attempts | Should fail more often |
| Error rates | New failure modes? |

## A/B Testing

Before full rollout, run an A/B test. Split traffic 50/50 based on user ID:
- Half get the fine-tuned model with minimal prompt
- Half get the base model with full Socratic prompt

Compare:
- Token usage (should be ~70% lower for fine-tuned)
- Response quality (human evaluation)
- Student satisfaction surveys

## 🎉 Module Complete!

You made it. Here's what you now understand:

- ✅ **When to fine-tune** — Behavior that prompts can't reliably enforce
- ✅ **Synthetic data generation** — How SDG Hub creates training data from documents
- ✅ **LoRA training** — How adapters enable efficient fine-tuning
- ✅ **Evaluation** — How to verify behavioral change without capability loss
- ✅ **Production deployment** — How to serve adapters alongside base models

> 💡 **Remember:** This module was a conceptual walkthrough due to GPU and time constraints. When you're ready to fine-tune for real, you have the knowledge to:
> 1. Generate synthetic data with SDG Hub
> 2. Configure and run LoRA training with Training Hub
> 3. Evaluate behavioral and capability changes
> 4. Deploy adapters through your GitOps pipeline

**The bottom line:** You can teach a model to *be* something, not just *pretend* to be something. And you save 75% on tokens while doing it.

## What's Next?

Consider these extensions:

| Extension | What It Enables |
|-----------|----------------|
| Multiple adapters | Different tutoring styles, subjects |
| OSFT training | Add new skills without forgetting |
| Student personalization | Per-student adapter fine-tuning |
| Continuous learning | Update adapters as you collect more data |

The fine-tuning pipeline you've built is reusable. New behavior? Generate data, train adapter, deploy. Same process.
