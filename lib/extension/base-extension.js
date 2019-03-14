const MissingExtensionNameError = require('./error/missing-extension-name');
const ClientNotSetError = require('./error/client-not-set-error');
const debug = require('../utils/debug')(__filename);

class BaseExtension {
  constructor() {
    this.client = null;
  }

  /**
   * Ensure the client has been set
   */
  ensureClientSet() {
    if (!this.client) {
      throw new ClientNotSetError();
    }
  }

  /**
   * Load extension
   * @param {BidiPass} client
   */
  async load(client) {
    debug('extension:load', this.name);

    this.client = client;

    return this;
  }

  /**
   * Get extension name
   */
  get name() {
    throw new MissingExtensionNameError(this);
  }
}

module.exports = BaseExtension;
