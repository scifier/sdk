const bidipass = require('../../../../bidipass-loader');
const web3Utils = require('web3-utils');
const chalk = require('chalk');

exports.command = 'issue <address> <amount>';
exports.desc = 'Issue tokens';
exports.builder = yargs => {
  return yargs
    .required('key', 'Missing private key')
  ;
};

exports.handler = async argv => {
  const { address, key, amount } = argv;

  const sdk = await bidipass(null, key);
  const platformRegistry = sdk.repository.api('PlatformRegistry');
  const rewardRegistry = await platformRegistry.rewardRegistry();
  const token = await rewardRegistry.token();
  const symbol = await token.symbol();

  console.log(chalk.green('{Issue}'));
  console.log(
    chalk.green(`<${ address }> Amount`),
    amount,
    symbol
  );

  await token.mint(address, web3Utils.toWei(amount.toString()));

  console.log(chalk.green('{Token}'));
  console.log(
    chalk.green(`Amount`),
    web3Utils.fromWei(await token.balanceOf(address)),
    symbol
  );
};
