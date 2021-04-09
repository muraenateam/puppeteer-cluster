"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require("os");
const INIT_INTERVAL = 50;
const MEASURE_INTERVAL = 200;
// timespan of which to measure load
// must be a multiple of MEASURE_INTERVAL
const MEASURE_TIMESPAN = 5000;
const loadListSize = MEASURE_TIMESPAN / MEASURE_INTERVAL;
class SystemMonitor {
    constructor() {
        this.cpuUsage = 0;
        this.memoryUsage = 0;
        this.loads = [];
        this.interval = null;
    }
    // After init is called there is at least something in the cpuUsage thingy
    init() {
        this.calcLoad();
        return new Promise((resolve) => {
            setTimeout(() => {
                this.calcLoad();
                this.interval = setInterval(() => this.calcLoad(), MEASURE_INTERVAL);
                // @ts-ignore
                resolve();
            }, INIT_INTERVAL);
        });
    }
    close() {
        clearInterval(this.interval);
    }
    calcLoad() {
        let totalIdle = 0;
        let totalTick = 0;
        const cpus = os.cpus();
        if (!cpus) {
            // In some environments, os.cpus() might return undefined (although it's not stated in
            // the Node.js docs), see #113 for more information
            return;
        }
        for (let i = 0, len = cpus.length; i < len; i += 1) {
            const cpu = cpus[i];
            for (const type in cpu.times) {
                totalTick += cpu.times[type];
            }
            totalIdle += cpu.times.idle;
        }
        const currentLoad = {
            idle: totalIdle / cpus.length,
            total: totalTick / cpus.length,
        };
        if (this.loads.length !== 0) {
            const compareLoad = this.loads[0];
            const idleDifference = currentLoad.idle - compareLoad.idle;
            const totalDifference = currentLoad.total - compareLoad.total;
            this.cpuUsage = 100 - (100 * idleDifference / totalDifference);
            this.memoryUsage = 100 - (100 * os.freemem() / os.totalmem());
        }
        this.loads.push(currentLoad);
        if (this.loads.length > loadListSize) {
            // remove oldest entry
            this.loads.shift();
        }
    }
    getCpuUsage() {
        return this.cpuUsage;
    }
    getMemoryUsage() {
        return this.memoryUsage;
    }
}
exports.default = SystemMonitor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3lzdGVtTW9uaXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9TeXN0ZW1Nb25pdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUJBQXlCO0FBT3pCLE1BQU0sYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUN6QixNQUFNLGdCQUFnQixHQUFHLEdBQUcsQ0FBQztBQUU3QixvQ0FBb0M7QUFDcEMseUNBQXlDO0FBQ3pDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBRTlCLE1BQU0sWUFBWSxHQUFHLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0FBRXpELE1BQXFCLGFBQWE7SUFBbEM7UUFFWSxhQUFRLEdBQVcsQ0FBQyxDQUFDO1FBQ3JCLGdCQUFXLEdBQVcsQ0FBQyxDQUFDO1FBRXhCLFVBQUssR0FBaUIsRUFBRSxDQUFDO1FBRXpCLGFBQVEsR0FBd0IsSUFBSSxDQUFDO0lBb0VqRCxDQUFDO0lBbEVHLDBFQUEwRTtJQUNuRSxJQUFJO1FBQ1AsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtZQUMzQixVQUFVLENBQ04sR0FBRyxFQUFFO2dCQUNELElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDaEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLGdCQUFnQixDQUFDLENBQUM7Z0JBQ3JFLGFBQWE7Z0JBQ2IsT0FBTyxFQUFFLENBQUM7WUFDZCxDQUFDLEVBQ0QsYUFBYSxDQUNoQixDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sS0FBSztRQUNSLGFBQWEsQ0FBQyxJQUFJLENBQUMsUUFBd0IsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFTyxRQUFRO1FBQ1osSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDO1FBQ2xCLElBQUksU0FBUyxHQUFHLENBQUMsQ0FBQztRQUNsQixNQUFNLElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNQLHNGQUFzRjtZQUN0RixtREFBbUQ7WUFDbkQsT0FBTztTQUNWO1FBRUQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixLQUFLLE1BQU0sSUFBSSxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUU7Z0JBQzFCLFNBQVMsSUFBSyxHQUFHLENBQUMsS0FBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pDO1lBQ0QsU0FBUyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1NBQy9CO1FBRUQsTUFBTSxXQUFXLEdBQUc7WUFDaEIsSUFBSSxFQUFFLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTTtZQUM3QixLQUFLLEVBQUUsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNO1NBQ2pDLENBQUM7UUFFRixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUN6QixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLE1BQU0sY0FBYyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQztZQUMzRCxNQUFNLGVBQWUsR0FBRyxXQUFXLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFFOUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsY0FBYyxHQUFHLGVBQWUsQ0FBQyxDQUFDO1lBQy9ELElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztTQUNqRTtRQUVELElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzdCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsWUFBWSxFQUFFO1lBQ2xDLHNCQUFzQjtZQUN0QixJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQztJQUVNLFdBQVc7UUFDZCxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDekIsQ0FBQztJQUNNLGNBQWM7UUFDakIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQzVCLENBQUM7Q0FDSjtBQTNFRCxnQ0EyRUMifQ==