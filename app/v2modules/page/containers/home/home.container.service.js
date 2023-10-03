import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const HomeContainerService = {};

HomeContainerService.Events = {
    RELOAD: 'RELOAD',
};


HomeContainerService.reloadPage = (payload) => {
    eventEmitter.emit(HomeContainerService.Events.RELOAD, payload);
};

HomeContainerService.onEmitReloadPage = (callback) => {
    eventEmitter.on(HomeContainerService.Events.RELOAD, callback);

    return () => {
        eventEmitter.off(HomeContainerService.Events.RELOAD, callback);
    }
}

Object.freeze(HomeContainerService);
export default HomeContainerService;
