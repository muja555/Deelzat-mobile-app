import {
    clearLegacyFavouriteProducts,
    getFavouriteProducts,
    getLegacyFavouriteProducts,
    saveFavouriteProducts
} from "v2modules/board/others/favourite-products-store";
import * as Actions from "./board.actions";
import USER_PROP from "modules/analytics/constants/analytics-user-propery.const";
import {setUserProperty} from "modules/analytics/others/analytics.utils";
import CreateUserWishlistInput from "v2modules/product/inputs/wishlist/create-user-wishlist.input";
import GetWishlistItemsInput from "v2modules/product/inputs/wishlist/get-wishlist-items.input";
import WishlistApi from "v2modules/product/apis/wishlist.api";
import CreateWishlistItemInput from "v2modules/product/inputs/wishlist/create-wishlist-item.input";
import DeleteWishlistItemInput from "v2modules/product/inputs/wishlist/delete-wishlist-item.input";

export const loadWishlist = (userId, browseCountryCode) => {
    return async (dispatch, getState) => {

        let wishlistItems = [];
        let oldWishlistItems = await getFavouriteProducts(userId, browseCountryCode) || [];

        if (userId) {

            try {
                const userWishlists = await WishlistApi.getUserWishlists() || [];
                let wishlist = userWishlists.find(_wishlist => _wishlist.country_code === browseCountryCode);

                if (!wishlist) { // Create wishlist by this browseCode

                    const legacyItems = await getLegacyFavouriteProducts(userId, browseCountryCode) || [];
                    clearLegacyFavouriteProducts(userId, browseCountryCode);

                    const input = new CreateUserWishlistInput();
                    input.country_code = browseCountryCode;
                    input.items = legacyItems.map(item => ({
                        product_id: item.id,
                    }));
                    wishlist = await WishlistApi.createUserWishlist(input);
                }

                dispatch(Actions.SetWishlist(wishlist));

                const input = new GetWishlistItemsInput();
                input.wishlistId = wishlist.id;
                wishlistItems = await WishlistApi.getWishlistItems(input);

            } catch (e) {
                console.warn(e);
                wishlistItems = oldWishlistItems;
            }
        }
        else {

            wishlistItems = oldWishlistItems;
        }

        dispatch(setWishlistItems({
            newList: wishlistItems,
            oldList: oldWishlistItems
        }));

        return Promise.resolve();
    }
}

export const addFavouriteProduct = (product) => {
    return async (dispatch, getState) => {

        const wishlist = getState().board.wishlist;
        let wishlistItems = getState().board.wishlistItems || [];

        if (!wishlistItems.find(item => item.product.id === product.id)) {

            wishlistItems.push({product});
            dispatch(setWishlistItems({
                newList: wishlistItems,
                oldList: wishlistItems
            }));


            if (wishlist) {
                const input = new CreateWishlistItemInput();
                input.wishlistId = wishlist.id;
                input.product_id = product.id;
                WishlistApi.createWishlistItem(input)
                    .catch(console.error);
            }
        }

        return Promise.resolve();
    }
}


export const removeFavouriteProduct = (product) => {
    return async (dispatch, getState) => {

        const wishlist = getState().board.wishlist;
        let wishlistItems = getState().board.wishlistItems || [];

        const deletedItem = wishlistItems.find(item => item.product?.id === product.id);

        wishlistItems = wishlistItems.filter(item => item?.product.id !== product.id);
        dispatch(setWishlistItems({
            newList: wishlistItems,
            oldList: wishlistItems
        }));

        if (wishlist && deletedItem) {
            const input = new DeleteWishlistItemInput();
            input.wishlistId = wishlist.id;
            input.wishlistItemId = deletedItem.id;
            WishlistApi.deleteWishlistItem(input)
                .catch(console.error);
        }

        return Promise.resolve();
    }
}


export const setWishlistItems = (payload) => {
    return async (dispatch, getState) => {

        const {
            newList = [],
            oldList = []
        } = payload;

        const browseCountryCode = getState()?.geo?.browseCountryCode;
        const userId = getState()?.auth?.auth0User?.userId;

        const toBeSaved = newList.map((item, index) => {

            const oldItem = oldList.find(oldi => !!item.id && oldi.id === item.id)
            if (!item.product && item.title) {
                item.product = item;
                item.id = undefined;
            }
            else if (oldItem?.product?.title && !item.product) {
                item.product = {...oldItem.product, isNotFound: true}
            }

            if (item.product?.image && typeof item.product?.image !== 'string') {
                item.product.image = item.product.image.src;
            }

            if (item.product) {
                item.product.inventory_quantity = item.product.variants?.reduce((sum, variant) => sum + variant.inventory_quantity, 0);
            }

            return {
                product: item.product,
                id: item.id || index
            };
        });

        dispatch(Actions.SetWishlistItems(toBeSaved));

        const favouriteIds = toBeSaved.map(item => item.product?.id).filter(item => !!item);
        setUserProperty(USER_PROP.FAVOURITE_PRODUCTS, favouriteIds);

        saveFavouriteProducts(toBeSaved, userId, browseCountryCode)
    }
}

