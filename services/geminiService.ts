import { GoogleGenAI, Modality } from "@google/genai";
import type { GenerateContentResponse } from "@google/genai";

if (!process.env.API_KEY) {
    // This is a placeholder check. In a real environment, the key would be set.
    // In this specific setup, we assume the environment variable is injected.
    console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const decadeStyles: { [key: string]: string } = {
  '1960s': '1960s film photograph, medium grain, soft contrast, pastel palette, studio portrait lighting with a simple backdrop, period-accurate wardrobe and hairstyle',
  '1970s': '1970s analog look, warm cast, muted saturation, subtle halation, background is a living room with wood paneling and vintage furniture, period-accurate wardrobe and hairstyle',
  '1980s': '1980s glossy magazine aesthetic, punchy colours, neon accents, on-camera flash look, background with neon geometric shapes and laser grids, period-accurate wardrobe and hairstyle',
  '1990s': '1990s 35mm compact camera vibe, mild flash, slight green-magenta cast, early streetwear styling, slightly out-of-focus urban background, period-accurate hair',
  '2000s': 'early digital camera look, slight sensor noise, cooler white balance, denim-and-tee fashion, brightly lit minimalist interior background, period-accurate hair'
};

const NEGATIVE_PROMPT = 'face morph, identity change, age change, different person, different ethnicity, pose change, body shape change, body morph, distortion, extra limbs, extra fingers, deformed face, warped head, different head size';
const SYSTEM_INSTRUCTION = `You are an expert image editing AI. You will be given a source image, a mask image, and a text prompt.
- The source image is the original photo to be edited.
- The mask image defines editable regions: strictly edit ONLY the white areas and leave the black areas completely untouched.
- The person’s face identity, facial geometry, skin tone, and body proportions in the black-masked areas must remain exactly the same.
- Keep the original pose, camera angle, and framing unchanged.`;

export const generateTimeTravelImage = async (
  base64Image: string,
  base64Mask: string,
  mimeType: string,
  decade: string,
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';
  
  const decadePrompt = decadeStyles[decade];
  if (!decadePrompt) {
    throw new Error(`Invalid decade: ${decade}`);
  }
  
  // FIX: The `negativePrompt` parameter is not supported in the `config` object.
  // To maintain the intended behavior, the negative prompt instructions are appended to the main text prompt.
  const prompt = `Using the provided source image and mask, transform only the HAIR, CLOTHING, and BACKGROUND (the white areas of the mask) to match this style: "${decadePrompt}". Do not make these changes: ${NEGATIVE_PROMPT}`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType } },
        { inlineData: { data: base64Mask, mimeType: 'image/png' } },
        { text: prompt },
      ],
    },
    config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseModalities: [Modality.IMAGE],
    },
  });

  // Extract image data from response
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64ImageBytes: string = part.inlineData.data;
      return `data:image/png;base64,${base64ImageBytes}`;
    }
  }

  throw new Error('No image data found in the API response.');
};