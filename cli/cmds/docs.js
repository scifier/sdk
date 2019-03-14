const chalk = require('chalk');
const path = require('path');
const httpServer = require('http-server/lib/http-server');

exports.command = 'docs';
exports.desc = 'Start documentation server';
exports.builder = yargs => {
  return yargs
    .option('host', {
      alias: 'a',
      type: 'string',
      describe: 'Docs server host',
      default: '127.0.0.1',
    })
    .option('port', {
      alias: 'p',
      type: 'number',
      describe: 'Docs server port',
      default: 8080,
    })
  ;
};

exports.handler = async argv => {
  const { host, port } = argv;

  const server = httpServer.createServer({
    cors: true,
    root: path.resolve(__dirname, '../../api-docs'),
  });

  server.listen(port, host, () => {
    console.info(chalk.green(`Documentation available on http://${ host }:${ port }`));
    console.info(chalk.yellow('Hit CTRL-C to stop the docs server'));
  });

  process.on('SIGINT', () => {
    console.info(chalk.red('Docs server stopped.'));
    process.exit(0);
  });
  
  process.on('SIGTERM', () => {
    console.info(chalk.red('Docs server stopped.'));
    process.exit(0);
  });
};
