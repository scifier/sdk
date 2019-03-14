class Serializable {
  /**
   * Serialize object
   * @param {*} args
   */
  async serialize(...args) {
    return JSON.stringify(
      await this.toPlainObject(),
      ...args,
    );
  }

  /**
   * Transform to plain object
   */
  async toPlainObject() {
    const result = {};

    for (const prop of this.$properties) {
      result[prop] = this[prop];
    }

    for (const prop of this.$asyncProperties) {
      result[prop] = await this[prop]();
    }

    return result;
  }

  /**
   * Serializable properties
   */
  get $properties() {
    return ['address'];
  }

  /**
   * Serializable async properties
   */
  get $asyncProperties() {
    return [];
  }
}

module.exports = Serializable;
