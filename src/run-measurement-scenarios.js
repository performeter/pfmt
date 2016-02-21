import {v4} from "node-uuid";

import getAsteroid from "./get-asteroid";

async function runMeasurementScenario (scenario, config, runDetails) {
    const events = [];
    var stage;
    const dispatch = event => {
        events.push({
            ...event,
            id: v4(),
            timestamp: Date.now(),
            meta: {
                ...event.meta,
                scenarioName: scenario.name,
                stage: stage,
                runDetails: runDetails
            }
        });
    };
    const asteroid = getAsteroid(config.ENDPOINT, dispatch);
    stage = "before";
    await scenario.before(asteroid, config);
    stage = "scenario";
    await scenario.scenario(asteroid, config);
    stage = "after";
    await scenario.after(asteroid, config);
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
        for (const iteration of iterations) {
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
