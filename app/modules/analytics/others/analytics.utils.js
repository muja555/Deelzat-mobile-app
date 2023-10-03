//***
/// for events specifications reference
/// see https://docs.google.com/spreadsheets/d/1q6RsxNGvQofuzbqy3zlKkG9VwWieQk6Z4ms4iVOoSag/edit?usp=sharing
//***

import analytics from '@react-native-firebase/analytics';
// import {ANALYTICS_PREFIX} from '@env';
import EVENT_NAME from "modules/analytics/constants/analytics-event-name.const";
import EVENT_PARAM from "modules/analytics/constants/analytics-event-param.const";
import {EventSource} from 'deelzat/types/analytics-source'
import COMPONENTS_PAGE from "modules/main/constants/components-pages.const";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import AuthMethodConst from "modules/auth/constants/auth-method.const";
import USER_PROP from "modules/analytics/constants/analytics-user-propery.const";
import AddressFieldNames from "v2modules/checkout/constants/address-field-names.const";
import { AppEventsLogger } from "react-native-fbsdk-next";
import uniqBy from 'lodash/uniqBy';
import * as Sentry from "@sentry/react-native";
import OneSignal from "react-native-onesignal";
import crashlytics from '@react-native-firebase/crashlytics';

import PostAlgoliaEventApi from "modules/analytics/apis/post-algolia-event.api";
import PostAlgoliaEventInput from "modules/analytics/inputs/post-algolia-event.input";
import store from "modules/root/components/store-provider/store-provider";
import { isTestBuild } from 'modules/main/others/main-utils';


/**
 * Limit a string value to maximum allowed characters in FB tracking
 * see https://firebase.google.com/docs/analytics/errors
 */
function limitValue(string) {
    return string?.substring(0, 100);
}

function getCurrency() {
    const state = store.getState();
    return state?.geo?.currencyCode || 'ILS';
}

let USER_ID;

export function trackViewProduct(product, trackSource: EventSource) {

    const isFound = !product.isNotFound;

    const params = {}
    params[EVENT_PARAM.IS_FOUND] = setBoolean(isFound)
    if (isFound) {
        params[EVENT_PARAM.INVENTORY] = product.inventory_quantity;
        params[EVENT_PARAM.IS_DISCOUNT] = setBoolean(product.compare_at_price > product.price);
        params[EVENT_PARAM.IS_NEW] = setBoolean(product.is_new);
    }
    mergeProductEventParams(params, product)
    mergeSourcesIntoParams(params, trackSource)

    logEvent(EVENT_NAME.VIEW_PRODUCT, params)

    logFacebookEventForItem(AppEventsLogger.AppEvents.ViewedContent, params);
}


export function trackViewProductsList(category, subCategory, trackSource: EventSource) {

    const params = {}
    mergeProductsListParams(params, category, subCategory)
    mergeSourcesIntoParams(params, trackSource)

    logEvent(EVENT_NAME.VIEW_SEARCH_RESULTS, params);

    logFacebookEventForItem(AppEventsLogger.AppEvents.Searched, params)
}


export function trackSaveProduct(product, trackSource: EventSource, selectedVariant) {
    const params = {}
    if (product.hasOwnProperty('is_new')) {
        params[EVENT_PARAM.IS_NEW] = setBoolean(product.is_new);
    }
    mergeProductEventParams(params,  product, selectedVariant)
    mergeSourcesIntoParams(params, trackSource)

    logEvent(EVENT_NAME.ADD_TO_WISHLIST, params);

    logFacebookEventForItem(AppEventsLogger.AppEvents.AddedToWishlist, params);
}


export function trackAddToCart(cartItem , trackSource: EventSource) {

    const params = {}
    mergeProductEventParams(params, cartItem.product, cartItem.variant);
    mergeSourcesIntoParams(params, trackSource);

    logEvent(EVENT_NAME.ADD_TO_CART, params);

    logFacebookEventForItem(AppEventsLogger.AppEvents.AddedToCart, params);
}


export function trackViewCart(cartItems = [], trackSource: EventSource) {

    const params = {}
    mergeProductsEventParams(params, cartItems);
    mergeSourcesIntoParams(params, trackSource);

    logEvent(EVENT_NAME.VIEW_CART, params);
}


export function trackBeginCheckout(cartItems = [], trackSource: EventSource) {

    const params = {}
    mergeProductsEventParams(params, cartItems)
    mergeSourcesIntoParams(params, trackSource)

    logEvent(EVENT_NAME.BEGIN_CHECKOUT, params);
    logFacebookEventForItems(AppEventsLogger.AppEvents.InitiatedCheckout, params);
}


export function trackCheckoutComplete(orderCreateInput,
                                      transactionID,
                                      trackSource: EventSource,
                                      errorMsg) {

    const cityToShip = orderCreateInput.shippingInfo[AddressFieldNames.CITY]
    const countryOrderOrigin = orderCreateInput.shippingInfo[AddressFieldNames.COUNTRY]

    const params = {};
    params[EVENT_PARAM.TRANSACTION_ID] = transactionID;
    params[EVENT_PARAM.SHIPPING] = cityToShip.destination_shipping_cost_value || 0;
    params[EVENT_PARAM.SHIPPING_CITY] = cityToShip.name;
    params[EVENT_PARAM.ORIGIN_COUNTRY] = countryOrderOrigin.title;
    params[EVENT_PARAM.PAYMENT_METHOD] = orderCreateInput.paymentMethod
    params[EVENT_PARAM.COUPON] = orderCreateInput.coupon?.code;
    params[EVENT_PARAM.ADDONS] = (orderCreateInput.addonsList || [])
        .filter(addon => addon.isSelected)
        .map(addon => addon.code).join(',')

    mergeProductsEventParams(params, orderCreateInput.checkoutItems, !errorMsg);
    mergeSourcesIntoParams(params, trackSource);

    if (!errorMsg) {

        logEvent(EVENT_NAME.COMPLETE_CHECKOUT, params);
        logFacebookEventForItems(AppEventsLogger.AppEvents.Purchased, params);
        logAlgoliaEventOrderCompleted(orderCreateInput.checkoutItems);

        try {
            OneSignal.sendTags({
                last_order: new Date().valueOf(),
                amount_spent: orderCreateInput.totalPrice,
            });
        } catch (onsignalE) {
            console.warn(onsignalE)
        }

    } else {

        mergeValueSplitIfNeeded(params, EVENT_PARAM.ERROR_MESSAGE, errorMsg)
        logEvent(EVENT_NAME.COMPLETE_CHECKOUT_FAILED, params)
    }
}


export function trackShareProduct(product, trackSource: EventSource) {

    const params = getItemParams(product);
    params[EVENT_PARAM.CONTENT_TYPE] = COMPONENTS_PAGE.PRODUCT_DETAILS;
    params[EVENT_PARAM.CURRENCY] = getCurrency();
    params[EVENT_PARAM.VALUE] = params[EVENT_PARAM.PRICE]
    mergeSourcesIntoParams(params, trackSource)

    logEvent(EVENT_NAME.SHARE, params)
}


export function trackShareProductsList(category, subCategory, selectedFilters, trackSource: EventSource) {

    const params = {}
    params[EVENT_PARAM.CONTENT_TYPE] = COMPONENTS_PAGE.PRODUCTS_LIST;
    params[EVENT_PARAM.SELECTED_FILTERS] = Object.keys(selectedFilters).join(',');

    mergeProductsListParams(params, category, subCategory)
    mergeSourcesIntoParams(params, trackSource)

    logEvent(EVENT_NAME.SHARE, params)
}


export function trackShareShop(shop, isOwner, trackSource) {

    const params = {}
    params[EVENT_PARAM.CONTENT_TYPE] = COMPONENTS_PAGE.SHOP;
    params[EVENT_PARAM.SHOP_ID] = shop.id
    params[EVENT_PARAM.SHOP_NAME] = limitValue(shop.name)
    params[EVENT_PARAM.IS_OWNER] = setBoolean(isOwner)

    mergeSourcesIntoParams(params, trackSource)

    logEvent(EVENT_NAME.SHARE, params)
}


export function trackViewSignupPage(trackSource: EventSource) {
    const params = {};
    mergeSourcesIntoParams(params, trackSource);
    logEvent(EVENT_NAME.VIEW_SIGNUP_PAGE, params);
}


export function trackSignupFailed(signUpMethod: AuthMethodConst, emailMobileValue, errorMsg) {
    const params = {};
    params[EVENT_PARAM.METHOD] = signUpMethod;
    params[EVENT_PARAM.VALUE] = emailMobileValue;
    mergeValueSplitIfNeeded(params, EVENT_PARAM.ERROR_MESSAGE, errorMsg);
    logEvent(EVENT_NAME.SIGN_UP_FAILED, params);
}


export function trackSignupAttempt(signUpMethod: AuthMethodConst, emailMobileValue) {
    const params = {};
    params[EVENT_PARAM.METHOD] = signUpMethod;
    params[EVENT_PARAM.VALUE] = emailMobileValue;
    logEvent(EVENT_NAME.SIGN_UP_ATTEMPT, params);
}


export function trackSignup(signUpMethod: AuthMethodConst, trackSource: EventSource) {

    const params = {}
    params[EVENT_PARAM.METHOD] = signUpMethod
    mergeSourcesIntoParams(params, trackSource)

    logEvent(EVENT_NAME.SIGN_UP, params)
    setUserProperty(USER_PROP.SINGUP_METHOD, signUpMethod)
}


export function trackLogout() {
    logEvent(EVENT_NAME.LOGOUT, {})
    setUserProperty(USER_PROP.SINGUP_METHOD, 'logged_out')
}


export function trackChangeMarket(toCode) {
    const params = {};
    params[EVENT_PARAM.TO] = toCode;
    logEvent(EVENT_NAME.CHANGE_MARKET, params);
}


export function trackClickOnBanner(bannerItem, index, bannerPage) {

    const params = {}
    params[EVENT_PARAM.BANNER_ID] = bannerItem.objectID + "";
    params[EVENT_PARAM.BANNER_NAME] = bannerItem.name;
    params[EVENT_PARAM.POSITION] = index + 1;
    params[EVENT_PARAM.PAGE_NAME] = bannerPage;

    logEvent(EVENT_NAME.CLICK_ON_BANNER, params)
}



export function trackClickOnActivity(item, index, activityPage) {

    const params = {}
    params[EVENT_PARAM.BANNER_ID] = item.objectID + "";
    params[EVENT_PARAM.ACTIVITY_NAME] = item.name;
    params[EVENT_PARAM.POSITION] = index + 1;
    params[EVENT_PARAM.PAGE_NAME] = activityPage;

    logEvent(EVENT_NAME.CLICK_ON_ACTIVITY, params)
}


export function trackViewShop(shop, isOwner, fromProduct, trackSource: EventSource) {

    const params = {}
    params[EVENT_PARAM.SHOP_ID] = shop?.id
    params[EVENT_PARAM.SHOP_NAME] = limitValue(shop?.name)
    params[EVENT_PARAM.IS_OWNER] = setBoolean(isOwner)
    if (fromProduct) {
        params[EVENT_PARAM.FROM_PRODUCT_ID] = fromProduct?.id + "";
        params[EVENT_PARAM.FROM_PRODUCT_NAME] = limitValue(fromProduct?.title)
    }

    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.VIEW_SHOP, params)
}


export function trackInitiateAddProduct(isUpdate, trackSource: EventSource) {
    const params = {}
    params[EVENT_PARAM.IS_UPDATE_PRODUCT] = setBoolean(isUpdate)
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.INITIATE_POST_PRUDCT_FUNNEL, params)
}


export function trackExitAddProduct() {
    logEvent(EVENT_NAME.EXIT_POST_PRODUCT_FUNNEL, {})
}


export function trackAddProductChangeStep(isUpdate, stepName) {
    const params = {}
    params[EVENT_PARAM.STEP] = stepName
    params[EVENT_PARAM.IS_UPDATE_PRODUCT] = setBoolean(isUpdate)
    logEvent(EVENT_NAME.CHANGE_STEP_POST_PRODUCT, params)
}


export function trackAddImage(imagesCount, imageSource: string) {

    const params = {}
    params[EVENT_PARAM.IMAGE_SOURCE] = imageSource
    params[EVENT_PARAM.IMAGES_COUNT] = imagesCount
    logEvent(EVENT_NAME.ADD_IMAGE, params)
}


export function trackRemoveImage(imagesCount) {

    const params = {}
    params[EVENT_PARAM.IMAGES_COUNT] = imagesCount
    logEvent(EVENT_NAME.REMOVE_IMAGE, params)
}


export function trackCropImage(imageSource) {
    const params = {}
    params[EVENT_PARAM.IMAGE_SOURCE] = imageSource
    logEvent(EVENT_NAME.CROP_IMAGE, params)
}


export function trackSetImageAsDefault(imageSource) {
    const params = {}
    params[EVENT_PARAM.IMAGE_SOURCE] = imageSource
    logEvent(EVENT_NAME.SET_IMAGE_AS_DEFAULT, params)
}


export function trackUploadImagesStarted(imagesCount) {
    const params = {}
    params[EVENT_PARAM.IMAGES_COUNT] = imagesCount
    logEvent(EVENT_NAME.UPLOAD_PRODUCT_IMAGES_STARTED, params)
}


export function trackUploadImagesSuccess(imagesCount) {
    const params = {}
    params[EVENT_PARAM.IMAGES_COUNT] = imagesCount
    logEvent(EVENT_NAME.UPLOAD_PRODUCT_IMAGES_SUCCESS, params)
}


export function trackUploadImagesFailed(failedImageSource, errorMsg) {
    const params = {}
    params[EVENT_PARAM.IMAGE_SOURCE] = failedImageSource
    params[EVENT_PARAM.ERROR_MESSAGE] = limitValue(errorMsg)
    logEvent(EVENT_NAME.UPLOAD_PRODUCT_IMAGES_FAILED, params)
}


export function trackAddProductFieldFilled(fieldName, fieldValue) {
    const params = {}
    params[EVENT_PARAM.FIELD_NAME] = fieldName
    if (Array.isArray(fieldValue)) {
        params[EVENT_PARAM.FIELD_VALUE] = fieldValue.join(',')
    } else {
        params[EVENT_PARAM.FIELD_VALUE] = limitValue(fieldValue)
    }
    logEvent(EVENT_NAME.POST_PRODUCT_FIELD_FILLED, params)
}


export function trackViewShopEdit(trackSource: EventSource) {
    const params = {}
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.VIEW_EDIT_SHOP, params)
}


export function trackExitShopEdit() {
    logEvent(EVENT_NAME.EXIT_EDIT_SHOP, {})
}


export function trackEditShopFieldFilled(fieldName, fieldValue)  {
    const params = {}
    params[EVENT_PARAM.FIELD_NAME] = fieldName
    params[EVENT_PARAM.FIELD_VALUE] = limitValue(fieldValue)
    logEvent(EVENT_NAME.EDIT_SHOP_FIELD_FILLED, params)
}


export function trackEditShopSuccess(trackSource: EventSource) {
    const params = {}
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.EDIT_SHOP_SUCCESS, params)
}


export function trackEditShopFailed(errorMessage, trackSource: EventSource) {
    const params = {}
    params[EVENT_PARAM.ERROR_MESSAGE] = limitValue(errorMessage)
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.EDIT_SHOP_FAILED, params)
}


export function trackPostProductComplete(productState, shopState, errorMsg) {
    const isUpdate = !!productState.id;
    const params = {}

    params[EVENT_PARAM.IS_UPDATE_PRODUCT] = setBoolean(!!productState.id);
    if (isUpdate) {
        params[EVENT_PARAM.ITEM_ID] = productState.id + "";
    }
    params[EVENT_PARAM.ITEM_NAME] = limitValue(productState.fields?.title?.value);
    params[EVENT_PARAM.PRICE_MODE] = productState.priceMode.value;
    params[EVENT_PARAM.IS_NEW_SHOP] = setBoolean(!!productState.newShopCreated);
    params[EVENT_PARAM.IMAGES_COUNT] = productState.images.length;

    if (productState.fields.hasOwnProperty('metafields.condition')) {
        params[EVENT_PARAM.IS_NEW] = setBoolean(productState.fields['metafields.condition'].value.value === 'new');
    }

    if (productState.variants.length && productState.variants[0].option1 === 'title') {
        const titleVariant = productState.variants[0];
        params[EVENT_PARAM.PRICE] = titleVariant.price;
        params[EVENT_PARAM.INVENTORY] = titleVariant.quantity;
        params[EVENT_PARAM.COMPARE_AT_PRICE] = titleVariant.price_sale;
    }
    params[EVENT_PARAM.VARIANTS_COUNT] = productState.variants?.length;

    params[EVENT_PARAM.ITEM_CATEGORY] = productState.category.title;
    params[EVENT_PARAM.ITEM_CATEGORY_ID] = productState.category.objectID;
    if (productState.subCategory) {
        params[EVENT_PARAM.ITEM_CATEGORY2] = productState.subCategory.title;
        params[EVENT_PARAM.ITEM_CATEGORY2_ID] = productState.subCategory.objectID;
    }
    if (productState.hasOwnProperty('target')) {
        params[EVENT_PARAM.ITEM_TARGET] = productState.target?.label;
    }

    params[EVENT_PARAM.SHOP_ID] = shopState.shopId;
    params[EVENT_PARAM.SHOP_NAME] = limitValue(shopState.shop?.name);

    mergeSourcesIntoParams(params, productState.trackSource)

    const getEventName = (name) => {
       if (isUpdate) {
           return name.replace('post', 'update');
       }
        return name;
    }

    if (!errorMsg) {
        logEvent(getEventName(EVENT_NAME.POST_PRODUCT_SUCCESS), params);
    } else {
        mergeValueSplitIfNeeded(params, EVENT_PARAM.ERROR_MESSAGE, errorMsg);
        logEvent(getEventName(EVENT_NAME.POST_PRODUCT_FAILED), params);
    }
}


export function trackRemoveProduct(shop, product) {
    const _merged = {
        ...product,
        shop
    }
    const params = getItemParams(_merged);
    logEvent(EVENT_NAME.DELETE_PRODUCT, params)
}


export function trackViewFollowingList(shop, isOwner, followingState) {
    const params = {};
    params[EVENT_PARAM.SHOP_ID] = shop.id;
    params[EVENT_PARAM.SHOP_NAME] = limitValue(shop.name);
    params[EVENT_PARAM.IS_OWNER] = setBoolean(isOwner);
    params[EVENT_PARAM.FOLLWING_LIST_COUNT] = followingState?.count;
    logEvent(EVENT_NAME.VIEW_SHOP_FOLLOWING_LIST, params);
}


export function trackClickOnCollectionShowMore(collection, page) {
    const params = {};
    params[EVENT_PARAM.COLLECTION_ID] = collection.objectID;
    params[EVENT_PARAM.COLLECTION_NAME] = collection.name;
    params[EVENT_PARAM.PAGE_NAME] = page;
    logEvent(EVENT_NAME.CLICK_ON_COLLECTION_SHOW_MORE, params)
}


export function trackFilterChanged(filterName, filterValue = []) {
    const params = {}
    params[EVENT_PARAM.FILTER_NAME] = filterName;
    let valueParam;
    if (filterName === 'sort') {
        valueParam = filterValue.length? filterValue[0].value.price : ''
    } else if (filterName === 'price') {
        valueParam = filterValue.map(val => val.title).join(',');
    } else {
        valueParam = filterValue.map(val => val.value).join(',');
    }
    params[EVENT_PARAM.FILTER_VALUE] = valueParam
    logEvent(EVENT_NAME.FILTER_CHANGED, params)
}


export function trackFiltersApplied(selectedFilters, trackSource: EventSource) {
    const params = {}
    params[EVENT_PARAM.FILTERS_NAMES] = Object.keys(selectedFilters).join(',')
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.FILTERS_APPLIED, params);
}


export function trackShopImageDeleted(shop) {
    const params = {}
    params[EVENT_PARAM.SHOP_ID] = shop?.id
    params[EVENT_PARAM.SHOP_NAME] = limitValue(shop?.name)
    logEvent(EVENT_NAME.SHOP_IMAGE_DELETED, params);
}


export function trackShopImageChanged(shop) {
    const params = {}
    params[EVENT_PARAM.SHOP_ID] = shop?.id
    params[EVENT_PARAM.SHOP_NAME] = limitValue(shop?.name)
    logEvent(EVENT_NAME.SHOP_IMAGE_CHANGED, params);
}


export function trackClickOnCopyBuyerInfo(isSelected) {
    const params = {};
    params[EVENT_PARAM.IS_SELECTED] = setBoolean(isSelected)
    logEvent(EVENT_NAME.CLICK_ON_COPY_BUYER_INFO, params)
}


export function trackClickOnChooseAddress() {
    logEvent(EVENT_NAME.CLICK_ON_CHOOSE_ADDRESS, {})
}


export function trackClickOnAddAddress() {
    logEvent(EVENT_NAME.CLICK_ON_ADD_ADDRESS, {})
}


export function trackClickOnEditAddress() {
    logEvent(EVENT_NAME.CLICK_ON_EDIT_ADDRESS, {})
}


export function trackClickOnDeleteAddress() {
    logEvent(EVENT_NAME.CLICK_ON_DELETE_ADDRESS, {})
}


export function trackSelectSavedAddress(sectionTitle, savedAddress) {
    const params = {};
    params[EVENT_PARAM.SECTION_NAME] = sectionTitle;
    params[EVENT_PARAM.SAVED_ADDRESS] = limitValue(savedAddress) || 'unselect';
    logEvent(EVENT_NAME.SELECT_SAVED_ADDRESS, params);
}


export function trackFollowShopStateChange(isFollowed, shop, trackSource: EventSource, fromProduct) {
    const params = {};
    params[EVENT_PARAM.IS_FOLLOWING] = setBoolean(isFollowed);
    params[EVENT_PARAM.SHOP_ID] = shop?.id;
    params[EVENT_PARAM.SHOP_NAME] = limitValue(shop?.name);
    if (fromProduct) {
        params[EVENT_PARAM.FROM_PRODUCT_ID] = fromProduct?.id + "";
        params[EVENT_PARAM.FROM_PRODUCT_NAME] = limitValue(fromProduct?.title)
    }
    mergeSourcesIntoParams(params, trackSource);
    logEvent(EVENT_NAME.FOLLOW_SHOP, params);
}


export function trackBlockShopStateChange(isBlocked, shop) {
    const params = {};
    params[EVENT_PARAM.IS_BLOCKED] = setBoolean(isBlocked);
    params[EVENT_PARAM.SHOP_ID] = shop?.id;
    params[EVENT_PARAM.SHOP_NAME] = limitValue(shop?.name);
    logEvent(EVENT_NAME.BLOCK_SHOP, params);
}


export function trackClickOnMainTabItem(tabName) {
    const params = {};
    params[EVENT_PARAM.PAGE_NAME] = tabName;
    logEvent(EVENT_NAME.CLICK_ON_MAIN_TABS_ITEM, params);
}


export function trackClickOnTrendingProduct(product, index, componetPage) {
    const params = getItemParams(product);
    params[EVENT_PARAM.POSITION] = index + 1;
    params[EVENT_PARAM.PAGE_NAME] = componetPage;
    logEvent(EVENT_NAME.CLICK_ON_TRENDING_PRODUCT, params);

    logAlgoliaEventProductClicked(product, index);
}


export function trackClickOnBundleProduct(product, index, componetPage) {
    const params = getItemParams(product);
    params[EVENT_PARAM.POSITION] = index + 1;
    params[EVENT_PARAM.PAGE_NAME] = componetPage;
    logEvent(EVENT_NAME.CLICK_ON_BUNDLE_PRODUCT, params);

    logAlgoliaEventProductClicked(product, index);
}


export function trackClickOnFeedProduct(product, index) {
    const params = getItemParams(product);
    params[EVENT_PARAM.POSITION] = index + 1;
    logEvent(EVENT_NAME.CLICK_ON_FEED_LIST_ITEM, params);

    logAlgoliaEventProductClicked(product, index);
}


export function trackClickOnDiscountSectionProduct(product, index) {
    const params = getItemParams(product);
    params[EVENT_PARAM.POSITION] = index + 1;
    logEvent(EVENT_NAME.CLICK_ON_DISCOUNTS_SECTION_PRODUCT, params);

    logAlgoliaEventProductClicked(product, index);
}


export function trackClickOnNewlyAddedSectionProduct(product, index) {
    const params = getItemParams(product);
    params[EVENT_PARAM.POSITION] = index + 1;
    logEvent(EVENT_NAME.CLICK_ON_NEWLY_ADDED_SEECTION_PRODUCT, params);

    logAlgoliaEventProductClicked(product, index);
}



export function trackClickOnProductListItemAction(product, action) {
    const params = getItemParams(product);
    params[EVENT_PARAM.ACTION] = action;

    logEvent(EVENT_NAME.CLICK_PRODUCT_LIST_BTN, params);
}


export function trackClickOnContactSeller(product) {
    const params = getItemParams(product);
    logEvent(EVENT_NAME.CLICK_ON_CONTACT_SELLER, params);
}


export function trackClickOnPageTab(tabName) {
    const params = {};
    params[EVENT_PARAM.TAB_NAME] = tabName;
    logEvent(EVENT_NAME.CLICK_ON_PAGE_TAB, params);
}


export function trackChangeLanguage(toLocale) {
    const params = {};
    params[EVENT_PARAM.TO] = toLocale;
    logEvent(EVENT_NAME.CHANGE_LANGUAGE, params);
}


export function trackSelectCheckoutPaymentMethod(paymentMethod, coupon, totalPrice) {
    const params = {};
    params[EVENT_PARAM.PAYMENT_METHOD] = paymentMethod;
    params[EVENT_PARAM.VALUE] = totalPrice;
    params[EVENT_PARAM.CURRENCY] = getCurrency();
    params[EVENT_PARAM.COUPON] = coupon?.code;
    logEvent(EVENT_NAME.SELECT_CHECKOUT_PAYMENT_METHOD, params);

    logFacebookEventForPaymentMethod(paymentMethod);
}


export function trackCheckoutFieldFilled(fieldName, fieldValue, sectionTitle) {
    const params = {};
    params[EVENT_PARAM.FIELD_NAME] = fieldName;
    params[EVENT_PARAM.FIELD_VALUE] = limitValue(fieldValue);
    params[EVENT_PARAM.SECTION_NAME] = sectionTitle;
    logEvent(EVENT_NAME.CHECKOUT_FIELD_FILLED, params);
}


export function trackAddressFieldFilled(fieldName, fieldValue, sectionTitle) {
    const params = {};
    params[EVENT_PARAM.FIELD_NAME] = fieldName;
    params[EVENT_PARAM.FIELD_VALUE] = limitValue(fieldValue);
    params[EVENT_PARAM.SECTION_NAME] = sectionTitle;
    logEvent(EVENT_NAME.ADDRESS_FIELD_FILLED, params);
}


export function trackClickOnAddNewAddress(sectionTitle) {
    const params = {};
    params[EVENT_PARAM.SECTION_NAME] = sectionTitle;
    logEvent(EVENT_NAME.CLICK_ON_ADD_NEW_CHECKOUT_ADDRESS, params);
}


export function trackSelectCheckoutAddon(addon) {
    const params = {};
    params[EVENT_PARAM.ADDON_ID] = addon.objectID;
    params[EVENT_PARAM.ADDON_NAME] = addon.text;
    params[EVENT_PARAM.IS_SELECTED] = setBoolean(addon.isSelected);
    logEvent(EVENT_NAME.SELECT_CHECKOUT_ADDON, params)
}


export function trackCheckoutAddonFieldFilled(addon, fieldName, fieldValue) {
    const params = {};
    params[EVENT_PARAM.ADDON_ID] = addon.objectID;
    params[EVENT_PARAM.ADDON_NAME] = addon.text;
    params[EVENT_PARAM.FIELD_NAME] = fieldName;
    params[EVENT_PARAM.FIELD_VALUE] = limitValue(fieldValue);
    logEvent(EVENT_NAME.CHECKOUT_ADDON_FIELD_FILLED, params);
}


let trackCCFillTaskID; // Prevent consequence events while editing, Stripe field missing onBlur function
export function trackFillCreditCardField(isValid) {
    clearTimeout(trackCCFillTaskID);

    trackCCFillTaskID = setTimeout(() => {
        if (trackCCFillTaskID !== 0) {
            const params = {};
            params[EVENT_PARAM.FIELD_NAME] = 'cc_info'
            params[EVENT_PARAM.IS_VALID] = setBoolean(isValid)
            logEvent(EVENT_NAME.CHECKOUT_FILLING_CC_FIELD, params)


        }
    }, 500)
}


export function trackClickOnCollectionItem(item, itemIndex, collection, page) {
    const params = getItemParams(item);
    params[EVENT_PARAM.COLLECTION_ID] = collection.objectID;
    params[EVENT_PARAM.COLLECTION_NAME] = collection.name;
    params[EVENT_PARAM.PAGE_NAME] = page;
    params[EVENT_PARAM.POSITION] = itemIndex + 1;
    logEvent(EVENT_NAME.CLICK_ON_COLLECTION_ITEM, params);

    logAlgoliaEventProductClicked(item, itemIndex)
}


export function trackClickOnRelatedItem(item, itemIndex, fromProduct) {
    const params = getItemParams(item);
    params[EVENT_PARAM.POSITION] = itemIndex + 1;
    if (fromProduct) {
        params[EVENT_PARAM.FROM_PRODUCT_ID] = fromProduct?.id + "";
        params[EVENT_PARAM.FROM_PRODUCT_NAME] = limitValue(fromProduct?.title);

        if (fromProduct.category) {
            params[EVENT_PARAM.FROM_PRODUCT_CATEGORY_ID] = fromProduct.category.objectID;
            params[EVENT_PARAM.FROM_PRODUCT_CATEGORY_NAME] = fromProduct.category.title;
        } else {
            const field = fromProduct.metafields?.find(meta => meta.key === 'category')
            params[EVENT_PARAM.FROM_PRODUCT_CATEGORY_NAME] = field?.value;
        }

        if (fromProduct.sub_category) {
            params[EVENT_PARAM.FROM_PRODUCT_SUBCATEGORY_ID] = fromProduct.sub_category.objectID;
            params[EVENT_PARAM.FROM_PRODUCT_SUBCATEGORY_NAME] = fromProduct.sub_category.title;
        } else {
            const field = fromProduct.metafields?.find(meta => meta.key === 'subCategory')
            params[EVENT_PARAM.FROM_PRODUCT_SUBCATEGORY_NAME] = field?.value;
        }
    }
    logEvent(EVENT_NAME.CLICK_ON_RELATED_ITEM, params);

    logAlgoliaEventProductClicked(item, itemIndex);
}


export function trackClickOnRecommendedItem(item, itemIndex, fromProduct) {
    const params = getItemParams(item);
    params[EVENT_PARAM.POSITION] = itemIndex + 1;
    if (fromProduct) {
        params[EVENT_PARAM.FROM_PRODUCT_ID] = fromProduct?.id + "";
        params[EVENT_PARAM.FROM_PRODUCT_NAME] = limitValue(fromProduct?.title);

        if (fromProduct.category) {
            params[EVENT_PARAM.FROM_PRODUCT_CATEGORY_ID] = fromProduct.category.objectID;
            params[EVENT_PARAM.FROM_PRODUCT_CATEGORY_NAME] = fromProduct.category.title;
        } else {
            const field = fromProduct.metafields?.find(meta => meta.key === 'category')
            params[EVENT_PARAM.FROM_PRODUCT_CATEGORY_NAME] = field?.value;
        }

        if (fromProduct.sub_category) {
            params[EVENT_PARAM.FROM_PRODUCT_SUBCATEGORY_ID] = fromProduct.sub_category.objectID;
            params[EVENT_PARAM.FROM_PRODUCT_SUBCATEGORY_NAME] = fromProduct.sub_category.title;
        } else {
            const field = fromProduct.metafields?.find(meta => meta.key === 'subCategory')
            params[EVENT_PARAM.FROM_PRODUCT_SUBCATEGORY_NAME] = field?.value;
        }
    }
    logEvent(EVENT_NAME.CLICK_ON_RECOMMENDED_ITEM, params);

    logAlgoliaEventProductClicked(item, itemIndex);
}



export function trackRejectShopOrder(order) {
    const params = {};
    params[EVENT_PARAM.ORDER_ID] = order.id;
    params[EVENT_PARAM.ORDER_PRODUCT_ID] = order.product_id
    logEvent(EVENT_NAME.REJECT_SHOP_ORDER, params)
}


export function trackClickOnSettings() {
    logEvent(EVENT_NAME.CLICK_ON_SETTINS, {})
}


export function trackConfirmShopOrder(order, pickUpDay, pickUpTime) {
    const params = {};
    params[EVENT_PARAM.ORDER_ID] = order.id;
    params[EVENT_PARAM.ORDER_PRODUCT_ID] = order.product_id;
    params[EVENT_PARAM.PICKUP_TIME] = pickUpTime.map((item) => item.value).join(',');
    params[EVENT_PARAM.PICKUP_DAY] = pickUpDay.value + ' day';
    logEvent(EVENT_NAME.CONFIRM_SHOP_ORDER, params)
}


export function trackRemoveCartItem(cartItem) {
    const params = getItemParams(cartItem.product, cartItem.variant);
    logEvent(EVENT_NAME.REMOVE_CART_ITEM, params);
}


export function trackChangeCartItemQuantity(cartItem, newQuantity) {
    const params = getItemParams(cartItem.product, cartItem.variant, newQuantity);
    logEvent(EVENT_NAME.CHANGE_CART_ITEM_QUANTITY, params);
}


export function trackOpenConversation(withUserId, trackSource: EventSource) {
    const params = {}
    params[EVENT_PARAM.WITH_USER_ID] = withUserId
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.OPEN_CONVERSATION, params)
}


export function trackChangeChatInfo(fields, trackSource) {
    const params = { ...fields};
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.CHANGE_CHAT_INFO, params)
}


export function trackClickOnFloatingAddProduct(pageName) {
    const params = {};
    params[EVENT_PARAM.PAGE_NAME] = pageName;
    logEvent(EVENT_NAME.CLICK_ON_FLOATING_ADD_PRODUCT, params);
}


export function trackOnBoardingStart() {
    logEvent(EVENT_NAME.ONBOARDING_START, {});
}


export function trackOnBoardingSkip(page: number) {
    const params = {};
    params[EVENT_PARAM.PAGE_NAME] = page + 1;
    logEvent(EVENT_NAME.ONBOARDING_SKIP, params);
}


export function trackOnBoardingComplete() {
    logEvent(EVENT_NAME.ONBOARDING_COMPLETE, {});
}


export function trackChangeProfileTheme(themeId: string) {
    const params = {};
    params[EVENT_PARAM.THEME_ID] = themeId;
    logEvent(EVENT_NAME.CHANGE_PROFILE_THEME, params);
}


export function trackClickOnThemePreview(themeId: string) {
    const params = {};
    params[EVENT_PARAM.THEME_ID] = themeId;
    logEvent(EVENT_NAME.CLICK_ON_THEME_PREVIEW, params);
}

export function trackChangeProfileAvatar(imageSource) {
    const params = {};
    params[EVENT_PARAM.IMAGE_SOURCE] = imageSource;
    logEvent(EVENT_NAME.CHANGE_PROFILE_AVATAR, {});
}


export function trackOpenAddCoupon(trackSource: EventSource) {
    const params = {}
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.OPEN_ADD_COUPON, params)
}

export function trackRedeemCouponSuccess(couponCode, trackSource: EventSource) {
    const params = {}
    params[EVENT_PARAM.COUPON] = couponCode
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.REDEEM_COUPON_SUCCESS, params)
}

export function trackRedeemCouponFailed(couponCode, errorMessage, trackSource: EventSource) {
    const params = {}
    params[EVENT_PARAM.COUPON] = couponCode
    params[EVENT_PARAM.ERROR_MESSAGE] = limitValue(errorMessage)
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.REDEEM_COUPON_FAILED, params)
}

export function trackClickOnSearchViewAll(searchTerm) {
    const params = {}
    params[EVENT_PARAM.SEARCH_TERM] = searchTerm;
    logEvent(EVENT_NAME.CLICK_ON_SEARCH_VIEW_ALL, params)
}


export function trackClickOnDiscountsSectionViewAll() {
    const params = {}
    logEvent(EVENT_NAME.CLICK_ON_DISCOUNTS_VIEW_ALL, params)
}


export function trackClickOnNewlyAddedSectionViewAll() {
    const params = {}
    logEvent(EVENT_NAME.CLICK_ON_NEWLY_ADDED_VIEW_ALL, params)
}

export function trackOnDeleteCoupon(couponCode, trackSource: EventSource) {
    const params = {}
    params[EVENT_PARAM.COUPON] = couponCode
    mergeSourcesIntoParams(params, trackSource)
    logEvent(EVENT_NAME.DELETE_COUPON, params)
}


function mergeProductsListParams(params, category, subCategory) {

    if (category) {
        params[EVENT_PARAM.ITEM_CATEGORY] = category.title;
        params[EVENT_PARAM.ITEM_CATEGORY_ID] = category.objectID;
    }

    if (subCategory) {
        params[EVENT_PARAM.ITEM_CATEGORY2] = subCategory.title;
        params[EVENT_PARAM.ITEM_CATEGORY2_ID] = subCategory.objectID;
    }
}


function mergeProductEventParams(params, product, variant, quantity) {

    const item = getItemParams(product, variant, quantity);
    params[EVENT_PARAM.ITEMS] = [item];
    params[EVENT_PARAM.CURRENCY] = getCurrency();
    params[EVENT_PARAM.VALUE] = item[EVENT_PARAM.PRICE]
}


/**
 * @param params
 * @param cartItems
 * @param allowArrays It won't log events with Array value unless it's an original firebase event
 */
function mergeProductsEventParams(params, cartItems = [], allowArrays = true) {

    const items = cartItems.map(item => getItemParams(item.product, item.variant, item.quantity || 0));

    params[EVENT_PARAM.CURRENCY] = getCurrency();
    params[EVENT_PARAM.VALUE] =  items.reduce( ( sum, { price } ) => sum + parseFloat(price || 0) , 0)
    if (allowArrays) {
        params[EVENT_PARAM.ITEMS] = items;
    }
}


function getItemParams(product, variant, quantity = 1) {

    const getVariantLabel = (variant) =>
        variant? [variant.option1, variant.option2].filter(t => !!t).join(', '): undefined;

    let itemPrice = variant? variant.price:  product.price;
    if (itemPrice)
        itemPrice = parseFloat(itemPrice).toFixed(2)

    const item = {};
    item[EVENT_PARAM.ITEM_ID] = product.id + "";
    item[EVENT_PARAM.ITEM_NAME] = limitValue(product.title);
    item[EVENT_PARAM.ITEM_BRAND] =  limitValue(product.shop?.name || product.shop_name);
    item[EVENT_PARAM.SHOP_ID] = product.named_tags?.shop || product.shop?.id || product.shop_id;
    item[EVENT_PARAM.QUANTITY] = quantity || 0;
    if (variant) {
        item[EVENT_PARAM.ITEM_VARIANT] = getVariantLabel(variant);
        item[EVENT_PARAM.ITEM_VARIANT_ID] = variant.id;
    }
    item[EVENT_PARAM.PRICE] = itemPrice || 0;
    item[EVENT_PARAM.PRICE] = parseFloat(item[EVENT_PARAM.PRICE])

    mergeCategoryParams(item, product);

    return item;
}


function mergeCategoryParams(params, product) {

    if (product.category) {
        params[EVENT_PARAM.ITEM_CATEGORY] = product.category.title;
        params[EVENT_PARAM.ITEM_CATEGORY_ID] = product.category.objectID;
    }
    else {

        const field = product?.metafields?.find(meta => meta.key === 'category')
        params[EVENT_PARAM.ITEM_CATEGORY] = field?.value || product.meta?.global?.category;
    }

    if (product.sub_category) {
        params[EVENT_PARAM.ITEM_CATEGORY2] = product.sub_category.title;
        params[EVENT_PARAM.ITEM_CATEGORY2_ID] = product.sub_category.objectID;
    }
    else {
        const field = product?.metafields?.find(meta => meta.key === 'subCategory')
        params[EVENT_PARAM.ITEM_CATEGORY2] = field?.value || product.meta?.global?.subCategory;
    }
}


/**
 * Merge multiple sources into one source
 * In case of search -> browse,, result would be
 * @param params
 * @param trackSource
 */
function mergeSourcesIntoParams(params, trackSource: EventSource) {
    if (!trackSource)
        return;

    params[EVENT_PARAM.SOURCE] = trackSource.name

    if (trackSource.attr1)
        params[EVENT_PARAM.SOURCE_ATTR_1] = limitValue(trackSource.attr1 + "");
    if (trackSource.attr2)
        params[EVENT_PARAM.SOURCE_ATTR_2] = limitValue(trackSource.attr2 + "");
    if (trackSource.index !== undefined && trackSource.index !== null)
        params[EVENT_PARAM.SOURCE_POSITION] = trackSource.index + 1

    let searchTerm;
    if (trackSource.name === EVENT_SOURCE.BROWSE) {
        searchTerm = [params[EVENT_PARAM.ITEM_CATEGORY], params[EVENT_PARAM.ITEM_CATEGORY2]]
            .filter(t => !!t).join('-');
    } else {
        searchTerm = params[EVENT_PARAM.SOURCE_ATTR_1]
    }

    params[EVENT_PARAM.SEARCH_TERM] = searchTerm
}


function logEvent(eventName: EVENT_NAME, eventParams) {

    const prefix = (__DEV__ || isTestBuild())? ('TEST' + "_") : '';

    // dont sent events in testing mode
    if (prefix) {
        return;
    }

    try {

        // Firebase
        eventParams[EVENT_PARAM.IS_TEST] = setBoolean(isTestBuild());
        analytics().logEvent(prefix + eventName, eventParams);

        // Smartlook
        //logEventForSmartlook(prefix + eventName, eventParams);
    } catch (e) {
        console.warn(e)
    }
}

/**
 * To send bool param as 'true' and 'false' instead of 1 and 0
 * @param val
 * @returns {string|string}
 */
function setBoolean(val) {
    return val
    //return 'boolean' === typeof val? (val + '') : ''
}


export function setUserProperty(propertyName: USER_PROP, value) {

    try {

        let propertyValue = value || '';
        if (Array.isArray(propertyValue))
            propertyValue = propertyValue.join(',');
        else if (value === false)
            propertyValue = 'false';
        else
            propertyValue = propertyValue + "";

        // Firebase
        analytics().setUserProperty(propertyName, propertyValue);


        if (!__DEV__) {

            // Smartlook
            // if (USER_ID) {
            //     Smartlook.setUserIdentifier(USER_ID, { [propertyName] : propertyValue});
            // }

            // Sentry
            if (propertyValue) {
                Sentry.setTag(propertyName, propertyValue);
            }
        }



    } catch (e) {
        console.warn(e)
    }


}

export function getUserID () {
    return AlgoliaUserID;
}

export function setUserID(userID: string) {
    AlgoliaUserID = userID?.replace('|', '_').replace(/\./g,'_');
    USER_ID = userID;

    try {
        // Firebase
        analytics().setUserId(userID).catch(console.warn);

        if (!__DEV__) {

            // Smartlook
            // if (userID)
            //     Smartlook.setUserIdentifier(userID);

            // Facebook
            AppEventsLogger.setUserID(userID);

            // Sentry
            Sentry.setUser({ id: userID });

            // Crashlytics
            crashlytics().setUserId(userID);
        }

        // OneSignal
        OneSignal.setExternalUserId(userID);
    }
    catch (e) {
        console.warn(e)
    }
}


/**
 * Track Firebase screen_view event
 * @param e: Tab.Screen focus event object
 * @param removed: if screen removed from scren, aka: Exit
 */
export function trackViewScreen(e, removed = false) {

    try {
        const screenName = e.target? e.target.substr(0, e.target.indexOf('-')): e;
        analytics().logScreenView({screen_name: screenName});

        // if (!__DEV__) {
        //     Smartlook.trackNavigationEvent(screenName,
        //         removed? Smartlook.ViewState.Exit: Smartlook.ViewState.Enter);
        // }
    }
    catch (e) {
        console.warn(e)
    }

}

export const screenListener = () => {
    return {
        focus: e => trackViewScreen(e),
        beforeRemove: e => trackViewScreen(e, true),
    }
}


/**
 * Split value if longer that 100 characters due to Firebase limitations
 * @param params
 * @param key
 * @param value
 */
function mergeValueSplitIfNeeded(params, key, value) {
    if (value && value?.length > 99) {
        const endIndex = Math.min(value.length, 198);
        params[key + "_0"] = value.substring(0, 99);
        params[key + "_1"] = value.substring(99, endIndex)
    }
    else {
        params[key] = value
    }
}



//==================
// FACEBOOK EVENTS
//==================
const LOG_FB = !isTestBuild() && !__DEV__; // Log Facebook events only on production

function logFacebookEventForPaymentMethod(paymentMethod) {
    if (!LOG_FB)
        return;

    try {
        AppEventsLogger.logEvent(
            AppEventsLogger.AppEvents.AddedPaymentInfo,
            {
                [AppEventsLogger.AppEventParams.Success]: 1,
                [EVENT_PARAM.PAYMENT_METHOD]: paymentMethod,
            }
        )
    } catch (e) {
        console.warn(e)
    }
}


function logFacebookEventForItem(eventName, params, numItems = undefined) {
    if (!LOG_FB)
        return;

    try {

        let facebookParams = {};

        if (params.items) {
            facebookParams[AppEventsLogger.AppEventParams.ContentType] = 'product';
            facebookParams[AppEventsLogger.AppEventParams.ContentID] =  params.items[0].id || params.items[0].item_id;
            facebookParams[AppEventsLogger.AppEventParams.Description] = params.items[0].title;
            facebookParams[AppEventsLogger.AppEventParams.Currency] =  getCurrency();
        }

        if (params[EVENT_PARAM.SOURCE])
            facebookParams[EVENT_PARAM.SOURCE] = params[EVENT_PARAM.SOURCE];
        if (params[EVENT_PARAM.SOURCE_ATTR_1])
            facebookParams[EVENT_PARAM.SOURCE_ATTR_1] = params[EVENT_PARAM.SOURCE_ATTR_1];
        if (params[EVENT_PARAM.SOURCE_ATTR_2])
            facebookParams[EVENT_PARAM.SOURCE_ATTR_2] = params[EVENT_PARAM.SOURCE_ATTR_2];
        if (params[EVENT_PARAM.SEARCH_TERM])
            facebookParams[AppEventsLogger.AppEventParams.SearchString] = params[EVENT_PARAM.SEARCH_TERM];

        if (params[EVENT_PARAM.ITEM_CATEGORY])
            facebookParams[EVENT_PARAM.ITEM_CATEGORY] = params[EVENT_PARAM.ITEM_CATEGORY];
        if (params[EVENT_PARAM.ITEM_CATEGORY_ID])
            facebookParams[EVENT_PARAM.ITEM_CATEGORY_ID] = params[EVENT_PARAM.ITEM_CATEGORY_ID];
        if (params[EVENT_PARAM.ITEM_CATEGORY2])
            facebookParams[EVENT_PARAM.ITEM_CATEGORY2] = params[EVENT_PARAM.ITEM_CATEGORY2];
        if (params[EVENT_PARAM.ITEM_CATEGORY2_ID])
            facebookParams[EVENT_PARAM.ITEM_CATEGORY2_ID] = params[EVENT_PARAM.ITEM_CATEGORY2_ID];


        if (!!numItems) { // AddToCart and Purchase events,, because they are the one with more than one product
            facebookParams[AppEventsLogger.AppEventParams.NumItems] = numItems;
            facebookParams[AppEventsLogger.AppEventParams.PaymentInfoAvailable] = 1;
        } else if (params.items){
            facebookParams[EVENT_PARAM.SHOP_NAME] = params.items[0].item_brand || params.items[0].vendor || '';
            facebookParams[EVENT_PARAM.SHOP_ID] =  params.items[0].named_tags?.shop || params.items[0].shop?.id || params.items[0].shop_id || '';
            facebookParams[EVENT_PARAM.ITEM_CATEGORY] =  params.items[0].item_category || '';
            facebookParams[EVENT_PARAM.ITEM_CATEGORY_ID] =  params.items[0].item_category_id || '';
            facebookParams[EVENT_PARAM.ITEM_CATEGORY2] =  params.items[0].item_category2 || '';
            facebookParams[EVENT_PARAM.ITEM_CATEGORY2_ID] =  params.items[0].item_category2_id || '';
        }

        if (params.items) {
            AppEventsLogger.logEvent(
                eventName,
                parseInt(params.items[0]?.price || 0),
                facebookParams
            )
        } else {
            AppEventsLogger.logEvent(
                eventName,
                facebookParams
            )
        }

    } catch (e) {
        console.warn(e)
    }
}


function logFacebookEventForItems(eventName, params) {
    if (!LOG_FB) // test environment
        return;

    let items =  params[EVENT_PARAM.ITEMS] || [];
    items = uniqBy(items, 'item_id');
    items.forEach(item => logFacebookEventForItem(eventName, {...params, items: [item]}, 1));
}


export function setFacebookUserParams(shop) {
    if (!LOG_FB || !shop) // test environment
        return;

    try {

        let mobileNumber = shop?.user?.mobileNumber;

        // format mobile number
        if (mobileNumber) {
            if (mobileNumber.startsWith('05')) {
                mobileNumber = mobileNumber.replace('05', '9725')
            } else if (mobileNumber.startsWith('00')) {
                mobileNumber = mobileNumber.substring(2);
            }


            if (!mobileNumber.startsWith('+')) {
                mobileNumber = "+" + mobileNumber;
            }

            mobileNumber = mobileNumber.replace('+', '00');
        }


        const countryCode = store?.getState()?.geo?.browseCountryCode?.toLowerCase() || 'ps';
        const citiesList = store?.getState()?.persistentData?.citiesList || [];

        const cityLabel = shop?.address?.city;
        let cityToSend;
        if (cityLabel && citiesList.length > 0) {
            cityToSend = citiesList.find(city => city['ar'] === cityLabel);
            cityToSend = cityToSend?.['en'];
            cityToSend = cityToSend.split(' ').join('');
            cityToSend = cityToSend.toLowerCase();
        }

        const userParams = {
            email: shop?.user?.email,
            firstName: shop?.user?.firstName,
            lastName: shop?.user?.lastName,
            phone: mobileNumber,
            city: cityToSend,
            country: countryCode,
        }


        AppEventsLogger.setUserData(userParams);
    } catch (e) {
      console.warn(e)
    }
}


//==================
// Smartlook events
//==================
const logEventForSmartlook = (eventName, eventParams) => {

    if (__DEV__) {
        return;
    }


    const param = {};
    Object.keys(eventParams).forEach((key) => {

        const value = eventParams[key];
        if (Array.isArray(value)) {

            value.forEach((item, index) => {
                const keyPrefix = `item${index + 1}_`;
                const itemParams = value[index];
                Object.keys(itemParams).forEach(pKey => {param[keyPrefix + pKey] = itemParams[pKey] + ""});
            });
        }
        else {

            param[key] = eventParams[key] + "";
        }
    });

   // Smartlook.trackCustomEvent(eventName, param);
}



//==================
// Algolia events
//==================
let AlgoliaUserID;

const logAlgoliaEventProductListViewed = (productList) => {

    const inputs = new PostAlgoliaEventInput();
    inputs.userToken = AlgoliaUserID;
    inputs.index = 'products';
    inputs.eventType = 'view';
    inputs.eventName = 'Product List Viewed';
    inputs.objectIDs = productList?.slice(0, 20).map(product => product.objectID);
    PostAlgoliaEventApi.sendEvent(inputs)
        .catch(console.warn);
}
export {logAlgoliaEventProductListViewed as logAlgoliaEventProductListViewed};


const logAlgoliaEventProductListFiltered = (queryFilters) => {

    if (!queryFilters) {
        return;
    }

    const inputs = new PostAlgoliaEventInput();
    inputs.userToken = AlgoliaUserID;
    inputs.index = 'products';
    inputs.eventType = 'view';
    inputs.eventName = 'Product List Filtered';
    inputs.filters = queryFilters
        .split('OR').join('AND') // replace all OR with AND
        .split('AND');

    PostAlgoliaEventApi.sendEvent(inputs)
        .catch(console.warn);

}
export {logAlgoliaEventProductListFiltered as logAlgoliaEventProductListFiltered};


const logAlgoliaEventProductClicked = (product, index) => {

    const productID = product.algolia_object_id || product.objectID;

    if (!productID) {
        return;
    }

    const inputs = new PostAlgoliaEventInput();
    inputs.userToken = AlgoliaUserID;
    inputs.index = 'products';
    inputs.eventType = 'click';
    inputs.objectIDs = [productID];
    inputs.eventName = 'Product Clicked';
    inputs.queryID = product.queryID;
    if (inputs.queryID) {
        inputs.positions = [index + 1];
    }

    PostAlgoliaEventApi.sendEvent(inputs)
        .catch(console.warn);
}
export {logAlgoliaEventProductClicked as logAlgoliaEventProductClicked}


const logAlgoliaEventAddProduct = (product) => {

    const productID = product.algolia_object_id || product.objectID;

    if (!productID) {
        return;
    }

    const inputs = new PostAlgoliaEventInput();
    inputs.userToken = AlgoliaUserID;
    inputs.index = 'products';
    inputs.eventType = 'conversion';
    inputs.eventName = 'Product Added';
    inputs.objectIDs = [productID];

    PostAlgoliaEventApi.sendEvent(inputs)
        .catch(console.warn);

}
export {logAlgoliaEventAddProduct as logAlgoliaEventAddProduct}


const logAlgoliaEventProductViewed = (product = {}) => {

    const productID = product.algolia_object_id || product.objectID;

    if (!productID) {
        return;
    }

    const inputs = new PostAlgoliaEventInput();
    inputs.userToken = AlgoliaUserID;
    inputs.index = 'products';
    inputs.eventType = 'view';
    inputs.eventName = 'Product Viewed';
    inputs.objectIDs = [productID];

    PostAlgoliaEventApi.sendEvent(inputs)
        .catch(console.warn);

}
export {logAlgoliaEventProductViewed as logAlgoliaEventProductViewed}


const logAlgoliaEventOrderCompleted = (cartItems = [], queryID) => {

    const inputs = new PostAlgoliaEventInput();
    inputs.userToken = AlgoliaUserID;
    inputs.index = 'products';
    inputs.eventType = 'conversion';
    inputs.eventName = 'Order Completed';
    inputs.objectIDs = cartItems?.slice(0, 20)?.map(item => (item.product?.algolia_object_id || item.product?.objectID));
    inputs.queryID = queryID;

    PostAlgoliaEventApi.sendEvent(inputs)
        .catch(console.warn);
}
export {logAlgoliaEventOrderCompleted as logAlgoliaEventOrderCompleted}
