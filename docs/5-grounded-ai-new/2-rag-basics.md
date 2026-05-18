# Understanding Embeddings

RAG is, in its simplest form, just about sending more information into the prompt that the model can use to answer more intelligently/grounded.  

Our prompt can with RAG look something like this:

```bash
You are a helpful, respectful and honest assistant named Canopy built to answer scientific questions.
You will be given a question you need to answer, and a context to provide you with information. You must answer the question based as much as possible on this context.
Always answer as helpfully as possible, while being safe. Your answers should not include any harmful, unethical, racist, sexist, toxic, dangerous, or illegal content. Please ensure that your responses are socially unbiased and positive in nature.

If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.

Context: {context}
Question: {question}
```

Notice how we send in both the question (which we previously sent in by itself with just the system prompt) and the context. `{something}` designate variables here that can be populated by the question and context texts (or anything else you wish).  

However, we can't send the entire knowledge of the universe of text in as context. In fact, the less context we send in, the faster the reply will be. So we need some way to send in as little but meaningful context as possible.  
Here we have a lot of options, the simplest just being keyword search, but imagine if we could search **semantically** instead.  

**Embeddings** let us do just that, to learn about embeddings, go into your workbench and run through `experiments\5-rag\1-embeddings.ipynb`.  
When you are done, continue to [vector databases](./3-vector-databases.md) to learn how we can store these embeddings.