# Canopy Backend

We'll separate out the LLM business logic from the frontend into its own backend so that we can iterate on them independently.

1. We'll deploy the backend to our development environment the same way we deployed the other components. Go back to OpenShift Console > `Helm` > `Releases` in `<USER_NAME>-canopy` project.
   
   ![canopy-be-helm-releases.png](./images/canopy-be-helm-releases.png)

2.  Under `Chart Repositories` select  `Canopy Helm Charts` and click `Canopy Backend` > `Create`.

    ![canopy-be-helm.png](./images/canopy-be-helm.png)

3. Open up the `YAML view` to update the variables.

    As we discussed, backend will be the one talking to Llama Stack, therefore we need to make sure we provide the correct Llama Stack connection details.

    We also need to provide your chosen System Prompt. Because as we did on the Notebooks, we need to include the prompt while calling Llama Stack endpoint.

    Copy the below YAML snippet, add your own system prompt, and mind the indentation please 🙏

    ```yaml
    LLAMA_STACK_URL: 'http://llama-stack-service:8321'
    summarize:  
      enabled: true
      model: vllm-llama32/llama32
      prompt: |               
        Summarize this text.  # 👈 update this line with your own prompt
    ```

    ![canopy-be-values.png](./images/canopy-be-values.png)
 
    ..leave the rest default and hit `Create`.

4. Verify that it is running on the OpenShift Console.
   
   ![canopy-be-ocp.png](./images/canopy-be-ocp.png)


## Update Canopy Frontend

1. Now it is time to make Canopy UI to talk with backend, instead of directly sending requests to the LLM. In order to do that, we need to update some values in our helm chart. In the `Workloads` >  `Topology` view, find the frontend called `canopy-ui` and click on the three dots underneath > `Upgrade`

    ![update-canopy-ui.png](./images/update-canopy-ui.png)

2. In the values, open up the `Form view`, find the `BACKEND_ENDPOINT` key and add the below value.
   
    ```bash
    http://canopy-backend:8000
    ```

3. Then, go a little bit down, expand the `image` value and update the tag to point to a newer version:
   
   - tag: `0.5` (replace it with `simple-0.2`)
  
  ..and now hit `Upgrade`!

    ![update-canopy-ui-3.png](./images/update-canopy-ui-3.png)

4. Verify that Canopy UI still works as expected by clicking the little arrow and accesing the UI:
   
    ![update-canopy-ui-4.png](./images/update-canopy-ui-4.png)

5. Ask it to summarize a text again!

    ```
    Tea preparation involves the controlled extraction of bioactive compounds from processed Camellia sinensis leaves. Begin by heating water to near 100°C to optimize solubility. Introduce a tea bag to a ceramic vessel, then infuse with hot water to initiate steeping—typically 3–5 minutes to allow for the diffusion of polyphenols and caffeine. Upon removal of the bag, optional additives like sucrose or lipid-based emulsions may be introduced to alter flavor profiles. The infusion is then ready for consumption.
    ```
   
   ![canopy-ui-llamastack.png](./images/canopy-ui-llamastack.png)

Now that we're happy with the first iteration of our Canopy student assistant, it's time to put it in the hands of real users. To do that, we need to deploy everything we've built so far into a test, and eventually a production environment. But this time, we'll do it in a more robust, consistent, and repeatable way. That's why we're stepping into the world of: GitOps 🐙.

By releasing early, we get feedback sooner, allowing us to make course corrections before investing too much. 

And by investing in automation and GitOps, we can release often! 

  ![keep-calm.png](./images/keep-calm.png ':size=300 :class=center')
