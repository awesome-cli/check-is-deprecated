import { readPackageFile } from './readPackageFile';

export const collectPackages = async (
  args: string[],
  includePackageFile: boolean | string
) => {
  const packagesToCheck = args;

  if (includePackageFile) {
    const projectRepoPackages = await readPackageFile(
      typeof includePackageFile === 'boolean'
        ? 'package.json'
        : includePackageFile
    );

    packagesToCheck.push(...projectRepoPackages);
  }

  return packagesToCheck;
};
