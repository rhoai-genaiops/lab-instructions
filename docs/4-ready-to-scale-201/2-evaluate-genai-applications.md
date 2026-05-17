# Evaluating GenAI Applications

Now that we have a backend in production that we have manually tested and it works OK. And we want to make sure that any changes we do to it work at least as well.  

To do this, we will set up automatic evaluations that trigger at different times 💫  

But, before we can set up any automatic evaluations, we need to understand how they work.

But even before that, in order to evaluate the behaviour of Canopy, we need to know the behaviour of it. How are we going to evaluate it if we don't know how it answers to our customers.

This is where we are going to utilize MLflow's Tracing capabilities. We will go back to tracing concept to deep dive later on. 

## MLflow tracing

1. Go to OpenShift AI > `Develop & train` > `Experiments (MLflow)` and select `<USER_NAME>-canopy`. Click `summarization` as the experiment.

    ![mlflow-traces.png](./images/mlflow-traces.png)

2. Select `Traces` from the menu. Do the prompts look familiar? 🙃 

    ![mlflow-traces-2.png](./images/mlflow-traces-2.png)

3. Click one of them. It's magic! You are able to see what was the system prompt, what was the user prompt, and what was the response from the model in such a neat way.

    ![mlflow-trace-3.png](./images/mlflow-trace-3.png)

Since we are able to see all these, we are also capable of _evaluate_ whether the response is as expected, is good or not.

Alright, let's onto the evaluations!

## How to evaluate a GenAI application?

There are a few components we can evaluate in our GenAI application:
1. **The LLM** - this would be to evaluate how competent our model is, without any bells and whistels. Great to do before you decide what model to use or upgrade to a new model.
2. **The application backend** - our backend is what implements the LLM logic. This could be simple things such as adding a system prompt (like we have done) to more complex workflows like fetching data to send to the LLM. We want to test our backend anytime our prompts, the backend code itself, or any of the workflow components change.
3. **The workflow components** - rather than just testing them through the backend as a blackbox, we also want to test these components individually to make sure that each component does as it should.

In this section, we will primarily focus on evaluating the application backend, as we have already chosen an LLM and don't have any additional components that are used from the backend.  
We will evaluate the application backend by evaluating the final prompt that gets traced by MLFlow before it's sent to the LLM, as this contains all and any transformations done by the backend.

You will see examples of the other tests in later sections.

## Evaluating with MLflow

We will be using MLFlow to evaluate our prompts.  
To do this, we can add `expectations` to our traces which says "given this context and a prompt, what kind of outputs are we expecting".
Then, we can send those traces with new prompts into our LLM, get a new output and evaluate that new output against the expectation using `scorers`.
For example, one scorer we will use is to make sure that the summarized text is shorter than a desired length.

Let's see this in action!

1. Go to Experiments (MLflow) -> <USER_NAME>-canopy -> summarization -> Traces

    ![traces](./images/traces.png)

2. Pick your favorite trace by clicking on it

3. Press `Show assessments` in the top left corner 

    ![show-assessments](./images/show-assessments.png)

4. Press `+ Add expectations` and add one with:

    - Assessment Name: `length`
    - Data Type: `Number`
    - Value: `200`
    - Rationale: _Whatever you feel like adding 🧙‍♂️_

    It should look something like below. When done, hit `Create`.

    ![expectation](./images/expectation.png)

    This will create a key, value pair (Assessment Name, Value) which we later can fetch in our scorer to see if the number of characters in the response is less than 200 :)

5. Now, we just need to add this trace to our evaluation dataset by clicking on the `+ Add to dataset` button at the top

    ![add-to-dataset](./images/add-to-dataset.png)

6. Create a new dataset, call it `eval`

    ![create-dataset](./images/create-dataset.png)

7. Finally, select the new dataset and press `Export` to add our trace to this dataset

    ![add-to-eval-dataset.png](./images/add-to-eval-dataset.png)

8. If you go back out of the trace and into `Datasets`, you should now see the eval dataset with the single trace and expectation in it.

    ![new-dataset](./images/new-dataset.png)

Now, let's go into our Workbench and open `experiments/4-ready-to-scale-201/1-mlflow-eval.ipynb` to use our newly created eval dataset and run some evaluations!

When you are done, come back here to check `Evaluation runs` on the OpenShift AI dashboard.

![eval-runs.png](./images/eval-runs.png)

And click the traces to get the detailed results of the evaluations:

![eval-runs-2.png](./images/eval-runs-2.png)

Now, onto the performance based evaluations!

## Speed tests with GuideLLM

We will be using GuideLLM to test how responsive our backend is. 
This involves things such as:
- How fast it starts responding (Time To First Token)
- How fast it produces tokens (Time Per Output Token)
- How many requests the system can handle at the same time without slowing down (Throughput)

This is important to test both for your model based on the hardware you use, but also on the backend system as a whole, as when we keep adding more complex functionality it will slow down how fast the model can responde, sometimes causing it to be an unviable option for our usecase.

To try it out, head over to your workbench again and go through the notebook `experiments/4-ready-to-scale-201/2-guidellm-test.ipynb`
