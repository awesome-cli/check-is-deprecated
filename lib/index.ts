#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import ora from 'ora';

import { collectPackages } from './helpers/collectPackages';
import { getPackageInfo } from './helpers/getPackageInfo';
import { extractDeprecated } from './helpers/extractDeprecated';

import Params from './interfaces/Params';

const spinner = ora();

const pkg = require(path.join(__dirname, '../package.json'));

const info = chalk.cyan('❯');

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options]  [packages]')
  .option('-f, --file [url]', 'get packages from package.json')
  .option('-g, --gh, --github', 'check GitHub repository')
  .option('-m, --msg, --message', 'output deprecation message')
  .option('-l, --link', 'output repo link')
  .option('-a, --all', 'display results for all packages')
  .action(async (params: Params) => {
    const {
      file: includePackageFile,
      github: includeGithubRepo,
      msg: displayMessage,
      link: displayLink,
      all: displayAll,
      args,
    } = params;

    if (args.length === 0 && !includePackageFile) {
      program.outputHelp();

      process.exit(1);
    }

    const packagesToCheck = await collectPackages(args, includePackageFile);

    spinner.text = `Checking package${packagesToCheck.length > 1 ? 's' : ''}`;
    spinner.start();

    const packagesInfo = await getPackageInfo(
      packagesToCheck,
      includeGithubRepo
    );

    spinner.stop();

    const packageResults = extractDeprecated(packagesInfo, displayAll);

    if (packageResults.length === 0) {
      console.log('🎉 All is OK!');

      process.exit(1);
    }

    packageResults.map(({ packageToCheck, npm, github }, index) => {
      console.log(`${chalk.bold.magentaBright(packageToCheck)}:`);

      if ('error' in npm) {
        console.log(`${logSymbols.warning} npm – repository not found`);
      } else {
        console.log(
          `${logSymbols[npm.deprecated ? 'error' : 'success']} npm${
            displayLink
              ? ` – https://www.npmjs.com/package/${packageToCheck}`
              : ''
          }`
        );

        if (github) {
          if ('error' in github) {
            console.log(github.error);
          } else if ('message' in github) {
            if (github.message === 'Not Found') {
              console.log(
                `${logSymbols.warning} GitHub – repository not found`
              );
            } else {
              console.log(`${logSymbols.warning} GitHub – ${github.message}`);
            }
          } else {
            const { id, archived, html_url } = github;

            if (id) {
              console.log(
                `${logSymbols[archived ? 'error' : 'success']} GitHub${
                  displayLink && html_url ? ` – ${html_url}` : ''
                }`
              );
            }
          }
        }

        if (displayMessage && npm.deprecated) {
          console.log(`${info} ${npm.deprecated}`);
        }
      }

      if (index !== packageResults.length - 1) {
        console.log('');
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
