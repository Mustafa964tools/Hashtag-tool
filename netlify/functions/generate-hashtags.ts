import { GoogleGenAI } from "@google/genai";

const models = [
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemini-3.1-pro-preview",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite"
];
let currentModelIndex = Math.floor(Math.random() * models.length);

export const handler = async (event: any, context: any) => {
  // Only allow POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { caption, platform = 'tiktok' } = JSON.parse(event.body);

    if (!caption) {
      return { 
        statusCode: 400, 
        body: JSON.stringify({ error: "Input is required" }) 
      };
    }

    if (!process.env.GEMINI_API_KEY) {
       return { 
         statusCode: 500, 
         body: JSON.stringify({ error: "Gemini API key is not configured" }) 
       };
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: { headers: { 'User-Agent': 'aistudio-build' } }
    });

    let prompt = "";
    if (platform === 'youtube') {
      prompt = `You are an expert SEO specialist for "964 Media" in the Kurdistan Region.
      Generate a comprehensive list of highly relevant YouTube tags based on the given Kurdish text.
      
      CRITICAL RULES:
      1. YOU MUST ALWAYS include the exact tag "964kurdi".
      2. NO GENERIC TAGS: Do not use broad words like Kurdistan, News, داواکاری, مافی_کارمەند.
      3. BE SPECIFIC: Extract direct subjects, locations, names, and key events mentioned.
      4. EXPAND AND DIVERSIFY: Generate synonyms, related topics, and different phrasing for the subjects to maximize tag effectiveness.
      5. IGNORE CREDITS: NEVER include the names of reporters, videographers, photographers, or credits (e.g., completely ignore names after "ڤیدیۆ:", "فۆتۆ:", "پەیامنێر:", "ڤیدیۆ و مۆنتاژ:").
      6. NATURAL KEYWORDS: Use words people actually search for.
      7. The tags MUST be in Kurdish.
      8. Separate tags ONLY with an English comma (,). No explanations. No bullet points.
      9. MAXIMIZE LENGTH: Generate as many tags as possible to reach close to 500 characters total. Do NOT exceed 500 characters.
      10. Respond instantly and only with the tags to ensure fast performance.
      
      Text: "${caption}"`;
    } else {
      prompt = `You are an expert TikTok manager for "964 Media" in the Kurdistan Region.
      Generate a list of highly relevant TikTok hashtags based on the given Kurdish text.
      
      CRITICAL RULES:
      1. YOU MUST ALWAYS include the exact hashtag "#964kurdi".
      2. NO GENERIC TAGS: Do not use broad words like #کوردستان, #هەواڵ, #داواکاری, #مافی_کارمەند.
      3. BE SPECIFIC: Extract ONLY the direct subjects, locations, names, and key events mentioned (e.g., if the text is about cleaners in Garmian striking for salary, use hashtags like: #گەرمیان #مووچە #نەخۆشخانە #مانگرتن).
      4. IGNORE CREDITS: NEVER include the names of reporters, videographers, photographers, or credits (e.g., completely ignore names after "ڤیدیۆ:", "فۆتۆ:", "پەیامنێر:", "ڤیدیۆ و مۆنتاژ:").
      5. NATURAL KEYWORDS: Use words that perfectly match the specific story.
      6. The hashtags MUST be in Kurdish.
      7. Return ONLY the hashtags separated by spaces. No explanations. No bullet points.
      8. Generate exactly 5 to 8 hashtags.
      9. Respond instantly and only with the hashtags to ensure fast performance.
      
      Text: "${caption}"`;
    }

    const randomModel = models[currentModelIndex];
    currentModelIndex = (currentModelIndex + 1) % models.length;

    const response = await ai.models.generateContent({
      model: randomModel,
      contents: prompt,
    });

    const cleanHashtags = response.text ? response.text.replace(/`/g, '').trim() : '';

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ hashtags: cleanHashtags }),
    };
  } catch (error: any) {
    console.error("Error generating hashtags:", error);
    
    // Handle 429 Rate Limit
    if (error?.status === 429 || error?.message?.includes("429")) {
      return {
        statusCode: 429,
        body: JSON.stringify({ error: "سیستەمەکە ئێستا سەرقاڵە یان سنوری بەکارهێنانی تێپەڕاندووە. تکایە کەمێکی تر دووبارە هەوڵ بدەرەوە." })
      };
    }

    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: "Failed to generate hashtags due to an internal error." }) 
    };
  }
};
