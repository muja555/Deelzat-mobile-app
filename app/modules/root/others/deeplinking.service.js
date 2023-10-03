import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const DeepLinkingService = {};

DeepLinkingService.Events = {
    NAVIGATE: 'NAVIGATE',
};

DeepLinkingService.navigateToLink = (payload) => {
    eventEmitter.emit(DeepLinkingService.Events.NAVIGATE, payload);
};

DeepLinkingService.onNavigateToLink = (callback) => {

    eventEmitter.on(DeepLinkingService.Events.NAVIGATE, callback);

    return () => {
        eventEmitter.off(DeepLinkingService.Events.NAVIGATE, callback);
    }
};

Object.freeze(DeepLinkingService)
export default DeepLinkingService
