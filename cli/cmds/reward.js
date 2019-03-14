const bidipass = require('../../bidipass-loader');
const { numberOrRange } = require('./utils/input');
const web3Utils = require('web3-utils');
const chalk = require('chalk');

exports.command = 'reward <address>';
exports.desc = 'Get miner reward identified by <address>';
exports.builder = yargs => {
  yargs
    .option('blocks', numberOrRange.options({
      alias: 'b',
      describe: `Block[s] number to fetch reward ${ numberOrRange.example('-b') }`,
      default: null,
    }))
  ;
};

exports.handler = async argv => {
  let { address, blocks } = argv;
  const sdk = await bidipass(null, null);

  const platformRegistry = sdk.repository.api('PlatformRegistry');
  const rewardRegistry = await platformRegistry.rewardRegistry();
  const token = await rewardRegistry.token();

  console.log(chalk.green('{Reward}'));
  console.log(chalk.green('Address:'), address);

  if (blocks.length > 0) {
    const symbol = await token.symbol();
    let total = 0;

    for (const block of blocks) {
      const reward = web3Utils.fromWei(await rewardRegistry.blockReward(address, block));

      total += parseFloat(reward);

      console.log(chalk.green(`<BLOCK ${ block }> Ammount:`), reward, symbol);
    }

    console.log(chalk.green('Total Ammount:'), total, symbol);
  } else {
    console.log(
      chalk.green('Ammount:'),
      web3Utils.fromWei(await rewardRegistry.totalReward(address)),
      await token.symbol(),
    );
  }
};
