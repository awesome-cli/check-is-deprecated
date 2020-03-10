import fetch from 'node-fetch';

import { spinner } from './spinner';

export const checkGithubRepo = async (user: string, repo: string) => {
  spinner.text = 'Checking GitHub repository';
  spinner.color = 'yellow';
  spinner.start();

  let data: any;

  try {
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}`);

    data = await res.json();
  } catch (err) {
    console.log(err);
  }

  spinner.stop();

  return data;
};
