const BaseExtension = require('../base-extension');
const Connection = require('./connection');

class OTP extends BaseExtension {
  /**
   * Generate new connection
   * @param {string} connectEndpoint 
   * @param {string} disconnectEndpoint
   */
  generate(connectEndpoint, disconnectEndpoint) {
    return Connection.create(connectEndpoint, disconnectEndpoint);
  }

  /**
   * Restore connection object from representation
   * @param {string} connectionRepr 
   */
  restore(connectionRepr) {
    return Connection.restore(connectionRepr);
  }
  
  /**
   * @inheritdoc
   */
  get name() {
    return 'otp';
  }
}

module.exports = OTP;
