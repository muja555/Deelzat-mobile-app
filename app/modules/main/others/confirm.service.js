import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const ConfirmService = {};

ConfirmService.Events = {
    SET_VISIBLE: 'SET_VISIBLE'
};

const setVisible = (payload) => {
    eventEmitter.emit(ConfirmService.Events.SET_VISIBLE, payload);
};

ConfirmService.onSetVisible = (callback) => {

    eventEmitter.on(ConfirmService.Events.SET_VISIBLE, callback);

    return () => {
        eventEmitter.off(ConfirmService.Events.SET_VISIBLE, callback);
    }
};

ConfirmService.confirm = (options) => {
    setVisible({
        show: true,
        actions: options.actions || [],
        message: options.message || '',
    });
};

Object.freeze(ConfirmService);
export default ConfirmService;
