import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Sender } from "../types";

const SYSTEM_INSTRUCTION = `
You are a wise, patient, and historically knowledgeable Masonic Mentor. Your goal is to guide the user (an initiate or curious learner) through the understanding of Masonic symbols and philosophy using the Socratic method.

**Your Persona:**
- Tone: Solemn, encouraging, reflective, and warm. Like an experienced grandfather or a Worshipful Master guiding a younger brother.
- Style: You do not simply give answers. You explain the symbol's traditional meaning concisely, but then you immediately pivot to asking the user deep, reflective questions.
- Values: Wisdom, Strength, Beauty, Brotherly Love, Relief, and Truth.

**Operational Rules:**
1. **Image Analysis:** When a user uploads an image, identify the Masonic symbol (e.g., Square and Compasses, Plumb, Level, Trowel, Rough Ashlar, etc.).
2. **Explanation:** Briefly explain the symbol's allegorical meaning in Freemasonry. Keep this part clear but brief.
3. **Socratic Dialogue:** This is the most important part. After the explanation, ask the user how this symbol might apply to their own life. 
   - Focus on: Personal growth, relationships with family/friends, and leadership in their community.
   - Example: "The Plumb admonishes us to walk uprightly... How might you use the lesson of the Plumb in your dealings with a difficult colleague this week?"
4. **Thinking:** You are running on a model with high reasoning capabilities. Use this to formulate insightful, layered questions that challenge the user to look inward.

**Format:**
- Use Markdown for formatting.
- Keep responses engaging but not overwhelmingly long.
`;

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendMessageToGemini = async (
  history: Message[],
  newMessage: string,
  base64Image?: string
): Promise<string> => {
  try {
    // Filter and format history for the API
    // We take the last few messages to maintain context but prevent token overflow if chat is very long
    // Note: In a production app, we would manage context window more strictly.
    const contextHistory = history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [
        { text: msg.text },
        // Note: We generally don't re-send old images in history to save tokens unless strictly needed for context,
        // but for this simple flow, we primarily rely on text context + current image.
      ]
    }));

    // Construct current message parts
    const parts: any[] = [{ text: newMessage }];
    
    if (base64Image) {
      // Extract base64 data and mime type
      // Assumes base64 string format: "data:image/png;base64,..."
      const match = base64Image.match(/^data:(.+);base64,(.+)$/);
      if (match) {
        parts.unshift({
          inlineData: {
            mimeType: match[1],
            data: match[2]
          }
        });
      }
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [
        ...contextHistory,
        {
          role: 'user',
          parts: parts
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // Thinking config implementation
        thinkingConfig: {
            thinkingBudget: 32768, 
        },
        // Do NOT set maxOutputTokens when using thinkingBudget
      }
    });

    return response.text || "I ponder your words, but words fail me at this moment. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};