import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const RootService = {};

RootService.Events = {
    RESET: 'RESET',
};


RootService.reset = (payload) => {
    eventEmitter.emit(RootService.Events.RESET, payload);
};

RootService.onReset = (callback) => {

    eventEmitter.on(RootService.Events.RESET, callback);

    return () => {
        eventEmitter.off(RootService.Events.RESET, callback);
    }
};

Object.freeze(RootService)
export default RootService
