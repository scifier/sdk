const bidipass = require('../../../bidipass-loader');
const chalk = require('chalk');

exports.command = 'remove <id>';
exports.desc = 'Remove the provider identified by <id>';
exports.builder = yargs => {
  return yargs
    .required('key', 'Missing private key')
  ;
};

exports.handler = async argv => {
  const { id, key } = argv;

  console.info(chalk.blue('--> Provider'), id);

  const sdk = await bidipass(id, key);
  const platformRegistry = sdk.repository.api('PlatformRegistry');

  if (!(await platformRegistry.exists(id))) {
    console.error(chalk.red(`Missing provider identified as ${ id }`));
    process.exit(1);
  }

  const platform = await platformRegistry.platform(id);

  console.info(chalk.blue('--> Remove provider at'), platform.address);
  
  await platformRegistry.remove(id);
};
