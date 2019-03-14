const Serializable = require('../../utils/serializable');

class Value extends Serializable {
  /**
   * @param {string} symbol
   * @param {number} amount
   * @param {string} denomination
   */
  constructor(symbol, amount, denomination) {
    super();

    this.symbol = symbol;
    this._amount = amount;
    this._denomination = denomination;
  }

  /**
   * Set new denomination
   * @param {number} denomination
   */
  set denomination(denomination) {
    this._denomination = denomination;
  }

  /**
   * Get denomination
   */
  get denomination() {
    return (this._denomination || 0).toString();
  }

  /**
   * Set new amount
   * @param {number} amount
   */
  set amount(amount) {
    this._amount = amount;
  }

  /**
   * Get amount
   */
  get amount() {
    return (this._amount || 0).toString();
  }

  /**
   * @inheritdoc
   */
  $sleep() {
    const { symbol, amount, denomination } = this;

    return { symbol, amount, denomination };
  }
}

module.exports = Value;
