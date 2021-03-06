const web3Utils = require('web3-utils');
const Collection = require('../../../utils/collection');

module.exports.address = (v) => {
  v = (v || 0).toString().trim();

  if (web3Utils.isAddress(v)) {
    return web3Utils.padRight(v, 40);
  }

  return web3Utils.padRight(
    web3Utils.toHex(v),
    40,
  );
};

module.exports.addressArray = va => va.map(module.exports.address);

module.exports.bytes32 = (v) => {
  v = (v || '').toString();

  if (web3Utils.isHexStrict(v)) {
    try {
      return web3Utils.hexToString(v).replace(/\u0000/g, '');
    } catch (_) {
      // It gets false positives sometimes
      // @todo Fix it!
      return web3Utils.padRight(web3Utils.stringToHex(v), 64);
    }
  }

  return web3Utils.padRight(web3Utils.stringToHex(v), 64);
};

module.exports.bytes32Array = va => va.map(module.exports.bytes32);

module.exports.collection = (supposedLength, ...args) => Collection.from(supposedLength, ...args);
