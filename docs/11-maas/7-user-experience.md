# WIP 

# 👤 User Experience

> 👤 **Persona Focus: The Consumer** — Forget infrastructure. Forget budgets. Forget OAuth configurations. You're a developer who just wants to call an AI model. "Give me an endpoint and an API key, and let me build cool stuff!"

---

## 🎯 What You'll Learn

In this lesson, you'll experience LiteMaaS from the user's perspective:

* 🔑 Create and manage your API keys
* 🚀 Make your first API call (the "Hello World" of AI!)
* 💬 Explore the chatbot playground
* 📊 Track your personal usage

---

## 🌟 The Self-Service Experience

Remember the old way?

```
Old Way (pre-MaaS):
1. Submit a ticket requesting GPU access
2. Wait 3-5 business days
3. Get access to spin up your own model
4. Figure out how to deploy vLLM
5. Debug why it won't start
6. Finally make an API call
7. Forget about it for 6 months (still consuming GPU)
```

The MaaS way:

```
MaaS Way:
1. Log in
2. Create API key
3. Make API call
4. Build your app
5. Check usage whenever you want
```

[Image: Side-by-side comparison meme:
LEFT: "Deploying my own model" - person climbing a mountain with heavy backpack
RIGHT: "Using MaaS" - person relaxing in a hammock with laptop, calling an API]

---

## 🔐 Step 1: Log In

1. Open your browser and navigate to:
   ```
   https://litemaas-<USER_NAME>-maas.apps.<CLUSTER_DOMAIN>
   ```

2. Click **"Login with OpenShift"**
3. Enter your OpenShift credentials
4. You're in! 🎉

As a regular user, you'll see a simplified dashboard:

[Image: User dashboard showing:
- Welcome message with username
- Quick stats cards: API Keys (1 active), This Month's Usage ($12.50), Remaining Budget ($87.50)
- Quick actions: "Create API Key", "Open Playground"
- Recent activity feed]

---

## 🔑 Step 2: Create Your First API Key

API keys are your ticket to AI. Each key:

* 🎫 Authenticates your requests
* 🤖 Can be scoped to specific models
* 💰 Has its own budget (optional)
* 📊 Tracks usage separately

### Creating a Key

1. Click **"API Keys"** in the sidebar (or the quick action button)
2. Click **"Create New Key"**
3. Fill in the details:

| Field | Value | Why |
|-------|-------|-----|
| **Name** | `my-first-key` | Descriptive names help you manage multiple keys |
| **Description** | `Testing the MaaS platform` | Optional but helpful |
| **Models** | Select `granite-8b` | Which models this key can access |
| **Budget** | `$10` (optional) | Per-key spending limit |

4. Click **Create**

[Image: Create API Key modal showing:
- Name input field
- Description textarea
- Models multi-select dropdown (checkboxes)
- Budget input with currency symbol
- Create/Cancel buttons]

### ⚠️ Save Your Key!

After creation, you'll see your API key **exactly once**:

```
sk-litemaas-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

[Image: Success modal showing:
- Green checkmark
- "API Key Created Successfully!"
- Key displayed in monospace font with copy button
- Warning: "This key will only be shown once. Copy it now!"
- "I've copied my key" button to dismiss]

> 🔒 **Security Note:** LiteMaaS doesn't store your key in plain text. If you lose it, you'll need to create a new one.

---

## 🚀 Step 3: The "Hello World" of AI

Time for the moment of truth — your first API call!

### Using curl

Open your terminal and run:

```bash
curl https://litemaas-<USER_NAME>-maas.apps.<CLUSTER_DOMAIN>/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer sk-litemaas-YOUR-KEY-HERE" \
  -d '{
    "model": "granite-8b",
    "messages": [
      {"role": "user", "content": "Hello! What is 2+2?"}
    ]
  }'
```

### The Response

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1699876543,
  "model": "granite-8b",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! 2 + 2 equals 4. Is there anything else you'd like to know?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 18,
    "total_tokens": 30
  }
}
```

🎉 **Congratulations!** You just made your first MaaS API call!

[Image: Celebratory "Achievement Unlocked" style graphic with:
- 🏆 "First API Call!"
- "You're now officially an AI developer"
- Confetti effects]

### Using Python

```python
import requests

url = "https://litemaas-<USER_NAME>-maas.apps.<CLUSTER_DOMAIN>/v1/chat/completions"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer sk-litemaas-YOUR-KEY-HERE"
}
data = {
    "model": "granite-8b",
    "messages": [
        {"role": "user", "content": "Write a haiku about cloud computing"}
    ]
}

response = requests.post(url, json=data, headers=headers)
print(response.json()["choices"][0]["message"]["content"])
```

Output:
```
Servers in the sky,
Data flows like morning mist—
Infinite, yet near.
```

### Using the OpenAI Python SDK

Since LiteMaaS is OpenAI-compatible, you can use the official OpenAI SDK:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://litemaas-<USER_NAME>-maas.apps.<CLUSTER_DOMAIN>/v1",
    api_key="sk-litemaas-YOUR-KEY-HERE"
)

response = client.chat.completions.create(
    model="granite-8b",
    messages=[
        {"role": "user", "content": "What's the meaning of life?"}
    ]
)

print(response.choices[0].message.content)
```

> 💡 **This is powerful!** Any application built for OpenAI can work with your private MaaS — just change the `base_url`.

---

## 💬 Step 4: The Chatbot Playground

Don't want to write code? Use the built-in playground!

1. Navigate to **Playground** in the sidebar
2. Select a model from the dropdown
3. Start chatting!

[Image: Playground interface showing:
- Model selector dropdown (granite-8b selected)
- Chat window with sample conversation
- Message input at bottom
- Settings panel on right: Temperature slider, Max tokens, System prompt
- Token counter showing current session usage]

### Playground Features

| Feature | Description |
|---------|-------------|
| **Model Switching** | Try different models mid-conversation |
| **System Prompt** | Set the AI's personality/behavior |
| **Temperature** | Control creativity (0 = focused, 1 = creative) |
| **Max Tokens** | Limit response length |
| **Token Counter** | Real-time usage tracking |
| **Export** | Download conversation as JSON |

### Exercise: Compare Models

If you have multiple models available:

1. Ask the same question to `granite-8b`
2. Switch to a different model
3. Ask the same question again
4. Compare the responses!

This is a great way to evaluate which model works best for your use case.

---

## 📊 Step 5: Track Your Usage

As a responsible developer (and budget-conscious human), you'll want to know how much you're using.

### Your Personal Dashboard

Navigate to **Dashboard** to see:

[Image: Personal usage dashboard showing:
- This Month card: $12.50 spent of $100 budget (progress bar at 12.5%)
- Usage Trend: Line graph showing daily usage over past 30 days
- Top Models: Pie chart showing usage by model
- Recent Requests: Table with last 10 API calls]

### Detailed Usage View

Click on **Usage** in the sidebar for more details:

| View | Shows |
|------|-------|
| **By Day** | Daily token consumption |
| **By Model** | Which models you use most |
| **By API Key** | Usage per key (useful if you have multiple) |
| **By Application** | If you've tagged requests with metadata |

### Understanding Token Usage

```
Your usage breakdown:
├── Input tokens: 15,234 (prompts you send)
├── Output tokens: 42,891 (responses you receive)
└── Total: 58,125 tokens

Estimated cost: $12.47
├── Input: 15,234 × $0.0005/1K = $7.62
└── Output: 42,891 × $0.0015/1K = $64.34... wait, that's wrong!

Actually:
├── Input: 15.234K × $0.0005 = $0.0076
└── Output: 42.891K × $0.0015 = $0.0643
└── Total: ~$0.07

(Tokens are cheap! The budget is generous for learning.)
```

> 💡 **Pro Tip:** Output tokens typically cost 2-3x more than input tokens because generation is more computationally expensive.

---

## 🔑 Managing Multiple API Keys

As you build more applications, you'll want separate keys for each:

| Key Name | Purpose | Budget |
|----------|---------|--------|
| `dev-testing` | Local development and experiments | $5 |
| `canopy-backend` | Production Canopy application | $50 |
| `jupyter-notebooks` | Data science experiments | $20 |

### Best Practices

1. **One key per application** — Easier to track usage and revoke if needed
2. **Descriptive names** — Future you will thank present you
3. **Separate dev/prod keys** — Don't use your production key for testing
4. **Regular rotation** — Regenerate keys periodically for security

### Viewing Your Keys

Navigate to **API Keys** to see all your keys:

[Image: API Keys list showing:
- Table with columns: Name, Created, Last Used, Models, Budget Used, Status
- Example rows with different keys
- "Create New Key" button
- Actions: View Details, Regenerate, Delete]

> ⚠️ **Note:** You can't see the actual key values — only metadata. If you need the key value, you'll have to create a new one.

---

## 🎮 Hands-on Exercises

### Exercise 1: Create a Specialized Key

1. Create a new API key called `poetry-generator`
2. Give it access to only one model
3. Set a budget of $2
4. Use it to generate 5 poems

### Exercise 2: Explore the Playground

1. Open the Playground
2. Set a system prompt: "You are a helpful assistant who only responds in rhymes."
3. Ask it about the weather
4. Try changing the temperature and see how responses differ

### Exercise 3: Track Your Usage

1. Make 10 API calls with different prompts
2. Go to Usage and find today's usage
3. Calculate the average tokens per request
4. Identify which request used the most tokens

---

## 🧪 Knowledge Check

<details>
<summary>❓ Why should you create separate API keys for different applications?</summary>

✅ **Answer:** Separate keys give you:
- Better usage tracking (know which app uses what)
- Easier revocation (if one app's key leaks, others are unaffected)
- Per-application budgets (control costs per project)
- Cleaner audit trails
</details>

<details>
<summary>❓ What makes LiteMaaS "OpenAI-compatible"?</summary>

✅ **Answer:** LiteMaaS uses the same API format as OpenAI (`/v1/chat/completions`, same request/response structure). This means any application written for OpenAI can work with LiteMaaS by just changing the base URL and API key.
</details>

<details>
<summary>❓ Why do output tokens typically cost more than input tokens?</summary>

✅ **Answer:** Output tokens require generation — the model has to "think" and produce new text. Input tokens just need to be processed and understood. Generation is more computationally expensive, so it costs more.
</details>

---

## 🎯 What You've Accomplished

As a Consumer, you've now:

* ✅ Created your first API key
* ✅ Made the "Hello World" of AI — your first API call!
* ✅ Explored the chatbot playground
* ✅ Learned to track your personal usage

[Image: Achievement badge with "👤 AI Developer" text and subtitle "You're now building with AI — no GPU knowledge required!"]

---

## 🎯 Next Steps

Now you know how to use MaaS as a consumer. But what about the big picture? How does the organization track usage across *everyone*?

Put your 📊 **Owner/Accountant** hat back on — it's time to dive into observability and chargeback!

**Continue to [Usage & Observability](./5-usage-observability.md)** →
