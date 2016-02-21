import * as constants from "../../constants";

export default function disconnect (asteroid, dispatch) {
    return async function () {
        try {
            dispatch({type: constants.DISCONNECT_START});
            await asteroid.disconnect();
            dispatch({type: constants.DISCONNECT_SUCCESS});
        } catch (error) {
            dispatch({
                type: constants.DISCONNECT_ERROR,
                payload: {
                    message: error.message
                }
            });
        }
    };
}
