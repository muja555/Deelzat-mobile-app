import * as Actions from "./cart.actions";
import {
    clearLegacyCartItems,
    getCartItems, getLegacyCartItems,
    saveCartItems
} from "modules/cart/others/cart.localstore";
import Toast from "deelzat/toast";
import OneSignal from "react-native-onesignal";
import {logAlgoliaEventAddProduct, setUserProperty} from "modules/analytics/others/analytics.utils";
import I19n from 'dz-I19n';
import USER_PROP from "modules/analytics/constants/analytics-user-propery.const";
import CartApi from "v2modules/product/apis/cart.api";
import CreateUserCartInput from "v2modules/product/inputs/cart/create-user-cart.input";
import GetCartItemsInput from "v2modules/product/inputs/cart/get-cart-items.input";
import CreateCartItemInput from "v2modules/product/inputs/cart/create-cart-item.input";
import DeleteCartItemInput from "v2modules/product/inputs/cart/delete-cart-item.input";
import EditCartItemInput from "v2modules/product/inputs/cart/edit-cart-item.input";
import {cartThunks} from "./cart.store";


export const loadCart = (userId, browseCountryCode) => {
    return async (dispatch, getState) => {

        let cartItems = [];

        if (userId) {

            try {
                const userCarts = await CartApi.getUserCarts() || [];
                let userCart = userCarts.find(cart => cart.country_code === browseCountryCode);

                if (!userCart) { // Create cart by this browseCode

                    const legacyItems = await getLegacyCartItems(userId, browseCountryCode) || [];
                    clearLegacyCartItems(userId, browseCountryCode);

                    const input = new CreateUserCartInput();
                    input.country_code = browseCountryCode;
                    input.items = legacyItems.map(cartItem => ({
                        product_id: cartItem.productID,
                        variant_id: cartItem.variantID,
                        quantity: cartItem.quantity,
                    }));
                    userCart = await CartApi.createUserCart(input);
                }

                dispatch(Actions.SetCart(userCart));

                const input = new GetCartItemsInput();
                input.cartId = userCart.id;
                cartItems = await CartApi.getCartItems(input);

            } catch (e) {
                console.warn(e);
                cartItems = await getCartItems(userId, browseCountryCode) || [];
            }
        }
        else {
            cartItems = await getCartItems(userId, browseCountryCode) || [];
        }

        dispatch(setCartItems(cartItems? [...cartItems]: []));

        return Promise.resolve();
    }
}

/**
 * Change Cart Item... quantity can be below zero to indicate the decrease
 * NOTE: if passed quantity is ZERO => remove that item from cart
 * @param payload: {productID, variantID,  quantity}
 * @returns {function(*, *): Promise<void>}
 */
export const changeCartItem = (payload) => {
    return async (dispatch, getState) => {

        const {
            productID = '',
            variantID,
            quantity = 0,
            product,
            variant,
            showToast = true,
        } = payload;

        let cartItems = getState().cart.cartItems;
        const userCart = getState().cart.cart;

        const listItem = cartItems.find(item => item.productID === productID && item.variantID === variantID);
        let newQuantity = parseInt(quantity || 0);

        if (listItem)
            newQuantity = parseInt(listItem.quantity || 0) + newQuantity;

        const isDeleted = newQuantity <= 0 || quantity === 0;
        const isUpdated = !isDeleted && !!listItem;

        // Update cart list
        if (isDeleted) {
            cartItems = cartItems.filter(item => !(item.productID === productID && item.variantID === variantID));
        }
        else if (isUpdated) {
            cartItems = cartItems.map(item => {
                if (item.productID === productID && item.variantID === variantID) {
                    return {...item, productID, variantID, quantity: newQuantity, product, variant}
                }
                return item
            });
        }
        else { // add new
            cartItems.push({productID, variantID, quantity: newQuantity, product, variant});
        }

        // Update BE cart items
        if (userCart) {

            const input = isDeleted? new DeleteCartItemInput()
                : isUpdated? new EditCartItemInput(): new CreateCartItemInput();
            input.cartId = userCart.id;
            if (listItem) {
                input.cartItemId = listItem.id;
            }
            input.product_id = productID;
            input.variant_id = variantID;
            input.quantity = newQuantity;

            if (isDeleted) {
                CartApi.deleteCartItem(input)
                    .catch(console.warn);
            }
            else if (isUpdated) {
                CartApi.editCarItem(input)
                    .catch(console.warn);
            }
            else {
                CartApi.createCartItem(input)
                    .catch(console.warn);
            }
        }


        if (showToast) {
            const toastMsg = isDeleted? I19n.t('تم حذف المنتج من حقيبة المشتريات'): I19n.t('تم اضافة المنتج إلى حقيبة المشتريات')
            Toast.success(toastMsg, require('assets/icons/Bag.png'));
        }

        dispatch(setCartItems([...cartItems]));

        if (!isDeleted) {
            logAlgoliaEventAddProduct(product);
        }

        try {
            OneSignal.sendTag('last_reload', "" + new Date().valueOf());
        } catch (e) {
            console.warn(e);
        }

        return Promise.resolve();
    }
}


export const deleteCurrentCart = (payload) => {
    return async (dispatch, getState) => {

        dispatch(cartThunks.setCartItems([]));
    }
}


export const setCartItems = (payload) => {
    return async (dispatch, getState) => {

        const browseCountryCode = getState()?.geo?.browseCountryCode;
        const userId = getState()?.auth?.auth0User?.userId;

        // Prepare product objects compatibility
        const toBeSaved = (payload || [])
            .map(item => {

                if (item.variant_id) {
                    item.variantID = item.variant_id;
                }

                if (!item.productID && item.product?.id) {
                    item.productID = item.product?.id;
                }

                if (item.product?.image && typeof item.product?.image !== 'string') {
                    item.product.image = item.product.image.src;
                }

                if (item.product) {
                    item.product.inventory_quantity = item.product.variants?.reduce((sum, variant) => sum + variant.inventory_quantity, 0);
                }

                if (item.variantID && !item.variant) {
                    item.variant = item.product?.variants?.find(_variant => _variant.id === item.variantID);
                }

                return item;
            });

        dispatch(Actions.SetCartItems(toBeSaved));
        setUserProperty(USER_PROP.CART_ITEMS, toBeSaved.length);

        saveCartItems(toBeSaved, userId, browseCountryCode);

    }
}
