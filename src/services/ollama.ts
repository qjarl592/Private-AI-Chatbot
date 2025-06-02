import axios from "axios";

const ollamaApiInstance = axios.create({
  baseURL: "http://localhost:11434",
});

export function getStatus() {
  return ollamaApiInstance.get("/api/tags");
}
