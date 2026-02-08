# MaaS - Take it to the Prod!

## Sealed Secrets

When we say GitOps, we say _"if it's not in Git, it's NOT REAL"_. But how are we going to store our sensitive data like API Keys in Git repositories, where many people can access?! Sure, Kubernetes provides a way to manage secrets, but the problem is that it stores the sensitive information as a base64 string - anyone can decode a base64 string! Therefore, we cannot store `Secret` manifest files openly. We use an open-source tool called Sealed Secrets to address this problem.

Sealed Secrets allows us to _seal_ Kubernetes secrets by using a utility called `kubeseal`. The `SealedSecrets` are Kubernetes resources that contain encrypted `Secret` object that only the controller can decrypt. Therefore, a `SealedSecret` is safe to store even in a public repository.

### Sealed Secrets in action

We are going to create a sealed secret that contains our API key, and let Sealed Secrets application to turn it into a regular OpenShift secret in our namespace. Then, Llama Stack can read the API Key from that secret and use it. 

In order to do that, we need to give what is the secret that it needs to seal:

1. Go back to your workbench and first expose your API Key to a variable:
   
    ```bash
    api_token="paste-your-key-from-MaaS-here"
    ```

    Then run the below command:


    ```bash
    cat << EOF > /tmp/test-api-token.yaml
    apiVersion: v1
    data:
      api_token: "$(echo -n api_key | base64 -w0)"
    kind: Secret
    metadata:
      name: llama-fp8-maas-token
    EOF
    ```

2. Use `kubeseal` command line to seal the secret definition. This will encrypt it using a certificate stored in the controller running inside the cluster. This has already been deployed for you as only one instance can exist per cluster.

    <p class="warn">
        ⛷️ <b>NOTE</b> ⛷️ - If you get an error "Error: cannot get sealed secret service: Unauthorized" from running the Kubeseal command, just re-login to OpenShift and run the command again. 
    </p>

    ```bash
    export CLUSTER_DOMAIN=<CLUSTER_DOMAIN>
    oc login --server=https://api.${CLUSTER_DOMAIN##apps.}:6443 -u <USER_NAME> -p <PASSWORD>
    ```

    ```bash
    kubeseal < /tmp/test-api-token.yaml > /tmp/sealed-test-api-token.yaml \
    -n <USER_NAME>-test \
    --controller-namespace sealed-secrets \
    --controller-name sealed-secrets \
    -o yaml
    ```

3. Verify that the secret is sealed:

    ```bash
    cat /tmp/sealed-test-api-token.yaml
    ```

    We should now see the secret is sealed, so it is safe for us to store in our repository. It should look something a bit like this, but with longer password and username output.

    <div class="highlight" style="background: #f7f7f7">
    <pre><code class="language-yaml">
    apiVersion: bitnami.com/v1alpha1
    kind: SealedSecret
    metadata:
      creationTimestamp: null
      name: llama-fp8-maas-token
      namespace: <USER_NAME>-test
    spec:
      encryptedData:
        api_token: AgAj3JQj+EP23pnzu...
    ...
    </code></pre></div>

4. We want to grab the results of this sealing activity, in particular the `encryptedData` so we can add it to git. We have already written a <span style="color:blue;">[helper helm chart](https://github.com/redhat-cop/helm-charts/tree/master/charts/helper-sealed-secrets)</span> that can be used to add sealed secrets to our cluster in a repeatable way. We'll provide the `encryptedData` values to this chart in the next step.

    ```bash
    cat /tmp/sealed-test-api-token.yaml| grep api_token
    ```

    <div class="highlight" style="background: #f7f7f7">
    <pre><code class="language-yaml">
        api_token: AgAj3JQj+EP23pnzu...
    </code></pre></div>

5. Open up `genaiops-gitops/test` and create a folder called `sealed-secrets`, and a `config.yaml` file under it.

    ```bash
    mkdir /opt/app-root/src/mlops-gitops/toolings/sealed-secrets
    touch /opt/app-root/src/mlops-gitops/toolings/sealed-secrets/config.yaml
    ```

6. Open up the `sealed-secrets/config.yaml` file and paste the below yaml to `config.yaml`.

    First, copy below:

    ```yaml
    repo_url: https://github.com/redhat-cop/helm-charts.git
    chart_path: charts/helper-sealed-secrets
    ```

    Then, extend the `config.yaml` file with the encrypted password you got previously:

    ```yaml
    repo_url: https://github.com/redhat-cop/helm-charts.git
    chart_path: charts/helper-sealed-secrets
    # ⬇️ extend by adding sealed secrets below
    secrets:
      # Additional secrets can be added to this list when necessary
      - name: llama-fp8-maas-token
        type: Opaque
        data:
          api_token: AgAj3JQj+EP23pnzu...
    ```

6. Let's push these changes and make sure the API key is in the test environment before we ask Llama Stack to consume it from there.

  ```bash
    cd /opt/app-root/src/genaiops-gitops
    git pull
    git add .
    git commit -m "🤫 ADD - sealed secret for API token 🤫"
    git push
    ```

### 👩‍🏫 Update Canopy 

Well, test first. 

1. Open `genaiops-gitops/canopy/test/llama-stack/config.yaml` and let Llama Stack know where to get the API token. Also, we need to provide the model name and the endpoint URL we get from LiteMaaS. Update it by adding the model to the list:

    ```yaml
    ---
    chart_path: charts/llama-stack-operator-instance
    sealed_secrets:  # 👈 Add this ❗︎❗︎
      enabled: true.    # 👈 Add this ❗︎❗︎
      secretName: llama-fp8-maas-token  # 👈 Add this ❗︎❗︎
    models:
      - name: "llama32"
        url: "http://llama-32-predictor.ai501.svc.cluster.local:8080/v1"
      - name: "llama32-fp8"   
        url: "http://llama-32-fp8-predictor.ai501.svc.cluster.local:8080/v1" 
      - name: "Llama-3.2-3B-Instruct-FP8"     # 👈 Add this ❗︎❗︎
        url: "https://litellm-user1-maas.<CLUSTER_DOMAIN>/v1" # 👈 Add this ❗︎❗︎
    eval:
      enabled: true
    rag:                  
      enabled: true
    mcp:                
      enabled: true     
    ```

  Yes, you are very right to think _why we are pushing an API key to Git? I don't think this is right!_, and we totally agree with you. We'll come to secret management conversation, promise!

3. Push the changes:

    ```bash
    cd /opt/app-root/src/genaiops-gitops
    git pull
    git add .
    git commit -m "🎄 Add FP8 from MaaS 🎄"
    git push
    ```

4. Now let's update the `backend`. Open up `backend/chart/values-test.yaml` and update change every `llama32-fp8` to `Llama-3.2-3B-Instruct-FP8`.

    ```yaml

    LLAMA_STACK_URL: "http://llama-stack-service:8321"
    summarize:
      enabled: true
      model: vllm-Llama-3.2-3B-Instruct-FP8/Llama-3.2-3B-Instruct-FP8 # 👈 Update this 
      temperature: 0.9
      max_tokens: 4096
      prompt: |
        You are a helpful assistant. Summarize the given text please.
    information-search:
      enabled: true
      vector_db_id: latest
      model: vllm-Llama-3.2-3B-Instruct-FP8/Llama-3.2-3B-Instruct-FP8 # 👈 Update this 
      prompt: |
        You are a helpful assistant specializing in document intelligence and academic content analysis.
    student-assistant:         
      enabled: true
      model: vllm-Llama-3.2-3B-Instruct-FP8/Llama-3.2-3B-Instruct-FP8 # 👈 Update this 
      temperature: 0.1
      vector_db_id: latest
      mcp_calendar_url: "http://canopy-mcp-calendar-mcp-server:8080/sse"
      prompt: |
        You are ...
    ```

4. Now let's push the changes:

    ```bash
    cd /opt/app-root/src/backend
    git pull
    git add chart/values-test.yaml
    git commit -m "🎄 Add FP8 from MaaS 🎄"
    git push
    ```

    Do you remember what happens when we make a change in the backend? Yes! Evaluation pipeline kicks off! Navigate to OpenShift console > Pipelines > Pipeline Runs under `<USER_NAME>-toolings` namespace and observe the evaluations. 

5. You can follow the same steps for **prod** files to move production Canopy to MaaS as well!
