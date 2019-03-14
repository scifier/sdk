class Types {
  /**
   * Check if a given value os object (exclude array)
   * @param {*} obj
   */
  static isObject(obj) {
    return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
  }
}

module.exports = Types;
