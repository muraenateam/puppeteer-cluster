# Puppeteer Cluster for Necrobrowser

[![Build Status](https://api.travis-ci.org/thomasdondorf/puppeteer-cluster.svg?branch=master)](https://travis-ci.org/thomasdondorf/puppeteer-cluster)
[![npm](https://badgen.now.sh/npm/v/@muraenateam/puppeteer-cluster)](https://www.npmjs.com/package/@muraenateam/puppeteer-cluster)

> :warning: **This is repo contains a modified version of Puppeteer Cluster for Necrobrowser needs**: Be very careful here!


Create a cluster of puppeteer workers. This library spawns a pool of Chromium instances via [Puppeteer] and helps to keep track of jobs and errors. This is helpful if you want to crawl multiple pages or run tests in parallel. Puppeteer Cluster takes care of reusing Chromium and restarting the browser in case of errors.

- [Installation](#installation)
- ... 
- [License](#license)


## Installation

Install puppeteer (if you don't already have it installed):

`npm install --save puppeteer`

Install puppeteer-cluster:

`npm install --save @muraenateam/puppeteer-cluster`

## Hacking

If you edit the TypeScript source, you need to rebuild first and use a local version of this library.

puppeteer-cluster$ rm -rf ./node-modules && npm run-script clean 
puppeteer-cluster$ npm install tsc typescript jest
puppeteer-cluster$ npm run-script build --target ES6 --force
> @muraenateam/puppeteer-cluster@0.2.1 build
> tsc "ES6"

At this stage you should have freshly generated javascript in dist.

## License

[MIT license](./LICENSE).

