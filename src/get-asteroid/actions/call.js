import {v4} from "node-uuid";

import * as constants from "../../constants";

export default function call (asteroid, dispatch) {
    return async function (name, ...params) {
        const methodCallId = v4();
        try {
            dispatch({
                type: constants.METHOD_CALL_START,
                payload: {name, params},
                meta: {methodCallId}
            });
            const result = await asteroid.call(name, ...params);
            dispatch({
                type: constants.METHOD_CALL_SUCCESS,
                payload: result,
                meta: {methodCallId}
            });
        } catch (error) {
            dispatch({
                type: constants.METHOD_CALL_ERROR,
                payload: {
                    message: error.message
                },
                meta: {methodCallId}
            });
        }
    };
}
