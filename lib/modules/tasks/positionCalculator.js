module.exports = {
  calculate: function(nextPriority, previousPriority) {
    var a = nextPriority || 0;
    var b = previousPriority || 0;

    return (a + b) / 2;
  },
  calculateLastItem: function(previousPriority) {
    return (previousPriority || 0) + 32768;
  }
};


