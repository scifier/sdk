const bidipass = require('../../../../bidipass-loader');
const chalk = require('chalk');

exports.command = 'check <id>';
exports.desc = 'Check if the address is a manager for the provider identified by <id>';
exports.builder = yargs => {
  return yargs
    .option('address', {
      type: 'array',
      alias: 'a',
      describe: 'Addresses of managers to check',
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

  for (const admin of address) {
    const isAdmin = await platform.whitelist(admin);

    console.log(chalk.blue(admin), isAdmin ? chalk.green('YES') : chalk.red('NO'));
  }
};
