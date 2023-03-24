import chalk from 'chalk';

(async () => {
  console.debug('Starting script...\n');

  try {
    const template = process.argv[2];
    const directory = `./templates/${template}`;

    const { default: fn } = require(directory);

    await fn();

    console.debug();
    console.debug(chalk.bold.green('Script executed with success!'));
  } catch (error) {
    console.debug(chalk.bold.red('Script failed with following error:'));
    console.error(error);
  }
})();
