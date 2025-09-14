const requirements = require('../data/processed/requirements.json');
const { matchAnswers } = require('../services/matcher');

function getRequirements(req, res) {
  res.json(requirements);
}

function matchRequirements(req, res) {
  const answers = req.body;
  const matched = matchAnswers(answers, requirements);
  res.json({ matched, answers });
}

module.exports = { getRequirements, matchRequirements };
