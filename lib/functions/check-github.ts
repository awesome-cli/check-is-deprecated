import fetch from 'node-fetch';

import { spinner } from './spinner';

export const checkGithub = async (user: string, repo: string) => {
  spinner.text = 'Checking GitHub repository';
  spinner.color = 'yellow';
  spinner.start();

  let data;

  try {
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}`);

    data = await res.json();
  } catch (err) {
    console.log(err);
  }

  spinner.stop();

  return data;
};
