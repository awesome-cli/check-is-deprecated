#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import logSymbols from 'log-symbols';

import { checkNpmRepo } from './functions/check-npm';
import { checkGithubRepo } from './functions/check-github';

const pkg = require(path.join(__dirname, '../package.json'));

const info = chalk.cyan('❯');

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

    const packages = await Promise.all(
      args.map(async (arg: string) => {
        const npmData = await checkNpmRepo(arg);

        const { data } = npmData;

        const githubData = await checkGithubRepo(data.user, data.repo);

        return {
          npm: npmData,
          github: githubData,
        };
      })
    );

    packages.map((item: any, index: number) => {
      if (!item) return;

      const { npm, github } = item;

      const { data, error } = npm;
      const { archived, html_url, message } = github;

      if (error.message) {
        console.log(error.message);
      } else {
        console.log(`${chalk.bold.magentaBright(args[index])}:`);

        console.log(
          `${logSymbols[data.deprecated ? 'error' : 'success']} npm${
            link ? ` – https://www.npmjs.com/package/${args[index]}` : ''
          }`
        );

        if (!message) {
          console.log(
            `${logSymbols[archived ? 'error' : 'success']} GitHub${
              link && html_url ? ` – ${html_url}` : ''
            }`
          );
        } else if (message === 'Not Found') {
          console.log(`${logSymbols.warning} GitHub repository not found`);
        }

        if (msg && data.message) {
          console.log(`${info} ${data.message}`);
        }
      }

      if (index + 1 < packages.length) {
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
