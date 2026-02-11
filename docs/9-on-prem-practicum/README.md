# Module 9 - On-Prem Practicum

> When student grades and personal data enter the chat, the cloud becomes a compliance minefield. Sometimes the safest path forward is keeping everything in-house. Let's bring your LLM on-prem 🏠

# 🧑‍🍳 Module Intro

RDU is expanding Canopy to handle student-related confidential data: grades, academic records, and personalized tutoring interactions. With regulations like FERPA and institutional security policies, sharing this data with external cloud providers isn't an option. The solution? Run your own LLM on-prem.

This module walks you through deploying models directly on your OpenShift cluster using vLLM. You'll learn how to evaluate models based on your hardware constraints, serve them locally, and update your Llama Stack and Canopy configurations to use these self-hosted endpoints. By the end, you'll have a fully functional on-prem AI stack that keeps sensitive data exactly where it belongs: on your own infrastructure.

# 🖼️ Big Picture
![big-picture-onprem.png](images/big-picture-onprem.png)

# 🔮 Learning Outcomes

* Understand when and why to deploy LLMs on-premises versus using cloud endpoints
* Learn how to read model cards and evaluate models for specific hardware constraints
* Deploy LLMs using vLLM serving runtime on Red Hat OpenShift AI
* Configure Llama Stack to use locally-hosted model endpoints
* Update Canopy to interact with on-prem models
* Compare performance characteristics

# 🔨 Tools used in this module

* **[vLLM](https://docs.vllm.ai/en/latest/)**: High-throughput LLM serving engine that supports CPU and GPU deployments
* **[KServe](https://kserve.github.io/website/)**: Kubernetes-native model serving platform integrated with OpenShift AI
* **[TinyLlama](https://huggingface.co/TinyLlama/TinyLlama-1.1B-Chat-v1.0)**: Compact 1.1B parameter model optimized for CPU inference
* **[Llama 3.2 3B](https://huggingface.co/meta-llama/Llama-3.2-3B-Instruct)**: Instruction-tuned model for comparison with larger capabilities
* **OpenShift AI Model Serving**: Enterprise platform for deploying and managing model endpoints
  