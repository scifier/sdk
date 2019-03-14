const BaseError = require('./base-error');

class MissingExtensionError extends BaseError {
  /**
   * @param {string} name 
   * @param  {...any} args 
   */
  constructor(name, ...args) {
    super(`Missing extension "${ name }"`, ...args);
  }
}

module.exports = MissingExtensionError;
