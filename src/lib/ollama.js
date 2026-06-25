import axios from "axios";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434/api";

const ollamaClient = axios.create({
  baseURL: OLLAMA_BASE_URL,
  timeout: 120000,
});

export async function generateCompletion(prompt, options = {}) {
  const { model = "llama3", stream = false, ...rest } = options;
  const { data } = await ollamaClient.post("/generate", {
    model,
    prompt,
    stream,
    ...rest,
  });
  return data;
}

export async function chatCompletion(messages, options = {}) {
  const { model = "llama3", stream = false, ...rest } = options;
  const { data } = await ollamaClient.post("/chat", {
    model,
    messages,
    stream,
    ...rest,
  });
  return data;
}

export async function generateEmbedding(text) {
  const { data } = await ollamaClient.post("/embeddings", {
    model: "llama3",
    prompt: text,
  });
  return data.embedding;
}
