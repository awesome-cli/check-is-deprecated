import { exec } from 'child_process';
import { promisify } from 'bluebird';

import { spinner } from './spinner';

const execAsync = promisify(exec);

export const checkNpmRepo = async (arg: string) => {
  let user = '';
  let repo = '';
  let message = '';

  let deprecated = false;

  let messageIndex: number;

  spinner.text = 'Checking npm repository';
  spinner.start();

  try {
    const stdout = (await execAsync(
      `npm view ${arg} deprecated repository`
    )) as string;

    spinner.stop();

    stdout.split("'").map(async (item, itemIndex) => {
      if (item.includes('deprecated')) {
        deprecated = true;

        messageIndex = itemIndex + 1;
      }

      if (itemIndex === messageIndex) {
        message = item;
      }

      if (item.includes('://')) {
        const parts = item.split('/');

        user = parts[3];
        repo = parts[4].replace('.git', '');
      }
    });
  } catch (err) {
    console.log(err);
  }

  return {
    user,
    repo,
    message,
    deprecated,
  };
};
