const ContainerError = require('./container-error');

class MissingKeyError extends ContainerError {
  /**
   * @param {string} key 
   * @param  {...any} args 
   */
  constructor(key, ...args) {
    super(`Missing "${ key }" key from config`, ...args);
  }
}

module.exports = MissingKeyError;
