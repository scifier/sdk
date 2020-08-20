#!/usr/bin/env node

const yargs = require('yargs');

process.env.BIDIPASS_ENV = 'us-west-2-test';

yargs
  .commandDir('cmds')
  .demandCommand()
  .recommendCommands()
  .option('key', {
    alias: 'k',
    describe: 'BidiPass private key',
  })
  .help('h')
  .alias('h', 'help')
  .showHelpOnFail(false, 'Specify --help for available options')
  .version()
  .alias('v', 'version')
  .epilog('Copyright BidiPass 2018')
  .argv;
