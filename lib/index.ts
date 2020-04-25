#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';

import { spinner } from './functions/spinner';
import { readPackageFile } from './functions/read-package-file';
import { getResults } from './functions/get-results';
import { displayPackageInfo } from './functions/display-package-info';

import { Params } from './interfaces/params';

const pkg = require(path.join(__dirname, '../package.json'));

program
  .version(pkg.version)
  .description(pkg.description)
  .usage('[options]  [packages]')
  .option('-f, --file [url]', 'get packages from package.json')
  .option('-g, --github', 'check GitHub repository')
  .option('-m, --msg', 'output deprecation message')
  .option('-l, --link', 'output repo link')
  .option('-a, --all', 'display results for all packages')
  .action(async (params: Params) => {
    const { args, file, ...rest } = params;

    if (args.length === 0 && !file) {
      program.outputHelp();

      process.exit(1);
    }

    let pkgs = args;

    if (file) {
      pkgs = [
        ...pkgs,
        ...(await readPackageFile(
          typeof file === 'boolean' ? 'package.json' : file
        )),
      ];
    }

    spinner.text = 'Checking packages';
    spinner.start();

    const results = await getResults(pkgs);

    spinner.stop();

    displayPackageInfo({ results, ...rest });
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
