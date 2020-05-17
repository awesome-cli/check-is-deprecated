import { promisify } from 'util';
import { readFile, stat } from 'fs';

const asyncReadFile = promisify(readFile);
const asyncStat = promisify(stat);

export const readPackageFile = async (path: string) => {
  const dirs = path.split('/');

  if (!(await asyncStat(path))) {
    console.log('File not exists');

    process.exit(1);
  }

  if (dirs[dirs.length - 1] !== 'package.json') {
    console.log('You need to provide the package.json file');

    process.exit(1);
  }

  const file = JSON.parse(await asyncReadFile(path, 'utf-8'));

  const repositoryDependencies: string[] = [];

  const addDependencies = (dependencies: Record<string, any>) => {
    if (dependencies) repositoryDependencies.push(...Object.keys(dependencies));
  };

  [
    file.dependencies,
    file.devDependencies,
    file.peerDependencies,
  ].map((dependencies) => addDependencies(dependencies));

  return repositoryDependencies;
};
