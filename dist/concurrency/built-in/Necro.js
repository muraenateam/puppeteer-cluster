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
const util_1 = require("../../util");
const ConcurrencyImplementation_1 = require("../ConcurrencyImplementation");
const debug = util_1.debugGenerator('BrowserConcurrency');
const fs = require("fs");
const path = require("path");
const util = require("util");
const BROWSER_TIMEOUT = 5000;
class Necro extends ConcurrencyImplementation_1.default {
    init() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    workerInstance(perBrowserOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = perBrowserOptions || this.options;
            // TODO improve this
            var rr = Math.random().toString(36).substring(7);
            var userDataDir = `${path.join(__dirname, '..', '..', '..', '..', '..', 'profiles', rr)}`;
            debug('Necro concurrency: adding to options --user-data-dir=' + userDataDir);
            options['userDataDir'] = (userDataDir);
            debug(util.inspect(options));
            if (!fs.existsSync(userDataDir)) {
                fs.mkdirSync(userDataDir);
                debug('created new userDataDir directory');
            }
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
                    catch (e) { }
                    // just relaunch as there is only one page per browser
                    chrome = yield this.puppeteer.launch(this.options);
                }),
            };
        });
    }
}
exports.default = Necro;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmVjcm8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvY29uY3VycmVuY3kvYnVpbHQtaW4vTmVjcm8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFHQSxxQ0FBNEQ7QUFDNUQsNEVBQXlGO0FBRXpGLE1BQU0sS0FBSyxHQUFHLHFCQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztBQUVuRCx5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLDZCQUE2QjtBQUU3QixNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUM7QUFFN0IsTUFBcUIsS0FBTSxTQUFRLG1DQUF5QjtJQUMzQyxJQUFJOzhEQUFJLENBQUM7S0FBQTtJQUNULEtBQUs7OERBQUksQ0FBQztLQUFBO0lBRVYsY0FBYyxDQUFDLGlCQUFzRDs7WUFHOUUsTUFBTSxPQUFPLEdBQUcsaUJBQWlCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUVsRCxvQkFBb0I7WUFDcEIsSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsSUFBSSxXQUFXLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFBO1lBQ3hGLEtBQUssQ0FBQyx1REFBdUQsR0FBRyxXQUFXLENBQUMsQ0FBQztZQUM3RSxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQTtZQUN0QyxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1lBRTVCLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxFQUFFO2dCQUM3QixFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUMxQixLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQTthQUM3QztZQUVELElBQUksTUFBTSxHQUFHLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFzQixDQUFDO1lBQ3ZFLElBQUksSUFBb0IsQ0FBQztZQUN6QixJQUFJLE9BQVksQ0FBQyxDQUFDLCtCQUErQjtZQUVqRCxPQUFPO2dCQUNILFdBQVcsRUFBRSxHQUFTLEVBQUU7b0JBQ3BCLE1BQU0scUJBQWMsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxHQUFTLEVBQUU7d0JBQzlDLE9BQU8sR0FBRyxNQUFNLE1BQU0sQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO3dCQUN2RCxJQUFJLEdBQUcsTUFBTSxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7b0JBQ25DLENBQUMsQ0FBQSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUVOLE9BQU87d0JBQ0gsU0FBUyxFQUFFOzRCQUNQLElBQUk7eUJBQ1A7d0JBRUQsS0FBSyxFQUFFLEdBQVMsRUFBRTs0QkFDZCxNQUFNLHFCQUFjLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO3dCQUMzRCxDQUFDLENBQUE7cUJBQ0osQ0FBQztnQkFDTixDQUFDLENBQUE7Z0JBRUQsS0FBSyxFQUFFLEdBQVMsRUFBRTtvQkFDZCxNQUFNLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztnQkFDekIsQ0FBQyxDQUFBO2dCQUVELE1BQU0sRUFBRSxHQUFTLEVBQUU7b0JBQ2YsS0FBSyxDQUFDLGlCQUFpQixDQUFDLENBQUM7b0JBQ3pCLElBQUk7d0JBQ0Esb0VBQW9FO3dCQUNwRSxNQUFNLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztxQkFDeEI7b0JBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRTtvQkFFZCxzREFBc0Q7b0JBQ3RELE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDdkQsQ0FBQyxDQUFBO2FBQ0osQ0FBQztRQUNOLENBQUM7S0FBQTtDQUVKO0FBNURELHdCQTREQyJ9