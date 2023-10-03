import * as Actions from "./shop.actions";
import ShopApi from "modules/shop/apis/shop.api"
import ShopGetInput from "modules/shop/inputs/shop-get.input";
import {setUserProperty} from "modules/analytics/others/analytics.utils";
import USER_PROP from "modules/analytics/constants/analytics-user-propery.const";
import { getThemeFromThemeId } from 'modules/main/others/main-utils';

export const loadShop = (payload) => {
    return async (dispatch, getState) => {

        const shopId = payload.shopId? payload.shopId : payload.id;

        if (!shopId) {
            dispatch(Actions.SetShop(null));
            return Promise.resolve();
        }

        try {
            const inputs = new ShopGetInput();
            inputs.shop_id = shopId;
            const shopResult = await ShopApi.get(inputs);
            dispatch(Actions.SetShop(shopResult));

            if (shopResult) {
                setUserProperty(USER_PROP.EMAIL, shopResult?.user?.email);
                setUserProperty(USER_PROP.PHONE, shopResult?.user?.mobileNumber);
                setUserProperty(USER_PROP.COUNTRY, shopResult?.address?.country);
                setUserProperty(USER_PROP.CITY, shopResult?.address?.city);
            }

            // Apply theme
            const selectedTheme = getThemeFromThemeId(shopResult?.theme_id)
            dispatch(Actions.SetTheme(selectedTheme));

        }
        catch (e) {
            console.warn(e);
            dispatch(Actions.SetShop(null));
        }

        setUserProperty(USER_PROP.SHOP_ID, shopId);

        return Promise.resolve();
    }
};


export const updateShopBasicInfo = (dispatch, state) => {
    const auth0User = state?.auth?.auth0User;
    const appMetaData = auth0User?.appMetadata || {};
    const shopIds = appMetaData.shops_ids || [];
    const shopId = shopIds.length ? shopIds[0] : null;

    dispatch(Actions.SetIsCompleted(!!appMetaData.isProfileCompleted));
    dispatch(Actions.SetShopIds(shopIds));
    dispatch(Actions.SetShopId(shopId));

    return shopId;
}


export const refreshShop = () => {
    return async (dispatch, getState) => {

        const shopId = updateShopBasicInfo(dispatch, getState())
        await dispatch(loadShop({shopId}));

        return Promise.resolve();
    }
};

