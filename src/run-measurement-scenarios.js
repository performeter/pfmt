import {v4} from "uuid";
import {range} from "ramda";

import * as constants from "./constants";
import getAsteroid from "./get-asteroid";

async function runMeasurementScenario (scenario, config, runDetails) {
    const events = [];
    var scenarioRunning;
    const dispatch = event => {
        if (scenarioRunning) {
            events.push({
                ...event,
                id: v4(),
                timestamp: Date.now(),
                meta: {
                    ...event.meta,
                    scenarioName: scenario.name,
                    runDetails: runDetails
                }
            });
        }
    };
    const asteroid = getAsteroid(config.ENDPOINT, dispatch);
    // Run the before function, if present
    if (scenario.before) {
        scenarioRunning = false;
        await scenario.before(asteroid, config);
    }
    // Run the scenario function
    scenarioRunning = true;
    dispatch({type: constants.SCENARIO_START});
    await scenario.scenario(asteroid, config);
    dispatch({type: constants.SCENARIO_END});
    // Run the after function, if present
    if (scenario.after) {
        scenarioRunning = false;
        await scenario.after(asteroid, config);
    }
    return events;
}

export default async function runMeasurementScenarios (options) {
    const {
        config,
        scenarios,
        iterations
    } = options;
    var events = [];
    // Run scenarios
    for (const scenario of scenarios) {
        for (const iteration of range(0, iterations)) {
            const runDetails = {
                id: v4(),
                number: iteration
            };
            events = events.concat(
                await runMeasurementScenario(scenario, config, runDetails)
            );
        }
    }
    return events;
}
