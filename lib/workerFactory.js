import { WORKER_SELF__INIT } from './actionsTypes';

const makeWorker = ({id, constructor, handleMessage, handleError}) => {
  const privateWorker = new Constructor();

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

  function postMessage(message) {
    privateWorker.postMessage(message);
  }

  function destroy() {
    privateWorker.terminate();
  }
  ;

  function init(dependecy) {
    postMessage({ type: WORKER_SELF__INIT, payload: dependecy });
    privateWorker.addEventListener('message', onMessage);
    privateWorker.addEventListener('error', onError);
  }
  ;

  return Object.freeze({
    id,
    postMessage,
    init,
    destroy,
    subscribe,
    unsubscribe
  });
};

export default makeWorker;
