const BaseError = require('../../../error/base-error');

class ContractApiError extends BaseError {
  /**
   * @param {string} msg 
   * @param  {...any} args 
   */
  constructor(msg, ...args) {
    super(BaseError.format('ContractApiError', msg), ...args);
  }
}

module.exports = ContractApiError;
