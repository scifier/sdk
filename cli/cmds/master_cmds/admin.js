exports.command = 'admin <command>';
exports.desc = 'Manage admins';
exports.builder = yargs => {
  return yargs.commandDir('admin_cmds');
};
exports.handler = () => {};
