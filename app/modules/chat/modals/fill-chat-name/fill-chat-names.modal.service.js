import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const FillChatNameModalService = {};

FillChatNameModalService.Events = {
    SET_VISIBLE: 'SET_VISIBLE',
};

/**
 * @param payload {message, onChangeName, trackSource}
 */
FillChatNameModalService.setVisible = (payload) => {
    payload.onChangeName = payload.onChangeName || (() => {})
    eventEmitter.emit(FillChatNameModalService.Events.SET_VISIBLE, payload);
};

FillChatNameModalService.onSetVisible = (callback) => {

    eventEmitter.on(FillChatNameModalService.Events.SET_VISIBLE, callback);

    return () => {
        eventEmitter.off(FillChatNameModalService.Events.SET_VISIBLE, callback);
    }
};

Object.freeze(FillChatNameModalService)
export default FillChatNameModalService
