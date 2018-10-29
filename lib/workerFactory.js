// @flow
import { WSELF__INIT } from './constants';


export type WorkerSettings = {|
    id: string,
    constructor: Worker,
    handleMessage: Function,
    handleError: Function
|};

const makeWorker = (
    { id, constructor: Constructor, handleMessage, handleError }: WorkerSettings
) => {
    const privateWorker = new Constructor();

    let subscribers = {};

    const makeStateHandler = (...args) => ({ data: event }) => {
        const [handle, ...handlers] = args;
            handle(event);

            if (Array.isArray(handlers)) {
                handlers.forEach(handle => handle(event));
            }
    }

    const onMessage = makeStateHandler(handleMessage, subscribers.message);
    const onError = makeStateHandler(handleError, subscribers.error);

    function subscribe(stateType: string, handler: Function) {
        if (Array.isArray(subscribers[stateType])) {
            if (!subscribers[stateType].include(handler)) {
                subscribers[stateType].push(handler);
            }
        } else {
            subscribers[stateType] = [handler];
        }
    };

    function unsubscribe(stateType: string, handler: Function) {
        if (Array.isArray(subscribers[stateType])) {
            subscribers = subscribers[stateType].filter(v => v !== handler);
        }
    };


    function postMessage(message: Object) {
        privateWorker.postMessage(message);
    }

    function destroy() {
        privateWorker.terminate();
    };

    function init(dependecy?: Object) {
        postMessage({ type: WSELF__INIT, payload: dependecy });
        privateWorker.addEventListener('message', onMessage);
        privateWorker.addEventListener('error', onError);
    };

    return Object.freeze({ id, postMessage, init, destroy, subscribe, unsubscribe });
};

export default makeWorker;
