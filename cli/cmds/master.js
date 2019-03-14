exports.command = 'master <command>';
exports.desc = 'Master commands';
exports.builder = yargs => {
  return yargs.commandDir('master_cmds');
};
exports.handler = () => {};
