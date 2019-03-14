const BaseApi = require('./base-api');
const AuthorizationRequest = require('./AuthorizationRequest');

class AuthorizationRegistry extends BaseApi {
  /**
   * Get LOGIN_SYMBOL value
   */
  async LOGIN_SYMBOL() {
    return this.contract.LOGIN_SYMBOL();
  }

  /**
   * Get TEST_SYMBOL value
   */
  async TEST_SYMBOL() {
    return this.contract.TEST_SYMBOL();
  }

  /**
   * Get ITEMS_DEFAULT value
   */
  async ITEMS_DEFAULT() {
    return this.contract.ITEMS_DEFAULT();
  }

  /**
   * List authorization requests
   * @param {string} platformId 
   * @param {string} user
   * @param {string|AuthorizationRequest} offset
   * @param {number} items
   */
  async read(platformId, user, offset = null, items = null) {
    items = items || (await this.ITEMS_DEFAULT());

    if (offset && typeof offset == 'object'
      && offset instanceof AuthorizationRequest) {
      offset = offset.address;
    }

    const requests = await this.contract.read(
      this.cast.bytes32(platformId),
      this.cast.address(user),
      this.cast.address(offset),
      items
    );

    return this.cast.collection(
      items,
      requests
        .filter(this.filter.nonZeroAddress)
        .map(address => {
          return this.repository
            .api(AuthorizationRequest.contractName)
            .at(address);
        })
    );
  }

  /**
   * Get total amount authorization requests belonging to a user within a platform 
   * @param {string} platformId 
   * @param {string} user
   */
  async totalRequests(platformId, user) {
    return this.contract.totalRequests(this.cast.bytes32(platformId), user);
  }

  /**
   * Create test authorization request
   * @param {string} platformId 
   * @param {string} user
   * @param {string} description
   */
  async authorizeTest(platformId, user, description, ...args) {
    const tx = await this.contract.authorizeTest(
      this.cast.bytes32(platformId),
      this.cast.address(user),
      description,
      ...args
    );

    const { args: { request } } = tx.findEvent('Authorize');

    return this.repository
      .api(AuthorizationRequest.contractName)
      .at(request);
  }

  /**
   * Create login authorization request
   * @param {string} platformId 
   * @param {string} user
   * @param {string} description
   */
  async authorizeLogin(platformId, user, description, ...args) {
    const tx = await this.contract.authorizeLogin(
      this.cast.bytes32(platformId),
      this.cast.address(user),
      description,
      ...args
    );

    const { args: { request } } = tx.findEvent('Authorize');

    return this.repository
      .api(AuthorizationRequest.contractName)
      .at(request);
  }

  /**
   * Create authorization request
   * @param {string} platformId 
   * @param {string} user 
   * @param {string} id 
   * @param {string} symbol 
   * @param {number} amount 
   * @param {number} denomination 
   * @param {string} description 
   * @param {number} opType
   */
  async authorize(
    platformId,
    user,
    id,
    symbol,
    amount,
    denomination,
    description,
    opType = AuthorizationRequest.OpType.GENERIC,
    ...args
  ) {
    const tx = await this.contract.authorize(
      this.cast.bytes32(platformId),
      this.cast.address(user),
      this.cast.bytes32(id),
      this.cast.bytes32(symbol),
      amount,
      denomination,
      description,
      opType,
      ...args
    );

    const { args: { request } } = tx.findEvent('Authorize');

    return this.repository
      .api(AuthorizationRequest.contractName)
      .at(request);
  }

  /**
   * @inheritdoc
   */
  static get contractName() {
    return 'AuthorizationRegistry';
  }
}

module.exports = AuthorizationRegistry;
