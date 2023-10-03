import store from "modules/root/components/store-provider/store-provider";
import GlobalSpinnerService from "modules/main/components/global-spinner/global-spinner.service";
import isString from "lodash/isString";
import {decompressString} from "modules/main/others/main-utils";
import ProductGetByHandleInput from "modules/product/inputs/product-get-by-handle.input";
import ProductApi from "modules/product/apis/product.api";
import {trackOpenConversation, trackViewShop} from "modules/analytics/others/analytics.utils";
import FillChatNameModalService from "modules/chat/modals/fill-chat-name/fill-chat-names.modal.service";
import AuthRequiredModalService from "modules/auth/modals/auth-required/auth-required.modal.service";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import MainTabsNavsConst from "v2modules/main/constants/main-tabs-navs.const";
import ProductListNavsConst from "v2modules/product/constants/product-list-navs.const";
import I19n from "dz-I19n";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import DeeplinkTypeConst from 'modules/root/constants/deeplink-type.const';

/**
 * Map any deeplink/pushnotifcation type
 */
const DeeplinksMap = {};
DeeplinksMap[DeeplinkTypeConst.PRODUCT] = {
    synonyms: ['product'],
    paramName: 'id'
};
DeeplinksMap[DeeplinkTypeConst.PRODUCT_LIST] = {
    synonyms: ['products', 'shopify_query', 'product_list'],
    paramName: 'filters'
};
DeeplinksMap[DeeplinkTypeConst.MY_PROFILE] = {
    synonyms: ['my_profile', 'my_shop', 'profile']
};
DeeplinksMap[DeeplinkTypeConst.SETTINGS] = {
    synonyms: ['settings']
};
DeeplinksMap[DeeplinkTypeConst.BROWSE] = {
    synonyms: ['browse', 'browse_page']
}
DeeplinksMap[DeeplinkTypeConst.WISHLIST] = {
    synonyms:  ['wishlist', 'wishlist_page']
};
DeeplinksMap[DeeplinkTypeConst.CART] = {
    synonyms: ['cart', 'cart_page']
}
DeeplinksMap[DeeplinkTypeConst.SHOP] = {
    synonyms: ['shop', 'shop_page'],
    paramName: 'shop_id'
}
DeeplinksMap[DeeplinkTypeConst.SHOPS] = {
    synonyms: ['shops', 'shops_page'],
    paramName: 'categories'
}
DeeplinksMap[DeeplinkTypeConst.CHAT_ROOM] = {
    synonyms: ['chat_room'],
    paramName: 'with_user_id'
}
DeeplinksMap[DeeplinkTypeConst.ORDERS] = {
    synonyms: ['orders']
}
DeeplinksMap[DeeplinkTypeConst.SALES] = {
    synonyms: ['sales']
}
DeeplinksMap[DeeplinkTypeConst.FREE_COUPON] = {
    synonyms: ['free_coupon'],
    paramName: 'route_to_page'
}
DeeplinksMap[DeeplinkTypeConst.COUPONS_LIST] = {
    synonyms: ['coupons', 'coupons_list']
}


const getDeeplinkValueFrom = (deeplinkType, data) => {
    if (!deeplinkType || !data) return ;
    const paramName = DeeplinksMap[deeplinkType].paramName;
    return data[paramName];
}
export {getDeeplinkValueFrom as getDeeplinkValueFrom}


const parseDeeplinkType = (remoteType) => {
    if (!remoteType) {
        return;
    }

    let deeplinkType;
    Object.keys(DeeplinksMap).forEach((key) => {

        if (DeeplinksMap[key].synonyms.includes(remoteType.toLowerCase())) {
            deeplinkType =  key;
        }
    });

    return deeplinkType;
}
export {parseDeeplinkType as parseDeeplinkType}



const routeToMyShop = (trackSource) => {

    const navigateToMyProfile = () => {
        RootNavigation.navigate(MainTabsNavsConst.PROFILE);
    }

    const isAuthenticated = store.getState()?.auth?.isAuthenticated;
    if (!isAuthenticated) {
        AuthRequiredModalService.setVisible({
            message: I19n.t('قم بتسجيل الدخول لتتمكن من تصفح حسابك'),
            trackSource,
            onAuthSuccess: navigateToMyProfile
        });
    } else {
        navigateToMyProfile();
    }
}


const routeToShop = (shopSkeleton, fromProduct, trackSource) => {

    if (!shopSkeleton || !shopSkeleton.id)
        return;

    const myShopState = store.getState().shop
    const myShopId = myShopState?.shopId

    if (myShopId === shopSkeleton.id) { // My Profile

        trackViewShop(myShopState.shop || shopSkeleton, true, fromProduct, trackSource);
        routeToMyShop(trackSource);
    }
    else { // Other Profile

        trackViewShop(shopSkeleton, true, fromProduct, trackSource);
        RootNavigation.push(MainStackNavsConst.OTHER_PROFILE, {
            skeleton: shopSkeleton,
        });
    }
}
export {routeToShop as routeToShop}


const routeToProducts = (linkParam, trackSource) => {
    if (!linkParam) return;

    const state = store.getState();
    const categories = state.persistentData.categories;
    const allSubCategories = state.persistentData.subCategories;

    let preSelectedFilters = []
    let screenSelectedFilters = {}
    let _category, _subCategory
    let tabName // new products, used products ...etc

    // If filters came from deeplink,
    if (isString(linkParam.id)) {
        try {
            let digest = decompressString(linkParam.id);
            digest = JSON.parse(digest);
            preSelectedFilters = digest.preSelectedFilters;
            screenSelectedFilters = digest.selectedFilters;
            if (digest.route?.includes("NEW")) {
                tabName = ProductListNavsConst.NEW;
            }
            else if (digest.route?.includes("USED")) {
                tabName = ProductListNavsConst.USED;
            }
            tabName = digest.route;
        } catch (e) {
            console.warn(e)
        }
    } else {
        preSelectedFilters = linkParam?.id;
    }

    if (preSelectedFilters && Array.isArray(preSelectedFilters)) {
        let _categoryId, _subCategoryId;

        const categoriesFilter = preSelectedFilters.flat().find(filter => filter.attribute === 'category')
        if (categoriesFilter) {
            _categoryId = categoriesFilter.value;
            _category = categories.find(category => category.objectID === _categoryId);

            const subCategory = preSelectedFilters.flat().find(filter => filter.attribute === 'sub_category')
            if (subCategory) {
                _subCategoryId = subCategory.value;
                _subCategory = allSubCategories[_subCategoryId];
            }
        }
    }

    const screenParams = {
        category: _category,
        subCategory: _subCategory,
        externalFilters: preSelectedFilters,
        screenSelectedFilters: screenSelectedFilters,
        isJustDiscounts: linkParam?.isJustDiscounts,
        trackSource
    };

    RootNavigation.push(MainStackNavsConst.PRODUCT_LIST, screenParams);

    if (tabName?.includes('USED')) {
        setTimeout(() => {
            RootNavigation.navigate(MainStackNavsConst.PRODUCT_LIST, {
                screen: ProductListNavsConst.USED
            });
        }, 500);
    }
}
export {routeToProducts as routeToProducts}


export const routeToChatRoom = (params, trackSource, dontWaitEver) => {

    const toUserId = params.toUserId;
    if (!toUserId)
        return;

    const navigateToChatRoom = () => {
        const chatProfile = store.getState()?.chat?.chatProfile;

        if (!!chatProfile?.userId && !!toUserId) {
            if (chatProfile?.userId !== toUserId) {
                RootNavigation.push(MainStackNavsConst.CHAT_ROOM, params)
            } else {
                RootNavigation.navigate(MainTabsNavsConst.PROFILE)
            }
            trackOpenConversation(toUserId, trackSource)
        }

        GlobalSpinnerService.setVisible(false);
    }

    const checkProfileName = (withTimeout) => {

        const check = () => {
            const state = store.getState();
            const chatProfile = state?.chat?.chatProfile;

            const split = chatProfile.name?.split(' ');
            const splittedName1 = split?.length > 0? split[0]: '';
            const splittedName2 = split?.length > 1? split[1]: '';
            const splittedEmail = chatProfile.email?.split('@');
            const emailPrefix = splittedEmail?.length > 0? splittedEmail[0]: '';

            const shouldChangeName  = !chatProfile.name
                || chatProfile.email === chatProfile.name
                || (splittedName1 === emailPrefix && splittedName2 === emailPrefix)
                || (splittedName1 === emailPrefix && splittedName2 === emailPrefix?.slice(0, -1))
                || (splittedName1 === emailPrefix?.slice(0, -1));

            if (shouldChangeName) {
                FillChatNameModalService.setVisible({
                    onChangeName: () => setTimeout(navigateToChatRoom, 700),
                    trackSource
                })
            } else {
                navigateToChatRoom()
            }
        }

        if (withTimeout || dontWaitEver) {
            check();
        } else {
            setTimeout(() => {
                check();
            }, (withTimeout));
        }

    }

    const isAuthenticated = store.getState()?.auth?.isAuthenticated;
    if (!isAuthenticated) {
        AuthRequiredModalService.setVisible({
            message: I19n.t('أنشئ حساب لتتمكن من التواصل مع البائعين'),
            trackSource,
            onAuthSuccess: () => checkProfileName(1200)
        })
    } else {
        checkProfileName(0)
    }
}


const routeTo = (type, id, trackSource, extra) => {
    const routingType =  parseDeeplinkType(type);

    if (routingType === DeeplinkTypeConst.PRODUCT) {

        if (!isNaN(id)) {
            let productId = id;
            if (typeof productId === 'string') {
                productId = Number(productId);
            }
            RootNavigation.navigate(MainStackNavsConst.PRODUCT_DETAILS, {
                skeleton: {id: productId, image: extra?.image},
                trackSource,
            });
            GlobalSpinnerService.setVisible(false);
        } else if (id){
            const inputs = new ProductGetByHandleInput();
            inputs.handle = id;
            ProductApi.getByHandel(inputs)
                .then(result => {
                    RootNavigation.navigate(MainStackNavsConst.PRODUCT_DETAILS, {
                        skeleton: result,
                        trackSource
                    });
                })
                .catch(console.warn);
        }

    }
    else if (routingType === DeeplinkTypeConst.MY_PROFILE) {

        routeToMyShop(trackSource);
        GlobalSpinnerService.setVisible(false);
    }
    else if (routingType === DeeplinkTypeConst.SETTINGS) {

        RootNavigation.push(MainStackNavsConst.SETTINGS);
        GlobalSpinnerService.setVisible(false);
    }
    else if (routingType === DeeplinkTypeConst.BROWSE) {

        RootNavigation.navigate(MainTabsNavsConst.BROWSE);
    }
    else if (routingType === DeeplinkTypeConst.WISHLIST) {

        RootNavigation.navigate(MainStackNavsConst.SAVED_PRODUCTS);
    }
    else if (routingType === DeeplinkTypeConst.CART) {

        RootNavigation.navigate(MainStackNavsConst.CHECKOUT);
    }
    else if (routingType === DeeplinkTypeConst.SHOP) {

        routeToShop({id}, null, trackSource)
        GlobalSpinnerService.setVisible(false);
    }
    else if (routingType === DeeplinkTypeConst.SHOPS) {
        if (!id) return;

        const state = store.getState();
        const categories = state.persistentData.categories;

        // categoryId-subCategoryID1,subCategoryID2, ...
        const res = id.split('-');

        const selectedCategoryID = res[0];
        const selectedCategory = categories.find(cat => cat.objectID === selectedCategoryID);
        let preSelectedSubCategories = res.length > 1? res[1] : "";
        if (preSelectedSubCategories) {
            preSelectedSubCategories = preSelectedSubCategories.split(",");
            preSelectedSubCategories = preSelectedSubCategories.map(preID => {return {objectID: preID}});
        }

        RootNavigation.navigate(MainTabsNavsConst.SHOPS, {
            preSelectedCategory: selectedCategory,
            preSelectedSubCategories: preSelectedSubCategories,
        });
        GlobalSpinnerService.setVisible(false)
    }
    else if (routingType === DeeplinkTypeConst.PRODUCT_LIST) {

        routeToProducts({id}, trackSource);
        GlobalSpinnerService.setVisible(false);

    }
    else if (routingType === DeeplinkTypeConst.CHAT_ROOM) {

        const params = {
            toUserId: id
        }
        routeToChatRoom(params, trackSource)
    }
    else if (routingType === DeeplinkTypeConst.ORDERS) {

        RootNavigation.push(id?
            MainStackNavsConst.ORDER_DETAILS:
            MainStackNavsConst.ORDERS, {orderId: id});
    }
    else if (routingType === DeeplinkTypeConst.SALES) {

        RootNavigation.push(MainStackNavsConst.SALES);
    }
    else if (routingType === DeeplinkTypeConst.COUPONS_LIST) {

        RootNavigation.push(MainStackNavsConst.COUPONS_LIST);
    }
    else if (routingType === DeeplinkTypeConst.ADDRESSES_LIST) {

        RootNavigation.push(MainStackNavsConst.SAVED_ADDRESSES);
    }
    else if (routingType === DeeplinkTypeConst.FREE_COUPON) {

        if (id?.toLowerCase()?.includes('wishlist')) {
            RootNavigation.push(MainStackNavsConst.SAVED_PRODUCTS);
        }
        else if (id?.toLowerCase()?.includes('cart')) {
            RootNavigation.push(MainStackNavsConst.CHECKOUT);
        }
        else if (id?.toLowerCase()?.includes('browse')) {
            RootNavigation.push(MainStackNavsConst.BROWSE);
        }
        else if (id?.toLowerCase()?.includes('coupon')) {
            RootNavigation.push(MainStackNavsConst.COUPONS_LIST);
        }
    }
}
export {routeTo as routeTo}
