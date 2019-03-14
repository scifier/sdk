const ContractApiError = require('./contract-api-error');

class OperationTimedOutError extends ContractApiError {
  /**
   * @param {string} name
   * @param  {...any} args
   */
  constructor(name, ...args) {
    super(`Operation "${name}" timed out`, ...args);
  }
}

module.exports = OperationTimedOutError;
