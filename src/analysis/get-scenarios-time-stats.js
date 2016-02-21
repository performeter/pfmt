import * as constants from "../constants";
import {filter, map, pipe, reduce, subtract, values} from "ramda";
import ss from "simple-statistics";

function byScenarioEvents (event) {
    return (
        event.type === constants.SCENARIO_START ||
        event.type === constants.SCENARIO_END
    );
}

function groupByScenario (group, event) {
    const {scenarioName} = event.meta;
    return {
        ...group,
        [scenarioName]: [
            ...(group[scenarioName] || []),
            event
        ]
    };
}

function groupByRunAndEventType (group, event) {
    const {type, meta: {runDetails: {id}}} = event;
    return {
        ...group,
        [id]: {
            ...(group[id] || {}),
            [type]: event
        }
    };
}

function toDelta (run) {
    return subtract(
        run[constants.SCENARIO_END].timestamp,
        run[constants.SCENARIO_START].timestamp
    );
}

function toTimeSeries (events) {
    return pipe(
        reduce(groupByRunAndEventType, {}),
        map(toDelta),
        values
    )(events);
}

function toStats (sample) {
    return {
        "84th": ss.quantile(sample, 0.84),
        "98th": ss.quantile(sample, 0.98),
        "mean": ss.mean(sample),
        "standardDeviation": ss.standardDeviation(sample),
        "max": ss.max(sample),
        "min": ss.min(sample)
    };
}

export default function getScenariosTimeStats (events) {
    return pipe(
        filter(byScenarioEvents),
        reduce(groupByScenario, {}),
        map(toTimeSeries),
        map(toStats)
    )(events);
}
