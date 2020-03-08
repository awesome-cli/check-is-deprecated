#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import fetch from 'node-fetch';
import { exec } from 'child_process';
import logSymbols from 'log-symbols';
import ora from 'ora';

const pkg = require(path.join(__dirname, '../package.json'));

const spinner = ora();

program
  .version(pkg.version)
  .description('Check if npm package is deprecated or archived')
  .usage('<pkgs> [options]')
  .option('-m, --msg', 'output deprecation message')
  .option('-r, --repo', 'output repo link')
  .action(cmd => {
    spinner.text = 'Checking npm repository';
    spinner.start();

    cmd.args.map(async (arg: string, index: number) => {
      exec(
        `npm view ${arg} deprecated repository`,
        async (error, stdout, stderr) => {
          spinner.stop();

          if (error) {
            return console.log(error);
          }

          if (stderr) {
            return console.log(stderr);
          }

          let user = '';
          let repo = '';
          let message = '';

          let deprecated = false;

          let messageIndex: number;

          stdout.split("'").map(async (item, itemIndex) => {
            if (item.includes('deprecated')) {
              deprecated = true;

              messageIndex = itemIndex + 1;
            }

            if (itemIndex === messageIndex) {
              message = item;
            }

            if (item.includes('://')) {
              const parts = item.split('/');

              user = parts[3];
              repo = parts[4].replace('.git', '');
            }
          });

          spinner.text = 'Checking GitHub repository';
          spinner.color = 'yellow';
          spinner.start();

          let data;

          try {
            const res = await fetch(
              `https://api.github.com/repos/${user}/${repo}`
            );

            data = await res.json();
          } catch (err) {
            console.log(err);
          }

          spinner.stop();

          console.log(`${chalk.bold.magentaBright(arg)}:`);

          console.log(`${logSymbols[deprecated ? 'error' : 'success']} npm`);

          console.log(
            data.id
              ? `${logSymbols[data.archived ? 'error' : 'success']} GitHub`
              : 'GitHub repository not found'
          );

          if (index + 1 < cmd.args.length) {
            console.log('');
          }
        }
      );
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
