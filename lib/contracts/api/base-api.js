const MissingContractNameError = require('./error/missing-contract-name');
const helpers = require('./helpers');
const Serializable = require('./serializable');

class BaseApi extends Serializable {
  /**
   * @param {Repository} repository 
   */
  constructor(repository) {
    super();
    
    this.repository = repository;
    this._registry = {};
    this._currentWorkingAddress = null;

    this._defaults();
  }

  /**
   * Get contract name
   */
  static get contractName() {
    throw new MissingContractNameError(this);
  }

  /**
   * Get current working contract instance
   */
  get contract() {
    return this._registry[this.address] || null;
  }

  /**
   * Get current working address
   */
  get address() {
    return this._currentWorkingAddress;
  }

  /**
   * Get contract instance
   */
  get Contract() {
    return this.repository.contract(this.constructor.contractName);
  }

  /**
   * Reset api state
   */
  reset() {
    this._registry = {};
    this._currentWorkingAddress = null;

    this._defaults();

    return this;
  }

  /**
   * @param {string} address 
   */
  at(address) {
    if (!this._registry.hasOwnProperty(address)) {
      this._registry[address] = this.Contract.at(address);
    }
    
    this._currentWorkingAddress = address;

    return this;
  }

  /**
   * Filters helper object
   */
  get filter() {
    return helpers.filter;
  }

  /**
   * Type cast helper object
   */
  get cast() {
    return helpers.cast;
  }

  /**
   * Setup defaults
   */
  _defaults() {
    this._currentWorkingAddress = this.Contract.address;

    if (this._currentWorkingAddress) {
      this._registry[this._currentWorkingAddress] = this.Contract;
    }
  }
}

module.exports = BaseApi;
