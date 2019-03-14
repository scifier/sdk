exports.command = 'provider <command>';
exports.desc = 'Manage providers';
exports.builder = yargs => {
  return yargs.commandDir('provider_cmds');
};
exports.handler = () => {};
