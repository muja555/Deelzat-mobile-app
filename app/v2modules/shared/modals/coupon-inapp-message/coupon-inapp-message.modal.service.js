import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const CouponInAppMessageModalService = {};

// Events
CouponInAppMessageModalService.Events = {
    SET_VISIBLE: 'SET_VISIBLE'
};

CouponInAppMessageModalService.setVisible = (payload) => {
    eventEmitter.emit(CouponInAppMessageModalService.Events.SET_VISIBLE, payload);
};

CouponInAppMessageModalService.onSetVisible = (callback) => {

    eventEmitter.on(CouponInAppMessageModalService.Events.SET_VISIBLE, callback);

    return () => {
        eventEmitter.off(CouponInAppMessageModalService.Events.SET_VISIBLE, callback);
    }
};

Object.freeze(CouponInAppMessageModalService);
export default CouponInAppMessageModalService;
