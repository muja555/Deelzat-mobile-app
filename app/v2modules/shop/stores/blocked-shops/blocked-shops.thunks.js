import { getBlockedShops } from 'v2modules/shop/others/blocked-shop.localstore';
import { blockedShopsActions } from 'v2modules/shop/stores/blocked-shops/blocked-shops.store';

export const loadBlockedShops = (payload) => {
    return (dispatch, getState) => {

        (async () => {
            const list = await getBlockedShops() || [];
            dispatch(blockedShopsActions.SetBlockedShopIdsList(list));
        })();
    }
};
