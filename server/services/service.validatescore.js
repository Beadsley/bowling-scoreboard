module.exports.validation = (scores, _frame) => {
  if (!Array.isArray(scores)) {
    throw new Error('request body must contain {roll: [roll_1, roll_2]}');
  } else if (scores.length !== 2) {
    throw new Error('array should contain 2 arguments');
  } else if (typeof scores[0] !== 'number' || typeof scores[1] !== 'number') {
    throw new Error('array should only contain numbers');
  } else if (scores[0] + scores[1] > 10 && _frame < 11) {
    throw new Error("frame total shouldn't be higher than 10");
  } else if (scores[0] + scores[1] > 20 && _frame === 11) {
    throw new Error("frame total shouldn't be higher than 20");
  } else {
    return true;
  }
};
