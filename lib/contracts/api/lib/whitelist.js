const BaseApi = require('../base-api');

class Whitelist extends BaseApi {
  /**
    * Getter to determine if address is in whitelist
    * @param {string} operator
    */
  async whitelist(operator) {
    return this.contract.whitelist(this.cast.address(operator));
  }

  /**
   * Add addresses to the whitelist
   * @param {Array} addresses 
   */
  async addAddressesToWhitelist(addresses, ...args) {
    return this.contract.addAddressesToWhitelist(
      this.cast.addressArray(addresses),
      ...args
    );
  }

  /**
   * Remove addresses to the whitelist
   * @param {Array} addresses 
   */
  async removeAddressesFromWhitelist(addresses, ...args) {
    return this.contract.removeAddressesFromWhitelist(
      this.cast.addressArray(addresses),
      ...args
    );
  }
}

module.exports = Whitelist;
