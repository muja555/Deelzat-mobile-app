import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const BlockedShopsService = {};

BlockedShopsService.Events = {
    APPLY_UPDATED_LIST: 'APPLY_UPDATED_LIST',
};


BlockedShopsService.applyUpdatedList = (payload) => {
    eventEmitter.emit(BlockedShopsService.Events.APPLY_UPDATED_LIST, payload);
};

BlockedShopsService.onEmitApplyUpdatedList = (callback) => {
    eventEmitter.on(BlockedShopsService.Events.APPLY_UPDATED_LIST, callback);

    return () => {
        eventEmitter.off(BlockedShopsService.Events.APPLY_UPDATED_LIST, callback);
    }
}

Object.freeze(BlockedShopsService);
export default BlockedShopsService;
