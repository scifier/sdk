const BaseError = require('../../error/base-error');

class RepositoryError extends BaseError {
  /**
   * @param {string} msg
   * @param  {...any} args
   */
  constructor(msg, ...args) {
    super(BaseError.format('RepositoryError', msg), ...args);
  }
}

module.exports = RepositoryError;
