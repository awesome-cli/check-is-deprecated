import chalk from 'chalk';
import logSymbols from 'log-symbols';

const info = chalk.cyan('❯');

export const displayPackageInfo = async ({
  results,
  msg,
  link,
  ...rest
}: any) => {
  // console.log(rest);

  results.map(({ pkg, npm, github }: any, index: any) => {
    const { deprecated, error: npmError, message: npmMessage } = npm;

    console.log(`${chalk.bold.magentaBright(pkg)}:`);

    if (npmError) {
      console.log(`${logSymbols.warning} npm – repository not found`);
    } else {
      console.log(
        `${logSymbols[deprecated ? 'error' : 'success']} npm${
          link ? ` – https://www.npmjs.com/package/${pkg}` : ''
        }`
      );

      const {
        id,
        archived,
        html_url,
        error: githubError,
        message: githubMessage,
      } = github;

      if (githubError) {
        console.log(githubError);
      }

      if (!githubMessage) {
        if (id) {
          console.log(
            `${logSymbols[archived ? 'error' : 'success']} GitHub${
              link && html_url ? ` – ${html_url}` : ''
            }`
          );
        }
      } else if (githubMessage === 'Not Found') {
        console.log(`${logSymbols.warning} GitHub – repository not found`);
      }

      if (msg && npmMessage) {
        console.log(`${info} ${npmMessage}`);
      }
    }
    if (index !== results.length - 1) {
      console.log('');
    }
  });
};
