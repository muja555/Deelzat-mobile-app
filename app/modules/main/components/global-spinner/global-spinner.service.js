import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const GlobalSpinnerService = {};

// Events
GlobalSpinnerService.Events = {
    SET_VISIBLE: 'SET_VISIBLE'
};

GlobalSpinnerService.setVisible = (payload) => {
    eventEmitter.emit(GlobalSpinnerService.Events.SET_VISIBLE, payload);
};

GlobalSpinnerService.onSetVisible = (callback) => {

    eventEmitter.on(GlobalSpinnerService.Events.SET_VISIBLE, callback);

    return () => {
        eventEmitter.off(GlobalSpinnerService.Events.SET_VISIBLE, callback);
    }
};

Object.freeze(GlobalSpinnerService);
export default GlobalSpinnerService;
