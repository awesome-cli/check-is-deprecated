#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import logSymbols from 'log-symbols';

import { checkNpmRepo } from './functions/check-npm';
import { checkGithubRepo } from './functions/check-github';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description('Check if npm package is deprecated or archived')
  .usage('<pkgs> [options]')
  .option('-m, --msg', 'output deprecation message')
  .option('-l, --link', 'output repo link')
  .action(async ({ args, msg, link }) => {
    await args.map(async (arg: string, index: number) => {
      const { user, repo, message, deprecated } = await checkNpmRepo(arg);

      const { id, archived, html_url } = await checkGithubRepo(user, repo);

      console.log(`${chalk.bold.magentaBright(arg)}:`);

      console.log(
        `${logSymbols[deprecated ? 'error' : 'success']} npm${
          msg && message ? ` – ${message}` : ''
        }`
      );

      if (id) {
        console.log(
          `${logSymbols[archived ? 'error' : 'success']} GitHub${
            link && html_url ? ` – ${html_url}` : ''
          }`
        );
      } else {
        console.log(`${logSymbols.warning} GitHub repository not found`);
      }

      if (index + 1 < args.length) {
        console.log(' ');
      }
    });
  });

program.on('--help', () => {
  console.log(
    chalk.yellowBright(
      figlet.textSync('Check Is\nDeprecated?', {
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
