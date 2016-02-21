import {v4} from "node-uuid";

export const METHOD_CALL_START = "METHOD_CALL_START";
export const METHOD_CALL_SUCCESS = "METHOD_CALL_SUCCESS";
export const METHOD_CALL_ERROR = "METHOD_CALL_ERROR";

export default function call (asteroid, dispatch) {
    return async function (name, ...params) {
        const methodCallId = v4();
        try {
            dispatch({
                type: METHOD_CALL_START,
                payload: {name, params},
                meta: {methodCallId}
            });
            const result = await asteroid.call(name, ...params);
            dispatch({
                type: METHOD_CALL_SUCCESS,
                payload: result,
                meta: {methodCallId}
            });
        } catch (error) {
            dispatch({
                type: METHOD_CALL_ERROR,
                payload: {
                    message: error.message
                },
                meta: {methodCallId}
            });
        }
    };
}
