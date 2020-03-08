#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import logSymbols from 'log-symbols';

import { checkNpm } from './functions/check-npm';
import { checkGithub } from './functions/check-github';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description('Check if npm package is deprecated or archived')
  .usage('<pkgs> [options]')
  .option('-m, --msg', 'output deprecation message')
  .option('-l, --link', 'output repo link')
  .action(async ({ args, msg, link }) => {
    await args.map(async (arg: string, index: number) => {
      const { user, repo, message, deprecated } = await checkNpm(arg);

      const data = await checkGithub(user, repo);

      console.log(`${chalk.bold.magentaBright(arg)}:`);

      console.log(
        `${logSymbols[deprecated ? 'error' : 'success']} npm${
          msg && message ? ` – ${message}` : ''
        }`
      );

      console.log(
        data.id
          ? `${logSymbols[data.archived ? 'error' : 'success']} GitHub${
              link && data.html_url ? ` – ${data.html_url}` : ''
            }`
          : `${logSymbols.warning} GitHub repository not found`
      );

      if (index + 1 < args.length) {
        console.log(' ');
      }
    });
  });

program.on('--help', () => {
  console.log(
    chalk.yellowBright(
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
