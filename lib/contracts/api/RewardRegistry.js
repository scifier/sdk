const BaseApi = require('./base-api');
const BDPpToken = require('./BDPpToken');

class RewardRegistry extends BaseApi {
  /**
   * Token contract
   */
  async token() {
    return this.repository
      .api(BDPpToken.contractName)
      .at(await this.contract.token());
  }

  /**
   * Get total rewards amount
   */
  async totalReward(miner) {
    return this.contract.totalReward(this.cast.address(miner));
  }

  /**
   * Get block reward
   */
  async blockReward(miner, blockNumber) {
    return this.contract.blockReward(this.cast.address(miner), blockNumber);
  }

  /**
   * @inheritdoc
   */
  static get contractName() {
    return 'RewardRegistry';
  }
}

module.exports = RewardRegistry;
