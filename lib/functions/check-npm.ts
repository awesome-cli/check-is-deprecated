import { exec } from 'child_process';
import { promisify } from 'util';
import isOnline from 'is-online';

import { spinner } from './spinner';

const execAsync = promisify(exec);

export const checkNpmRepo = async (arg: string) => {
  let messageIndex: number;

  spinner.text = 'Checking npm repository';
  spinner.start();

  try {
    const data: any = {};

    const { stdout } = await execAsync(
      `npm view ${arg} deprecated repository -json`
    );

    spinner.stop();

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

    return data;
  } catch (err) {
    // const online = await isOnline();

    // console.log(online);

    spinner.stop();

    // if (online === false) {
    //   return { error: `Error with connection` };
    // } else {
    return { error: `npm - ${arg} not found` };
    // }
  }
};
