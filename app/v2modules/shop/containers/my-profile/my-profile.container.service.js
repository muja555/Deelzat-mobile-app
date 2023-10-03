import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const MyProfileService = {};


MyProfileService.Events = {
    REFRESH_STATS: 'REFRESH_STATS',
};

MyProfileService.refreshMyProfileStatus = (payload) => {
    eventEmitter.emit(MyProfileService.Events.REFRESH_STATS, payload);
};

MyProfileService.onRefreshMyProfileStatus = (callback) => {

    eventEmitter.on(MyProfileService.Events.REFRESH_STATS, callback);

    return () => {
        eventEmitter.off(MyProfileService.Events.REFRESH_STATS, callback);
    }
};

Object.freeze(MyProfileService);
export default MyProfileService;
