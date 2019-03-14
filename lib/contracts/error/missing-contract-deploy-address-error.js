const RepositoryError = require('./repository-error');

class MissingContractDeployAddressError extends RepositoryError {
  /**
   * @param {string} name 
   * @param  {...any} args 
   */
  constructor(name, ...args) {
    super(`Missing contract "${ name }" deploy address`, ...args);
  }
}

module.exports = MissingContractDeployAddressError;
