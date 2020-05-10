export const extractDeprecated = <T>(
  packagesInfo: T[],
  displayAll: boolean
) => {
  if (displayAll) {
    return packagesInfo;
  }

  return packagesInfo.filter(
    (packageInfo: any) =>
      packageInfo.npm.deprecated || packageInfo?.github?.archived
  );
};
