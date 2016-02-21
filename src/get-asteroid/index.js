import Promise from "bluebird";
import {createClass} from "asteroid";
import {Client} from "faye-websocket";

import call from "./actions/call";
import connect from "./actions/connect";
import disconnect from "./actions/disconnect";
import subscribe from "./actions/subscribe";

const _Asteroid = createClass();
const PROMISE_TIMEOUT = 10000;

class Asteroid {
    constructor (endpoint) {
        this._asteroid = new _Asteroid({
            endpoint: endpoint,
            SocketConstructor: Client,
            autoConnect: false
        });
    }
    connect () {
        return new Promise(resolve => {
            this._asteroid.on("connected", resolve);
            this._asteroid.connect();
        }).timeout(PROMISE_TIMEOUT);
    }
    disconnect () {
        return new Promise(resolve => {
            this._asteroid.on("disconnected", resolve);
            this._asteroid.disconnect();
        }).timeout(PROMISE_TIMEOUT);
    }
    subscribe (...args) {
        return new Promise((resolve, reject) => {
            this._asteroid.subscribe(...args)
                .on("ready", resolve)
                .on("error", reject);
        }).timeout(PROMISE_TIMEOUT);
    }
    call (...args) {
        return Promise.resolve(
            this._asteroid.call(...args)
        ).timeout(PROMISE_TIMEOUT);
    }
}

export default function getAsteroid (endpoint, dispatch) {
    const asteroid = new Asteroid(endpoint);
    return {
        call: call(asteroid, dispatch),
        connect: connect(asteroid, dispatch),
        disconnect: disconnect(asteroid, dispatch),
        subscribe: subscribe(asteroid, dispatch)
    };
}
