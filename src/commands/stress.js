import {createWriteStream, readdirSync} from "fs";
import {join, resolve} from "path";

import runStressScenarios from "../run-stress-scenarios";
import getLogger from "../services/logger";

export const builder = {
    config: {
        alias: "c",
        default: "pfmt.config.js",
        describe: "Path to the config file, which can either be js or json",
        type: "string"
    },
    scenariosDir: {
        alias: "d",
        default: "measurement-scenarios",
        describe: "Directory containing the measurement scenarios",
        type: "string"
    },
    stressLevel: {
        alias: "s",
        default: 1,
        describe: "Number of concurrent scenarios to run",
        type: "number"
    },
    outputPath: {
        alias: "o",
        default: "stress-scenarios-log.json",
        describe: "Path where to write the result log"
    }
};

export async function handler (argv) {
    try {
        // Retrieve config
        const config = require(
            resolve(process.cwd(), argv.config)
        );
        // Retrieve scenarios
        const scenariosDir = resolve(process.cwd(), argv.scenariosDir);
        const scenarios = readdirSync(scenariosDir)
            // Only load .js files
            .filter(fileName =>
                /\.js$/.test(fileName)
            )
            .map(fileName =>
                require(join(scenariosDir, fileName))
            );
        // Create logger
        const stream = createWriteStream(
            resolve(process.cwd(), argv.outputPath)
        );
        const log = getLogger(stream);
        // Exec command
        await runStressScenarios({
            config: config,
            scenarios: scenarios,
            stressLevel: argv.stressLevel,
            log: log
        });
    } catch (e) {
        console.log("Error executing stress command");
        console.log(e.stack);
    }
}
