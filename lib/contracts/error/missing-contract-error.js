const RepositoryError = require('./repository-error');

class MissingContractError extends RepositoryError {
  /**
   * @param {string} name
   * @param  {...any} args
   */
  constructor(name, ...args) {
    super(`Missing contract "${name}" in repository`, ...args);
  }
}

module.exports = MissingContractError;
