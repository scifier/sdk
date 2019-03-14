const FlexContract = require('flex-contract');
const Types = require('../utils/types');
const debug = require('../utils/debug')(__filename);

class Contract extends FlexContract {
  /**
   * @param {*} abi
   * @param {string} address
   * @param {*} opts
   */
  constructor(abi, address = null, opts = {}) {
    opts = Contract._defaults(opts);

    super(abi, address, opts);

    this._opts = opts;
    this._hookMethods(abi);
  }

  /**
   * Clone contract with a different address
   * @param {string} address
   */
  at(address) {
    return this.clone({ address });
  }

  /**
   * Clone contract
   * @param {*} opts
   */
  clone(opts = {}) {
    return new Contract(
      this.abi,
      this.address,
      Object.assign(this._opts, opts),
    );
  }

  /**
   * Hook methods from ABI
   * @param {*} abi
   */
  _hookMethods(abi) {
    for (const def of abi) {
      if (def.type === 'function' && !def.constant) {
        const originalFn = this[def.name];
        const { name } = def;
        const self = this;

        debug(`method:hook:${this.address}`, def.name);

        this[def.name] = async (...args) => {
          const hookedArgs = Array.from(args);

          if (hookedArgs.length <= 0 || !Types.isObject(hookedArgs[hookedArgs.length - 1])) {
            hookedArgs.push({});
          }

          const opts = hookedArgs[hookedArgs.length - 1];

          for (const key of Contract._overrideKeys) {
            if (opts.hasOwnProperty(key) || !this._opts.hasOwnProperty(key)) {
              continue;
            }

            opts[key] = this._opts[key];
          }

          debug(`call:${self.address}:${name}`, ...hookedArgs);

          return originalFn(...hookedArgs);
        };
      }
    }
  }

  /**
   * Set options defaults
   * @param {*} opts
   */
  static _defaults(opts) {
    return Object.assign({ gasPrice: '0', gasBonus: 1 }, opts);
  }

  /**
   * Get keys to override
   */
  static get _overrideKeys() {
    return ['gasPrice', 'key', 'gasBonus'];
  }
}

module.exports = Contract;
