function matchAnswers(answers, requirements) {
    return requirements.filter(rule => {
      // Very naive matching example
      if (rule.appliesWhen.seats && answers.seats < rule.appliesWhen.seats.gte) return false;
      if (rule.appliesWhen.areaM2 && answers.areaM2 < rule.appliesWhen.areaM2.gte) return false;
      if (rule.appliesWhen.servesAlcohol && !answers.servesAlcohol) return false;
      return true;
    });
  }
  
  module.exports = { matchAnswers };
  