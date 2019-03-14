const path = require('path');
const Container = require('./lib/container');
const TruffleNetwork = require('./lib/network/truffle-network');
const Repository = require('./lib/contracts/repository');
const BidiPass = require('./lib/bidipass');
const debug = require('./lib/utils/debug')(__filename);

function relativePath(p) {
  return path.resolve(__dirname, p);
}

/**
 * Create an instance of BidiPass
 * @param {string} providerId
 * @param {string} accountKey
 *
 * @todo create an external mapping for .env variables
 */
module.exports = async (providerId, accountKey) => {
  const container = Container.fromEnv(__dirname);

  const truffleConfigFile = relativePath(container.readOrThrow('TRUFFLE_CONFIG'));
  const networkId = container.read('BIDIPASS_ENV', container.readOrThrow('NETWORK_ID'));
  const artifactsDir = relativePath(container.readOrThrow('ARTIFACTS'));

  debug('providerId', providerId);
  debug('networkId', networkId);
  debug('truffleConfigFile', truffleConfigFile);
  debug('artifactsDir', artifactsDir);

  const network = TruffleNetwork.fromTruffleConfigFile(truffleConfigFile, networkId);

  const repository = await Repository.createWithArtifacts(
    network,
    artifactsDir,
    accountKey,
  );

  const extensions = container.readOrThrow('EXTENSIONS');

  debug('extensions', extensions);

  const instance = new BidiPass(providerId, container, repository);

  for (const extension of extensions) {
    await instance.loadExtensionByName(extension);
  }

  return instance;
};
