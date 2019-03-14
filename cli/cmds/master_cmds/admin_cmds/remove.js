const bidipass = require('../../../../bidipass-loader');
const chalk = require('chalk');

exports.command = 'remove';
exports.desc = 'Remove admins';
exports.builder = yargs => {
  return yargs
    .required('key', 'Missing private key')
    .option('address', {
      type: 'array',
      alias: 'a',
      describe: 'Addresses of admins to remove',
    })
    .required('address', 'You should specify at least one address')
  ;
};

exports.handler = async argv => {
  const { address, key } = argv;

  const sdk = await bidipass(null, key);
  const platformRegistry = sdk.repository.api('PlatformRegistry');

  console.info(chalk.blue('--> Remove admins from provider registry at'), platformRegistry.address);

  await platformRegistry.removeAddressesFromWhitelist(address);

  console.log(chalk.green('\n{Removed Admins}'));
  console.log(chalk.green('Addresses:'), address.join(', '));
};
