import { checkNpmPackage } from './checkNpmPackage';
import { parseGithubRepoUrl } from './parseGithubRepoUrl';
import { checkGithubRepo } from './checkGithubRepo';

export const getPackageInfo = async (
  packagesToCheck: string[],
  includeGithubRepo: boolean
) => {
  return await Promise.all(
    packagesToCheck.map(async (packageToCheck) => {
      try {
        const npmResults = await checkNpmPackage(packageToCheck);

        if (!includeGithubRepo) {
          return { packageToCheck, npm: npmResults };
        }

        const { user, repo } = parseGithubRepoUrl(
          npmResults?.repository?.url ?? npmResults?.url
        );

        const githubResults = await checkGithubRepo(user, repo);

        return { packageToCheck, npm: npmResults, github: githubResults };
      } catch (err) {
        return { error: err };
      }
    })
  );
};
