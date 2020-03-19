#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';

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

    await Promise.all(
      args.map(async (arg: string) => {
        console.log(`${chalk.bold.magentaBright(arg)}:`);

        const { data } = await checkNpmRepo(arg);

        await checkGithubRepo(data.user, data.repo);

        // return {
        //   npm: npmData,
        //   github: githubData,
        // };
      })
    );
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
