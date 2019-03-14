const web3Utils = require('web3-utils');
const cast = require('./cast');

module.exports = {
  nonZeroAddress(v) {
    return cast.address(v) !== web3Utils.padRight('0x0', 40);
  },
};
