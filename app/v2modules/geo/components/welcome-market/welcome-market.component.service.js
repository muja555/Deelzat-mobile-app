import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const WelcomeMarketService = {};

WelcomeMarketService.Events = {
    SHOW: 'WelcomeMarketService.SHOW',
};

WelcomeMarketService.showWelcomeMarket = (payload) => {
    eventEmitter.emit(WelcomeMarketService.Events.SHOW, payload);
};

WelcomeMarketService.onShowWelcomeMarket = (callback) => {

    eventEmitter.on(WelcomeMarketService.Events.SHOW, callback);

    return () => {
        eventEmitter.off(WelcomeMarketService.Events.SHOW, callback);
    }
};

Object.freeze(WelcomeMarketService)
export default WelcomeMarketService
