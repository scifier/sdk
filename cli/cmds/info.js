const bidipass = require('../../bidipass-loader');
const chalk = require('chalk');

exports.command = 'info';
exports.desc = 'Show distribution information';
exports.builder = yargs => {};

exports.handler = async argv => {
  const sdk = await bidipass(null, null);

  console.log(chalk.green('{Network}'));

  console.log(
    chalk.green('Provider:'),
    sdk.repository.network.constructor.name
  );

  console.log(
    chalk.green('Web3:'),
    sdk.repository.network.provider.constructor.name,
    chalk.blue(sdk.repository.network.provider.host || 'N/A')
  );

  console.log(
    chalk.green('Stats:'),
    chalk.blue(await sdk.repository.network.web3.eth.getBlockNumber()),
    'blocks,',
    chalk.blue(await sdk.repository.network.web3.eth.net.getPeerCount()),
    'peers',
  );
    
  console.log('');
  
  console.log(chalk.green('{Contracts}'));

  console.log(
    chalk.green('AuthorizationRegistry:'),
    sdk.repository.api('AuthorizationRegistry').address
  );

  console.log(
    chalk.green('PlatformRegistry:'),
    sdk.repository.api('PlatformRegistry').address
  );

  console.log(
    chalk.green('BDPpToken:'),
    sdk.repository.api('BDPpToken').address
  );

  console.log(
    chalk.green('BidiPassUtilityToken:'),
    sdk.repository.api('BidiPassUtilityToken').address
  );

  console.log(
    chalk.green('RewardRegistry:'),
    (await sdk.repository.api('PlatformRegistry').rewardRegistry()).address
  );
};
