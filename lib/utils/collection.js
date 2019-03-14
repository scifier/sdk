class Collection extends Array {
  /**
   * @param {number} supposedLength 
   * @param  {...any} args 
   */
  constructor(supposedLength, ...args) {
    super(...args);

    this.supposedLength = supposedLength;
  }

  /**
   * Check if the collection is incomplete
   */
  get isIncomplete() {
    return this.offsetItem !== null;
  }

  /**
   * Get offset item
   */
  get offsetItem() {
    if (this.supposedLength > this.length) {
      return null;
    }

    return this[this.length - 1];
  }

  /**
   * @inheritdoc
   * @param number supposedLength 
   * @param  {...any} args 
   */
  static from(supposedLength, ...args) {
    return new this(supposedLength, ...super.from(...args));
  }
}

module.exports = Collection;
