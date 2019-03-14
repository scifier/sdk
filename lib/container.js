const dotenv = require('dotenv');
const dotenvParseVariables = require('dotenv-parse-variables');
const path = require('path');
const filterObj = require('filter-object');
const MissingKeyError = require('./error/missing-key-error');

class Container {
  /**
   * @param {*} config 
   */
  constructor(config) {
    this._config = config;
  }

  /**
   * Write parameter to config
   * @param {string} key 
   * @param {*} value 
   */
  write(key, value) {
    this._config[key] = value;

    return this;
  }

  /**
   * Read parameter from config or throw an error
   * @param {string} key
   * @throws {MissingKeyError} 
   */
  readOrThrow(key) {
    if (!this.has(key)) {
      throw new MissingKeyError(`Missing "${ key }" key in config`);
    }

    return this._config[key];
  }

  /**
   * Read parameter from config
   * @param {string} key 
   * @param {*} defaultValue 
   */
  read(key, defaultValue = null) {
    if (!this.has(key)) {
      return defaultValue;
    }

    return this._config[key];
  }

  /**
   * Check if item exists
   * @param {string} key 
   */
  has(key) {
    return this._config.hasOwnProperty(key);
  }
  
  /**
   * Read config from env
   * @param {string} basePath
   */
  static fromEnv(basePath = null) {
    const result = dotenv.config({
      path: path.resolve(basePath || process.cwd(), '.env')
    });
 
    if (result.error) {
      throw result.error;
    }
    
    return new this(Object.assign(
      dotenvParseVariables(result.parsed),
      filterObj(process.env, 'BIDIPASS_*')
    ));
  }
}

module.exports = Container;
