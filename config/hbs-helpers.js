module.exports = {
  equal: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },
  multiply: function (a, b) {
    if (typeof a === 'number' && typeof b === 'number') {
      return a * b
    }
  }
}
