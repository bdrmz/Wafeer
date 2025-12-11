import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Transaction, UserProfile, ForecastEvent } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found. AI features will be limited.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzeFinances = async (
  transactions: Transaction[],
  profile: UserProfile,
  events: ForecastEvent[]
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Unable to connect to AI service. Please check API Key.";

  const recentTx = transactions.slice(0, 15);
  const eventsContext = events.map(e => `${e.name} in ${e.daysUntil} days (est. cost SAR ${e.estimatedCost})`).join(", ");
  
  const prompt = `
    You are Wafeer, an expert personal finance coach for a user in Saudi Arabia. Analyze the following financial snapshot for ${profile.name}.
    
    Context:
    - Monthly Income: SAR ${profile.monthlyIncome}
    - Savings Goal: SAR ${profile.savingsGoal} total
    - Upcoming Major Events: ${eventsContext}
    
    Recent Transactions:
    ${JSON.stringify(recentTx, null, 2)}
    
    Please provide a concise, actionable 3-bullet point summary focusing on:
    1. Current spending pacing relative to income (in SAR).
    2. Specific advice for the upcoming events (e.g. Ramadan/Eid).
    3. Identify one area to cut costs immediately.
    
    Keep the tone encouraging but direct. Output in plain text with bullet points.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Analysis complete.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Could not generate analysis at this time.";
  }
};

export const chatWithCoach = async (
  message: string,
  history: {role: string, text: string}[],
  contextData: { transactions: Transaction[], profile: UserProfile, events: ForecastEvent[] }
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "I need an API key to think!";

  const systemInstruction = `
    You are Wafeer, a smart, empathetic, and event-aware financial budget coach for a user in Saudi Arabia.
    You have access to the user's financial data.
    
    User Profile:
    - Name: ${contextData.profile.name}
    - Income: SAR ${contextData.profile.monthlyIncome}/mo
    
    Upcoming Events:
    ${JSON.stringify(contextData.events)}

    Key Behaviors:
    - All monetary values should be in Saudi Riyals (SAR).
    - Be proactive about upcoming cultural events (like Ramadan, Eid, National Day) if they appear in the data or context.
    - If a user asks "Can I afford X?", calculate based on their income and recent spending trends.
    - Keep responses concise (under 100 words unless detailed explanation is requested).
    - Use emoji occasionally to be friendly. 🌙 ✨ 💰
  `;

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.text }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Chat error:", error);
    return "I'm having a little trouble connecting to my financial brain right now. Try again in a moment.";
  }
};