# Deploy milvus in test and prod
genai-gitops update

# OGX - a unifying framework
We now chose Milvus, but there is a chance that we don't only want to use that vector databse.
OGX allows us to change out the vector database without changing our application layer, it becomes just a simple config change in OGX.
OGX also has some additional functionality to support a variety of retrieval modes, but we won't dig too deep into that here. You can read more about those here: [https://ogx-ai.github.io/docs/concepts/file_operations_vector_stores#search-capabilities](https://ogx-ai.github.io/docs/concepts/file_operations_vector_stores#search-capabilities)

# Send a request to milvus through OGX
To see how it works