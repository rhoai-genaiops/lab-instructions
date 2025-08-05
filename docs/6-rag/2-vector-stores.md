# 📊 Vector Stores: The Foundation of RAG

<div class="terminal-curl"></div>

Think of vector stores as the specialized libraries that power RAG systems. While a traditional library organizes books alphabetically, vector stores organize information by *meaning* - allowing AI to find relevant content based on semantic similarity rather than just keyword matching.

For Canopy at RDU, this means students can ask "How does bias affect hiring?" and get relevant information even if your course materials use terms like "discrimination in recruitment" or "algorithmic fairness in employment."

## 🔍 What are Vector Stores?

**Vector stores** (also called vector databases) are specialized databases that store and search through high-dimensional vectors - mathematical representations of text meaning. Here's how they work:

### The Vector Magic ✨

1. **Text → Numbers**: Every piece of text gets converted into a list of numbers (a vector) that captures its meaning
2. **Similarity Search**: When you ask a question, the system finds vectors with similar "shapes" in the mathematical space
3. **Lightning Fast**: Even with millions of documents, searches happen in milliseconds

### Why Regular Databases Aren't Enough

**❌ Traditional Keyword Search:**
- Searching for "bias" only finds exact word matches
- Misses related concepts like "discrimination" or "unfairness"
- Can't understand context or nuance

**✅ Vector-Based Semantic Search:**
- Finds conceptually related content regardless of exact words
- Understands context and relationships between ideas
- Ranks results by relevance and meaning

## 🛠️ Vector Store Options

There are several vector database options available for RAG systems:

- **Milvus**: Open-source, highly scalable, great for production workloads
- **Chroma**: Lightweight, developer-friendly, good for prototyping
- **Pinecone**: Cloud-native, managed service, pay-as-you-scale
- **Weaviate**: GraphQL API, hybrid search capabilities
- **Qdrant**: Written in Rust, high performance, good for large datasets

For this module, we'll use **Milvus** as our vector database - it's open-source, highly scalable, and perfect for educational RAG systems that need to handle multiple courses and thousands of documents.

## 📊 Deploy Milvus Vector Database

Let's deploy Milvus using our GitOps workflow to your toolings environment. We'll start with a standalone deployment that's perfect for development and educational use cases.

### 1. Deploy Milvus via GitOps

We can deploy a Milvus instance in our toolings environment. This vector database will support the end-to-end journey of our RAG system. We need to install it through `genaiops-gitops/toolings/` following our established GitOps pattern.

Create a `milvus` folder under toolings and then create a `config.yaml` file under the milvus folder. Or simply run the commands below:

```bash
mkdir /opt/app-root/src/genaiops-gitops/toolings/milvus
touch /opt/app-root/src/genaiops-gitops/toolings/milvus/config.yaml
```

Open up the `milvus/config.yaml` file and paste the line below to let Argo CD know which chart we want to deploy:

```yaml
chart_path: charts/milvus
```

### 2. Commit and Deploy via GitOps

Commit the changes to the repo as you've done before:

```bash
cd /opt/app-root/src/genaiops-gitops
git pull
git add .
git commit -m "📊 Milvus vector database added 📊"
git push
```

Once this change has been sync'd (you can check this in Argo CD), Milvus will be automatically deployed to your `<USER_NAME>-toolings` namespace. The ApplicationSet will detect the new configuration and deploy the vector database with our predefined educational-optimized settings.

> **💡 Deployment Note**: We're using a **standalone deployment** of Milvus, which is perfect for development and educational environments. For production systems with high availability requirements, you would typically deploy Milvus in a **distributed mode** with multiple nodes, data replication, and load balancing. The standalone mode gives us all the RAG functionality we need while keeping resource usage reasonable for learning purposes.

### 3. Verify Milvus Deployment

Once deployed, verify everything is running correctly:

```bash
# Check if Milvus pods are running
oc get pods -n <USER_NAME>-toolings | grep milvus

# Check the service is accessible
oc get svc -n <USER_NAME>-toolings | grep milvus

# View logs if needed
oc logs -l app=milvus -n <USER_NAME>-toolings --tail=50
```

You should see output showing Milvus pods in `Running` state.

## 🔧 Understanding Vector Storage

### Embeddings: Text as Math

When documents get processed for RAG:

1. **Chunking**: Documents are split into meaningful pieces (paragraphs, sections)
2. **Embedding**: Each chunk becomes a vector (typically 384 or 768 dimensions)
3. **Storage**: Vectors are indexed in your vector database for fast similarity search
4. **Metadata**: Original text, source info, and tags are stored alongside vectors

## 🎯 Next Steps: Building Intelligent Agents

With your vector store ready, you now have the foundation for RAG. Next, you'll build the intelligent layer that knows how to search your vector database and create helpful responses for students.

Continue to **[🦙 LlamaStack & RAG](3-llamastack-rag.md)** to connect your vector store with LlamaStack and create your first RAG-powered educational assistant.