const requirements = require('../data/processed/requirements.json');
const { matchAnswers } = require('../services/matcher');

function getRequirements(req, res) {
  res.json(requirements);
}

function matchRequirements(req, res) {
  const answers = req.body;

  try {
    const matched = matchAnswers(answers, requirements);
    res.json({ matched, answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to match requirements' });
  }
}

module.exports = { getRequirements, matchRequirements };
