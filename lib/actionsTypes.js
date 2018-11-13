// Register new Worker
export const WORKER__REGISTER = 'WORKER__REGISTER';
// Destroy worker
export const WORKER__CLOSE = 'WORKER__CLOSE';
// Send message to Worker
export const WORKER_MESSAGE__SEND = 'WORKER_MESSAGE__SEND';
// Subscribe on special worker message
export const WORKER__SUBSCRIBE = 'WORKER__SUBSCRIBE';
// Unsubscribe special worker
export const WORKER__UNSUBSCRIBE = 'WORKER__UNSUBSCRIBE';
// Initialize inside worker
export const WORKER_SELF__INIT = 'WORKER_SELF__INIT';
// Destroy Worker inside
export const WORKER_SELF__DESTROY = 'WORKER_SELF__DESTROY';

/**
 * @name registerWorker
 * @description
 * @param {Object[]} settings
 * @return {ActionType} ActionType
 */
export const registerWorker = settings => ({type: WORKER__REGISTER, payload: settings});

/**
 * @name destroyWorker
 * @description
 * @param {String} workerId
 * @return {ActionType} ActionType
 */
export const destroyWorker = workerId => ({type: WORKER__DESTROY, payload: {
  id
}});

/**
 * @name sendMessage
 * @description Send message to worker
 * @param {Object[]} data
 * @returns {{type: string, payload: {workerId: WorkerMessage.workerId, message: WorkerMessage.message}}}
 */
export const sendMessage = (data) => {
  const {
    workerId,
    ...messa
  } = data;

  return {
    type: WORKER_MESSAGE__SEND,
    payload: {
      workerId,
      ...message
    }
  };
};

export const subscribeWorker = options => ({type: WORKER__SUBSCRIBE, payload: options});

export const unsubscribeWorker = details => ({type: WORKER__UNSUBSCRIBE, payload: details});
