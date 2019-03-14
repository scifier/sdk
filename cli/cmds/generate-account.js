const bidipass = require('../../bidipass-loader');
const chalk = require('chalk');

exports.command = 'generate-account';
exports.desc = 'Generate new blockchain account';
exports.builder = yargs => {
  return yargs
    .option('entropy', {
      alias: 'e',
      describe: 'A random string to increase entropy for generated credentials',
      default: Math.random().toString(),
    })
  ;
};

exports.handler = async argv => {
  const { entropy, key } = argv;

  const sdk = await bidipass(null, key);
  const { web3 } = sdk.repository.network;

  const account = web3.eth.accounts.create(entropy);

  console.log(chalk.green('{New Account}'));
  console.log(chalk.green('Address:'), account.address);
  console.log(chalk.green('Private Key:'), account.privateKey);
};
