# Automatically trigger on git changes

Now that we have successfully ran our evaluation pipeline (🎉), we would like it to run automatically everytime we make a change to our tests, prompts, or backend.  
To do this, we can create a Tekton pipeline with a git hook to the relevant repos. This Tekton pipeline will the trigger our evaluation kubeflow pipeline. 🔗

## Trigger kfp through a Tekton pipeline

1. Go to `<USER_NAME>-test` and deploy the Tekton pipeline through ArgoCD by running: 
    bash```
    
    ```
2. Now let's look at it by going to the OpenShift Dashboard -> Pipelines -> `canopy-test-pipeline`. You can see that all it does is a simple git clone followed by starting the kubeflow pipeline.  
3. Great, we have our pipeline! However, so far we would still need to trigger it manually, just that we trigger the Tekton pipeline instead of the kubeflow pipeline...

    ![super-important-meme](images/super-important-meme.jpg)

    To get some use of our Tekton pipeline, let's make it trigger automatically from our git repos.  
    Start by going to Gitea.
4. Inside of Gitea, navigate to your `canopy-evals` repository.
5. Go to Settings -> Webhooks
6. Click `Add` and choose Gitea
7. Enter `<TODO: Pipeline-trigger-url>` -> click Add
8. Now we can test if this worked by clicking on `Test webhook connection`.  
    You can go to the pipeline view in OpenShift to see if the pipeline started properly.  
9. Now do the same for the `canopy-backend` repo as well.
10. Whenever the pipeline is ran it produces and saves the eval results in your MinIO bucket. You can go there to see how you did: <TODO: minio bucket url>

Congratulations! You have now added testing pipelines to your backend and eval repos, so whenever you update your evaluations or your backend repo, you will run through the tests.

## Try updating your prompt

So far, we have only ran the pipeline with predefined tests, let's go and add some useful tests on our own 🧪

1. 