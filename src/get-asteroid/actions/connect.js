export const CONNECT_START = "CONNECT_START";
export const CONNECT_SUCCESS = "CONNECT_SUCCESS";
export const CONNECT_ERROR = "CONNECT_ERROR";

export default function connect (asteroid, dispatch) {
    return async () => {
        try {
            dispatch({type: CONNECT_START});
            await asteroid.connect();
            dispatch({type: CONNECT_SUCCESS});
        } catch (error) {
            dispatch({
                type: CONNECT_ERROR,
                payload: error,
                error: true
            });
        }
    };
}
