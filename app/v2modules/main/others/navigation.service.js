import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();

/**
 * Used to route to screen from outside stacks, DON'T USE IT AS POSSIBLE
 */
const NavigationService = {};

NavigationService.Events = {
    PUSH: 'PUSH',
};


NavigationService.navigateTo = (payload) => {

    eventEmitter.emit(NavigationService.Events.PUSH, payload);
};

NavigationService.onNavigateTo = (callback) => {

    eventEmitter.on(NavigationService.Events.PUSH, callback);

    return () => {
        eventEmitter.off(NavigationService.Events.PUSH, callback);
    }
};

Object.freeze(NavigationService)
export default NavigationService
