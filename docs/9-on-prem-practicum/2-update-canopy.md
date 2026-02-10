# 🔄 Update Canopy to Use On-Prem Models

Now that we have a model running locally, it's time to connect it to our application stack. This involves two steps: updating Llama Stack to point to the new model endpoint, and verifying Canopy works with the on-prem setup.

## 🦙 Update Llama Stack Configuration

1. Navigate to **OpenShift Console** → **Helm** → **Releases** and find your `llama-stack-operator-instance` release in the `<USER_NAME>-canopy` project.

2. Click on the release and select **Upgrade**.

    ![tiny-llama-upgrade.png](./images/tiny-llama-upgrade.png)

3. Let's add your newly deployed on-prem TinyLlama as another model endpoint to your Llama Stack. That way, you'd be able to access both cloud model Llama 3.2 3B and TinyLlama via Llama Stack. 

    In the Form view, add the TinyLlama endpoint to the Llama Stack configuration under `models` by clicking **Add models**:

    - **Model Name**: `tinyllama`
    - **Model URL**: `http://tinyllama-predictor:8080/v1`
    - **Token**: (leave it empty)

4. Click **Upgrade** to apply the changes.

    ![tiny-llama-upgrade2.png](./images/tiny-llama-upgrade2.png)

5. Now we can point the `backend` to TinyLlama for summarization use case (and lower the `max_token` because TinyLlama can't handle as much as previous 😅). So find `canopy-backend` under **OpenShift Console** → **Helm** → **Releases** 

    ![tiny-backend-upgrade.png](./images/tiny-backend-upgrade.png)

6.  Let's first evaluate the summarization use case with the new model. Add these under `summarize`.

    ```yaml
    summarize:
      enabled: true
      max_tokens: 512 # 👈 ADD this ❗️❗️❗️
      model: vllm-tinyllama/tinyllama # 👈 UPDATE this ❗️❗️❗️
      prompt: "<your prompt>"
    ```

7. Click **Upgrade** to apply the changes.

    ![tiny-backend-upgrade2.png](./images/tiny-backend-upgrade2.png)

### 🌳 Test Canopy with the New Model

Once Llama Stack and backend are back up, let's verify it can communicate with the on-prem model.

1. Go to [Canopy UI](https://canopy-ui-<USER_NAME>-canopy.<CLUSTER_DOMAIN>) and test summarization. You can copy the text about Turkish tea from the previous chapters if you wish ☕️

   And please be patient. TinyLlama is doing its best for you 🦙🏋️‍♀️♥️

2. You should receive a response from TinyLlama. Notice how the response style and capabilities might differ from Llama 3.2 3B. That's expected given the smaller model size.

> **Observation**: TinyLlama responses may be less sophisticated (and slower) than larger models running on GPUs, but is often a whole lot cheaper as it runs on CPU. This is the trade-off you make for CPU-only deployment.

3. Compare the responses to what you experienced with the cloud-hosted model. Consider:
   - **Response quality**: Are answers still helpful and accurate?
   - **Response time**: How does latency compare?

    You can compare the Canopy in your experimentation area with the Canopy in your test environment. Since we haven't touched our GitOps configuration, `test` and `prod` are still using te cloud model. You can access the test Canopy by clicking [here](https://canopy-ui-<USER_NAME>-test.<CLUSTER_DOMAIN>) or copying the below URL to your favourite browser:

    ```bash
    https://canopy-ui-<USER_NAME>-test.<CLUSTER_DOMAIN>
    ```

## 📊 Performance Considerations

Running models on CPU introduces different performance characteristics:

| Metric | Cloud Endpoint | On-Prem CPU |
| ------ | -------------- | ----------- |
| Time to First Token | ~100-500ms | ~1-3 seconds |
| Tokens per Second | 50-100+ | 5-15 |
| Concurrency | High | Limited |
| Data Privacy | External | Full control |

For development and testing, CPU inference is perfectly acceptable. For production workloads with higher traffic, you'll want to revisit GPU allocation or consider model optimization techniques 😉

You found a way to keep the student data completely within your infrastructure.But are your fellow students and professors going be happy with this?

Let's look into model optimization and compression before we settle with TinyLlama actually 🦙🌿