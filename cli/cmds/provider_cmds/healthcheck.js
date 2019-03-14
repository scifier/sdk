const bidipass = require('../../../bidipass-loader');
const cast = require('../../../lib/contracts/api/helpers/cast');
const colorize = require('json-colorizer');
const chalk = require('chalk');
const faker = require('faker');

exports.command = 'healthcheck <id>';
exports.desc = 'Perform healthcheck for the provider identified by <id>';
exports.builder = yargs => {
  return yargs
    .required('key', 'Missing private key')
  ;
};

exports.handler = async argv => {
  const { id, key } = argv;

  console.info(chalk.blue('--> Provider'), id);

  const sdk = await bidipass(id, key);
  const { web3 } = sdk.repository.network;
  const authorizationRegistry = sdk.repository.api('AuthorizationRegistry');
  const authorizationRequest = sdk.repository.api('AuthorizationRequest');
  const platformRegistry = sdk.repository.api('PlatformRegistry');

  const platformExists = await platformRegistry.exists(id);

  if (!platformExists) {
    console.log(chalk.red(`Provider does not exist`));
  } else {
    const platform = await platformRegistry.platform(id);

    console.log(chalk.blue(`Provider exists at`), chalk.green(platform.address));

    const UID = faker.random.alphaNumeric(32);
    const CONNECT = faker.internet.url();
    const DISCONNECT = faker.internet.url();
    const USER_NAME = faker.name.findName();

    const account = web3.eth.accounts.create(Math.random().toString());
    const user = sdk.identity.generate(UID, CONNECT, DISCONNECT);

    user.address = account.address;
    user.custom.setDisplayName(USER_NAME); 

    console.log(chalk.blue('Using identity'), colorize(user.serialize(null, 2)));

    await sdk.identity.whitelist(user);

    console.log(chalk.blue('Whitelist'), chalk.green(user.address));

    const watcher = authorizationRegistry.contract.Authorize.watch(
      cast.bytes32(user.providerId),
      cast.bytes32(user.uid),
      { pollRate: 500 }
    );

    watcher.on('error', e => { throw e });

    console.log(
      chalk.blue('Listen for authorization requests for'),
      chalk.green(user.providerId),
      chalk.green(user.uid)
    );

    try {
      await sdk.identity.testConnection(user);

      console.log(chalk.blue('Trigger test connection'));

      watcher.on('data', async event => {
        try {
          const request = authorizationRequest.at(event.args.request);
          const uid = await request.uid();

          // If it fails to filter from RPC for whatever reason...
          if (uid !== user.uid) {
            return;
          }
  
          console.log(
            chalk.blue('Authorization'),
            colorize(await request.serialize(null, 2))
          );
  
          const otpCounter = await platform.userOtpCounter(user.address);
          const otpCode = user.connection.generateToken(otpCounter);
      
          await request.approve(otpCode, { key: account.privateKey });
  
          console.log(chalk.blue('Approve with OTP code'), chalk.green(otpCode));
  
          watcher.close();
        } catch (e) {
          try { watcher.close() } catch(_) {} // Fail silently
          console.error(e);
        }
      });

      const authorization = sdk.identity.testConnection(user, 'Test connection');
  
      await authorization.dispatch();

      console.log(chalk.blue('Dispatch test connection'));
    } catch (e) { // Cleanup stuff...
      try { watcher.close() } catch(_) {} // Fail silently
      console.error(e);
    }

    await sdk.identity.unwhitelist(user);

    console.log(chalk.blue('Unwhitelist'), chalk.green(user.address));
  }
};
