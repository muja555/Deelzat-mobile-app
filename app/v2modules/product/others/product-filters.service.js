import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const ProductFiltersService = {};

ProductFiltersService.Events = {
    CHANGE_FILTERS: 'ProductFiltersService.CHANGE_FILTERS',
};

ProductFiltersService.emitFiltersChanged = (payload) => {
    eventEmitter.emit(ProductFiltersService.Events.CHANGE_FILTERS, payload);
};

ProductFiltersService.onFiltersChanged = (callback) => {

    eventEmitter.on(ProductFiltersService.Events.CHANGE_FILTERS, callback);

    return () => {
        eventEmitter.off(ProductFiltersService.Events.CHANGE_FILTERS, callback);
    }
};

Object.freeze(ProductFiltersService)
export default ProductFiltersService
