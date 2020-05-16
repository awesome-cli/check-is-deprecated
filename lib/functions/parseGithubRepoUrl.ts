import { Data } from '../interfaces/Data';

export const parseGithubRepoUrl = (url: string) => {
  const data = {} as Pick<Data, 'user' | 'repo'>;

  if (url.includes('://')) {
    const parts = url.split('/');

    data.user = parts[3];
    data.repo = parts[4].replace('.git', '');
  }

  return data;
};
