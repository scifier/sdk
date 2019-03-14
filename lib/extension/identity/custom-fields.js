const Serializable = require('../../utils/serializable');

class CustomFields extends Serializable {
  /**
   * @param {string} displayName
   */
  constructor({displayName} = {}) {
    super();
    this.displayName = displayName;
  }

  /**
   * Set custom field display name
   * @param {string} displayName
   * @returns {CustomFields}
   */
  setDisplayName(displayName) {
    this.displayName = displayName;

    return this;
  }
}

module.exports = CustomFields;
