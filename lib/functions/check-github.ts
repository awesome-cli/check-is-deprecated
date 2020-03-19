import fetch from 'node-fetch';

import { spinner } from './spinner';

export const checkGithubRepo = async (user: string, repo: string) => {
  spinner.text = 'Checking GitHub repository';
  spinner.color = 'yellow';
  spinner.start();

  try {
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}`);

    const data = await res.json();

    spinner.stop();

    return data;
  } catch (err) {
    spinner.stop();

    return { error: 'Unable to check repository' };
  }
};
