var MAX_INT = 4294967295;

module.exports = {
  calculate: function(nextPriority, previousPriority) {
    if (!nextPriority && !previousPriority) {
      return MAX_INT / 2;
    }

    var a = nextPriority || 0;
    var b = previousPriority || 0;

    return (a + b) / 2;
  }
};
