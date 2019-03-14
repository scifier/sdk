const bidipass = require('../../../../bidipass-loader');
const chalk = require('chalk');

exports.command = 'remove <id>';
exports.desc = 'Remove managers for the provider identified by <id>';
exports.builder = yargs => {
  return yargs
    .required('key', 'Missing private key')
    .option('address', {
      type: 'array',
      alias: 'a',
      describe: 'Addresses of managers to remove',
    })
    .required('address', 'You should specify at least one address')
  ;
};

exports.handler = async argv => {
  const { id, address, key } = argv;

  console.info(chalk.blue('--> Provider'), id);

  const sdk = await bidipass(id, key);
  const platformRegistry = sdk.repository.api('PlatformRegistry');

  if (!(await platformRegistry.exists(id))) {
    console.error(chalk.red(`Missing provider identified as ${ id }`));
    process.exit(1);
  }

  const platform = await platformRegistry.platform(id);

  console.info(chalk.blue('--> Remove managers from provider contract at'), platform.address);

  await platform.removeAddressesFromWhitelist(address);

  console.log(chalk.green('\n{Removed Managers}'));
  console.log(chalk.green('Addresses:'), address.join(', '));
};
