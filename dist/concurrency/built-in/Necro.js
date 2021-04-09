"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ConcurrencyImplementation_1 = require("../ConcurrencyImplementation");
const path = require("path");
const util = require("util");
const util_1 = require("../../util");
const debug = util_1.debugGenerator('BrowserConcurrency');
const BROWSER_TIMEOUT = 5000;
class Necro extends ConcurrencyImplementation_1.default {
    init() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    workerInstance(perBrowserOptions) {
        return __awaiter(this, void 0, void 0, function* () {
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
            let chrome = yield this.puppeteer.launch(options);
            let page;
            let context; // puppeteer typings are old...
            return {
                jobInstance: () => __awaiter(this, void 0, void 0, function* () {
                    yield util_1.timeoutExecute(BROWSER_TIMEOUT, (() => __awaiter(this, void 0, void 0, function* () {
                        context = yield chrome.createIncognitoBrowserContext();
                        page = yield context.newPage();
                    }))());
                    return {
                        resources: {
                            browser: yield chrome,
                            page,
                        },
                        close: () => __awaiter(this, void 0, void 0, function* () {
                            yield util_1.timeoutExecute(BROWSER_TIMEOUT, context.close());
                        }),
                    };
                }),
                close: () => __awaiter(this, void 0, void 0, function* () {
                    yield chrome.close();
                }),
                repair: () => __awaiter(this, void 0, void 0, function* () {
                    debug('Starting repair');
                    try {
                        // will probably fail, but just in case the repair was not necessary
                        yield chrome.close();
                    }
                    catch (e) {
                    }
                    // just relaunch as there is only one page per browser
                    chrome = yield this.puppeteer.launch(this.options);
                }),
            };
        });
    }
}
exports.default = Necro;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmVjcm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29uY3VycmVuY3kvYnVpbHQtaW4vTmVjcm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSw0RUFBdUY7QUFFdkYsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUU3QixxQ0FBMEQ7QUFFMUQsTUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ25ELE1BQU0sZUFBZSxHQUFHLElBQUksQ0FBQztBQUU3QixNQUFxQixLQUFNLFNBQVEsbUNBQXlCO0lBQzNDLElBQUk7O1FBQ2pCLENBQUM7S0FBQTtJQUVZLEtBQUs7O1FBQ2xCLENBQUM7S0FBQTtJQUVZLGNBQWMsQ0FBQyxpQkFBc0Q7O1lBRzlFLGdGQUFnRjtZQUNoRixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxpQkFBaUIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFckUsT0FBTyxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsV0FBVyxJQUFJLEdBQUcsQ0FBQztZQUNqRCxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEQsT0FBTyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFekQsS0FBSyxDQUFDLGlDQUFpQyxPQUFPLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQztZQUM5RCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBRTdCLEVBQUU7WUFDRixzREFBc0Q7WUFDdEQsRUFBRTtZQUVGLElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFzQixDQUFDO1lBQ3ZFLElBQUksSUFBb0IsQ0FBQztZQUN6QixJQUFJLE9BQVksQ0FBQyxDQUFDLCtCQUErQjtZQUVqRCxPQUFPO2dCQUNILFdBQVcsRUFBRSxHQUFTLEVBQUU7b0JBQ3BCLE1BQU0scUJBQWMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxHQUFTLEVBQUU7d0JBQzlDLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO3dCQUN2RCxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ25DLENBQUMsQ0FBQSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUVOLE9BQU87d0JBQ0gsU0FBUyxFQUFFOzRCQUNQLE9BQU8sRUFBRSxNQUFNLE1BQU07NEJBQ3JCLElBQUk7eUJBQ1A7d0JBRUQsS0FBSyxFQUFFLEdBQVMsRUFBRTs0QkFDZCxNQUFNLHFCQUFjLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUMzRCxDQUFDLENBQUE7cUJBQ0osQ0FBQztnQkFDTixDQUFDLENBQUE7Z0JBRUQsS0FBSyxFQUFFLEdBQVMsRUFBRTtvQkFDZCxNQUFNLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDekIsQ0FBQyxDQUFBO2dCQUVELE1BQU0sRUFBRSxHQUFTLEVBQUU7b0JBQ2YsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQ3pCLElBQUk7d0JBQ0Esb0VBQW9FO3dCQUNwRSxNQUFNLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDeEI7b0JBQUMsT0FBTyxDQUFDLEVBQUU7cUJBQ1g7b0JBRUQsc0RBQXNEO29CQUN0RCxNQUFNLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3ZELENBQUMsQ0FBQTthQUNKLENBQUM7UUFDTixDQUFDO0tBQUE7Q0FFSjtBQWpFRCx3QkFpRUMifQ==