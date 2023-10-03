import EventEmitter from 'eventemitter3'

const eventEmitter = new EventEmitter();
const ImagePreviewModalService = {};

// Events
ImagePreviewModalService.Events = {
    SET_VISIBLE: 'SET_VISIBLE'
};

ImagePreviewModalService.setVisible = (payload) => {
    eventEmitter.emit(ImagePreviewModalService.Events.SET_VISIBLE, payload);
};

ImagePreviewModalService.onSetVisible = (callback) => {

    eventEmitter.on(ImagePreviewModalService.Events.SET_VISIBLE, callback);

    return () => {
        eventEmitter.off(ImagePreviewModalService.Events.SET_VISIBLE, callback);
    }
};

Object.freeze(ImagePreviewModalService);
export default ImagePreviewModalService;
