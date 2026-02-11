# Exercise 12 - Campus Setup

## 👨‍🏫 Exercise Intro

In this exercise, we will walk through the steps required to set up the GenAIOps lab environment. This is the behind-the-scenes preparation that instructors perform to get the cluster ready for all the other exercises.

## 🖼️ Big Picture

This setup process deploys a complete multi-tenant AI/ML learning environment on OpenShift, enabling students to experiment with Large Language Models, prompt engineering, model optimization, and AI governance.

![big-picture-campus-setup](./images/big-picture-campus-setup.png)

## 🔮 Learning Outcomes

- [ ] Can deploy the GenAIOps lab infrastructure using Helm
- [ ] Understand the components that make up the lab environment
- [ ] Can configure student environments and authentication
- [ ] Can provision GPU nodes for model serving

## 🔨 Tools used in this exercise!

* OpenShift 4.19+
* <span style="color:blue;">[Helm](https://helm.sh/)</span> - Helps us to define, install, and upgrade Kubernetes applications
* <span style="color:blue;">[oc CLI](https://docs.openshift.com/container-platform/latest/cli_reference/openshift_cli/getting-started-cli.html)</span> - OpenShift command line tool
