import { GoogleGenAI, Type } from '@google/genai';
import { PageAnalysis } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeSocialPage(url: string, persona: string): Promise<Omit<PageAnalysis, 'id' | 'url' | 'date'>> {
  let personaInstruction = '';
  if (persona === 'blossom') {
    personaInstruction = 'ركز على بناء السلطة (Authority)، القيادة في المجال، والمحتوى الاحترافي والقيم.';
  } else if (persona === 'bubbles') {
    personaInstruction = 'ركز على التفاعل المجتمعي، المحتوى الممتع، الفيروسي (Viral)، وبناء علاقات قوية مع المتابعين.';
  } else if (persona === 'buttercup') {
    personaInstruction = 'ركز على النمو السريع، التسويق الجريء، المبيعات المباشرة، والمحتوى القوي والمنافس.';
  }

  const prompt = `
قم بتحليل صفحة السوشيال ميديا التالية: ${url}
بناءً على نوع الصفحة ومحتواها المتوقع، قم بتقديم تقييم شامل وخطة نمو لمدة 30 يوماً.
يجب أن تكون أفكار خطة النمو "مواكبة للترند" (Trendy) وليست أفكاراً عامة، ويجب صياغتها خصيصاً لتناسب مجال الصفحة أياً كان نوعها.

الأسلوب المطلوب للخطة (Persona): ${personaInstruction}

قم بإرجاع النتيجة بصيغة JSON فقط، بالهيكل التالي:
{
  "persona": "${persona}",
  "analysis": {
    "logo": "تقييم الشعار وصورة الحساب",
    "bio": "تقييم البايو والوصف",
    "posts": "تقييم المنشورات العادية",
    "reels": "تقييم الريلز والفيديوهات القصيرة",
    "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
    "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2"]
  },
  "plan": [
    {
      "day": 1,
      "action": "نوع المحتوى (مثال: ريلز تريند، بوست تفاعلي)",
      "content": "فكرة المحتوى بالتفصيل وكيفية تنفيذها بشكل مواكب للترند"
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          persona: { type: Type.STRING },
          analysis: {
            type: Type.OBJECT,
            properties: {
              logo: { type: Type.STRING },
              bio: { type: Type.STRING },
              posts: { type: Type.STRING },
              reels: { type: Type.STRING },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["logo", "bio", "posts", "reels", "strengths", "weaknesses"]
          },
          plan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                action: { type: Type.STRING },
                content: { type: Type.STRING }
              },
              required: ["day", "action", "content"]
            }
          }
        },
        required: ["persona", "analysis", "plan"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");
  return JSON.parse(text);
}
