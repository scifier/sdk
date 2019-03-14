const BaseError = require('../../error/base-error');

class ExtensionError extends BaseError {
  /**
   * @param {string} msg 
   * @param  {...any} args 
   */
  constructor(msg, ...args) {
    super(BaseError.format('ExtensionError', msg), ...args);
  }
}

module.exports = ExtensionError;
