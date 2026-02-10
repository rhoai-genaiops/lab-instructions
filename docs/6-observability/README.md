# Module 6 - The AI Watcher

> Running AI in production without observability is like teaching a class in the dark with a blindfold on - you have no idea if students are learning, confused, or have already left the room. Let's give Canopy the vital signs and instrumentation it needs to stay healthy and trustworthy 📊

# 🧑‍🍳 Module Intro

You've built Canopy with summarization and RAG capabilities, but how do you know it's actually working well in production? This module introduces the three pillars of observability that transform your AI application from a black box into a transparent, monitorable system you can trust.

You'll learn to use OpenShift AI's built-in observability stack: metrics to quantify performance, logs to understand behavior, and traces to follow requests through your distributed system. You'll also close the loop with user feedback -- collecting thumbs up/down signals, turning negative feedback into evaluation test cases, and using A/B testing to compare prompts side-by-side so you can make data-driven prompt engineering decisions. By the end, you'll have dashboards that show Canopy's health at a glance, a feedback-driven improvement cycle, and the skills to debug issues quickly.

# 🖼️ Big Picture
![big-picture-observability](images/big-picture-monitoring.jpg)

# 🔮 Learning Outcomes

* Understand the three pillars of observability and why they're essential for production AI systems
* Deploy and configure OpenShift AI's observability stack with OpenTelemetry, Prometheus, and Tempo
* Query metrics using PromQL to monitor Canopy's performance and resource usage
* Create custom Grafana dashboards to visualize AI-specific metrics and system health
* Analyze logs using OpenShift's logging stack to debug issues and understand user interactions
* Trace requests through distributed components to identify bottlenecks and latency sources
* Collect user feedback and export negative signals as evaluation datasets to systematically improve prompts
* Use A/B testing to compare prompt variants side-by-side and promote winners through GitOps

# 🔨 Tools used in this module

* **OpenTelemetry Collector (OTel)**: Vendor-neutral standard for collecting telemetry data from your AI workloads
* **Prometheus**: Time-series database that stores metrics and powers alerting
* **Grafana**: Visualization platform that turns metrics into actionable dashboards
* **Red Hat build of Tempo**: Distributed tracing system that follows requests across microservices
* **LokiStack**: Scalable log aggregation system integrated with OpenShift
* **OpenShift User Workload Monitoring**: Pre-configured monitoring stack for tracking custom application metrics and model performance
