const BaseError = require('./base-error');

class NotAnExtensionError extends BaseError {
  /**
   * @param {*} object
   * @param  {...any} args
   */
  constructor(object, ...args) {
    const className = BaseError.className(object);

    super(`Object "${className}" should inherit "BaseExtension" class`, ...args);
  }
}

module.exports = NotAnExtensionError;
