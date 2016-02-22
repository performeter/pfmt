import {map} from "bluebird";
import {v4} from "node-uuid";
import {range} from "ramda";

import * as constants from "./constants";
import getAsteroid from "./get-asteroid";

async function runStressScenario (scenario, config, runDetails, log) {
    const dispatch = event => {
        log({
            ...event,
            id: v4(),
            timestamp: Date.now(),
            meta: {
                ...event.meta,
                scenarioName: scenario.name,
                runDetails: runDetails
            }
        });
    };
    const asteroid = getAsteroid(config.ENDPOINT, dispatch);
    dispatch({type: constants.SCENARIO_START});
    await scenario.scenario(asteroid, config);
    dispatch({type: constants.SCENARIO_END});
}

async function concurrentInfiniteLoop (concurrencyLevel, fn) {
    var iteration = -1;
    return map(range(0, concurrencyLevel), async () => {
        for (;;) {
            iteration += 1;
            await fn(iteration).catch(() => null);
        }
    });
}

function randomPick (array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

export default async function runStressScenarios (options) {
    const {
        config,
        scenarios,
        stressLevel,
        log
    } = options;
    // Run scenarios
    await concurrentInfiniteLoop(stressLevel, async iteration => {
        const scenario = randomPick(scenarios);
        const runDetails = {
            id: v4(),
            number: iteration
        };
        await runStressScenario(scenario, config, runDetails, log);
    });
}
