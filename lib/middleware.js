import {WORKER__REGISTER, WORKER__CLOSE, WORKER_SELF__DESTROY, WORKER_MESSAGE__SEND} from './actionsTypes';
import makeWorker from './workerFactory';

const initialize = ({
  wstorage
}, {store, next, action}) => {
  const {
    payload: {
      id,
      ...options
    }
  } = action;
  if (!wstorage.has(id)) {
    const {worker, dependency} = options;
    const myWorker = makeWorker({
      id,
      constructor: worker,
      handleMessage: action => store.dispatch(action),
      handleError: action => store.dispatch(action)
    });

    myWorker.init(dependency);
  }
};

const destroy = ({
  wstorage
}, {next, action}) => {
  const {id} = action.payload;
  if (wstorage.has(id)) {
    const {destroy, postMessage} = wstorage.get(id);
    postMessage({type: WORKER_SELF__DESTROY});

    const timout = setTimeout(() => {
      destroy();
      wstorage.delete(id);
      clearTimeout(timout);
    }, 60);
  }
};

function makeWorkerMiddleware() {
  const wstorage = new Map();

  return store => next => (action) => {
    const {
      type,
      ...options
    } = action;

    switch (type) {
      case WORKER__REGISTER:
        initialize({
          wstorage
        }, {store, next, action});
        break;

      case WORKER__CLOSE:
        destroy({
          wstorage
        }, {store, next, action});
        break;

      case WORKER_MESSAGE__SEND:
        const {
          payload: {
            id,
            message
          }
        } = options;
        if (wstorage.has(id)) {
          const targetWorker = wstorage.get(id);
          targetWorker.sendMessage(message);
        }
        break;

      default:
        break;
    }

    next(action);
  }
}

export default makeWorkerMiddleware;
