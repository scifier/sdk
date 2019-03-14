const bidipass = require('../../../bidipass-loader');
const web3Utils = require('web3-utils');
const chalk = require('chalk');

exports.command = 'info <id>';
exports.desc = 'Display information for the provider identified by <id>';
exports.builder = {};

exports.handler = async argv => {
  const { id, key } = argv;

  console.info(chalk.blue('--> Provider'), id);

  const sdk = await bidipass(id, key);
  const platformRegistry = sdk.repository.api('PlatformRegistry');

  const platformExists = await platformRegistry.exists(id);

  if (platformExists) {
    const platform = await platformRegistry.platform(id);

    console.log(chalk.green('\n{Provider}'));
    console.log(chalk.blue('Address'), platform.address);
    console.log(chalk.blue('Identifier'), await platform.id());
    console.log(chalk.blue('Name'), await platform.name());
    console.log(chalk.blue('Description'), await platform.description());
    console.log(chalk.blue('Website'), await platform.website());
    console.log(chalk.blue('Reward size'), web3Utils.fromWei(await platform.rewardSize()));
    console.log(chalk.blue('Icon'), await platform.icon());
    console.log(chalk.blue('Users connected'), await platform.usersConnected());

    // @todo get rid of back compatilibity after deprecated
    try {
      console.log(chalk.blue('Pay Fees'), await platform.shouldPayFees());
      console.log(chalk.blue('Pay Generic'), await platform.shouldPayGeneric());
    } catch (_) {
      console.log(chalk.blue('Pay Fees'), 'N/A');
      console.log(chalk.blue('Pay Generic'), 'N/A');
    }
  } else {
    console.log(chalk.red('Provider does not exist'));
  }
};
