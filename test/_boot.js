const web3Utils = require('web3-utils');
const bidipass = require('../bidipass-loader');

global.BIDIPASS = {
  sdk: null,
  newAccount(sdk) {
    const { web3 } = sdk.repository.network;

    return web3.eth.accounts.create(Math.random().toString());
  },
  provider: {
    id: 'provider1',
    name: 'Test Platform',
    description: 'Test Platform',
    website: 'http://127.0.0.1',
    icon: 'https://bidipass.org/img/logo.png',
    rewardSize: web3Utils.toWei('5').toString(10),
  },
  owner: {
    address: '0xc31eb6e317054a79bb5e442d686cb9b225670c1d',
    key: '0x3e722ce009e8acbfad73048108d965b6e38c8d2051d4feaef9fe8d867de7f62c',
  },
};

before(async () => {
  const sdk = global.BIDIPASS.sdk = await bidipass(
    global.BIDIPASS.provider.id,
    global.BIDIPASS.owner.key
  );

  const platformRegistry = sdk.repository.api('PlatformRegistry');

  await platformRegistry.addAddressesToWhitelist(
    [ global.BIDIPASS.owner.address ],
  );

  if (!(await platformRegistry.exists(global.BIDIPASS.provider.id))) {
    await platformRegistry.add(
      global.BIDIPASS.provider.rewardSize,
      global.BIDIPASS.provider.id,
      global.BIDIPASS.provider.name,
      global.BIDIPASS.provider.description,
      global.BIDIPASS.provider.website,
      global.BIDIPASS.provider.icon,
      global.BIDIPASS.owner.address,
    );
  }

  const platform = await platformRegistry.platform(
    global.BIDIPASS.provider.id
  );

  await platform.addAddressesToWhitelist(
    [ global.BIDIPASS.owner.address ],
  );
});

after(async () => {
  // @todo Figure out why is not exiting
  setImmediate(() => process.exit(0));
});
