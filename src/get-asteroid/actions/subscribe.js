import {v4} from "uuid";

import * as constants from "../../constants";

export default function subscribe (asteroid, dispatch) {
    return async function (name, ...params) {
        const subscriptionId = v4();
        try {
            dispatch({
                type: constants.SUBSCRIPTION_START,
                payload: {name, params},
                meta: {subscriptionId}
            });
            await asteroid.subscribe(name, ...params);
            dispatch({
                type: constants.SUBSCRIPTION_SUCCESS,
                meta: {subscriptionId}
            });
        } catch (error) {
            dispatch({
                type: constants.SUBSCRIPTION_ERROR,
                payload: {
                    message: error.message
                },
                meta: {subscriptionId}
            });
        }
    };
}
