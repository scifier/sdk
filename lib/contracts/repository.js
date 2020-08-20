const fs = require('fs-extra');
const path = require('path');
const MissingContractError = require('./error/missing-contract-error');
const MissingContractDeployAddressError = require('./error/missing-contract-deploy-address-error');
const Contract = require('./contract');
const NotAContractError = require('./error/not-a-contract-error');
const MissingApiError = require('./error/missing-api-error');
const debug = require('../utils/debug')(__filename);

class Repository {
  /**
   * @param {BaseNetwork} network
   * @param {string} accountKey
   * @param {*} contracts
   */
  constructor(network, accountKey = null, contracts = {}) {
    this.network = network;
    this.accountKey = accountKey;
    this._contracts = contracts;
    this._apis = {};
  }

  /**
   * Get contract API by it's name
   * @param {string} name
   * @todo Think on importing apis's from a predefined mapping
   */
  api(name) {
    if (!this._apis.hasOwnProperty(name)) {
      try {
        const Api = require(`./api/${name}`);

        // @todo Check if it extends BaseApi
        this._apis[name] = new Api(this);
      } catch (_) {
        throw new MissingApiError(name);
      }
    }

    return this._apis[name];
  }

  /**
   * Get contract by it's name
   * @param {*} name
   * @throws {MissingContractError}
   */
  contract(name) {
    if (!this.contractExists(name)) {
      throw new MissingContractError(name);
    }

    return this._contracts[name];
  }

  /**
   * Get the list of loaded contracts
   */
  get contracts() {
    return Object.keys(this._contracts);
  }

  /**
   * Check if contract exists by name
   * @param {string} name
   */
  contractExists(name) {
    return this._contracts.hasOwnProperty(name);
  }

  /**
   * Add contract to repository
   * @param {string} name
   * @param {*} instance
   */
  addContract(name, instance) {
    if (!(instance instanceof Contract)) {
      throw new NotAContractError(instance);
    }

    debug('contract:add', name, instance.address);

    this._contracts[name] = instance.clone({ key: this.accountKey });

    return this;
  }

  /**
   * Create contract from artifact
   * @param {*} artifact
   * @param {string} address
   */
  async contractFromArtifact(artifact, address = null, networkId = null) {
    try {
      address = address || Repository.getContractDeployAddress(artifact, networkId);
    } catch (e) {
      if (!(e instanceof MissingContractDeployAddressError)) {
        throw e;
      }
    }

    return new Contract(artifact.abi, address, { web3: this.network.web3 });
  }

  /**
   * Create with artifacts read from a directory
   * @param {BaseNetwork} network
   * @param {string} artifactsDir
   * @param {string} accountKey
   */
  static async createWithArtifacts(network, artifactsDir, accountKey = null) {
    const repository = new this(network, accountKey);
    const artifacts = (await fs.readdir(artifactsDir))
      .filter(f => /\.json$/.test(f) && f !== 'truffle.json');

    for (const artifactFile of artifacts) {
      const artifact = require(path.join(artifactsDir, artifactFile));

      repository.addContract(
        artifact.contractName,
        await repository.contractFromArtifact(artifact, null, network.truffleConfig.network_id),
      );
    }

    return repository;
  }

  /**
   * Get contract deploy address
   * @param {*} artifact
   * @param {string} networkId
   */
  static getContractDeployAddress(artifact, networkId = null) {
    const deploys = Object.keys(artifact.networks || {});
    const deployIdx = (networkId && deploys.indexOf(networkId.toString())) || 0;

    if (deploys.length <= 0 || deployIdx === -1) {
      throw new MissingContractDeployAddressError(
        artifact.contractName,
      );
    }

    return artifact.networks[deploys[deployIdx]].address;
  }
}

module.exports = Repository;
