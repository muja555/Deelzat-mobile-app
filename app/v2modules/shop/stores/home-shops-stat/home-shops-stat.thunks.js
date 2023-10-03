import ShopApi from "modules/shop/apis/shop.api";
import ShopFollowersCountGetInput from "modules/shop/inputs/shop-followers-count-get.input";
import * as Actions from "./home-shops-stat.actions";

let currentRequests = [];

export const requestShopStat = (shopId) => {
    return (dispatch, getState) => {

        if (!shopId) {
            return;
        }

        const cache = getState().homeShopsStat.cache || {};
        const isRequesting = currentRequests.find(r => r === shopId);

        if (!cache[shopId] && !isRequesting) {

            currentRequests.push(shopId);

            const inputsStats = new ShopFollowersCountGetInput();
            inputsStats.shop_id = shopId;

            ShopApi.followersCountGet(inputsStats)
                .then((stat) => {
                    currentRequests = currentRequests.filter(rShop => rShop !== shopId);
                    dispatch(Actions.addShopStat({shopId, stat}))
                })
                .catch(console.warn);
        }

        return Promise.resolve();
    }
};


