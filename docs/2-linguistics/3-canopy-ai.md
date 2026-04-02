# 🌿 What is Canopy?

<div class="terminal-curl"></div>

**Canopy** is an intelligent, leafy little assistant designed to support teaching and learning at **Redwood Digital University**. From summarizing texts to generating quizzes and scoring assignments — it’s your educational AI buddy in action.

Canopy frontend gives you a clean, playful UI built in Streamlit, powered by your choice of LLMs. Whether hosted in OpenShift or running locally, it’s built for experimentation and enablement.

## 🎯 Why This Frontend Matters for Prompt Engineering

Just like a good prompt shapes a great model response, **a good user interface shapes great exploration**.

In GenAI applications, **how people interact with the model often matters more than which model you use**.

You can have the smartest LLM in the world, but if the UI doesn't help users to easily interact with it — the value is lost.

This first iteration of **Canopy** is built to support:

- System prompts 🧠 to define model behavior.

- User prompts 💬 to define what you ask.

- Live streaming output 🌱 so you see each token bloom.

In future modules, this same interface will evolve to handle information search, intelligent student assistance, and socratic tutoring.

## 🚀 Getting Started with Canopy on OpenShift

Let's get you your own instance of Canopy up and running in just a few minutes.

### 📦 1. Deploy the Frontend to OpenShift

In OpenShift, you have an experimentation environment which is called `<USER_NAME>-canopy`. You'll use this environment to iterate over Canopy, bring in new features, update the frontend when new capabilities arrive, and so on.

1. Go to [OpenShift Console](https://console-openshift-console.<CLUSTER_DOMAIN>) and enter your credentials:

    User: `<USER_NAME>`
    Password: `<PASSWORD>`

    After logging in, you will see the Projects page:

    ![openshift-console.png](./images/openshift-console.png)

2. Expand `Helm` section from the left menu, click `Releases` and make sure you are on `<USER_NAME>-canopy` project. Then from the top right select `Create Helm Release`. 

    ![add-helm.png](./images/add-helm.png)

3. Select `Canopy Helm Charts` and click on `Canopy UI` helm chart to deploy.

    ![canopy-helm](./images/canopy-helm.png)

4. Hit `Create` , then expand `Canopy UI Helm Chart Values Schema` and fill out the values as below:

    - **SYSTEM_PROMPT:** Do you remember the great prompt you came up with in the previous section? Let's paste that here or use the one you pasted to the top of the instructions!
```
<PROMPT>
```
    - **MODEL_NAME:** `llama32`
    - **LLM_ENDPOINT:** `https://llama32-ai501.<CLUSTER_DOMAIN>`
  
    Leave the rest as it is for now.

    ![helm-values.png](./images/helm-values.png)

    ✅ This will create:

      - A UBI9-based Streamlit application that sends your chat requests to the LLM
      - A secure OpenShift route for us to access the app outside of the cluster

5. Once the application is successfully running, click the external link icon (↗) in the top-right corner of the pod to access the Canopy UI 🌳🌳🌳

    ![canopy-ui-ocp.png](./images/canopy-ui-ocp.png)


### 🧪 2. Try the Summarization UI

1. You can copy the text about Canopy from Wikipedia: https://en.wikipedia.org/wiki/Canopy_(biology). And paste it to the application to summarize. So paste the content to the text box, press `Send 💬` and then watch the model generate a summary in real-time ✨

    ![summarize-with-canopy](./images/summarize-with-canopy.png)

---

✅ What you have accomplished

   - Deployed the Canopy frontend on OpenShift

   - Connected it to the provided LLM endpoint

   - Used the system prompt to shape the assistant's behavior

   - Understood the relationship between prompting and summarization style
