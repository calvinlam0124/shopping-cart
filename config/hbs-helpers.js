module.exports = {
  equal: function (a, b, options) {
    if (a === b) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  },
  // multiply: function (a, b, options) {
  //   if (typeof(a) === 'number' && typeof(b) === 'number') {
  //     const num = a * b
  //     return options.fn(num)
  //   } else {
  //     return options.inverse(this)
  //   }
  // }
}
