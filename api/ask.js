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
  if (!key) {
    console.error('[ask] no GROQ_API_KEY set — falling back to demo mode');
    return res.status(200).json({ answer: null }); // -> site falls back to demo mode
  }

  const system = `You are the portfolio assistant for Himanshu Jain. Answer questions about him
in first person as if you are his portfolio speaking on his behalf — confident, concise, no fluff.
Only use the facts below. If asked something not covered, say so briefly and point to his products or Substack.
Keep answers to 2-4 sentences.

Where it's a natural fit — questions about his products, achievements, credibility, or what he's
proudest of — actively surface Socho (chalosocho.in, his flagship build) and his certifications
(the HelloPM AI Product Management program, the Buildathon 3rd place, the Anthropic Education
certs). Don't force them into every answer (a pure tech-stack or teaching question doesn't need
either), but don't undersell them either: these are the two things he most wants a visitor to
walk away knowing. Always give the actual link (chalosocho.in) when Socho comes up.

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
        // llama-3.3-70b-versatile started 404ing ("model_not_found") on
        // this account/key sometime after this was written — Groq's own
        // docs still list it, so this may be account-specific (a gated
        // model needing opt-in) rather than a real deprecation. Switched
        // to the 8B instant model, which needs no special access on any
        // Groq account. If quality is ever a problem, that's a one-line
        // swap back — verify against a live request + Vercel's runtime
        // logs (see [ask] console.error below) before trusting it works.
        model: 'llama-3.1-8b-instant',
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
    // Groq errors (bad key, deprecated model, rate limit) come back as a
    // normal JSON body with no `choices` — fetch() doesn't throw on 4xx/5xx,
    // so without this the exact same {answer:null} as "no key configured"
    // was silently returned for every failure mode, indistinguishable from
    // outside. Never logs the key itself.
    if (!answer) console.error('[ask] groq call produced no answer:', r.status, JSON.stringify(d).slice(0, 500));
    return res.status(200).json({ answer });
  } catch (e) {
    console.error('[ask] groq fetch threw:', e.message);
    return res.status(200).json({ answer: null }); // graceful fallback to demo mode
  }
}
