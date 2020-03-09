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
    if (args.length === 0) {
      return console.log('Packages are not provided');
    }

    const data = await Promise.all(
      args.map(async (arg: string) => {
        const npmData = await checkNpmRepo(arg);

        const { user, repo } = npmData;

        const githubData = await checkGithubRepo(user, repo);

        return {
          npm: npmData,
          github: githubData,
        };
      })
    );

    data.map((item: any, index: number) => {
      if (!item) return;

      const { npm, github } = item;

      const { deprecated, message } = npm;
      const { id, archived, html_url } = github;

      console.log(`${chalk.bold.magentaBright(args[index])}:`);

      console.log(
        `${logSymbols[deprecated ? 'error' : 'success']} npm${
          msg && message ? ` – ${message}` : ''
        }${link ? ` – https://www.npmjs.com/package/${args[index]}` : ''}`
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

      if (index + 1 < data.length) {
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
