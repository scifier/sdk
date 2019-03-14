const ContractApiError = require('./contract-api-error');

class AuthorizationFailedError extends ContractApiError {
  /**
   * @param {string} state
   * @param {string} reason 
   * @param  {...any} args 
   */
  constructor(state, reason, ...args) {
    super(`Authorization failed with state "${ state }": ${ reason }`, ...args);

    this.state = state;
    this.reason = reason;
  }
}

module.exports = AuthorizationFailedError;
