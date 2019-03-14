const BaseExtension = require('../base-extension');
const Value = require('./value');
const Item = require('./item');

class Action extends BaseExtension {
  /**
   * Get total amount authorization requests belonging to a user within a platform
   * @param {Identity} identity
   */
  async total(identity) {
    return this._authorizationRegistry().totalRequests(
      identity.providerId,
      identity.address,
    );
  }

  /**
   * List authorization requests
   * @param {Identity} identity
   * @param {string|AuthorizationRequest} offset
   * @param {number} items
   */
  async list(identity, ...args) {
    return this._authorizationRegistry().read(
      identity.providerId,
      identity.address,
      ...args,
    );
  }

  /**
   * Get authorization registry object
   */
  _authorizationRegistry() {
    this.ensureClientSet();

    return this.client.repository.api('AuthorizationRegistry');
  }

  /**
   * Get item constructor
   */
  get Item() {
    return Item;
  }

  /**
   * Get value constructor
   */
  get Value() {
    return Value;
  }

  /**
   * @inheritdoc
   */
  get name() {
    return 'action';
  }
}

module.exports = Action;
