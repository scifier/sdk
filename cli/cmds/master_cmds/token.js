exports.command = 'token <command>';
exports.desc = 'Token commands';
exports.builder = yargs => {
  return yargs.commandDir('token_cmds');
};
exports.handler = () => {};
