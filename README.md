# [Check is deprecated](https://github.com/awesome-cli/check-is-deprecated)

[![NPM version](https://img.shields.io/npm/v/check-is-deprecated?style=flat-square)](https://www.npmjs.com/package/check-is-deprecated)
[![NPM downloads](https://img.shields.io/npm/dm/check-is-deprecated?style=flat-square)](https://www.npmjs.com/package/check-is-deprecated)

## About

Check if npm package is deprecated or archived

## Prerequisites

- Node.js
- npm/Yarn

## How to Install

First, install the CLI by npm:

```sh
$ npm install -g check-is-deprecated
```

Or Yarn:

```sh
$ yarn global add check-is-deprecated
```

## How to Use

```sh
$ check-is-deprecated [options] [packages]
```

**Instead of `check-is-deprecated` you can use aliases: `is-deprecated` & `cid`**

## Options

- `-f, --file [url]` get packages from package.json
- `-g, --github` check GitHub repository
- `-m, --msg` output deprecation message
- `-l, --link` output repo link
- `-a, --all` display results for all packages

## License

This project is licensed under the MIT License © 2020-present Jakub Biesiada
