import fetch from 'node-fetch';

import { GithubResult } from '../interfaces/GithubResult';

interface GithubNotFound {
  message: string;
  documentation_url: string;
}

export const checkGithubRepo = async (user: string, repo: string) => {
  try {
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}`);

    const data: GithubResult | GithubNotFound = await res.json();

    return data;
  } catch {
    return { error: 'Unable to check repository' };
  }
};
