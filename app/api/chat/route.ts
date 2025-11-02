import { streamObjectSchema } from '@/app/scheme/stream-object-schemes';
import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';

export const runtime = 'edge';

export async function POST(request: Request) {
  try {
    const { dish } = await request.json();
    
    const response = streamObject({
      model: google('gemini-2.0-flash'),
      schema: streamObjectSchema,
      prompt: `
	 sen bir aşçısın ve tarif oluşturucusun. 
	 - Tarif adı / başlık: ${dish} için bir tarif oluştur`
    });
    
    return response.toTextStreamResponse();
  } catch (error: Error | unknown) {
    console.error("API Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
