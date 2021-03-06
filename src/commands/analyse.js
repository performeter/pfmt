import {resolve} from "path";

import getScenariosTimeStats from "../analysis/get-scenarios-time-stats";

export const builder = {
    inputPath: {
        alias: "i",
        default: "measurement-scenarios-log.json",
        describe: "Path of the result log"
    }
};

export async function handler (argv) {
    try {
        // Read results
        const inputPath = resolve(process.cwd(), argv.inputPath);
        const events = require(inputPath);
        // Get stats and print them to the console
        const stats = getScenariosTimeStats(events);
        console.log(JSON.stringify(stats, null, 4));
    } catch (e) {
        console.log("Error executing analyse command");
        console.log(e.stack);
    }
}
