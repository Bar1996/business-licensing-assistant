// scripts/pdfToJson.js
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// ⚙️ קריאת ארגומנטים
const [,, inputFile, outputFile = "requirements.json"] = process.argv;

if (!inputFile) {
  console.error("Usage: node scripts/pdfToJson.js <input.pdf> [output.json]");
  process.exit(1);
}

// 🌐 הגדרת Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// 🧹 פונקציה שמנקה את הטקסט מבעיות JSON
function cleanJsonString(raw) {
  return raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .replace(/\u201C|\u201D/g, '"') // גרשיים חכמות → רגילות
    .replace(/\\(?!["\\/bfnrtu])/g, "") // מנקה backslashes לא חוקיים
    .replace(/“|”/g, '"') // עוד סוגי גרשיים
    .trim();
}

// 📝 פונקציה שמסכמת סעיף עם Gemini
async function summarizeSection(text, sectionId) {
  const prompt = `
עבד את הטקסט הבא והחזר **אך ורק** JSON חוקי בפורמט הבא (מערך עם אובייקט יחיד):

[
  {
    "id": "${sectionId}",
    "title": "כותרת קצרה וברורה בעברית",
    "appliesWhen": {},
    "authority": "שם הרשות",
    "priority": "medium/high",
    "steps": [
      "משפט דרישה ראשון",
      "משפט דרישה שני"
    ],
    "legalRef": "פרק ${sectionId}"
  }
]

חוקים חשובים:
- החזר אך ורק JSON חוקי (בלי טקסט נוסף, בלי הסברים).
- השתמש תמיד במערך עם אובייקט יחיד.
- שם הרשות זה או ״משטרת ישראל״ או ״משרד הבריאות״ תעשה בדיקה ותתאים
- מה שקשור למשטרה יסווג כmedium priority ומה שקשור לבריאות כhigh
- ה-id חייב להיות בדיוק "${sectionId}".
- ה-steps חייב להיות מערך של משפטים קצרים וברורים.
- ה-legalRef חייב להיות מחרוזת קצרה (כמו "פרק ${sectionId}").

טקסט לעיבוד:
${text}
  `;

  const result = await model.generateContent(prompt);
  let raw = result.response.text().trim();
  raw = cleanJsonString(raw);

  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error(`❌ JSON.parse נכשל עבור סעיף ${sectionId}:`, raw);
    return null;
  }
}

// ✨ הסעיפים שאנחנו רוצים לחלץ
const sections = {
  "3.3": [],
  "3.5": [],
  "4.6": [],
  "4.7": [],
  "4.3": []
};

(async () => {
  try {
    // 📖 קריאת PDF
    const pdfData = await pdfParse(fs.readFileSync(inputFile));
    const lines = pdfData.text.split("\n").map(l => l.trim()).filter(Boolean);

    // 🔍 חילוץ הסעיפים
    let current = null;
    for (const line of lines) {
      const match = line.match(/^(\d+\.\d+)/);
      if (match && sections[match[1]] !== undefined) {
        current = match[1];
        continue;
      }
      if (current) {
        if (/^\d+\.\d+/.test(line)) {
          current = null;
          continue;
        }
        sections[current].push(line);
      }
    }

    // 🛠️ עיבוד עם Gemini
    const requirements = [];
    for (const [sec, content] of Object.entries(sections)) {
      if (!content.length) continue;
      const parsed = await summarizeSection(content.join(" "), sec);
      if (Array.isArray(parsed)) {
        requirements.push(...parsed);
      } else if (parsed) {
        requirements.push(parsed);
      }
    }

    // 📂 יצירת תיקייה ליעד אם לא קיימת
    const absoluteOutput = path.resolve(outputFile);
    fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });

    // 💾 שמירת JSON
    fs.writeFileSync(
      absoluteOutput,
      JSON.stringify(requirements, null, 2),
      "utf-8"
    );

    console.log(`✅ requirements.json נוצר בהצלחה בנתיב: ${absoluteOutput}`);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
})();
