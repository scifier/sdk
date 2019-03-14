const bidipass = require('../../../../bidipass-loader');
const chalk = require('chalk');

exports.command = 'check';
exports.desc = 'Check if the address is an admin';
exports.builder = yargs => {
  return yargs
    .option('address', {
      type: 'array',
      alias: 'a',
      describe: 'Addresses of admins to check',
    })
    .required('address', 'You should specify at least one address')
  ;
};

exports.handler = async argv => {
  const { address, key } = argv;

  const sdk = await bidipass(null, key);
  const platformRegistry = sdk.repository.api('PlatformRegistry');

  for (const admin of address) {
    const isAdmin = await platformRegistry.whitelist(admin);

    console.log(chalk.blue(admin), isAdmin ? chalk.green('YES') : chalk.red('NO'));
  }
};
