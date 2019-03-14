const { expect } = require('chai');
const Connection = require('../lib/extension/otp/connection');
const IdentityModel = require('../lib/extension/identity/identity');
const AuthorizationRequest = require('../lib/contracts/api/AuthorizationRequest');
const Collection = require('../lib/utils/collection');

function approveRequest(sdk, identity, account, opType) {
  const authorizationRegistry = sdk.repository.api('AuthorizationRegistry');
  const authorizationRequest = sdk.repository.api('AuthorizationRequest');
  const platformRegistry = sdk.repository.api('PlatformRegistry');

  const watcher = authorizationRegistry.contract.Authorize.watch({ pollRate: 500 });

  watcher.on('error', e => { throw e });
  watcher.on('data', async event => {
    watcher.close();

    const platform = await platformRegistry.platform(identity.providerId);
    const request = authorizationRequest.at(event.args.request); 
    
    expect(await request.uid()).to.be.equal(identity.uid);
    expect(await request.state()).to.be.equal(
      request.constructor.State.PENDING
    );
    expect(await request.opType()).to.be.equal(opType);

    const otpCode = identity.connection.generateToken(
      await platform.userOtpCounter(identity.address)
    );

    await request.approve(otpCode, { key: account.privateKey });

    expect(await request.state()).to.be.equal(
      request.constructor.State.APPROVED
    );
    expect(await request.otpCode()).to.be.equal(otpCode);
  });
}

suite('Identity', async function() {
  let account = null;
  let identity = null;
  const testEndpoint = 'https://example.com/bidipass/verify-connection';

  test('should generate valid identity', async function() {
    const { sdk } = global.BIDIPASS;

    const identity = sdk.identity.generate(testEndpoint);

    // @todo fast hack o_O
    sdk.container.has('BIDIPASS_DUMP_QR') && require('fs').writeFileSync('qr.html', `<img src="${await identity.qr()}"/>`);

    const repr = identity.serialize();
    const restoredIdentity = sdk.identity.restore(repr);

    expect(repr).to.be.a('string');
    expect(restoredIdentity).to.be.an.instanceof(IdentityModel);
    expect(restoredIdentity.connection).to.be.an.instanceof(Connection);
    expect(restoredIdentity.serialize()).to.be.equal(repr);
  });

  test('should whitelist identity', async function() {
    const { sdk, newAccount } = global.BIDIPASS;

    account = newAccount(sdk);
    account.uid = 'user1';

    identity = sdk.identity.generate(account.uid, testEndpoint);
    identity.address = account.address;

    let error = null;

    try {
      await sdk.identity.whitelist(identity);
    } catch (e) { error = e }

    const platform = await sdk.identity.platform(identity);

    expect(error).to.not.be.an.instanceof(Error);
    expect(await platform.userId(identity.address)).to.be.equal(account.uid);
    expect(await platform.isUserConnected(identity.address)).to.be.true;
  });

  test('should unwhitelist identity', async function() {
    const { sdk } = global.BIDIPASS;

    let error = null;

    try {
      await sdk.identity.unwhitelist(identity);
    } catch (e) { error = e }

    expect(error).to.not.be.an.instanceof(Error);

    await sdk.identity.whitelist(identity);
  });

  test('should perform test connection', async function() {
    const { sdk } = global.BIDIPASS;
    
    approveRequest(sdk, identity, account, AuthorizationRequest.OpType.GENERIC);

    const authorization = sdk.identity.testConnection(identity, 'Test connection', 2000);

    await authorization.dispatch();

    const details = await authorization.request.details();

    expect(details.state).to.be.equal(authorization.request.constructor.State.ACCEPTED);
  });

  test('should be able to cancel an authorization', async function() {
    const { sdk } = global.BIDIPASS;

    const authorization = sdk.identity.authorizeLogin(identity, 'Login', 2000);
    const request = await authorization.send();

    await request.cancel();

    expect(await request.state()).to.be.equal(
      request.constructor.State.CANCELED
    );
  });

  test('should perform 2FA (login)', async function() {
    const { sdk } = global.BIDIPASS;
    
    approveRequest(sdk, identity, account, AuthorizationRequest.OpType.GENERIC);

    const authorization = sdk.identity.authorizeLogin(identity, 'Login', 2000);

    await authorization.dispatch();

    expect(await authorization.request.state()).to.be.equal(
      authorization.request.constructor.State.ACCEPTED
    );
  });

  test('should perform action authorization (Sell 10 ETH)', async function() {
    const { sdk } = global.BIDIPASS;

    const originalId = 'action1';
    const description = 'Sell 10 ETH';
    const symbol = 'ETH';
    const amount = 10 * (10 ** 18);
    const denomination = 10 ** 18;
    const opType = sdk.action.Item.DEBIT;

    const value = new sdk.action.Value(symbol, amount, denomination);
    const action = new sdk.action.Item(originalId, description, value, opType);
    
    approveRequest(sdk, identity, account, opType);

    const authorization = sdk.identity.authorize(identity, action, 2000);

    await authorization.dispatch();

    const details = await authorization.request.details();

    expect(details.state).to.be.equal(
      authorization.request.constructor.State.ACCEPTED
    );
  });

  test('should get total amount of requests', async function() {
    const { sdk } = global.BIDIPASS;

    const totalRequests = await sdk.action.total(identity);

    expect(totalRequests).to.be.equal('4');
  });

  test('should be able to list requests', async function() {
    const { sdk } = global.BIDIPASS;

    const requests = await sdk.action.list(identity, null, 3);
    const lastRequests = await sdk.action.list(identity, requests.offsetItem, 3);

    expect(requests).to.be.an.instanceof(Collection);
    expect(requests.length).to.be.equal(3);
    expect(requests.isIncomplete).to.be.equal(true);
    expect(lastRequests.length).to.be.equal(1);
    expect(lastRequests.isIncomplete).to.be.equal(false);
    expect(lastRequests.offsetItem).to.be.equal(null);
  });
});
