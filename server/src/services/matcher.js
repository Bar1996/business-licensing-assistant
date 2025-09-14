function matchAnswers(answers, requirements) {
    return requirements.filter(rule => {
      const { appliesWhen } = rule;
  
      if (!appliesWhen) return true;
  
      if (appliesWhen.seats && answers.seats < appliesWhen.seats.gte) return false;
      if (appliesWhen.areaM2 && answers.areaM2 < appliesWhen.areaM2.gte) return false;
      if (appliesWhen.servesAlcohol && !answers.servesAlcohol) return false;
      if (appliesWhen.usesGas && !answers.usesGas) return false;
  
      return true;
    });
  }
  
  module.exports = { matchAnswers };
  