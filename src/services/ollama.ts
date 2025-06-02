import axios from "axios";

const ollamaApiInstance = axios.create({
  url: "http://localhost:11434",
});

export function getStatus() {
  return ollamaApiInstance.get("/api/tags");
}
