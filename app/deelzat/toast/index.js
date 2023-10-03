import EndPoints from 'environments/end-points';

const HaysToast = {};

let HaysToastRef = [];

const addHaysToastRef = (toastRef) => {
    HaysToastRef.push(toastRef)
};
export { addHaysToastRef as addToastRef }

const removeHaysToastRef = (id) => {
    HaysToastRef = HaysToastRef.filter((item) => item.id !== id);
};
export { removeHaysToastRef as removeToastRef }

const getHaysToastRef = (id) => {
    return HaysToastRef.find((item) => item.id === id);
};
export { getHaysToastRef as getHaysToastRef }


const ToastShow = (_options) => {
    const options = {
        text: _options.text,
        title: _options.title,
        type: _options.type,
        payload: {
            source: _options.imageSrc || EndPoints.DEFAULT_NOTIFICATION_ICON,
            action: _options.action,
        },
        interval: _options.interval,
    };

    const currentToast = HaysToastRef[HaysToastRef.length - 1];
    if (currentToast) {
        currentToast.onTap = _options.onTap;
        currentToast.ref.current?.alertWithType(options.type, options.title ? options.title : '', options.text, options.payload, options.interval);
    }
   };

HaysToast.success = (message, imageSrc) => {
    ToastShow({
        text: message,
        type: 'success',
        imageSrc,
    });
};

HaysToast.danger = (message) => {
    ToastShow({
        text: message,
        type: 'error'
    });
};

HaysToast.alert = (message) => {
    ToastShow({
        text: message,
        type: 'warn'
    });
};

HaysToast.info = (message, imageSrc) => {
    ToastShow({
        text: message,
        type: 'info',
        imageSrc
    });
};

HaysToast.pushNotification = (message, interval, imageSrc, onTap) => {
    ToastShow({
        text: message,
        interval: interval,
        type: 'success',
        action: 'tap',
        onTap: onTap,
        imageSrc: imageSrc,
    });
};

HaysToast.default = (message) => {
    ToastShow({
        text: message
    });
};

export default HaysToast;
