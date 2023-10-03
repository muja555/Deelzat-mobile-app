import {createReducer, on} from "deelzat/store";
import * as Actions from "./app.actions"
import appInitialState from "./app.state";
import * as Sentry from '@sentry/react-native';
import { SeInAppPopup } from './app.actions';

const updateSentryContext = (key, value) => {
    try {
        Sentry.setContext(key, value);
    } catch (e) {
        console.warn(e);
    }

}

const appReducer = createReducer(
    appInitialState,
    [

        on(Actions.SetExampleData, (state,  { payload } ) => {
            return {
                ...state,
                data: payload
            };
        }),

        on(Actions.SetSwipeEnabled, (state,  { payload } ) => {
            updateSentryContext('swipeEnabled', payload);
            return {
                ...state,
                swipeEnabled: payload
            };
        }),

        on(Actions.SetIsRemoteConfigsReady, (state,  { payload } ) => {
            return {
                ...state,
                isRemoteConfigsReady: payload
            };
        }),

        on(Actions.SetAppInitialized, (state,  { payload } ) => {
            updateSentryContext('appInitialized', payload);
            return {
                ...state,
                appInitialized: payload
            };
        }),

        on(Actions.SetIsStagingAPI, (state,  { payload } ) => {
            updateSentryContext('isStagingApi', payload);
            return {
                ...state,
                isStagingApi: payload
            };
        }),

        on(Actions.SeInAppPopup, (state,  { payload } ) => {
            return {
                ...state,
                inAppPopup: payload
            };
        }),

    ]);

export default appReducer;
