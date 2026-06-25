# Himanshu Jain — Portfolio (v2, "Chemistry Lab")

Single-file, hand-built. No framework, no build step. Edit `index.html`, re-upload, done.
Light + dark mode (auto-detects system, toggle in nav). Same layout in both themes.

## What makes it unique
- **Reaction Mechanism** section — your ChemIQ thinking shown as a 5-step chemical mechanism with electron-pushing arrows. No other portfolio shows *how you think*, only what you built.
- **Periodic Table of Builds** — products as element cells where POSITION = strategy. Columns = cluster, rows = maturity (shipped/wip/concept). Whole strategy readable at a glance.
- **Ask My Portfolio** — Groq-powered Q&A (key stays server-side). Works in demo mode with zero backend.
- **Field Notes** — auto-pulls your Substack via RSS.

## Files
- `index.html` — the whole site
- `profile.png` — your photo (already included)
- `api/ask.js` — optional serverless function for the Ask widget (keeps Groq key hidden)

## Deploy (Vercel, ~3 min)
1. Put `index.html`, `profile.png`, and `api/` in one GitHub repo (web upload fine).
2. vercel.com → New Project → import → Deploy.
3. Ask widget (optional): Vercel → Settings → Environment Variables → add
   `GROQ_API_KEY` = key from console.groq.com/keys → redeploy.
   Key lives ONLY in Vercel. Never in HTML, never in browser. Skip it = widget runs in demo mode.

Netlify/GitHub Pages also work for the whole site except the live AI (auto-falls back to demo).

## Edit (3 things, all in the ███ EDIT ZONE ███)
1. **CONFIG** — your real substackUrl, substackRss, email.
2. **PROJECTS** — copy one block to add a build. Fields:
   `cluster` (edtech|career|pm) sets the column; `maturity` (shipped|wip|concept) sets the row;
   `repo` = public github URL ("" hides the Code button).
3. **ABOUT_ME** — keeps Ask-widget answers current.

## BEFORE you make ChemIQ public or link any repo — scan for secrets
All your repos touch Groq/Supabase. Run in each repo folder locally:
    git log -p | grep -iE "gsk_|sk-|eyJ|api[_-]?key|secret|GROQ|SUPABASE|SERVICE_ROLE" | head
Anything returned = scrub history before publishing, or leave repo:"" (Live link only).
ChemIQ is currently PRIVATE — its Code button is intentionally off until you decide.

## TODO before go-live
- [ ] Fill Substack URL + email in CONFIG
- [ ] Verify fundedagent.vercel.app resolves (no https in your list)
- [ ] Secret-scan the 6 public repos already linked (stereo-jee, jd-resume-customiser, fundedagent, PMquest, discovery-funnel, voiceskill)
- [ ] Decide: make ChemIQ public (after scan) or keep Live-link-only
- [ ] (Optional) Add GROQ_API_KEY in Vercel for live Ask widget
