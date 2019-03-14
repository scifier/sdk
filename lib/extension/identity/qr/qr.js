const qr = require('qr-image');

class QR {
  /**
   * @param {Identity} identity 
   */
  constructor(identity) {
    this.identity = identity;
  }

  /**
   * Generate QR code
   * @param {*} options
   */
  async generate(options = {}) {
    const repr = this.identity.serialize();
    const params = Object.assign({ type: 'png', ec_level: 'H' }, options);

    return qr.image(repr, params);
  }
}

module.exports = QR;
