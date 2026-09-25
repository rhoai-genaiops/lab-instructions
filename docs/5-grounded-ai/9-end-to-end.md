## Automate the Flow with Tekton

1. Let's automate this whole flow when there is a new document uploaded to MinIO! For that we need to deploy a Tekton pipeline to handle triggering the KFP (Kubeflow Pipelines) as well as some surrounding ops tasks (very similar to what we did in Ready to Scale 201).
    In the end, the whole flow will look like this:

    ![doc-ingestion-tekton-flow.png](./images/doc-ingestion-tekton-flow.png)


Let's deploy the Tekton pipeline by creating a folder under `genaiops-gitops/toolings` as below:

  ```bash
  mkdir -p /opt/app-root/src/genaiops-gitops/toolings/doc-ingestion-pipeline
  touch /opt/app-root/src/genaiops-gitops/toolings/doc-ingestion-pipeline/config.yaml
  ```

2. Update the `config.yaml` file:

    ```yaml
    ---
    chart_path: charts/canopy-doc-ingestion-pipeline
    username: <USER_NAME>
    cluster_domain: <CLUSTER_DOMAIN>
    ```

3. Commit and push changes as always.

    ```bash
    cd /opt/app-root/src/genaiops-gitops
    git pull
    git add .
    git commit -m "🦁 RAG doc ingestion pipeline added 🦁"
    git push
    ```

4. This pipeline will give you a webhook to add to MinIO so that when we upload a file, MinIO can trigger the Tekton pipeline.  
Go to MinIO ([https://minio-ui-<USER_NAME>-toolings.<CLUSTER_DOMAIN>](https://minio-ui-<USER_NAME>-toolings.<CLUSTER_DOMAIN>)) > `Events` and click on `Add Event Destination` on the right top. Select `Webhook`:

    ![minio-webhook-1.png](./images/minio-webhook-1.png)

5. Fill out the form with these two information:

    **Identifier:** `doc-ingestion-webhook`

    **Endpoint:** `http://el-canopy-doc-ingestion-event-listener.<USER_NAME>-toolings.svc.cluster.local:8080`

    ..and hit `Save Event Destination`.

    ![minio-webhook-2.png](./images/minio-webhook-2.png)

6. Strangely on top, MinIO will ask you to restart it to make the configuration takes effect. Click `Restart` and just refresh the page 🤷

    ![minio-webhook-3.png](./images/minio-webhook-3.png)

7. Now, let's associate this webhook with `documents` bucket. Go to Buckets > documents > Events and click `Subscribe to Event`. Select your newly created webhook from the dropdown menu of ARN, and check `PUT - Object Uploaded` as the event. `Save` your changes. You don't have to restart it again :)

    ![minio-webhook-4.png](./images/minio-webhook-4.png)

8. Now, you can download yet another syllabus that your choice from [RDU website](https://rdu-website-ai501.<CLUSTER_DOMAIN>) and upload it to `documents` bucket. You need to go to `Object Browser` > `documents` for it.

    ![minio-upload-pdf.gif](./images/minio-upload-pdf.gif)

9. After you upload the PDF, go to `OpenShift console` > `Pipelines` and observe that a pipeline is triggered.

    ![rag-tekton-pipeline.png](./images/rag-tekton-pipeline.png)

10. And if you go back to the OpenShift AI console, you'll see that `doc-ingestion` Kubeflow Pipeline is running:

    ![rag-kfp-pipelinerun.png](./images/rag-kfp-pipelinerun.png)

11. After the pipeline finish, you'll see a automated push happened in `genaiops-gitops` repository (which in turn will start our eval pipeline). 

    ![gitea-auto-commit.png](./images/gitea-auto-commit.png)

## Automated Promotion with Evaluation Results

Remember the evaluation pipeline we deployed back in [Ready to Scale 201](../4-ready-to-scale-201/3-automate-with-tekton.md)? Now with the full RAG flow in place, it does something extra: after all evaluations pass, it **automatically creates a Pull Request** to promote the new `vector_db_id` to production — with all evaluation results embedded directly in the PR body.

The evaluation pipeline:

- Runs **KFP evaluations** (groundedness, relevance, precision) against the new vector DB using MLflow
- Runs **GuideLLM benchmarks** (throughput, latency, TTFT) against the backend endpoints
- Creates a **PR to `genaiops-gitops`** with the results so you can make an informed decision

12. After the evaluation pipeline finishes (triggered by the doc-ingestion completing), go to `Gitea` > `genaiops-gitops` > `Pull Requests`. You'll see an automated PR has been created with the evaluation results:

    ![eval-pr-created.png](./images/eval-pr-created.png)

13. Open the PR and inspect the body. It contains:

    **KFP Evaluation Metrics** — a table with the latest MLflow metrics (groundedness, relevance, precision) for each experiment, plus direct links to the MLflow run in OpenShift AI.

    **GuideLLM Benchmarks** — a table with throughput (req/s), output tokens/s, TTFT, and latency for each endpoint.


14. Click on the MLflow links in the PR to navigate directly to the experiment run in the OpenShift AI dashboard.

15. You can also check the GuideLLM detailed HTML reports in MinIO. Go to MinIO > Object Browser > `test-results` and navigate to the folder matching the commit hash.

16. **You are the human in the loop!** Review the evaluation results in the PR:
    - Are the groundedness and relevance scores acceptable?
    - Is the latency within your SLA requirements?
    - Does the new document improve or degrade the overall quality?

    If everything looks good, **merge the PR** to promote the new `vector_db_id` to production. If not, go back and iterate — add more test cases, improve your prompts, or ingest better documents.

17. After merging, ArgoCD will automatically deploy the new `vector_db_id` to the production backend. The full GitOps cycle is complete!

    ```
    New Document → Doc Ingestion → Vector DB Updated → Evaluations Run
        → PR Created with Metrics → Human Reviews → Merge → Production Deployed
    ```

18. What if your evals don't cover anything related to the last PDF you uploaded? Feel free to update your evals by adding more prompt & expected result pairs (Prompt Engineering Yay!). When you update the dataset, the evals pipeline will be triggered automagically and a new PR will be created with the updated results!
