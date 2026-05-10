import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface NailArtDesign {
  title: string;
  description: string;
  colors: string[];
  techniques: string[];
  occasion: string;
}

export async function generateNailDesign(userPreferences: string): Promise<NailArtDesign> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Design a unique, luxurious nail art concept based on these preferences: ${userPreferences}. 
    The style must align with "Ivy's Nail Lounge" - a premium, elegant, and modern nail studio in Bath, UK. 
    Focus on sophisticated, Instagram-worthy designs.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          colors: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "A list of 3-5 specific color shades (e.g., 'Dusty Rose', 'Champagne Gold')"
          },
          techniques: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Professional techniques used (e.g., 'BIAB Base', 'Hand-painted floral', 'Chrome finish')"
          },
          occasion: { type: Type.STRING, description: "The perfect occasion for this design" }
        },
        required: ["title", "description", "colors", "techniques", "occasion"]
      }
    }
  });

  return JSON.parse(response.text);
}

export async function generateNailDesignImage(prompt: string): Promise<string> {
  // We use gemini-2.5-flash-image for runtime image generation
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: `A professional, high-end close-up photo of luxury nail art on elegant hands. The design is: ${prompt}. Studio lighting, beautify editorial style, photorealistic, premium aesthetic. No background distractions.`,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      },
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("No image data returned from Gemini");
}
