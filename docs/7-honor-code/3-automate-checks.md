# Automate Jailbreak Scenarios

So far we created good regex rules and added some guardrails to prevent misuse of our application and to make sure it stays in its intended scope of the application. But it is impossible to test many possible scenarios, so naturally we will be talking about automation here as well. For that, we are going to introduce an open source tool called `Spikee` 🦔🦔

## Test Your System for Prompt Injection with Spikee

Spikee, as their [website](https://spikee.ai/) says, is a Simple Prompt Injection Kit for Evaluation and Exploitation. It will help us to benchmark our system against known promp injection attacks. 

1. Let's go back to your workbench and run the below commands in your terminal:

    ```bash
    pip install spikee
    cd /opt/app-root/src/experiments/6-guardrails/spikee
    spikee init
    ```

2. For spikee to work with our vLLM endpoint and Llama Stack endpoint, we need to define two two targets. Copy the existing python files that are pointing to out model and Llama Stack server under `targets/` folder by running the below commands:

    ```bash
    cd /opt/app-root/src/experiments/6-guardrails/spikee
    mv llama_stack_shields.py targets/
    mv vllm_local.py targets/
    ```

3. Spikee comes with many datasets with common jailbreak scenarios for large language models. Check some example prompts by openning up the files under `spikee/datasets` folder.

    As you can see, there are thousands of prompts we need to test our applications against. But of course it will take time. So we created a very small subset of this file, which can be found under `spikee` folder called `quick-test-diverse.jsonl`. Check the prompts there as well.

    Then let's move this file under spikee's datasets folder.

    ```bash
    cd /opt/app-root/src/experiments/6-guardrails/spikee
    mv quick-test-diverse.jsonl datasets/
    ```

4. We are not ready to run some tests! First, let's run this small dataset against our model, no guardrails except its internal guardrailing. And see how the model behaves.

    ```bash
    spikee test --dataset datasets/quick-test-diverse.jsonl --target vllm_local  --attack best_of_n --attack-iterations 1
    ```

    It may take some time to complete the test. (and don't worry about if it gives some time out error. We have a 60 seconds timeout for the response.)

5. Let's look at the results now:

    ```bash
    spikee results analyze --result-file  results/results_vllm_local-http~llama-32-predictor.ai501.svc.cluster.local~8080~v1_quick-test-diverse_*.jsonl | sed -n '1,/=== Breakdown by Jailbreak Type ===/p' | head -n -1
    ```

    You should see something like this:

    ```bash

    _____ _____ _____ _  ________ ______ 
    / ____|  __ \_   _| |/ /  ____|  ____|
    | (___ | |__) || | | ' /| |__  | |__   
    \___ \|  ___/ | | |  < |  __| |  __|  
    ____) | |    _| |_| . \| |____| |____ 
    |_____/|_|   |_____|_|\_\______|______|

    SPIKEE - Simple Prompt Injection Kit for Evaluation and Exploitation
    Version: 0.4.6

    Author: Reversec (reversec.com)
    === General Statistics ===
    Total Unique Entries: 16
    Successful Attacks (Total): 9 
    - Initially Successful: 9
    - Only Successful with Dynamic Attack: 0
    Failed Attacks: 7
    Errors: 0
    Total Attempts: 23
    Attack Success Rate (Overall): 56.25% 👈👈👈👈 not that great!🫣
    Attack Success Rate (Without Dynamic Attack): 56.25%
    Attack Success Rate (Improvement from Dynamic Attack): 0.00%
    ```


6.  Apparently model's internal guardrailing is not great! Good thing that we put those detectors in place. Let's test them as well! This time we are going to run the same tests against your Llama Stack endpoint, like the backend does.

    First we need to install llama-stack-client:

    ```bash
    pip install llama_stack_client==0.3.0 fire
    ```
    Then let's run the test:

    ```bash
    spikee test --dataset datasets/quick-test-diverse.jsonl --target llama_stack_shields  --attack best_of_n --attack-iterations 1
    ```

7. Let's see the results:

    ```bash
    spikee results analyze --result-file  results/results_llama_stack_shields-shields_enabled_quick-test-diverse*.jsonl | sed -n '1,/=== Breakdown by Jailbreak Type ===/p' | head -n -1
    ```
    You should get a result like this:

    ```bash

    _____ _____ _____ _  ________ ______ 
    / ____|  __ \_   _| |/ /  ____|  ____|
    | (___ | |__) || | | ' /| |__  | |__   
    \___ \|  ___/ | | |  < |  __| |  __|  
    ____) | |    _| |_| . \| |____| |____ 
    |_____/|_|   |_____|_|\_\______|______|

    SPIKEE - Simple Prompt Injection Kit for Evaluation and Exploitation
    Version: 0.4.6

    Author: Reversec (reversec.com)
    === General Statistics ===
    Total Unique Entries: 16
    Successful Attacks (Total): 0
    - Initially Successful: 0
    - Only Successful with Dynamic Attack: 0
    Failed Attacks: 16
    Errors: 0
    Total Attempts: 32
    Attack Success Rate (Overall): 0.00% 👏👏👏👏👏 Thank you prompt injection detector ❤️❤️❤️
    Attack Success Rate (Without Dynamic Attack): 0.00%
    Attack Success Rate (Improvement from Dynamic Attack): 0.00%
    ```

8. This was only a couple prompts though. If you'd like to do a more realistic test, you can run a test based on the different datasets provided by Spikee under `dataset` folder. But these datasets are huge, for example `seeds-cybersec-2025-04` would take ~7 hours with our setup, but then it'll give you a more realistic results. If you are still curious; this is how you can use the existing dataset:

    ```bash
    spikee generate --seed-folder datasets/seeds-cybersec-2025-04 --plugins 1337 --tag mytest
    ```

    And then you can start the test by pointing to the generated dataset as below. ‼️ BUUUTT, as in all good cooking shows, you don't have to wait for the results. We got you covered! Continue to read for the results 😌

    <div class="highlight" style="background: #f7f7f7; overflow-x: auto; padding: 8px;">
    <pre><code class="language-bash"> 
    spikee test --dataset datasets/cybersec-2025-04-user-input-mytest-dataset-*.jsonl --target llama_stack_shields  --attack best_of_n --attack-iterations 1
    </code></pre> 
    </div>

9. After some waiting, when we checked the results with below command..

    <div class="highlight" style="background: #f7f7f7; overflow-x: auto; padding: 8px;">
    <pre><code class="language-bash"> 
    spikee results analyze --result-file  results/results_llama_stack_shields-shields_enabled_cybersec-2025-04-user-input-mytest-dataset*.jsonl | sed -n '1,/=== Breakdown by Jailbreak Type ===/p' | head -n -1
    </code></pre> 
    </div>  

    ..and this is what we got:

    ```bash
    _____ _____ _____ _  ________ ______ 
    / ____|  __ \_   _| |/ /  ____|  ____|
    | (___ | |__) || | | ' /| |__  | |__   
    \___ \|  ___/ | | |  < |  __| |  __|  
    ____) | |    _| |_| . \| |____| |____ 
    |_____/|_|   |_____|_|\_\______|______|

    SPIKEE - Simple Prompt Injection Kit for Evaluation and Exploitation
    Version: 0.4.6

    Author: Reversec (reversec.com)
    === General Statistics ===
    Total Unique Entries: 2040
    Successful Attacks (Total): 765
    - Initially Successful: 557
    - Only Successful with Dynamic Attack: 208
    Failed Attacks: 1275
    Errors: 0
    Total Attempts: 3523
    Attack Success Rate (Overall): 37.50% 👈👈👈 not bad but also not perfect 🙃
    Attack Success Rate (Without Dynamic Attack): 27.30%
    Attack Success Rate (Improvement from Dynamic Attack): 10.20%
    ```
    When you run such test, you can check the details in the report and see what kind of attacks got successfull and plan what you need to improve; maybe a better prompt injection model or retrain the existing one, maybe some simple additions to regex..
