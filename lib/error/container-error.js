const BaseError = require('./base-error');

class ContainerError extends BaseError {
  /**
   * @param {string} msg 
   * @param  {...any} args 
   */
  constructor(msg, ...args) {
    super(BaseError.format('ContainerError', msg), ...args);
  }
}

module.exports = ContainerError;
