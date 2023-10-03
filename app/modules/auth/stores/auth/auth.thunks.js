import * as Actions from "./auth.actions";
import SecureStore from "modules/main/others/secure-store";
import Auth0Api from "modules/auth/apis/auth0.api";
import Auth0RefreshTokenInput from "modules/auth/inputs/auth0-refresh-token.input";

import {addToRequestHeader} from "deelzat/http";
import Auth0GetUserInput from "modules/auth/inputs/auth0-get-user.input";
import {shopThunks} from "modules/shop/stores/shop/shop.store";

import {setUserID} from "modules/analytics/others/analytics.utils";
import DeviceInfo from "react-native-device-info";
import {updateShopBasicInfo} from "modules/shop/stores/shop/shop.thunks";

export const loadAuth0User = () => {
    return async (dispatch, getState) => {

        const auth0Credentials = getState()?.auth?.auth0;

        try {
            const inputs = new Auth0GetUserInput(auth0Credentials);
            const auth0UserResult = await Auth0Api.getUser(inputs);

            setUserID(auth0UserResult.userId);

            dispatch(Actions.SetAuth0User(auth0UserResult));
        }
        catch (e) {
            console.error(e);
            dispatch(Actions.SetAuth0User(null));
        }

        updateShopBasicInfo(dispatch, getState());
        dispatch(Actions.SetChecked(true));
        await dispatch(shopThunks.refreshShop());

        return Promise.resolve();
    }
};


export const auth0Success = (payload) => {
    return async (dispatch, getState) => {

        await SecureStore.set(SecureStore.Keys.USER_CREDENTIALS, payload);

        addToRequestHeader('Authorization', 'Bearer ' + payload.idToken);

        dispatch(Actions.SetAuth0(payload));
        dispatch(Actions.SetIsAuthenticated(true));

        dispatch(loadAuth0User());

        return Promise.resolve();
    }
};

export const logout = () => {
    return async (dispatch, getState) => {

        await SecureStore.set(SecureStore.Keys.USER_CREDENTIALS, null);

        dispatch(Actions.SetAuth0(false));
        dispatch(Actions.SetIsAuthenticated(false));

        addToRequestHeader('Authorization', undefined);

        dispatch(Actions.SetAuth0User(null));
        setUserID(DeviceInfo.getUniqueId());

        await dispatch(shopThunks.refreshShop());

        return Promise.resolve();
    }
};


export const checkAuth = (payload) => {
    return async (dispatch, getState) => {

        const userCredentials = await SecureStore.get(SecureStore.Keys.USER_CREDENTIALS);

        if (userCredentials && userCredentials.refreshToken) {
            try {

                const inputs = new Auth0RefreshTokenInput();
                inputs.refreshToken = userCredentials.refreshToken;

                const refreshTokenResult = await Auth0Api.refreshToken(inputs);

                refreshTokenResult.refreshToken = userCredentials.refreshToken;
                await dispatch(auth0Success(refreshTokenResult));

            }
            catch (e) {
                console.error(e);
                dispatch(Actions.SetChecked(true));
            }
        }
        else {

            dispatch(Actions.SetChecked(true));
            setUserID(DeviceInfo.getUniqueId());

            if (userCredentials && !userCredentials.refreshToken) {
                dispatch(logout());
            }
        }

        return Promise.resolve();
    }
};
