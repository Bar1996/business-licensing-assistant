const { matchAnswers } = require('../services/matcher');
const requirements = require('../data/processed/requirements.json');

function generateReport(req, res) {
  const answers = req.body;
  const matched = matchAnswers(answers, requirements);

  let report = "📋 דוח דרישות מותאם לעסק שלך:\n\n";
  matched.forEach(reqItem => {
    report += `🔹 ${reqItem.title}\n`;
    reqItem.steps.forEach(step => {
      report += `   - ${step}\n`;
    });
    report += `   [${reqItem.authority} | Priority: ${reqItem.priority}]\n\n`;
  });

  res.json({ report, answers });
}

module.exports = { generateReport };
