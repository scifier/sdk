const MintableERC20 = require('./lib/mintable-erc20');

class BDPpToken extends MintableERC20 {
  /**
   * @inheritdoc
   */
  static get contractName() {
    return 'BDPpToken';
  }
}

module.exports = BDPpToken;
