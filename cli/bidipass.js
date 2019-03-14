#!/usr/bin/env node

const yargs = require('yargs');

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
