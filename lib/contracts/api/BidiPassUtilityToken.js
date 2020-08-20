const MintableERC20 = require('./lib/mintable-erc20');

class BidiPassUtilityToken extends MintableERC20 {
  /**
   * @inheritdoc
   */
  static get contractName() {
    return 'BidiPassUtilityToken';
  }

  /**
   * Approve the passed address to spend the specified amount of tokens on behalf of platform
   * @param {string} platform Tha address of platform where msg.sender is whitelisted
   * @param {string} spender The address which will spend the funds
   * @param {string} value The amount of tokens to be spent
   */
  async approveFrom(platform, spender, value, ...args) {
    return this.contract.approveFrom(
      this.cast.address(platform),
      this.cast.address(spender),
      value,
      ...args,
    );
  }
}

module.exports = BidiPassUtilityToken;
