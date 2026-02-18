# Automatically trigger on git changes

Now that we have successfully ran our evaluation pipeline (🎉), we would like it to run automatically everytime we make a change to our tests, prompts, or backend.  
To do this, we can create a Tekton pipeline with a git hook to the relevant repos. This Tekton pipeline will then trigger our evaluation kubeflow pipeline. 🔗

## Update Llama Stack in test

Just like we enabled evaluations for Llama Stack in our `experimentation` environment, we need to enable it for our `test` environment.

1. Go back to your workbench in the `<USER_NAME>-canopy` namespace.

2. Inside of `genaiops-gitops/canopy/test/llama-stack/config.yaml` add this line:

   (This is basically the same as checking the `eval` box in the previous section.)

    ```yaml
    eval:
      enabled: true
    ```

    Your final `config.yaml` should look something like this:

    <div class="highlight" style="background: #f7f7f7; overflow-x: auto; padding: 8px;">
    <pre><code class="language-yaml"> 
    chart_path: charts/llama-stack-operator-instance
    models:
     - name: "llama32"
       url: "http://llama-32-predictor.ai501.svc.cluster.local:8080/v1"
    eval:      # 👈 added
      enabled: true
    </code></pre>
    </div>

3. Let's push the changes for Argo CD to pick it up.

    ```bash
    cd /opt/app-root/src/genaiops-gitops
    git add .
    git commit -m  "🤔 enable evaluation 🤔"
    git push 
    ```

## Install Pipeline Server

We also need to set up our pipeline server for our `toolings` namespace, but this time we will do it with ArgoCD.

1. Like before, open your workbench in the `<USER_NAME>-canopy` namespace.

2. Let's add a DSPA (which stands for **D**ata**S**cience**P**ipeline**A**pplication, and is our pipeline server) folder and `config.yaml` under `genaiops-gitops/canopy/toolings`, you can do that by running these commands:

    ```bash
    mkdir /opt/app-root/src/genaiops-gitops/toolings/dspa
    touch /opt/app-root/src/genaiops-gitops/toolings/dspa/config.yaml
    ```
    We don't have any specific settings inside for our DSPA, let's add it to the `config.yaml` in the next step

3. Inside of `genaiops-gitops/toolings/dspa/config.yaml` add this:

    ```yaml
    ---
    chart_path: charts/dspa
    ```

4. Let's push the changes for Argo CD to pick it up.

    ```bash
    cd /opt/app-root/src/genaiops-gitops
    git add .
    git commit -m  "🪈 Set up our pipeline server 🪈"
    git push 
    ```

5. As soon as it's ready you can go to `OpenShift AI` -> `Projects` -> `<USER_NAME>-toolings` -> `Pipelines` and see that it's available to start importing pipelines:  

    ![dspa-ready](images/dspa-ready.png)

Great, now you are all set up!  

## Trigger our Kubeflow pipeline through a Tekton pipeline

Now we are ready to set up automatic runs of our Kubeflow pipeline!  
We will be triggering it from a Tekton Pipeline, where we both will have a step for our Llama Stack Evals and for GuideLLM.  

1. Let's deploy the Tekton pipeline through ArgoCD. Start by running: 

    ```bash
    mkdir /opt/app-root/src/genaiops-gitops/toolings/evaluation-pipeline
    touch /opt/app-root/src/genaiops-gitops/toolings/evaluation-pipeline/config.yaml
    ```
    This will create a config file inside `genaiops-gitops/toolings/evaluation-pipeline`.

2. Open up the `evaluation-pipeline/config.yaml` file and paste the below yaml to config.yaml.

    ```yaml
    chart_path: charts/canopy-evals-pipeline
    USER_NAME: <USER_NAME>
    CLUSTER_DOMAIN: <CLUSTER_DOMAIN>
    kfp:
      llsUrl: http://llama-stack-service.<USER_NAME>-test.svc.cluster.local:8321
      backendUrl: http://canopy-backend.<USER_NAME>-test.svc.cluster.local:8000
    ```

    As you may have noticed, we are pointing our base (Llama Stack) url and backend url to our test namespace, as that's what we want to run our tests on.

3. And finally commit and push it to git, as it only counts if it's in git 😉

    ```bash
    cd /opt/app-root/src/genaiops-gitops
    git add .
    git commit -m "🚄 Evaluation Pipelines 🚄"
    git push
    ```
4. Open the `OpenShift Console` to perform the next steps.

5. From within the `OpenShift Dashboard,` locate `Pipelines` in the Explorer and click: `Pipelines` -> `<USER_NAME>-toolings` -> `canopy-evals-pipeline`.

    You can see that all it does is a simple `git clone` followed by starting the Kubeflow pipeline.  

    After the pipeline is complete it also raises the changes in `test` as a PR to `prod`.

    ![tekton-pipeline](images/tekton-pipeline.png)

6. Great, we have our pipeline! However, so far we would still need to trigger it manually, the only difference from before is that we now trigger a Tekton pipeline that then triggers our Kubeflow pipeline and nothing more...

    ![super-important-meme](images/super-important-meme.jpg)

    To get some use of our Tekton pipeline, let's make it trigger automatically from git changes in our repos.  
    Start by going to Gitea.

7. Inside of Gitea, navigate to your `evals` repository. Go to Settings.

    ![gitea-evals-settings.png](./images/gitea-evals-settings.png)

8. Click `Webhooks` > `Add` and choose Gitea.

    ![gitea-evals-webhook.png](./images/gitea-evals-webhook.png)

9. Enter `http://el-canopy-evals-event-listener.<USER_NAME>-toolings.svc.cluster.local:8080` -> click `Add Webhook`

    ![githook](images/githook.png)

10. Now do the same for **backend** repository 💥💥💥 

    Go to `backend` repository > Settings > Webhook > Add > Gitea and add the same webhook. This will be the second webhook definition for the backend repository.

    ```bash
    http://el-canopy-evals-event-listener.<USER_NAME>-toolings.svc.cluster.local:8080
    ```

    Here we have a filter in our Trigger so that only changes to the `values-test.yaml` file (in other words the prompts) will trigger the pipeline. If you are interested, you can take a look the definition [here](https://github.com/rhoai-genaiops/genaiops-helmcharts/blob/main/charts/canopy-evals-pipeline/templates/triggers/triggers.yaml#L54).


Congratulations! 🎉  

You have now added evals pipelines to your backend and eval repos, so whenever you update your evaluations or prompts, you will run through the tests.

In practice we would also run the tests whenever we build a new backend, but since we are using pre-built backend images we are skipping that for now.

## Try updating your prompt and run evaluations

Let's go and add some more useful tests to trigger the pipeline 🧪

1. Go back to your workbench and enter the `backend/chart/values-test.yaml` file.  
    In there you'll find your system prompt for test environment. Update your prompt as you see fit.

2. After you have finished updating it, commit it to git:
    ```bash
    cd /opt/app-root/src/backend
    git add .
    git commit -m "🍋 triggering the evals 🍋"
    git push
    ```
3. Let's go back to the OpenShift console pipeline view to see if the pipeline started properly.  

    ![pipeline-started](images/pipeline-started.png)

4. Whenever the pipeline is ran, it produces and saves the results in a MinIO bucket called `test-results`. Go there and see how well your tests performed: `https://minio-ui-<USER_NAME>-toolings.<CLUSTER_DOMAIN>/browser/test-results`

5. Alternatively, you can see the results in your Prompt Tracker application (it's in the `Quick Links` in the top right of your lab instructions if you have already closed it 😉). The results will be attached in the related git commit.
   
    ![evals-results-prompt-tracker.png](./images/evals-results-prompt-tracker.png)

6. Finally, if you go to your backend repository in Gitea you should now see a PR ([https://gitea-gitea.<CLUSTER_DOMAIN>/<USER_NAME>/backend/pulls?type=all&state=open](https://gitea-gitea.<CLUSTER_DOMAIN>/<USER_NAME>/backend/pulls?type=all&state=open)) that can be reviewed and accepted if the results looked good enough to go to prod.  

    When you accept the PR, Argo CD will detect the changes in the values files (aka in the prompt), syncs the changes to prod environment, then your prod Canopy starts using the new prompt 🙌
