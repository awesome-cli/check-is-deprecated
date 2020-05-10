import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export const checkNpmPackage = async (name: string) => {
  try {
    const { stdout } = await execAsync(
      `npm view ${name} deprecated repository --json`
    );

    return JSON.parse(stdout);
  } catch (err) {
    return { error: err };
  }
};
