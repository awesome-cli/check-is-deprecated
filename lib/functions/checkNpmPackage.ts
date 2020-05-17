import npmGetPackageInfo from 'npm-get-package-info';

import { NpmResult } from '../interfaces/NpmResult';

export const checkNpmPackage = async (
  name: string
): Promise<NpmResult | { error: Error }> => {
  try {
    return await npmGetPackageInfo({
      name,
      info: ['deprecated', 'repository'],
    });
  } catch (err) {
    return { error: err };
  }
};
