const ContractApiError = require('./contract-api-error');

class MissingContractNameError extends ContractApiError {
  /**
   * @param {*} object
   * @param  {...any} args
   */
  constructor(object, ...args) {
    const className = MissingContractNameError.className(object);

    super(`Missing contract name for "${className}"`, ...args);
  }
}

module.exports = MissingContractNameError;
