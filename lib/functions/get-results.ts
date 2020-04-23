import npmGetPackageInfo from 'npm-get-package-info';

import { checkGithubRepo } from './check-github';
import { parseUrl } from './parse-url';

export const getResults = async (pkgs: string[]) => {
  return await Promise.all(
    pkgs.map(async (pkg) => {
      const npm: any = await npmGetPackageInfo({
        name: pkg,
        info: ['deprecated', 'repository'],
      });

      let github = {};

      if (!npm.error) {
        const { user, repo } = parseUrl(npm.url);

        github = await checkGithubRepo(user, repo);
      }

      return { pkg, npm, github };
    })
  );
};
