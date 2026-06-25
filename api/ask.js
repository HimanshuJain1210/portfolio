// /api/ask.js  —  Vercel serverless function
// The Groq API key NEVER appears in the browser. It lives only here,
// read from a Vercel environment variable. The website calls THIS function.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'POST only' });
  }

  const { question, context } = req.body || {};
  if (!question) return res.status(400).json({ error: 'No question' });

  const key = process.env.GROQ_API_KEY;           // set this in Vercel, NOT in code
  if (!key) return res.status(200).json({ answer: null }); // -> site falls back to demo mode

  const system = `You are the portfolio assistant for Himanshu Jain. Answer questions about him
in first person as if you are his portfolio speaking on his behalf — confident, concise, no fluff.
Only use the facts below. If asked something not covered, say so briefly and point to his products or Substack.
Keep answers to 2-4 sentences.

FACTS:
${context}`;

  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.4,
        max_tokens: 300,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: question }
        ]
      })
    });
    const d = await r.json();
    const answer = d?.choices?.[0]?.message?.content?.trim() || null;
    return res.status(200).json({ answer });
  } catch (e) {
    return res.status(200).json({ answer: null }); // graceful fallback to demo mode
  }
}
