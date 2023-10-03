import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const ShopFollowService = {};

ShopFollowService.Events = {
    SHOP_FOLLOW_STATE_CHANGE: 'SHOP_FOLLOW_STATE_CHANGE'
};

ShopFollowService.shopFollowStateChanged = (payload) => {
    eventEmitter.emit(ShopFollowService.Events.SHOP_FOLLOW_STATE_CHANGE, payload);
};

ShopFollowService.onShopFollowStateChanged = (callback) => {

    eventEmitter.on(ShopFollowService.Events.SHOP_FOLLOW_STATE_CHANGE, callback);

    return () => {
        eventEmitter.off(ShopFollowService.Events.SHOP_FOLLOW_STATE_CHANGE, callback);
    }
};

Object.freeze(ShopFollowService)
export default ShopFollowService
