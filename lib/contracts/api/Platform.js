const Whitelist = require('./lib/whitelist');

class Platform extends Whitelist {
  /**
   * Get rewardSize value
   */
  async rewardSize() {
    return this.contract.rewardSize();
  }

  /**
   * Get id value
   */
  async id() {
    return this.cast.bytes32(await this.contract.id());
  }

  /**
   * Get name value
   */
  async name() {
    return this.contract.name();
  }

  /**
   * Get description value
   */
  async description() {
    return this.contract.description();
  }

  /**
   * Get website value
   */
  async website() {
    return this.contract.website();
  }

  /**
   * Get icon value
   */
  async icon() {
    return this.contract.icon();
  }

  /**
   * Get usersConnected value
   */
  async usersConnected() {
    return this.contract.usersConnected();
  }

  /**
   * Check if platform should pay fees
   */
  async shouldPayFees() {
    return this.contract.shouldPayFees();
  }

  /**
   * Check if platform should pay for
   * generic operations like test and login
   */
  async shouldPayGeneric() {
    return this.contract.shouldPayGeneric();
  }

  /**
   * Get user OTP counter (for counter based OTP)
   * @param {string} user
   */
  async userOtpCounter(user) {
    return this.contract.userOtpCounter(this.cast.address(user));
  }

  /**
   * Get user uid
   * @param {string} user
   */
  async userId(user) {
    return this.cast.bytes32(await this.contract.userId(this.cast.address(user)));
  }

  /**
   * Get user connection time
   * @param {string} user
   */
  async userConnectedAt(user) {
    return this.contract.userConnectedAt(this.cast.address(user));
  }

  /**
   * Check if user exists
   * @param {string} user
   */
  async isUserConnected(user) {
    return this.contract.isUserConnected(this.cast.address(user));
  }

  /**
   * Increment OTP counter
   */
  async incrementOtpCounter(...args) {
    return this.contract.incrementOtpCounter(...args);
  }

  /**
   * Connect a user to the platform
   * @param {string} user
   * @param {string} uid
   */
  async connectUser(user, uid, ...args) {
    return this.contract.connectUser(
      this.cast.address(user),
      this.cast.bytes32(uid),
      ...args,
    );
  }

  /**
   * Disconnect a user from the platform
   * @param {string} user
   */
  async disconnectUser(user, ...args) {
    return this.contract.disconnectUser(this.cast.address(user), ...args);
  }

  /**
   * Change fees pay state
   * @param {bool} state
   */
  async payFees(state, ...args) {
    return this.contract.payFees(state, ...args);
  }

  /**
   * Change fees pay state for generic operations
   * @param {bool} state
   */
  async payGeneric(state, ...args) {
    return this.contract.payGeneric(state, ...args);
  }

  /**
   * Update reward size
   * @param {number} rewardSize
   */
  async setRewardSize(rewardSize, ...args) {
    return this.contract.setRewardSize(rewardSize, ...args);
  }

  /**
   * @inheritdoc
   */
  get $asyncProperties() {
    return [
      'rewardSize', 'id', 'name',
      'description', 'website',
      'icon', 'usersConnected',
      'shouldPayFees', 'payGeneric',
    ];
  }

  /**
   * @inheritdoc
   */
  static get contractName() {
    return 'Platform';
  }
}

module.exports = Platform;
