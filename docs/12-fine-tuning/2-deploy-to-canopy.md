# 🚀 Deploy to Canopy

Your fine-tuned model passed evaluation. Time to put it in front of students.

## Deployment Options

You have two paths:

| Option | Pros | Cons |
|--------|------|------|
| **Merged model** | Simple deployment, one artifact | Larger storage, can't switch adapters |
| **Base + LoRA adapter** | Multiple adapters, easy A/B testing | Slightly more complex setup |

For Canopy, we'll use **Base + LoRA adapter** as this can lets us:
- Run multiple tutoring styles (Socratic, direct instruction)
- A/B test against the prompt-engineered version
- Roll back instantly by disabling the adapter

## Configure vLLM for Adapters

Update your vLLM deployment to enable LoRA support:

| Configuration | What It Does |
|---------------|--------------|
| `enableLora: true` | Enables LoRA adapter loading |
| `maxLoraRank: 16` | Must match your adapter's rank |
| `loraModules` | List of adapters to load at startup |

You can also specify adapters at runtime via the API—just include the adapter name in your request.


