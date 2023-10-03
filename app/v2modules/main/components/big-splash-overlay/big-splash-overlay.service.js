import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const BigSplashOverlayService = {};

BigSplashOverlayService.Events = {
    SET_VISIBLE: 'BigSplashOverlayService.SET_VISIBLE',
};

BigSplashOverlayService.setVisible = (payload) => {
    eventEmitter.emit(BigSplashOverlayService.Events.SET_VISIBLE, payload);
};

BigSplashOverlayService.onChangeVisibility = (callback) => {

    eventEmitter.on(BigSplashOverlayService.Events.SET_VISIBLE, callback);

    return () => {
        eventEmitter.off(BigSplashOverlayService.Events.SET_VISIBLE, callback);
    }
};

Object.freeze(BigSplashOverlayService)
export default BigSplashOverlayService
