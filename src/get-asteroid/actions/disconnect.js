export const DISCONNECT_START = "DISCONNECT_START";
export const DISCONNECT_SUCCESS = "DISCONNECT_SUCCESS";
export const DISCONNECT_ERROR = "DISCONNECT_ERROR";

export default function disconnect (asteroid, dispatch) {
    return async function () {
        try {
            dispatch({type: DISCONNECT_START});
            await asteroid.disconnect();
            dispatch({type: DISCONNECT_SUCCESS});
        } catch (error) {
            dispatch({
                type: DISCONNECT_ERROR,
                payload: {
                    message: error.message
                }
            });
        }
    };
}
