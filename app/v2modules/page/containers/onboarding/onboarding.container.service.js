import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const OnBoardingService = {};

OnBoardingService.Events = {
    SHOW: 'OnBoardingService.SHOW',
};

OnBoardingService.showOnBoarding = (payload) => {
    eventEmitter.emit(OnBoardingService.Events.SHOW, payload);
};

OnBoardingService.onShowOnBoarding = (callback) => {

    eventEmitter.on(OnBoardingService.Events.SHOW, callback);

    return () => {
        eventEmitter.off(OnBoardingService.Events.SHOW, callback);
    }
};

Object.freeze(OnBoardingService)
export default OnBoardingService
