
/**
 * POST /api/validate-ad
 * Body: { text: string }
 * Returns: { ok: boolean, issues: string[], suggestions: string[] }
 */
const BANNED = [
  'make $$$', 'guaranteed income', 'work from home $$$', 'cash only deal',
  'scam', '100% free', 'no verification', 'bitcoin only', 'crypto only'
];

function hasEmail(text){ return /[\w.+-]+@[\w-]+\.[\w.-]+/.test(text); }
function hasPhone(text){ return /(\+?\d[\s-]?){7,}/.test(text); }
function tooMuchPunctuation(text){ return /[!?.]{4,}/.test(text) || /!!{2,}/.test(text); }
function tooMuchCaps(text){ const letters = text.replace(/[^A-Za-z]/g,''); const caps = letters.replace(/[^A-Z]/g,''); return letters.length>10 && (caps.length/letters.length) > 0.7; }
function hasUrl(text){ return /(https?:\/\/|www\.)\S+/.test(text); }
function tooShort(text){ return text.trim().length < 40; }
function tooLong(text){ return text.length > 2500; }
function repeatedWords(text){ return /(\b\w{3,}\b)(?:\s+\1){2,}/i.test(text); }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ ok:false, issues:['Method not allowed'], suggestions:[] });
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
  const text = String(body.text || '');

  const issues = [];
  const suggestions = [];

  // Banned terms
  for (const term of BANNED) {
    const rx = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    if (rx.test(text)) {
      issues.push(`Contains banned phrase: "${term}"`);
      suggestions.push('Rephrase marketing claims to be factual and policy-safe.');
    }
  }

  if (hasEmail(text)) {
    issues.push('Contains email address. Direct contact info can trigger moderation.');
    suggestions.push('Remove email; use platform messaging or masked contact.');
  }
  if (hasPhone(text)) {
    issues.push('Contains phone number. May violate contact policies.');
    suggestions.push('Remove phone number; rely on platform contact tools.');
  }
  if (hasUrl(text)) {
    issues.push('Contains external link/URL.');
    suggestions.push('Remove external links; describe the item/service in-text.');
  }
  if (tooMuchPunctuation(text)) {
    issues.push('Excessive punctuation (e.g., !!! or ????).');
    suggestions.push('Use neutral punctuation; avoid spammy emphasis.');
  }
  if (tooMuchCaps(text)) {
    issues.push('Excessive ALL CAPS text.');
    suggestions.push('Use sentence case; avoid shouting.');
  }
  if (repeatedWords(text)) {
    issues.push('Repeated words detected (spammy).');
    suggestions.push('Remove repeated words and keep the copy concise.');
  }
  if (tooShort(text)) {
    issues.push('Text is very short.');
    suggestions.push('Add details: condition, location, price, and clear description.');
  }
  if (tooLong(text)) {
    issues.push('Text is very long.');
    suggestions.push('Trim copy under ~2500 chars; keep it focused and scannable.');
  }

  const ok = issues.length === 0;
  if (ok) suggestions.push('Looks good! Consider adding clear price, location, and item condition.');

  return res.status(200).json({ ok, issues, suggestions });
}
