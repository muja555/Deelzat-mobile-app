import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const ConversationsListService = {};

ConversationsListService.Events = {
    REFRESH_LIST: 'ConversationsListService.REFRESH_LIST',
};

ConversationsListService.invokeRefreshList = (payload) => {
    eventEmitter.emit(ConversationsListService.Events.REFRESH_LIST, payload);
};

ConversationsListService.onRefreshList = (callback) => {

    eventEmitter.on(ConversationsListService.Events.REFRESH_LIST, callback);

    return () => {
        eventEmitter.off(ConversationsListService.Events.REFRESH_LIST, callback);
    }
};

Object.freeze(ConversationsListService)
export default ConversationsListService
