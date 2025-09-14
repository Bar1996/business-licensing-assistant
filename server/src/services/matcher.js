const priorityOrder = { high: 0, medium: 1, low: 2 };

function passNum(val, cond = {}) {
  if (cond.gte != null && !(val >= cond.gte)) return false;
  if (cond.lte != null && !(val <= cond.lte)) return false;
  if (cond.eq  != null && !(val === cond.eq)) return false;
  return true;
}

function matchAnswers(answers = {}, requirements = []) {
  return requirements
    .filter(rule => {
      const aw = rule.appliesWhen || {};
      if (aw.areaM2 && !passNum(answers.areaM2 ?? 0, aw.areaM2)) return false;
      if (aw.seats  && !passNum(answers.seats  ?? 0, aw.seats))  return false;

      for (const k of ['servesAlcohol','usesGas','deliveries','servesMeat']) {
        if (typeof aw[k] === 'boolean' && answers[k] !== aw[k]) return false;
      }
      return true;
    })
    .sort((a,b) => (priorityOrder[a.priority] ?? 9) - (priorityOrder[b.priority] ?? 9));
}

module.exports = { matchAnswers };
