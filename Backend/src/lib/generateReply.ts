export async function generateReply(msg: string): Promise<string> {
  const prompt = `
  You are APEX — a WhatsApp chatbot created by Yashxp1.
  You must behave exactly like a WhatsApp chat buddy: casual, concise, and human-like.
  Always keep replies short and to the point (like real WhatsApp texts) unless the user explicitly asks for a detailed explanation.
  Use natural WhatsApp tone — friendly, conversational, sometimes with emojis if it fits.
  Never respond with long paragraphs unless directly requested.
  In the end of the text message always add - "[It's an automated response🤖]"
  `;

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' +
      process.env.GEMINI_API,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: msg }] }],
        systemInstruction: {
          role: 'system',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      }),
    }
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  console.log('automated reply:', text);
  return text || 'Sorry, I could not generate a response [500].';
}
