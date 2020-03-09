import { exec } from 'child_process';
import { promisify } from 'bluebird';

import { spinner } from './spinner';

const execAsync = promisify(exec);

type NpmData = {
  message: string;
  user: string;
  repo: string;
  deprecated: boolean;
};

type NpmError = {
  message: string;
};

export const checkNpmRepo = async (arg: string) => {
  let messageIndex: number;

  const data: NpmData = {} as NpmData;
  const error: NpmError = {} as NpmError;

  spinner.text = 'Checking npm repository';
  spinner.start();

  try {
    const stdout = (await execAsync(
      `npm view ${arg} deprecated repository`
    )) as string;

    stdout.split("'").map(async (item, itemIndex) => {
      if (item.includes('deprecated')) {
        data.deprecated = true;

        messageIndex = itemIndex + 1;
      }

      if (itemIndex === messageIndex) {
        data.message = item;
      }

      if (item.includes('://')) {
        const parts = item.split('/');

        data.user = parts[3];
        data.repo = parts[4].replace('.git', '');
      }
    });
  } catch (err) {
    error.message = `${arg} not found`;
  }

  spinner.stop();

  return { data, error };
};
