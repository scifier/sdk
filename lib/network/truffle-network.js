const BaseNetwork = require('./base-network');

class TruffleNetwork extends BaseNetwork {
  /**
   * @param {*} truffleConfig
   */
  constructor(truffleConfig) {
    super(TruffleNetwork.createProviderFromTruffleConfig(truffleConfig));

    this.truffleConfig = truffleConfig;
  }

  /**
   * Create Web3 provider from truffle config
   * @param {*} truffleConfig
   */
  static createProviderFromTruffleConfig(truffleConfig) {
    const { host, port, protocol } = truffleConfig;
    const resolvedHost = /^[a-z]+:\/\//i.test(host) ? host : `${protocol}://${host}`;
    const url = `${resolvedHost}:${port}`;

    return this.createRetryableProviderFromProtocol(protocol, url);
  }

  /**
   * Initialize from truffle config
   * @param {string} truffleConfigFile
   * @param {string} networkId
   */
  static fromTruffleConfigFile(truffleConfigFile, networkId) {
    const config = require(truffleConfigFile);

    return new this(config.networks[networkId]);
  }
}

module.exports = TruffleNetwork;
