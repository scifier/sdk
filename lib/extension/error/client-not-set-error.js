const ExtensionError = require('./extension-error');

class ClientNotSetError extends ExtensionError {
  /**
   * @param  {...any} args
   */
  constructor(...args) {
    super('BidiPass client has not been set', ...args);
  }
}

module.exports = ClientNotSetError;
