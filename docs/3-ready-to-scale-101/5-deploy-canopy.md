## Deploy Canopy Test & Prod

We deployed our `canopy` in experiment environment manually, but for the higher environments we need to store the definitions in Git and deploy our models via Argo CD to get all the benefits that GitOps brings.


1. Just like we did with our toolings, we need to generate `ApplicationSet` definition for our model deployment. We will have two separated `ApplicationSet` definition; one is for `test` and one is for `prod` environment. For the enablement simplicity reasons, we keep them in the same repository. However in the real life, you may also like to take prod definitions into another repository where you only make changes via Pull Requests with a protected `main` branch. We keep `ApplicationSet` definition separate so that it'll be easy to take the prod definition into another place later on :)

    Let's update the `ApplicationSet` definition with `CLUSTER_DOMAIN` and `USER_NAME` definition just like before. Open up the `genaiops-gitops/appset-test.yaml` and `genaiops-gitops/appset-prod.yaml` files and replace the values. For the lazy ones we also have the commands:

  ```bash
    sed -i -e 's/CLUSTER_DOMAIN/<CLUSTER_DOMAIN>/g' /opt/app-root/src/genaiops-gitops/appset-test.yaml
    sed -i -e 's/USER_NAME/<USER_NAME>/g' /opt/app-root/src/genaiops-gitops/appset-test.yaml
    sed -i -e 's/CLUSTER_DOMAIN/<CLUSTER_DOMAIN>/g' /opt/app-root/src/genaiops-gitops/appset-prod.yaml
    sed -i -e 's/USER_NAME/<USER_NAME>/g' /opt/app-root/src/genaiops-gitops/appset-prod.yaml
  ```

1. Let's add `canopy-ui` definition. We created two files since we have two different environments; `test` and `prod`. So we have two files to update. Update both `canopy/test/canopy-ui/config.yaml` and `canopy/prod/canopy-ui/config.yaml` files as follow. 

    This will take UI deployment helm-chart and apply the additional configuration such as image version.  

    ```yaml
    repo_url: https://<GIT_SERVER>/<USER_NAME>/canopy-ui
    chart_path: chart
    name: canopy
    BACKEND_ENDPOINT: "http://canopy-backend:8000"
    image:
    name: "canopy-ui"
    tag: "0.2"
    ```
2. Let's get this deployed of course - it's not real unless its in git!

    ```bash
    cd /opt/app-root/src/genaiops-gitops
    git add .
    git commit -m  "🌳 ADD - ApplicationSets and Canopy UI to deploy 🌳"
    git push 
    ```

3. With the `canopy-ui` values stored in Git, now let's tell Argo CD to start picking up changes to these environments. To do this, simply we need to create ApplicationSets:

    ```bash
    oc apply -f /opt/app-root/src/genaiops-gitops/appset-test.yaml -n <USER_NAME>-toolings
    oc apply -f /opt/app-root/src/genaiops-gitops/appset-prod.yaml -n <USER_NAME>-toolings
    ```

4. You should see the two canopy application, one for `test` and one for `prod` deployed in Argo CD. 

    

5. You can also go to OpenShift Console, check `<USER_NAME>-test` namespace to see if the app is deployed.
