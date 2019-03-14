const BaseExtension = require('./extension/base-extension');
const NotAnExtensionError = require('./error/not-an-extension-error');
const MissingExtensionError = require('./error/missing-extension-error');

class BidiPass {
  /**
   * Create an instance of BidiPass
   * @param {string} providerId
   * @param {Container} container
   * @param {Repository} repository
   */
  constructor(providerId, container, repository) {
    this.providerId = providerId;
    this.container = container;
    this.repository = repository;

    this._extensions = {};
  }

  /**
   * Load an extension by it's name
   * @param {string} name 
   */
  async loadExtensionByName(name) {
    const Extension = require(`./extension/${ name }`);

    return this.loadExtension(new Extension());
  }

  /**
   * Load an extension
   * @param {BaseExtension} extension 
   */
  async loadExtension(extension) {
    if (!(extension instanceof BaseExtension)) {
      throw new NotAnExtensionError(extension);
    }

    this._extensions[extension.name] = await extension.load(this);
    // @todo rewrite this piece
    this[extension.name] = this._extensions[extension.name];

    return this;
  }

  /**
   * Get extension instance by name
   * @param {string} name 
   */
  extension(name) {
    if (!this.extensionExists(name)) {
      throw new MissingExtensionError(name);
    }
    
    return this._extensions[name];
  }

  /**
   * List available extensions
   */
  get extensions() {
    return Object.keys(this._extensions);
  }

  /**
   * Check if an extension is registered
   * @param {string} name 
   */
  extensionExists(name) {
    return this._extensions.hasOwnProperty(name);
  }
}

module.exports = BidiPass;
