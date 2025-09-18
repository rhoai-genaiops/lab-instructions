# Eval automation with pipelines

Now that we know how the evaluation works, let's automate it by using pipelines! 🎢  

## Update Llama Stack in test

Just like we enabled evaluations for Llama Stack in our `experimentation` envirionment, we need to enable it for our `test` environment.

1. Open up your workbench in the `<USER_NAME>-canopy` namespace.
2. Inside of `genaiops-gitops/canopy/prod/llamastack/config.yaml` and `genaiops-gitops/canopy/test/llamastack/config.yaml` add this line:
    ```yaml
    eval:
        enabled: true
    ```

    Your final config.yaml should look something like this:

    ```yaml
    chart_path: charts/llama-stack
    MODEL_URL: https://llama32-ai501.<CLUSTER_DOMAIN>.com/
    eval:
        enabled: true
    ```

Great, now you are all set up!  

## The Kubeflow pipeline

We will be using Kubeflow Pipelines as our pipeline framework of choise for running the evaluation.  
Kubeflow pipelines are handy for data science/AI engineering tasks as it is Python based and works nicely with OpenShift AI by displaying the pipeline run inside the OpenShift AI dashboard.

The evaluation pipeline is inside of a repo called `canopy-evals`, where both the evaluation tests and pipelines are stored together.  

1. To explore it, start by going into your `<USER_NAME>-canopy` Data Science Project and open up your workbench.

2. Then, clone the repository 
    ```bash
   git clone https://<USER_NAME>:<PASSWORD>@<GIT_SERVER>/<USER_NAME>/canopy-evals.git
   ```
3. Inside, you will find a few folders, one called `test_pipeline` and one for each usecase that we are going to want to run evaluations on - `Summary` is the only one relevant for us for now, the rest are slight spoilers for the upcoming modules 🤫  
Open up `Summary` and then `summary_tests.yaml` to see what tests we will run. Make sure to add some of your own examples as well ✍️

    ![summary_test.png](images/summary_tests.png)

4. The code for the kubeflow pipeline that is running these evaluations is inside of `test_pipeline/kfp_pipeline.py`, go ahead and open it up and take a look. It may look large, but most of it is html to create a nice looking output. You will recognize these lines: 
    ```python
    scoring_response = lls_client.scoring.score(
        input_rows=eval_rows, scoring_functions=scoring_params
    )
    ```

5. Scroll down to near the bottom of the file and edit the arguments to this:
    ```python
    arguments = {
        "repo_url": "https://<USER_NAME>:<PASSWORD>@<GIT_SERVER>/<USER_NAME>/canopy-evals.git",
        "branch": "main",
        "base_url": "http://llama-stack.<USER_NAME>-canopy.svc.cluster.local:80",
        "backend_url": "http://canopy-backend.<USER_NAME>-canopy.svc.cluster.local:8000",
        "secret_name": "test-results",
        "git_hash": "test",
    }
    ```
    These arguments instruct your pipeline how to run.

6. Now we can run the pipeline! 🙌  
    Just execute this in your terminal:
    ```bash
    python canopy-evals/test_pipeline/kfp_pipeline.py
    ```
    **#TODO:** Create a custom image with kfp and kfp-kubernetes in it.  
    After you have started, navigate to the OpenShift AI dashboard -> Experiments -> Experiments and Runs -> kfp-training-pipeline -> canopy-testing-pipeline  

    ![running-kfp-pipeline](images/running-kfp-pipeline.png)

7. After it has finished runnig you can go to this URL to see your results:  
    ```bash
    https://minio-ui-<USER_NAME>-canopy.<CLUSTER_DOMAIN>.opentlc.com/browser/test-results
    ```

    ![test-results](images/test-results.png)

    Congratulations on running your first evaluation pipeline! 🎉


In the next section, we will see how to automatically trigger this pipeline on git changes.