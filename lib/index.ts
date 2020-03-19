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
  .description(pkg.description)
  .usage('<pkgs> [options]')
  .option('-m, --msg', 'output deprecation message')
  .option('-l, --link', 'output repo link')
  .action(async ({ args, msg, link }) => {
    if (args.length === 0) {
      return console.log('Packages are not provided');
    }

    const results = await Promise.all(
      args.map(async (arg: string) => {
        const npm = await checkNpmRepo(arg);

        const github = await checkGithubRepo(npm.user, npm.repo);

        return { pkg: arg, npm, github };
      })
    );

    results.map(({ pkg, npm, github }: any, index) => {
      const { deprecated, message: npmMessage, error } = npm;
      const { id, archived, html_url, message: githubMessage } = github;

      if (error) {
        console.log(chalk.yellow(`${logSymbols.warning} ${error}`));
      } else {
        console.log(`${chalk.bold.magentaBright(pkg)}:`);

        console.log(
          `${logSymbols[deprecated ? 'error' : 'success']} npm${
            link ? ` – https://www.npmjs.com/package/${pkg}` : ''
          }`
        );

        if (!githubMessage) {
          if (id) {
            console.log(
              `${logSymbols[archived ? 'error' : 'success']} GitHub${
                link && html_url ? ` – ${html_url}` : ''
              }`
            );
          }
        } else if (githubMessage === 'Not Found') {
          console.log(`${logSymbols.warning} GitHub – repository not found`);
        }

        if (msg && npmMessage) {
          console.log(`${info} ${npmMessage}`);
        }

        if (index !== args.length - 1) {
          console.log('');
        }
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
