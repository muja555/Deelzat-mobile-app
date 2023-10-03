import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const DeelDailyContainerService = {};

DeelDailyContainerService.Events = {
    RELOAD: 'RELOAD',
};


DeelDailyContainerService.reloadPage = (payload) => {
    eventEmitter.emit(DeelDailyContainerService.Events.RELOAD, payload);
};

DeelDailyContainerService.onEmitReloadPage = (callback) => {
    eventEmitter.on(DeelDailyContainerService.Events.RELOAD, callback);

    return () => {
        eventEmitter.off(DeelDailyContainerService.Events.RELOAD, callback);
    }
}

Object.freeze(DeelDailyContainerService);
export default DeelDailyContainerService;
