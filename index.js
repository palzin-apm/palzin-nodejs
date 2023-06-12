'use strict'
const Palzin = require('./src/palzin')

module.exports = (conf = {}) => {
  return new Palzin(conf)
}
