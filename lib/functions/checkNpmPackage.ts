import npmGetPackageInfo from 'npm-get-package-info';

export const checkNpmPackage = async (name: string) => {
  try {
    return await npmGetPackageInfo({
      name,
      info: ['deprecated', 'repository'],
    });
  } catch (err) {
    return { error: err };
  }
};
