const bidipass = require('../../../../bidipass-loader');
const chalk = require('chalk');

exports.command = 'add';
exports.desc = 'Add new admin';
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
  const { entropy, key } = argv;

  const sdk = await bidipass(null, key);
  const { web3 } = sdk.repository.network;

  const account = web3.eth.accounts.create(entropy);

  const platformRegistry = sdk.repository.api('PlatformRegistry');
  
  console.info(chalk.blue('--> Add new admin to provider registry at'), platformRegistry.address);

  await platformRegistry.addAddressesToWhitelist([ account.address ]);

  console.log(chalk.green('\n{Admin Account}'));
  console.log(chalk.green('Address:'), account.address);
  console.log(chalk.green('Private Key:'), account.privateKey);
};
