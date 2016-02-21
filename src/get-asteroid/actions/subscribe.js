import {v4} from "node-uuid";

export const SUBSCRIPTION_START = "SUBSCRIPTION_START";
export const SUBSCRIPTION_SUCCESS = "SUBSCRIPTION_SUCCESS";
export const SUBSCRIPTION_ERROR = "SUBSCRIPTION_ERROR";

export default function subscribe (asteroid, dispatch) {
    return async (name, ...params) => {
        const subscriptionId = v4();
        try {
            dispatch({
                type: SUBSCRIPTION_START,
                payload: {name, params},
                meta: {subscriptionId}
            });
            await asteroid.subscribe(name, ...params);
            dispatch({
                type: SUBSCRIPTION_SUCCESS,
                meta: {subscriptionId}
            });
        } catch (error) {
            dispatch({
                type: SUBSCRIPTION_ERROR,
                payload: error,
                error: true,
                meta: {subscriptionId}
            });
        }
    };
}
