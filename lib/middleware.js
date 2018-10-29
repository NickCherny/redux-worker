import makeWorker from './workerFactory';
import {
    WSELF__DESTROY,
    WORKER__INIT,
    WORKER__POST_MESSAGE,
} from './constants';


const initialize = ({ wstorage }, { store, next, action }) => {
    const { payload: { id, ...options } } = action;
    if (!wstorage.has(id)) {
        const { worker, dependency } = options;
        const myWorker = makeWorker({
            id,
            constructor: worker,
            handleMessage: action => store.dispatch(action),
            handleError: action => store.dispatch(action),
        });

        myWorker.init(dependency);
    }
};

const destroy = ({ wstorage }, { next, action }) => {
    const { id } = action.payload;
    if (wstorage.has(id)) {
        const { destroy, postMessage } = wstorage.get(id);
        postMessage({ type: WSELF__DESTROY });

        const timout = setTimeout(() => {
            destroy();
            clearTimeout(timout);
        }, 100);
        wstorage.delete(id);
    }
};

function makeWorkerMiddleware() {
    const wstorage = new Map();

    return store => next => (action) => {
        const { type, ...options } = action;

        switch (type) {
            case WORKER__INIT:
                initialize({ wstorage }, { store, next, action });
                break;

            case WSELF__DESTROY:
                destroy({ wstorage }, { store, next, action });
                break;

            case WORKER__POST_MESSAGE:
                const { payload: { id, message } } = options;
                if (wstorage.has(id)) {
                    const concreteWorker = wstorage.get(id);
                    concreteWorker.postMessage(message);
                }
                break;

            default:
                break;
        }

        next(action);
    }
}

export default makeWorkerMiddleware;
