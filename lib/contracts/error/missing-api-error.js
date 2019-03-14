const RepositoryError = require('./repository-error');

class MissingApiError extends RepositoryError {
  /**
   * @param {string} name
   * @param  {...any} args
   */
  constructor(name, ...args) {
    super(`Missing API for contract "${name}"`, ...args);
  }
}

module.exports = MissingApiError;
