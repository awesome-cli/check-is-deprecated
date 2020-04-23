import { promisify } from 'util';
import { readFile, exists } from 'fs';

import { spinner } from './spinner';

const asyncReadFile = promisify(readFile);
const asyncExists = promisify(exists);

export const readPackageFile = async (path: string) => {
  // spinner.text = 'Checking file...';
  // spinner.start();

  const dirs = path.split('/');

  if (!(await asyncExists(path))) {
    // spinner.fail('File not exists');
    console.log('File not exists');

    process.exit(1);
  }

  if (dirs[dirs.length - 1] !== 'package.json') {
    // spinner.fail('You need to provide the package.json file');
    console.log('You need to provide the package.json file');

    process.exit(1);
  }

  const file = JSON.parse(await asyncReadFile(path, 'utf-8'));

  let dependencies: string[] = [];

  const addDependencies = (deps: object) => {
    if (deps) {
      dependencies = [...dependencies, ...Object.keys(deps)];
    }
  };

  [file.dependencies, file.devDependencies, file.peerDependencies].map((deps) =>
    addDependencies(deps)
  );

  // spinner.succeed();

  return dependencies;
};
