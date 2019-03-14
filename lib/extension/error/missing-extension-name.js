const ExtensionError = require('./extension-error');

class MissingExtensionNameError extends ExtensionError {
  /**
   * @param {*} object
   * @param  {...any} args
   */
  constructor(object, ...args) {
    const className = MissingExtensionNameError.className(object);

    super(`Missing extension name for "${className}"`, ...args);
  }
}

module.exports = MissingExtensionNameError;
