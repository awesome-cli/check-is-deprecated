import { Data } from '../interfaces/data';

export const parseUrl = (url: string) => {
  const data = {} as Data;

  if (url.includes('://')) {
    const parts = url.split('/');

    data.user = parts[3];
    data.repo = parts[4].replace('.git', '');
  }

  return data;
};
