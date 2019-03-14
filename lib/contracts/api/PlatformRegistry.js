const Whitelist = require('./lib/whitelist');
const RewardRegistry = require('./RewardRegistry');
const Platform = require('./Platform');

class PlatformRegistry extends Whitelist {
  /**
   * Reward registry contract
   */
  async rewardRegistry() {
    return this.repository
      .api(RewardRegistry.contractName)
      .at(await this.contract.rewardRegistry());
  }

  /**
   * Get platforms value
   */
  async platforms() {
    return this.contract.platforms();
  }

  /**
   * Get platform contract addess
   * @param {string} platformId
   */
  async platform(platformId) {
    return this.repository
      .api(Platform.contractName)
      .at(await this.contract.platform(this.cast.bytes32(platformId)));
  }

  /**
   * Get name of the platform
   * @param {string} platformId
   */
  async name(platformId) {
    return this.contract.name(this.cast.bytes32(platformId));
  }

  /**
   * Get description of the platform
   * @param {string} platformId
   */
  async description(platformId) {
    return this.contract.description(this.cast.bytes32(platformId));
  }

  /**
   * Get website address of the platform
   * @param {string} platformId
   */
  async website(platformId) {
    return this.contract.website(this.cast.bytes32(platformId));
  }

  /**
   * Get icon URL of the platform
   * @param {string} platformId
   */
  async icon(platformId) {
    return this.contract.icon(this.cast.bytes32(platformId));
  }

  /**
   * Check if a platform exists
   * @param {string} platformId
   */
  async exists(platformId) {
    return this.contract.exists(this.cast.bytes32(platformId));
  }

  /**
   * Create a new platform and add it to registry
   * @param {number} rewardSize 
   * @param {string} id 
   * @param {string} name 
   * @param {string} description 
   * @param {string} website 
   * @param {string} icon 
   * @param {string} owner
   */
  async add(
    rewardSize,
    id,
    name,
    description,
    website,
    icon,
    owner,
    ...args
  ) {
    const tx = await this.contract.add(
      rewardSize,
      this.cast.bytes32(id),
      name,
      description,
      website,
      icon,
      this.cast.address(owner),
      ...args
    );

    const { args: { platformId } } = tx.findEvent('AddPlatform');

    return this.platform(this.cast.bytes32(platformId));
  }

  /**
   * Remove a platform from the registry
   * @param {string} platformId 
   */
  async remove(platformId, ...args) {
    return this.contract.remove(this.cast.bytes32(platformId), ...args);
  }

  /**
   * @inheritdoc
   */
  static get contractName() {
    return 'PlatformRegistry';
  }
}

module.exports = PlatformRegistry;
