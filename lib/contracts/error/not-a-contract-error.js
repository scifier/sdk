const RepositoryError = require('./repository-error');

class NotAContractError extends RepositoryError {
  /**
   * @param {*} object
   * @param  {...any} args
   */
  constructor(object, ...args) {
    const className = RepositoryError.className(object);

    super(`Object "${className}" should inherit "Contract" class`, ...args);
  }
}

module.exports = NotAContractError;
