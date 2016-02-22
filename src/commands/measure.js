import {readdirSync, writeFileSync} from "fs";
import {join, resolve} from "path";

import runMeasurementScenarios from "../run-measurement-scenarios";

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
    iterations: {
        alias: "i",
        default: 1,
        describe: "Number of iterations",
        type: "number"
    },
    outputPath: {
        alias: "o",
        default: "measurement-scenarios-log.json",
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
        // Exec command
        const events = await runMeasurementScenarios({
            config: config,
            scenarios: scenarios,
            iterations: argv.iterations
        });
        // Write result
        const outputPath = resolve(process.cwd(), argv.outputPath);
        writeFileSync(outputPath, JSON.stringify(events, null, 4));
    } catch (e) {
        console.log("Error executing measure command");
        console.log(e.stack);
    }
}
