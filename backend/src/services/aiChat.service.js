import axios from "axios";
import { config } from "../config/index.js";
import { getLatestReading } from "./sensorData.service.js";

const openRouterClient = config.openRouter.apiKey
  ? axios.create({
      baseURL: "https://openrouter.ai/api/v1",
      headers: {
        Authorization: `Bearer ${config.openRouter.apiKey}`,
        "Content-Type": "application/json",
      },
    })
  : null;

/**
 * Send a message to the AI and get a response
 * @param {string} userMessage
 * @param {object} [context] - optional sensor context
 * @returns {Promise<string>}
 */
export async function chat(userMessage, contexts = []) {
  if (!openRouterClient) {
    return "AI chat is not configured. Add OPENROUTER_API_KEY to your environment.";
  }

  //replace the system prompt and make dynamic with the sensors

  const systemPrompt = `You are a helpful assistant for an ESP32 smart home monitoring dashboard. 
You help users understand their sensor data and suggest actions. 
Be concise and practical. Use these values : ${contexts.forEach((context) => context.latestTemp)}`;

  const { data } = await openRouterClient.post("/chat/completions", {
    model: config.openRouter.model,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    max_tokens: 500,
  });

  return data.choices?.[0]?.message?.content?.trim() || "No response.";
}

/**
 * Get AI response with sensor context
 * @param {string} userMessage
 * @param {string} [entityId]
 * @returns {Promise<string>}
 */
export async function chatWithContext(userMessage, entityIds) {
  let contexts = [];
  if (entityIds) {
    const latests = [];
    entityIds.forEach(async (entityId) =>
      latests.push(await getLatestReading(entityId)),
    );
    if (latests)
      latests.forEach((latest) => contexts.push({ latestTemp: latest.value }));
  }
  return chat(userMessage, contexts);
}
