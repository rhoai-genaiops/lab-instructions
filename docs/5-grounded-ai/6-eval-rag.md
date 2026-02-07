# Evaluate RAG

After we now have built a RAG system, I know what you all are thinking...

![testing_meme](images/testing_meme.png)

And I agree, so that's the end of this section!

...

However, since we already have an evaluation framework it would be a shame not to use it, so let's add some evaluations to make sure our RAG performs as expected after all.

To do that, we simply need to add a new eval folder with some tests in it.

1. Go to your workbench and navigate to `evals` folder.

2. Then start by making a copy of the `Summary` folder and rename it as `information-search`. Here are the commands if you don't want to do it manually:

    ```bash
    cp -r /opt/app-root/src/evals/Summary /opt/app-root/src/evals/information-search
    mv /opt/app-root/src/evals/information-search/summary_tests.yaml /opt/app-root/src/evals/information-search/information_search_tests.yaml
    ```

3. After that, there are a few things we need to change in our new `information-search` folder, specifically inside `information_search_tests.yaml`:
    - The name
    - The endpoint 
    - And of course the prompts

  Open up `evals/information-search/information_search_tests.yaml` and paste this to overwrite the whole file for a good baseline:


```yaml
name: information_search_tests
description: Tests for the information-search prompts of the Llama 3.2 3B model.
model: llama32
endpoint: /information-search
scoring_params:
    "llm-as-judge::base":
        "judge_model": llama32
        "prompt_template": judge_prompt.txt
        "type": "llm_as_judge"
        "judge_score_regexes": ["Answer: (A|B|C|D|E)"]
    "basic::subset_of": null
tests:
  - prompt: "Describe the main learning outcomes for students completing the Advanced Generative AI Systems course."
    expected_result: "Students will learn to design GenAI applications, engineer prompts with evaluation, build production systems with CI/CD, implement RAG pipelines, secure LLM apps with guardrails, integrate multi-modal models, optimize models via quantization, instrument monitoring systems, orchestrate agents with tool-calling, and operate MaaS with APIs and governance."
  - prompt: "What are the key modules covered in weeks 5-8 of the AI501 curriculum?"
    expected_result: "Week 5 covers RAG Foundations (embeddings, chunking, ingestion pipelines), Week 6 covers Guardrails (safety taxonomies, filters, jailbreak defense), Week 7 covers Observability (tracing, metrics, logs, SLI/SLO), and Week 8 covers Tool-Calling & Agents (function calling, MCP, planner/critic loops)."
  - prompt: "What assessment components make up the AI501 course evaluation and what are their weightings?"
    expected_result: "Assessment includes Prompting & Eval Harness (10%), RAG Mini-System (15%), Guardrails & Red-Team (10%), Observability Pack (10%), Optimization Lab (10%), Agent with Tools (10%), Capstone (30%), and Participation (5%)."
  - prompt: "Explain what RAG implementation involves according to the course syllabus."
    expected_result: "RAG implementation involves building pipelines for ingestion, indexing, and retrieval with citations and provenance. Students learn embeddings, chunking strategies, ingestion pipelines, and create ETL→vector DB→retrieval→generation systems with citations."
  - prompt: "What technologies and platforms are used in the AI501 course infrastructure?"
    expected_result: "The course uses AI/ML platforms like Llama Stack abdHugging Face; development tools including Python, PyTorch, LangChain, Docker, and Kubernetes; infrastructure with GPU clusters and vector databases like Pinecone and Weaviate; plus security and monitoring tools for guardrails and observability."
  - prompt: "What are the four practical implementation tracks available in AI501?"
    expected_result: "The four tracks are: Production AI Systems (Llama Stack, GitOps, CI/CD), Knowledge Grounding (RAG design, vector DBs, doc pipelines), AI Safety & Security (Guardrails, red-teaming, observability), and Advanced Applications (Agents/tool-calling, multi-modal, model optimization)."
```
    

  **Note:** These prompts are for the course AI501, depending on what course you ingested before you may need to change them to match your content. To find good prompts and expected responses you can try running a few through the **Canopy UI** or **Llamastack Playground**.

4. After you are happy with the evaluation, make sure to commit it to git:
    ```bash
    cd /opt/app-root/src/evals/information-search
    git add .
    git commit -m "🥼 RAG eval added 🥼"
    git push
    ```

5. Our eval pipeline should trigger off of this git push, just like in the `Ready to Scale 201` section, you can go to OpenShift Pipelines to see how it's progressing.

You can find the results in MinIO `test-results` bucket but let's continue to automate this whole flow and see the results in our little Prompt Tracker application.
