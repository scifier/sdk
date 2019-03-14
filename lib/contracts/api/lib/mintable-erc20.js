const BaseApi = require('../base-api');

class MintableERC20 extends BaseApi {
  /**
    * Gets the balance of the specified address.
    * @param {string} address
    */
  async balanceOf(address) {
    return this.contract.balanceOf(this.cast.address(address));
  }

  /**
   * Get token symbol
   */
  async symbol() {
    return this.contract.symbol();
  }

  /**
   * Get total supply
   */
  async totalSupply() {
    return this.contract.totalSupply();
  }

  /**
   * Mint tokens to address
   * @param {string} to
   * @param {number} amount
   */
  async mint(to, amount, ...args) {
    return this.contract.mint(this.cast.address(to), amount, ...args);
  }
}

module.exports = MintableERC20;
