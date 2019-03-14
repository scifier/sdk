const { expect } = require('chai');
const BidiPass = require('../lib/bidipass');
const Container = require('../lib/container');
const Repository = require('../lib/contracts/repository');
const BaseNetwork = require('../lib/network/base-network');
const Web3 = require('web3');

suite('BidiPass', async function() {
  test('should load properly', async function() {
    const { sdk } = global.BIDIPASS;

    expect(sdk).to.be.an.instanceof(BidiPass);
    expect(sdk.container).to.be.an.instanceof(Container);
    expect(sdk.repository).to.be.an.instanceof(Repository);
    expect(sdk.repository.network).to.be.an.instanceof(BaseNetwork);
    expect(sdk.repository.network.web3).to.be.an.instanceof(Web3);
    expect(sdk.extensions).to.include.members([
      'action', 'identity', 'otp',
    ]);
    expect(sdk.providerId).to.be.equal(global.BIDIPASS.provider.id);
  });

  test('should configure proper network', async function() {
    const { sdk } = global.BIDIPASS;
    const contracts = sdk.repository.contracts;

    expect(contracts).to.include.members([
      'AuthorizationRegistry',
      'AuthorizationRequest',
      'BDPpToken',
      'Platform',
      'PlatformRegistry',
      'RewardRegistry',
    ]);
  });
});
