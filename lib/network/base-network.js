const Web3 = require('web3');
const debug = require('../utils/debug')(__filename);
const RetryProxy = require('./provider/retry-proxy');

class BaseNetwork {
  /**
   * @param {*} provider 
   */
  constructor(provider) {
    this.provider = provider;

    this._web3 = null;
  }

  /**
   * Get Web3 instance
   */
  get web3() {
    this._web3 = this._web3 || new Web3(this.provider);
    
    return this._web3;
  }

  /**
   * Create a retryable provider from considering protocol
   * @param {string} protocol
   * @param  {...any} args 
   */
  static createRetryableProviderFromProtocol(protocol, ...args) {
    return this.createRetryableProvider(this.Web3Provider(protocol), ...args);
  }

  /**
   * Create a retryable provider
   * @param {EthereumProvider} Provider 
   * @param  {...any} args 
   */
  static createRetryableProvider(Provider, ...args) {
    debug(`Web3:${Provider.name}`, ...args);

    const proxy = new RetryProxy(new Provider(...args));

    return proxy.create();
  }

  /**
   * Get web3 provider implementation
   * @param {string} protocol
   */
  static Web3Provider(protocol) {
    let Provider = null;

    switch (protocol.toLowerCase()) {
      case 'ipc':
        Provider = Web3.providers.IpcProvider;
        break;
      case 'ws':
        Provider = Web3.providers.WebsocketProvider;
        break;
      case 'http':
      case 'https':
      default:
        Provider = Web3.providers.HttpProvider;
    }

    return Provider;
  }
}

module.exports = BaseNetwork;
