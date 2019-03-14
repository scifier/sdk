const bidipass = require('../../../../bidipass-loader');
const chalk = require('chalk');
const web3Utils = require('web3-utils');

exports.command = 'add <id>';
exports.desc = 'Add manager for the provider identified by <id>';
exports.builder = yargs => {
  return yargs
    .required('key', 'Missing private key')
    .option('entropy', {
      alias: 'e',
      describe: 'A random string to increase entropy for generated credentials',
      default: Math.random().toString(),
    })
  ;
};

exports.handler = async argv => {
  const { id, entropy, key } = argv;

  console.info(chalk.blue('--> Provider'), id);

  const sdk = await bidipass(id, key);
  const { web3 } = sdk.repository.network;

  const account = web3.eth.accounts.create(entropy);

  const platformRegistry = sdk.repository.api('PlatformRegistry');

  if (!(await platformRegistry.exists(id))) {
    console.error(chalk.red(`Missing provider identified as ${ id }`));
    process.exit(1);
  }

  const platform = await platformRegistry.platform(id);

  console.info(chalk.blue('--> Adding manager to provider contract at'), platform.address);

  await platform.addAddressesToWhitelist([ account.address ]);

  console.log(chalk.green('\n{Manager Account}'));
  console.log(chalk.green('Address:'), account.address);
  console.log(chalk.green('Private Key:'), account.privateKey);
};
