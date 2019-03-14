const bidipass = require('../../../bidipass-loader');
const chalk = require('chalk');
const web3Utils = require('web3-utils');

exports.command = 'update <id>';
exports.desc = 'Update the provider identified by <id>';
exports.builder = yargs => {
  return yargs
    .required('key', 'Missing private key')
    .option('pay-fees', {
      describe: 'Mark if platform has to pay fees',
      type: 'boolean',
      required: false,
      default: undefined,
    })
    .option('pay-generic', {
      describe: 'Mark if platform has to pay fees for generic operations like test and login',
      type: 'boolean',
      required: false,
      default: undefined,
    })
    .option('reward-size', {
      describe: 'Miner reward size',
      type: 'number',
      required: false,
      default: undefined,
    })
  ;
};

exports.handler = async argv => {
  const {
    id, key, 
    payFees, payGeneric, rewardSize,
  } = argv;

  console.info(chalk.blue('--> Provider'), id);

  const sdk = await bidipass(id, key);

  const platformRegistry = sdk.repository.api('PlatformRegistry');
  
  const platformExists = await platformRegistry.exists(id);

  if (platformExists) {
    const platform = await platformRegistry.platform(id);

    console.log(chalk.green('\n{Provider}'));
    console.log(chalk.blue('Address'), platform.address);

    if (payFees !== undefined) {
      console.info(chalk.blue('Update shouldPayFees:'), payFees);
      await platform.payFees(payFees);
    }

    if (payGeneric !== undefined) {
      console.info(chalk.blue('Update payGeneric:'), payGeneric);
      await platform.payGeneric(payGeneric);
    }

    if (rewardSize !== undefined) {
      console.info(chalk.blue('Update rewardSize:'), rewardSize);
      await platform.setRewardSize(web3Utils.toWei(rewardSize.toString()));
    }
  } else {
    console.log(chalk.red('Provider does not exist'));
  }
};
