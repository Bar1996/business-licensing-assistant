const { matchAnswers } = require("../services/matcher");
const requirements = require("../data/processed/requirements.json");
const { generateLLMReport } = require("../services/aiService");

async function generateReport(req, res) {
  const answers = req.body || {};
  const matched = matchAnswers(answers, requirements);
  const report = await generateLLMReport({ answers, matched });

  res.json({
    provider: process.env.LLM_PROVIDER,
    report,
    answers,
    matched,
  });
}

module.exports = { generateReport };
