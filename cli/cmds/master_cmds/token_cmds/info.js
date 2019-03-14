const bidipass = require('../../../../bidipass-loader');
const web3Utils = require('web3-utils');
const chalk = require('chalk');

exports.command = 'info';
exports.desc = 'Show token information';
exports.builder = yargs => {
  return yargs
    .option('address', {
      alias: 'a',
      type: 'array',
      describe: 'Address[es] to check the balance',
      required: false,
    })
  ;
};

exports.handler = async argv => {
  const { address } = argv;

  const sdk = await bidipass(null, null);
  const platformRegistry = sdk.repository.api('PlatformRegistry');
  const rewardRegistry = await platformRegistry.rewardRegistry();
  const token = await rewardRegistry.token();
  const symbol = await token.symbol();

  console.log(chalk.green('{Token}'));
  
  console.log(chalk.green('Symbol:'), symbol);
  console.log(chalk.green('Address:'), token.address);
  console.log(chalk.green('Supply:'), web3Utils.fromWei(await token.totalSupply()), symbol);

  for (const account of (address || [])) {
    console.log(
      chalk.green(`<${ account }> Amount`),
      web3Utils.fromWei(await token.balanceOf(account)),
      symbol
    );
  }
};
