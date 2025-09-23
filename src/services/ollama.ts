import { removeQuotes } from "@/lib/utils";
import axios from "axios";
import { z } from "zod";

const baseURL = "http://localhost:11434";
const ollamaApiInstance = axios.create({
  baseURL,
  responseType: "json",
});

// baseURL 변경 함수
export function setOllamaBaseURL(newBaseURL: string) {
  ollamaApiInstance.defaults.baseURL = newBaseURL;
}

// 현재 baseURL 조회 함수
export function getOllamaBaseURL() {
  return ollamaApiInstance.defaults.baseURL;
}

const OllamaModelDetailSchema = z.object({
  parent_model: z.string(),
  format: z.string(),
  family: z.string(),
  families: z.array(z.string()),
  parameter_size: z.string(),
  quantization_level: z.string(),
});
export type OllamaModelDetail = z.infer<typeof OllamaModelDetailSchema>;

const OllamaModelSchema = z.object({
  name: z.string(),
  model: z.string(),
  modified_at: z.string(),
  size: z.number(),
  digest: z.string(),
  details: OllamaModelDetailSchema,
});
export type OllamaModel = z.infer<typeof OllamaModelSchema>;

const OllamaModelListSchema = z.object({
  models: z.array(OllamaModelSchema),
});
export type OllamaModelList = z.infer<typeof OllamaModelListSchema>;

export async function getStatus() {
  const { data } = await ollamaApiInstance.get("/api/tags");
  return OllamaModelListSchema.parse(data);
}

export const ChatItemSchema = z.object({
  role: z.enum(["assistant", "user"]),
  content: z.string(),
});
export type ChatItem = z.infer<typeof ChatItemSchema>;

interface OllamaChatProps {
  model: string;
  messages: ChatItem[];
}

export function postChatStream(props: OllamaChatProps, timeout = 30000) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout);
  return fetch(`${baseURL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...props, stream: true }),
    signal: controller.signal,
  });
}

export async function postChat(props: OllamaChatProps) {
  const { data } = await ollamaApiInstance.post("/api/chat", {
    ...props,
    stream: false,
  });
  return data;
}

export async function recommendChatTitle(props: OllamaChatProps) {
  const recommendPrompt: ChatItem = {
    role: "user",
    content: `This is new chat start message of llm chat service. 
    Recommend chat tilte for this conversation. 
    The title should not over 30 words.
    The title should be one sentance.
    Tht title can represent the context of conversation. 
    Just answer only one title string so that I can use it as a tile directly`,
  };
  props.messages.push(recommendPrompt);
  const res = await postChat(props);
  const title = res.message.content;
  return removeQuotes(title.trim());
}
