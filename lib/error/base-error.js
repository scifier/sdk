class BaseError extends Error {
  /**
   * Format error string
   * @param {string} base
   * @param {string} msg
   */
  static format(base, msg) {
    return `[${base}] ${msg}`;
  }

  /**
   * Get class name of the object
   * @param {*} object
   */
  static className(object) {
    return (object.constructor && object.constructor.name) || 'UnknownObject';
  }
}

module.exports = BaseError;
