export const extractDeprecated = <T>(
  packagesInfo: T[],
  displayAll: boolean
) => {
  if (displayAll) {
    return packagesInfo;
  }

  // console.log((packagesInfo as any)[0].npm.error.message);

  return packagesInfo.filter(
    (packageInfo: any) =>
      packageInfo.npm.error ||
      packageInfo.npm.deprecated ||
      packageInfo?.github?.archived
  );
};
