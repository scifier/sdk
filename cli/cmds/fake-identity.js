const bidipass = require('../../bidipass-loader');
const chalk = require('chalk');
const Confirm = require('prompt-confirm');
const colorize = require('json-colorizer');
const cast = require('../../lib/contracts/api/helpers/cast');

exports.command = 'fake-identity';
exports.desc = 'Fake an identity';
exports.builder = yargs => {
  return yargs
    .required('key', 'Missing private key')
    .option('repr', {
      alias: 'r',
      describe: 'String representation of a serialized identity',
      required: true,
    })
    .option('approve', {
      alias: 'a',
      type: 'boolean',
      describe: 'Either approve (true) or reject (false) incoming requests',
      default: true,
    })
    .option('interactive', {
      alias: 'i',
      type: 'boolean',
      describe: 'Interactive mode',
      default: true,
    })
    .option('pollRate', {
      alias: 'pr',
      type: 'number',
      describe: 'Network poll rate in miliseconds',
      default: 500,
    })
  ;
};

async function authorize() {
  return new Confirm({
    name: 'consent', 
    message: 'Would you like to authorize the request above?'
  }).run();
}

exports.handler = async argv => {
  const { repr, key, approve, pollRate, interactive } = argv;
  
  const sdk = await bidipass('', key);
  const identity = sdk.identity.restore(repr);
  sdk.providerId = identity.providerId;
  const platformRegistry = sdk.repository.api('PlatformRegistry');

  if (!(await platformRegistry.exists(identity.providerId))) {
    console.error(chalk.red(`Missing provider identified as ${ identity.providerId }`));
    process.exit(1);
  }

  console.info(
    chalk.blue('--> Faking identity at'),
    identity.address,
    interactive ? '<interactive>' : (approve ? '<approve>' : '<reject>')
  );

  const authorizationRegistry = sdk.repository.api('AuthorizationRegistry');
  const authorizationRequest = sdk.repository.api('AuthorizationRequest');

  const watcher = authorizationRegistry.contract.Authorize.watch(
    cast.bytes32(identity.providerId),
    cast.bytes32(identity.uid),
    { pollRate }
  );

  watcher.on('error', e => { throw e });
  watcher.on('data', async event => {
    const platform = await platformRegistry.platform(identity.providerId);
    const request = authorizationRequest.at(event.args.request);

    if (interactive ? (await authorize()) : approve) {
      const otpCounter = await platform.userOtpCounter(identity.address);
      const otpCode = identity.connection.generateToken(otpCounter);
  
      await request.approve(otpCode);
    } else {
      await request.reject();
    }

    console.log(colorize(await request.serialize(null, 2)));
  });
};
