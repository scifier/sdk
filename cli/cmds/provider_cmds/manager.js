exports.command = 'manager <command>';
exports.desc = 'Manage provider managers';
exports.builder = yargs => {
  return yargs.commandDir('manager_cmds');
};
exports.handler = () => {};
