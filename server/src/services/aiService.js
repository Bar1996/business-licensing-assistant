const { GoogleGenerativeAI } = require("@google/generative-ai");

function systemPrompt() {
  return `מטרתך: להכין דוח רישוי מותאם לעסק מזון בישראל בעברית, בפורמט Markdown.
כלול: תקציר, דרישות לפי עדיפות ורשות, צעדים מעשיים (bullets), אסמכתאות אם קיימות, ולבסוף הסתייגות.
הסגנון תמציתי ונגיש לבעלי עסקים.`;
}

function userPrompt({ answers, matched }) {
  return `מאפייני עסק:\n${JSON.stringify(answers, null, 2)}\n\nדרישות מותאמות:\n${JSON.stringify(matched, null, 2)}\n\nבנה דוח Markdown בהתאם להנחיות.`;
}

function buildPlainReport({ answers, matched }) {
  let md = `# דוח רישוי מותאם\n\n`;
  md += `**תקציר:** הדוח נבנה לפי מאפייני העסק: שטח ${answers.areaM2 || 0} מ"ר, ${answers.seats || 0} מקומות ישיבה, ${answers.servesAlcohol ? 'מגיש אלכוהול' : 'ללא אלכוהול'}.\n\n`;
  md += `## דרישות מותאמות\n`;
  for (const r of matched) {
    md += `### ${r.title}  \n`;
    md += `*רשות:* ${r.authority} • *עדיפות:* ${r.priority}\n\n`;
    if (r.steps?.length) {
      for (const s of r.steps) md += `- ${s}\n`;
      md += `\n`;
    }
    if (r.legalRef) md += `_אסמכתא:_ ${r.legalRef}\n\n`;
  }
  md += `---\n> ⚠️ המידע אינו ייעוץ משפטי; יש לאמת מול הרשויות.\n`;
  return md;
}

async function geminiReport(ctx) {

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY missing");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
  });

  const prompt = `${systemPrompt()}\n\n${userPrompt(ctx)}`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

async function generateLLMReport(ctx) {
  try {
    return await geminiReport(ctx);
  } catch (e) {
    console.error("⚠️ Gemini failed, falling back:", e.message);
    return buildPlainReport(ctx);
  }
}

module.exports = { generateLLMReport };
