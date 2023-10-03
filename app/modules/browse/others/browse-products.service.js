import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const BrowseProductsService = {};

BrowseProductsService.Events = {
    CHANGE_FILTERS: 'CHANGE_FILTERS',
};

BrowseProductsService.changeFilters = (payload) => {
    eventEmitter.emit(BrowseProductsService.Events.CHANGE_FILTERS, payload);
};

BrowseProductsService.onChangeFilters = (callback) => {

    eventEmitter.on(BrowseProductsService.Events.CHANGE_FILTERS, callback);

    return () => {
        eventEmitter.off(BrowseProductsService.Events.CHANGE_FILTERS, callback);
    }
};

Object.freeze(BrowseProductsService)
export default BrowseProductsService
