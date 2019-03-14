const BaseError = require('../../../error/base-error');

class IdentityError extends BaseError {
  /**
   * @param {string} msg 
   * @param  {...any} args 
   */
  constructor(msg, ...args) {
    super(BaseError.format('IdentityError', msg), ...args);
  }
}

module.exports = IdentityError;
