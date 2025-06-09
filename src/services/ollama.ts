import axios from "axios";
import { z } from "zod";

const ollamaApiInstance = axios.create({
  baseURL: "http://localhost:11434",
});

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
