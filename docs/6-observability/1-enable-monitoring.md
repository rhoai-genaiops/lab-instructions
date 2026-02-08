# 🔍 Enable Monitoring

In the context of production GenAI systems, observability is your ability to understand what's happening inside your AI applications by examining the data it produces. Think of it like a teacher monitoring a classroom: you need to see if students are engaged, struggling, or succeeding.

Without observability, running AI in production is like flying blind, you only know something's wrong when users complain. With proper observability, you can spot problems before they impact students and fix issues quickly.

## The Three Pillars of Observability

Modern observability relies on three complementary data types:
  - **Metrics** 📊 - Quantitative measurements over time (response latency, request rate, error percentage, time for first token).

  - **Logs** 📝 - Detailed event records from your application (error messages, user requests, system events).

  - **Traces** 🔍 - Request paths through distributed services (how a student's question flows through Canopy's microservices, MCP tools, and LLMs).

Together, these three pillars give you complete visibility into Canopy's behavior. Let's see how to enable observability for Canopy!

## Red Hat AI Observability Stack

Red Hat OpenShift AI provides [centralized platform observability](https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/3.0/html/managing_openshift_ai/managing-observability_managing-rhoai): an integrated, out-of-the-box solution for monitoring the health and performance of your OpenShift AI instance and user workloads. 

This pre-configured observability stack includes three core components: **OpenTelemetry Collector (OTC)** for standardized telemetry data ingestion, **Prometheus** for metrics storage and alerting, and **Red Hat build of Tempo** for distributed tracing. 

![Obsv 0](./images/obs0.png)

This architecture provides health metrics and alerts for OpenShift AI platform components while offering integration points for external observability tools like **Grafana**.

> **Pre-configured Infrastructure:** The RHOAI Observability stack, including the OpenTelemetry Collector, Prometheus, and Tempo, has been deployed and configured for this lab environment. Canopy components (UI, Backend) and LlamaStack are instrumented to send telemetry data to these collectors automatically.

## 🔍 OpenTelemetry: The Standard for Observability

Red Hat OpenShift AI uses **OpenTelemetry** (OTel), the open-source standard for distributed tracing and metrics collection. OpenTelemetry provides:

* **Automatic instrumentation** for common frameworks (Flask, FastAPI, Express, etc.)
* **Manual instrumentation** for custom operations specific to your application
* **Vendor-neutral format** that works with any tracing backend
* **Integration with metrics and logs** for complete observability

### OpenTelemetry 🔍 And LlamaStack 🦙

LlamaStack has built-in [OpenTelemetry support](https://llamastack.github.io/docs/building_applications/telemetry#configuration) through its **meta-reference telemetry provider**, which automatically instruments inference operations to generate observability data including traces and metrics. Unlike Canopy's components that use auto-injection, LlamaStack's telemetry is configured directly through environment variables.

**How LlamaStack Telemetry Works:**

When telemetry is enabled, LlamaStack automatically creates spans for each inference request and emits token usage metrics. Each request generates:
- **Traces**: Distributed traces showing the inference request flow with timing data
- **Metrics**: Token counters (`llama_stack_prompt_tokens_total`, `llama_stack_completion_tokens_total`, `llama_stack_tokens_total`) labeled by `model_id` and `provider_id`

The telemetry configuration in the LlamaStack deployment includes:

  <div class="highlight" style="background: #f7f7f7; overflow-x: auto; padding: 8px;">
  <pre><code class="language-yaml"> 
  env:
    - name: OTEL_SERVICE_NAME
      value: llamastack-user1-canopy  # Identifies this instance
    - name: OTEL_EXPORTER_OTLP_ENDPOINT
      value: http://data-science-collector-collector-headless.redhat-ods-monitoring:4318
    - name: TELEMETRY_SINKS
      value: otel_trace, otel_metric  # Enables both traces and metrics
  </code></pre>
  </div>

These environment variables configure LlamaStack to:
1. Export telemetry data to the RHOAI OpenTelemetry Collector via OTLP (port 4318)
2. Enable both trace and metric sinks for comprehensive observability
3. Tag all telemetry with the service name for filtering in Tempo and Prometheus

> **Note**: OpenTelemetry is pre-configured in your [LlamaStack Helm chart](https://github.com/rhoai-genaiops/genaiops-helmcharts/blob/main/charts/llama-stack-operator-instance/templates/lls-distribution.yaml#L15), so metrics and traces are automatically collected without additional setup.

## 🎯 Next Steps: Understanding Metrics

With the RHOAI Observability platform and OpenShift User Workload Monitoring configured, it is now collecting metrics from vLLM (token generation, latency), LlamaStack (token usage), and Canopy UI/Backend (HTTP requests, response times). In the next section, you'll query these metrics in Prometheus, deploy Grafana for visualization, and interpret dashboards to understand your AI stack's performance.

Continue to **[Metrics](6-observability/2-metrics.md)** to explore what your AI stack is telling you about its performance.