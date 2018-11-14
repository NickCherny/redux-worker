import { WORKER_SELF__INIT } from './actionsTypes';

/**
 * @name makeWorker
 * @description
 * @param {Object[]} config
 * @param {String} config.id
 * @param {Worker} config.constructor
 * @param {Function} config.handleMessage
 * @param {}
 */
const makeWorker = ({id, constructor, handleMessage, handleError}) => {
  const _workerInstance = new Constructor();

  let subscribers = {};

  const makeStateHandler = (...args) => ({data: event}) => {
    const [handle, ...handlers] = args;
    handle(event);

    if (Array.isArray(handlers)) {
      handlers.forEach(handle => handle(event));
    }
  }

  const onMessage = makeStateHandler(handleMessage, subscribers.message);
  const onError = makeStateHandler(handleError, subscribers.error);

  function subscribe(stateType, handler) {
    if (Array.isArray(subscribers[stateType])) {
      if (!subscribers[stateType].include(handler)) {
        subscribers[stateType].push(handler);
      }
    } else {
      subscribers[stateType] = [handler];
    }
  }
  ;

  function unsubscribe(stateType, handler) {
    if (Array.isArray(subscribers[stateType])) {
      subscribers = subscribers[stateType].filter(v => v !== handler);
    }
  }
  ;

  function sendMessage(message) {
    _workerInstance.postMessage(message);
  }

  function destroy() {
    _workerInstance.terminate();
  }

  function init(dependecy) {
    sendMessage({ type: WORKER_SELF__INIT, payload: dependecy });
    _workerInstance.addEventListener('message', onMessage);
    _workerInstance.addEventListener('error', onError);
  }

  const publicAPI = {};

  Object.defineProperties(publicAPI, {
    'id': {
      value: id,
      enumerable: true,
    },
    'init': {
      value: init,
      enumerable: true
    },
    'destroy': {
      value: destroy,
      enumerable: true
    },
    'sendMessage': {
      value: sendMessage,
      enumerable: true
    },
    'subscribe': {
      value: subscribe
    },
    'unsubscribe': {
      value: unsubscribe
    }
  });

  return Object.freeze(publicAPI);
};

export default makeWorker;
