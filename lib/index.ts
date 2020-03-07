#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description('Check if npm package is deprecated or archived')
  .usage('<pkgs>')
  .action(cmd => {
    // TODO check npm
    // TODO check github if link exists in npm (and npm package is not deprecated)
    // TODO error if package not exists

    cmd.args.map(async (arg: string) => {
      console.log(arg);
    });
  });

program.on('--help', () => {
  console.log(
    chalk.red(
      figlet.textSync('Is\nDeprecated?', {
        horizontalLayout: 'full',
        verticalLayout: 'full',
      })
    )
  );
});

program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.help();
}
