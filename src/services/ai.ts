import { GoogleGenAI, Type } from '@google/genai';

export interface ThumbnailConcept {
  hookIdea: string;
  visualThumbnail: string;
  thumbnailText: string[];
  positioning: string;
  finalPrompt: string;
}

export async function generateConcept(
  input: string,
  mode: string,
  aspectRatio: string,
  fontStyle: string,
  textEffect: string,
  template?: string
): Promise<ThumbnailConcept> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const prompt = `
    Kamu adalah AI khusus pembuat thumbnail profesional untuk konten sosial media.
    Tugas kamu adalah mengubah input berikut menjadi konsep thumbnail yang HIGH CTR.

    INPUT:
    ${input}

    PENGATURAN:
    - Mode: ${mode}
    - Aspek Rasio: ${aspectRatio}
    - Gaya Font: ${fontStyle}
    - Efek Teks: ${textEffect}
    ${template ? `- Template: ${template}` : ''}

    ATURAN:
    - Fokus pada 1 momen paling menarik
    - Gunakan emosi kuat
    - Visual harus langsung dipahami dalam 1 detik
    - Maksimal 1-2 subjek utama
    - Teks maksimal 3-6 kata, huruf besar, memancing penasaran

    Buatlah konsep thumbnail yang terdiri dari 5 bagian.
    PENTING: 'finalPrompt' HARUS dalam bahasa Inggris, sangat detail, dan siap digunakan untuk AI Image Generator.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hookIdea: { type: Type.STRING, description: 'Ide hook untuk konteks konten' },
          visualThumbnail: { type: Type.STRING, description: 'Deskripsi gambar detail' },
          thumbnailText: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'Teks overlay (pisahkan per baris jika perlu)',
          },
          positioning: { type: Type.STRING, description: 'Posisi teks pada gambar' },
          finalPrompt: { type: Type.STRING, description: 'Prompt bahasa Inggris untuk AI Image Generator' },
        },
        required: ['hookIdea', 'visualThumbnail', 'thumbnailText', 'positioning', 'finalPrompt'],
      },
    },
  });

  return JSON.parse(response.text || '{}');
}

export async function generateThumbnailImage(prompt: string, aspectRatio: string, referenceImageBase64?: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  let ar = '16:9';
  if (aspectRatio === '9:16') ar = '9:16';
  if (aspectRatio === '1:1') ar = '1:1';

  const parts: any[] = [];

  if (referenceImageBase64) {
    const match = referenceImageBase64.match(/^data:(image\/\w+);base64,(.*)$/);
    if (match) {
      parts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      });
    }
  }
  
  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
    config: {
      imageConfig: {
        aspectRatio: ar,
      },
    },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('Gagal menghasilkan gambar.');
}

export async function editThumbnailImage(prompt: string, imageBase64: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  const parts: any[] = [];

  const match = imageBase64.match(/^data:(image\/\w+);base64,(.*)$/);
  if (match) {
    parts.push({
      inlineData: {
        mimeType: match[1],
        data: match[2],
      },
    });
  }
  
  parts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('Gagal mengedit gambar.');
}
