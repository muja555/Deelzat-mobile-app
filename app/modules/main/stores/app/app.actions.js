import {createAction} from "deelzat/store";

const SET_EXAMPLE_DATA = '[App] Set Example Data';
export const SetExampleData = createAction(
    SET_EXAMPLE_DATA
);

const SET_SWIPE_ENABLED = '[App] Set Swipe Enabled';
export const SetSwipeEnabled = createAction(
    SET_SWIPE_ENABLED
);

const SET_IS_REMOTE_CONFIGS_READY = '[App] Set Is Remote Configs Ready';
export const SetIsRemoteConfigsReady = createAction(
    SET_IS_REMOTE_CONFIGS_READY
);

const SET_APP_INITIALIZED = '[App] Set App initialized';
export const SetAppInitialized = createAction(
    SET_APP_INITIALIZED
);

const SET_IS_STAGING_API = '[App] Set Is Staging API';
export const SetIsStagingAPI = createAction(
    SET_IS_STAGING_API
);


const SET_IN_APP_POPUP = '[App] Set In App Popup';
export const SeInAppPopup = createAction(
    SET_IN_APP_POPUP
);
