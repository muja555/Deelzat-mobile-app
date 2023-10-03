import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const AuthModalService = {};

// Events
AuthModalService.Events = {
    SET_VISIBLE: 'SET_VISIBLE'
};

AuthModalService.setVisible = (payload) => {
    eventEmitter.emit(AuthModalService.Events.SET_VISIBLE, payload);
};

AuthModalService.onSetVisible = (callback) => {

    eventEmitter.on(AuthModalService.Events.SET_VISIBLE, callback);

    return () => {
        eventEmitter.off(AuthModalService.Events.SET_VISIBLE, callback);
    }
};

Object.freeze(AuthModalService);
export default AuthModalService;
