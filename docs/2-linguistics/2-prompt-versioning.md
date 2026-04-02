# 🗂️ Prompt Versioning

Do you remember the first System Prompt you tried? What was the first one? Why you didn't like the second one? 

There must be a better way to track these experiments you've been conducting in the playground!

This is where we introduce **prompt versioning** and a **prompt registry** concepts!

## 🎯 Why Prompt Versioning Matter

Think of good prompt like a well-written function or component. Once you get it right, you want to reuse it across different apps and users.

But in GenAI workflows, we face a big challenge: Prompt experiments are often **invisible**, **untracked**, and **not reusable**. Just like you experienced a moment ago!

This makes collaboration hard and reproducibility nearly impossible—especially at scale.

There are a variety of different strategies here on where to store your prompts and how to load them into your application. 

In our case, we are going to store the prompt in MLflow Prompt Registry! 

## MLflow Prompt Registry

MLFlow provides bunch of capabilities for developing, debugging, and evaluating LLM applications.

For this chapter, we are going to focus on its prompt registry & versioning feature. We are going to store our prompts on MLflow, add notes, tags, etc when necessary and fetch these prompts from our backend during the runtime. 

Let's go to MLflow and store your favourite Summarization prompt for `<USER_NAME>-canopy` experiment environment. We'll get to talk about production later 🤫🤫🤫

1. Access to [MLflow](Login to [OpenShift AI](https://rh-ai.<CLUSTER_DOMAIN>/)mlflow). Use the same credentials to log in. You’ll see your `<USER_NAME>-canopy` project there too!

2. Click `<USER_NAME>-canopy` and go to `Prompts` from the menu on the left.

3. Click `Create prompt` and call it something like `summarization`. You need this info for the next section :) And paste your new favourite System Prompt for the task. 

    Alternatively you can add a nice commit message there too, and hit `Create`. 

    This is the first version (Version 1) of your prompt and it automatically gets `latest` tag. 

