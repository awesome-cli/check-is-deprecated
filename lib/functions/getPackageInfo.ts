import { checkNpmPackage } from './checkNpmPackage';
import { parseGithubRepoUrl } from './parseGithubRepoUrl';
import { checkGithubRepo } from './checkGithubRepo';

import { NpmResult } from '../interfaces/NpmResult';

export const getPackageInfo = async (
  packagesToCheck: string[],
  includeGithubRepo: boolean
) => {
  return await Promise.all(
    packagesToCheck.map(async (packageToCheck) => {
      try {
        const npmResults = await checkNpmPackage(packageToCheck);

        if (!includeGithubRepo || (npmResults as { error: Error })?.error) {
          return { packageToCheck, npm: npmResults };
        }

        const { user, repo } = parseGithubRepoUrl(
          (npmResults as NpmResult)?.repository?.url
        );

        const githubResults = await checkGithubRepo(user, repo);

        return { packageToCheck, npm: npmResults, github: githubResults };
      } catch (err) {
        return { error: err };
      }
    })
  );
};
