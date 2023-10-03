import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const MainTabService = {};

MainTabService.Events = {
    RESET_CURRENT_TAB: 'RESET_CURRENT_TAB',
    NAVIGATE_TO_TAB: 'NAVIGATE_TO_TAB'
};

MainTabService.resetCurrentTab = (payload) => {
    eventEmitter.emit(MainTabService.Events.RESET_CURRENT_TAB, payload);
};

MainTabService.onResetCurrentTab = (callback) => {

    eventEmitter.on(MainTabService.Events.RESET_CURRENT_TAB, callback);

    return () => {
        eventEmitter.off(MainTabService.Events.RESET_CURRENT_TAB, callback);
    }
};

MainTabService.navigateToTab = (payload) => {
    eventEmitter.emit(MainTabService.Events.NAVIGATE_TO_TAB, payload);
};

MainTabService.onNavigateToTab = (callback) => {

    eventEmitter.on(MainTabService.Events.NAVIGATE_TO_TAB, callback);

    return () => {
        eventEmitter.off(MainTabService.Events.NAVIGATE_TO_TAB, callback);
    }
};


Object.freeze(MainTabService)
export default MainTabService
