import {map} from "bluebird";
import {range} from "ramda";

import * as constants from "./constants";
import getAsteroid from "./get-asteroid";

async function runStressScenario (scenario, config) {
    const dispatch = () => null;
    const asteroid = getAsteroid(config.ENDPOINT, dispatch);
    dispatch({type: constants.SCENARIO_START});
    await scenario.scenario(asteroid, config);
    dispatch({type: constants.SCENARIO_END});
}

async function concurrentInfiniteLoop (concurrencyLevel, fn) {
    return map(range(0, concurrencyLevel), async () => {
        for (;;) {
            await fn().catch(() => null);
        }
    });
}

function randomPick (array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
}

export async function runStressScenarios (options) {
    const {
        config,
        scenarios,
        stressLevel
    } = options;
    // Run scenarios
    await concurrentInfiniteLoop(stressLevel, async () => {
        const scenario = randomPick(scenarios);
        await runStressScenario(scenario, config);
    });
}
