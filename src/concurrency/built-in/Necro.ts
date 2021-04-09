import * as puppeteer from 'puppeteer';
import ConcurrencyImplementation, {WorkerInstance} from '../ConcurrencyImplementation';

import * as path from 'path';
import * as util from 'util';

import {debugGenerator, timeoutExecute} from '../../util';

const debug = debugGenerator('BrowserConcurrency');
const BROWSER_TIMEOUT = 5000;

export default class Necro extends ConcurrencyImplementation {
    public async init() {
    }

    public async close() {
    }

    public async workerInstance(perBrowserOptions: puppeteer.LaunchOptions | undefined):
        Promise<WorkerInstance> {

        // Access by value not reference, so we can generate dynamic user-data-dir paths
        const options = Object.assign({}, perBrowserOptions || this.options);

        options.userDataDir = options.userDataDir || '.';
        const rr = Math.random().toString(36).substring(2, 7);
        options.userDataDir = path.join(options.userDataDir, rr);

        debug(`Necrobrowser: --user-data-dir=${options.userDataDir}`);
        debug(util.inspect(options));

        //
        // Below is similar to concurrency built-in Browser.ts
        //

        let chrome = await this.puppeteer.launch(options) as puppeteer.Browser;
        let page: puppeteer.Page;
        let context: any; // puppeteer typings are old...

        return {
            jobInstance: async () => {
                await timeoutExecute(BROWSER_TIMEOUT, (async () => {
                    context = await chrome.createIncognitoBrowserContext();
                    page = await context.newPage();
                })());

                return {
                    resources: {
                        browser: await chrome,
                        page,
                    },

                    close: async () => {
                        await timeoutExecute(BROWSER_TIMEOUT, context.close());
                    },
                };
            },

            close: async () => {
                await chrome.close();
            },

            repair: async () => {
                debug('Starting repair');
                try {
                    // will probably fail, but just in case the repair was not necessary
                    await chrome.close();
                } catch (e) {
                }

                // just relaunch as there is only one page per browser
                chrome = await this.puppeteer.launch(this.options);
            },
        };
    }

}
