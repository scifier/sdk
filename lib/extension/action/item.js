const Serializable = require('../../utils/serializable');
const Value = require('./value');
const AuthorizationRequest = require('../../contracts/api/AuthorizationRequest');

class Item extends Serializable {
  /**
   * @param {string} id 
   * @param {string} description 
   * @param {Value} value 
   * @param {number} opType 
   */
  constructor(id, description, value, opType) {
    super();
    
    this.id = id;
    this.description = description;
    this.value = value;
    this.opType = opType;
  }

  /**
   * @inheritdoc
   */
  $sleep() {
    const { id, description, value, opType } = this;

    return { id, description, value: value.$sleep(), opType };
  }

  /**
   * @inheritdoc
   */
  static $awake(obj) {
    const self = Object.assign(new this, obj);

    self.value = Value.restore(self.value);

    return self;
  }

  /**
   * Debit action
   */
  static get DEBIT() {
    return AuthorizationRequest.OpType.DEBIT;
  }

  /**
   * Credit action
   */
  static get CREDIT() {
    return AuthorizationRequest.OpType.CREDIT;
  }
}

module.exports = Item;