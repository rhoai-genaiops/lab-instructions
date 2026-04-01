# 🧑‍🏫📚 GenAIOps Enablement Lab Exercises (AI501)

## Slide Decks
Slide decks are published along side the exercise instructions.

👨‍🏫 👉 [The Published Slides Live Here](https://rhoai-genaiops.github.io/lab-instructions/slides/ai501-index.html) 👈 🧑‍💻

## 🪄 Customize The Instructions
The box at the top of the page allows you to load the docs with your team's variables prefilled. Fill in the following fields and click **Save**:

1. **Username** — e.g. `user1`. This value will be prefixed to things such as the namespaces we use.
2. **Password** — your lab password.
3. **Cluster Domain** — the `apps.*` portion of your OpenShift domain (see below).
4. **System Prompt** - we will update this box as we go along with the exercises, you can keep empty for now.

The values are persisted in your browser's local storage. Click **Clear** to reset all saved values.

* After saving, you should see your username and password below:

    ```bash
    <USER_NAME>
    <PASSWORD>
    ```

* For the cluster domain, enter only the `apps.*` portion of your OpenShift domain. For example, if your console address is <code class="language-yaml">https://console-openshift-console.apps.hivec.sandbox1243.opentlc.com/</code>
 then enter `apps.hivec.sandbox1243.opentlc.com` in the cluster domain field.

    You should see your cluster domain below:

    ```bash
    <CLUSTER_DOMAIN>
    ```

## 🦆 Conventions
When running through the exercises, we've tried to call out where things need replacing, especially in Notebooks. If you saved your details above, most `<PLACEHOLDER>` values will be filled in automatically. If any remain, replace them manually with your actual values. For example, if your username is `user1` and you see `<USER_NAME>`, replace it with `user1` like so:
    <div class="highlight" style="background: #f7f7f7">
    <pre><code class="language-bash">
    name: &lt;USER_NAME&gt;
    # ^ this becomes
    name: user1
    </code></pre></div>

There are lots of code blocks for you to copy and paste. They have a little ✂️ icon on the right when you move your cursor over the code block.

```bash
    echo "like this one :)"
```

**Important:** Not all code blocks are meant to be copied. Blocks without the ✂️ icon are **expected output**. Use them to validate your results or YAML against the given block.

Alright, let's get started! Head over to the first exercise and begin your GenAIOps journey! 🏃💨