class Serializable {
  /**
   * Return serializable representation
   */
  $sleep() {
    return this;
  }

  /**
   * Restore object from representation object
   * @param {*} obj 
   */
  static $awake(obj) {
    return Object.assign(new this, obj);
  }

  /**
   * Serialize object
   * @param {*} args
   */
  serialize(...args) {
    return JSON.stringify(this.$sleep(), ...args);
  }

  /**
   * Restore object from string representation
   * @param {string} repr 
   */
  static restore(repr) {
    return this.$awake(JSON.parse(repr));
  }
}

module.exports = Serializable;
