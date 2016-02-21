import * as constants from "../../constants";

export default function connect (asteroid, dispatch) {
    return async function () {
        try {
            dispatch({type: constants.CONNECT_START});
            await asteroid.connect();
            dispatch({type: constants.CONNECT_SUCCESS});
        } catch (error) {
            dispatch({
                type: constants.CONNECT_ERROR,
                payload: {
                    message: error.message
                }
            });
        }
    };
}
