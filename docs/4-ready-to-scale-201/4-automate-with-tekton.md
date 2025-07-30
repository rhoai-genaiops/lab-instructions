# Automatically trigger on git changes

Now that we have successfully ran our evaluation pipeline (🎉), we would like it to run automatically everytime we make a change to our tests, prompts, or backend.  
To do this, we can create a Tekton pipeline with a git hook to the relevant repos. This Tekton pipeline will the trigger our evaluation kubeflow pipeline. 🔗

## Trigger it through a Tekton pipeline

## Try updating your prompt