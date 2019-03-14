const { expect } = require('chai');
const Contract = require('../lib/contracts/contract');
const BaseApi = require('../lib/contracts/api/base-api');

suite('Contracts', async function() {  
  test('should initialize a contract correctly', async function() {
    const { sdk } = global.BIDIPASS;

    const contract = sdk.repository.contract('PlatformRegistry');
    const api = sdk.repository.api('PlatformRegistry');

    expect(contract).to.be.an.instanceof(Contract);
    expect(api).to.be.an.instanceof(BaseApi);
  });

  test('should be able to read from contract', async function() {
    const { sdk } = global.BIDIPASS;

    const platformRegistry = sdk.repository.api('PlatformRegistry');

    const rewardRegistry = await platformRegistry.rewardRegistry();
    const token = await rewardRegistry.token();
    const totalSupply = await token.totalSupply();

    expect(parseInt(totalSupply)).to.be.gte(0);
  });

  test('should be able to write to contract', async function() {
    const { sdk } = global.BIDIPASS;

    const platformRegistry = sdk.repository.api('PlatformRegistry');
    
    await platformRegistry.addAddressesToWhitelist(
      [ global.BIDIPASS.owner.address ],
      { key: global.BIDIPASS.owner.key }
    );

    expect(await platformRegistry.whitelist(
      global.BIDIPASS.owner.address
    )).to.be.equal(true);
  });
});
