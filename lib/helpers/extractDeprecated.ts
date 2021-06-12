export const extractDeprecated = <T>(
  packagesInfo: T[],
  displayAll: boolean
) => {
  if (displayAll) {
    return packagesInfo;
  }

  return packagesInfo.filter(
    (packageInfo) =>
      packageInfo.npm?.error ||
      packageInfo.npm?.deprecated ||
      packageInfo?.github?.archived ||
      packageInfo.github?.message ||
      packageInfo.github?.error
  );
};
