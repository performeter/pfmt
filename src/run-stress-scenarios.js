import fs from "fs";
import {v4} from "node-uuid";

import getAsteroid from "./get-asteroid";

const events = [];

async function runStressScenario (scenario, config, runDetails) {
    const dispatch = event => {
        events.push({
            ...event,
            id: v4(),
            timestamp: Date.now(),
            meta: {
                ...event.meta,
                scenarioName: scenario.name,
                stage: "scenario",
                runDetails: runDetails
            }
        });
    };
    const asteroid = getAsteroid(config.ENDPOINT, dispatch);
    await scenario.scenario(asteroid, config);
}

export async function runStressScenarios (options) {
    /*
    *   Retrieve scenarios
    */
    const scenarios = fs.readdirSync(options.measurementScenariosDir)
        .filter(fileName =>
            options.fileNameMatcher.test(fileName)
        )
        .map(fileName =>
            require(`${options.measurementScenariosDir}/${fileName}`)
        );
    /*
    *   Run scenarios
    */
    for (const scenario of scenarios) {
        for (const runNumber of options.scenariosIterationCount) {
            const runDetails = {
                id: v4(),
                number: runNumber
            };
            await runStressScenario(scenario, options.config, runDetails);
        }
    }
    /*
    *   Write results
    */
    console.log(JSON.stringify(events));
}
