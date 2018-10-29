import {
    WORKER__INIT,
    WORKER__DESTROY,
    WORKER__POST_MESSAGE,
    WORKER__SUBSCRIBE,
    WORKER__UNSUBSCRIBE
} from './constants';




export const initWorker = (settings) => ({
    type: WORKER__INIT,
    payload: settings
});

export const destroyWorker = (id) => ({
    type: WORKER__DESTROY,
    payload: { id }
});

/**
 * @description Send message to worker
 * @param {Object[]} data
 * @returns {{type: string, payload: {workerId: WorkerMessage.workerId, message: WorkerMessage.message}}}
 */
export const postMessage = (data) => {
    const { workerId, ...message } = data;
    return {
        type: WORKER__POST_MESSAGE,
        payload: {
            workerId,
            ...message
        }
    };
};

export const subscribeWorker = (options) => ({
    type: WORKER__SUBSCRIBE,
    payload: options
});

export const unsubscribeWorker = (details) => ({
    type: WORKER__UNSUBSCRIBE,
    payload: details
});
