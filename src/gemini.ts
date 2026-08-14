import { getAppSettings } from './db';

export interface GeminiOptions {
  systemInstruction?: string;
  temperature?: number;
  jsonMode?: boolean;
}

export async function generateContentAI(
  prompt: string,
  options: GeminiOptions = {}
): Promise<string> {
  const settings = getAppSettings();
  
  // Try user setting key, then process.env
  let apiKey = settings.geminiApiKey || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error('Chưa cấu hình Gemini API Key. Vui lòng vào Cài đặt (biểu tượng bánh răng) để nhập API Key của bạn.');
  }

  const model = settings.modelName || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload: any = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  const generationConfig: any = {};
  if (options.temperature !== undefined) {
    generationConfig.temperature = options.temperature;
  }
  if (options.jsonMode) {
    generationConfig.responseMimeType = 'application/json';
  }
  if (Object.keys(generationConfig).length > 0) {
    payload.generationConfig = generationConfig;
  }

  if (options.systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: options.systemInstruction }]
    };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const msg = errJson.error?.message || `Lỗi API (${response.status})`;
      throw new Error(msg);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    if (!candidate) {
      throw new Error('Gemini không trả về nội dung nào.');
    }

    const textPart = candidate.content?.parts?.[0]?.text;
    if (!textPart) {
      throw new Error('Phản hồi trống từ AI.');
    }

    return textPart;
  } catch (err: any) {
    console.error('Gemini call error:', err);
    throw new Error(err.message || 'Không thể kết nối tới dịch vụ AI Gemini.');
  }
}
