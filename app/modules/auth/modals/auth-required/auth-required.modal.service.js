import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const AuthRequiredModalService = {};

AuthRequiredModalService.Events = {
    SET_VISIBLE: 'SET_VISIBLE',
};

/**
 * @param payload {message, onAuthSuccess, onHide}
 */
AuthRequiredModalService.setVisible = (payload) => {

    if (payload) {
        payload.onAuthSuccess = payload.onAuthSuccess || (() => {})
    }
    eventEmitter.emit(AuthRequiredModalService.Events.SET_VISIBLE, payload);
};

AuthRequiredModalService.onSetVisible = (callback) => {

    eventEmitter.on(AuthRequiredModalService.Events.SET_VISIBLE, callback);

    return () => {
        eventEmitter.off(AuthRequiredModalService.Events.SET_VISIBLE, callback);
    }
};

Object.freeze(AuthRequiredModalService)
export default AuthRequiredModalService
