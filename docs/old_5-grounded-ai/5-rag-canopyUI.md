# 🌐 Powering Canopy with RAG Capabilities

## Integrate RAG into Canopy

The Canopy application we deployed already has RAG built-in as you may have seen from the feature list on the left, we just need to enable the feature flag.

1. Go to your workbench and open the file `backend/chart/values-test.yaml`

2. Edit the file to contain the `information-search` feature flag. Feel free to change the prompt, this is a system prompt just like before.

    ```yaml
    LLAMA_STACK_URL: "http://llama-stack-service:8321"
    summarize:
      enabled: true
      model: vllm-llama32/llama32
      temperature: 0.9
      max_tokens: 4096
      prompt: |
        You are a helpful assistant. Summarize the given text please.
    information-search:         # 👈 add this block 📚❗︎
      enabled: true
      vector_db_id: latest
      model: vllm-llama32/llama32
      prompt: |
        You are a helpful assistant specializing in document intelligence and academic content analysis.
    ```

3. Push the change to git:

    ```bash
    cd /opt/app-root/src/backend/chart
    git add values-test.yaml
    git commit -m "🔨 RAG feature added 🔨"
    git push
    ```

4. Open the Canopy UI (https://canopy-ui-<USER_NAME>-test.<CLUSTER_DOMAIN> if you have closed it since last time), select the *Information Search* feature in the left menu and ask something like `what is the total credits in Biotechnology program in Redwood Digital University?`

Replace "Biotechnology" in the prompt with the program syllabus you've uploaded to Minio. For example, if you uploaded the "Computer Science" syllabus only, update the prompt to say "Computer Science" instead of "Biotechnology."

  ![ask-canopy.png](images/ask-canopy.png)

Congratulations! 🎉  
You now have a fully functioning RAG system where you can ingest complex documents as needed.

But the question is, are we going to run the pipeline manually every time or do we have a better way to do this? And what about production? Are we going to push without any testing?!

Let's advance to the next section!
