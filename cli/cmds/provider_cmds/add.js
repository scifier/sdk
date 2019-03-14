const bidipass = require('../../../bidipass-loader');
const chalk = require('chalk');
const web3Utils = require('web3-utils');

exports.command = 'add <id>';
exports.desc = 'Add a new provider identified by <id>';
exports.builder = yargs => {
  return yargs
    .required('key', 'Missing private key')
    .option('entropy', {
      alias: 'e',
      describe: 'A random string to increase entropy for generated credentials',
      default: Math.random().toString(),
    })
    .option('name', {
      alias: 'n',
      describe: 'Platform name',
      required: true,
    })
    .option('description', {
      alias: 'd',
      describe: 'Platform description',
      required: true,
    })
    .option('website', {
      alias: 'w',
      describe: 'Platform website',
      required: true,
    })
    .option('icon', {
      alias: 'i',
      describe: 'Platform icon URL',
      required: true,
    })
    .option('rewardSize', {
      alias: 'r',
      default: 5,
      type: 'number',
      describe: 'Reward size for authorization request in BDPp tokens (denomination=10**18)',
    })
  ;
};

exports.handler = async argv => {
  const {
    id, entropy, key, 
    name, description, 
    website, icon, rewardSize,
  } = argv;

  console.info(chalk.blue('--> Provider'), id);

  const sdk = await bidipass(id, key);
  const { web3 } = sdk.repository.network;

  const account = web3.eth.accounts.create(entropy);

  const platformRegistry = sdk.repository.api('PlatformRegistry');
  
  console.info(chalk.blue('--> Create provider contract'));

  const platform = await platformRegistry.add(
    web3Utils.toWei(rewardSize.toString()),
    id,
    name,
    description,
    website,
    icon,
    account.address,
  );

  console.info(chalk.blue('--> Provider contract created at'), platform.address);

  console.log(chalk.green('\n{Owner Account}'));
  console.log(chalk.green('Address:'), account.address);
  console.log(chalk.green('Private Key:'), account.privateKey);
};
