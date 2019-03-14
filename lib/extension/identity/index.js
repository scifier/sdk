const BaseExtension = require('../base-extension');
const IdentityModel = require('./identity');
const thirdParty = require('./3rd-party');
const Authorization = require('./authorization');

class Identity extends BaseExtension {
  /**
   * Restore identity from string representation
   * @param {string} identityRepr 
   */
  restore(identityRepr) {
    return IdentityModel.restore(identityRepr);
  }

  /**
   * Generate a new identity
   * @param {string} uid 
   * @param {string} connectEndpoint 
   * @param {string} disconnectEndpoint
   * @param {string} address 
   */
  generate(uid, connectEndpoint, disconnectEndpoint, address = null) {
    this.ensureClientSet();

    const connection = this.client.otp.generate(
      connectEndpoint,
      disconnectEndpoint
    );

    return this.create(
      uid,
      connection,
      address
    );
  }

  /**
   * Create identity object
   * @param {string} uid 
   * @param {Connection} connection 
   * @param {string} address 
   */
  create(uid, connection, address = null) {
    this.ensureClientSet();

    return new IdentityModel(
      this.client.providerId,
      uid,
      address,
      connection
    );
  }

  /**
   * Get identity platform object
   * @param {Identity} identity 
   */
  async platform(identity) {
    this.ensureClientSet();

    const platformRegistry = this.client.repository.api('PlatformRegistry');
    
    return platformRegistry.platform(identity.providerId);
  }

  /**
   * Whitelist an identity
   * @param {Identity} identity 
   */
  async whitelist(identity) {
    const platform = await this.platform(identity);
    
    return platform.connectUser(
      identity.address,
      identity.uid
    );
  }

  /**
   * Unwhitelist an identity
   * @param {Identity} identity 
   */
  async unwhitelist(identity) {
    const platform = await this.platform(identity);
    
    return platform.disconnectUser(identity.address);
  }

  /**
   * Test connection with an identity
   * @param {Identity} identity 
   * @param {string} description
   */
  testConnection(identity, description) {
    return Authorization.create(
      identity,
      this._authorizationRegistry(),
      'authorizeTest',
      identity.providerId,
      identity.address,
      description
    );
  }

  /**
   * Authorize identity login
   * @param {Identity} identity 
   * @param {string} description
   */
  authorizeLogin(identity, description) {
    return Authorization.create(
      identity,
      this._authorizationRegistry(),
      'authorizeLogin',
      identity.providerId,
      identity.address,
      description
    );
  }

  /**
   * Authorize identity against an action
   * @param {Identity} identity 
   * @param {Action} action
   */
  authorize(identity, action) {
    return Authorization.create(
      identity,
      this._authorizationRegistry(),
      'authorize',
      identity.providerId,
      identity.address,
      action.id,
      action.value.symbol,
      action.value.amount,
      action.value.denomination,
      action.description,
      action.opType
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
   * Get third party libraries
   */
  get ThirdParty() {
    return thirdParty;
  }

  /**
   * @inheritdoc
   */
  get name() {
    return 'identity';
  }
}

module.exports = Identity;
