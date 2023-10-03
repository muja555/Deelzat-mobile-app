import AsyncStorage from '@react-native-async-storage/async-storage';

const CartStoreConst = {};
CartStoreConst.CART_ITEMS_OLD = "CART_ITEMS_V2";
CartStoreConst.CART_ITEMS_NEW = "CART_ITEMS_V3";

const getKey = (userId, countryCode, old) => {
    return (old? CartStoreConst.CART_ITEMS_OLD: CartStoreConst.CART_ITEMS_NEW)
        + (userId ? `_${userId}` : '')
        + (countryCode ? `_${countryCode}` : '');
}

const saveCartItems = async (cartItems = [], userId, countryCode) => {
    try {
        const value = JSON.stringify(cartItems);
        return AsyncStorage.setItem(getKey(userId, countryCode), value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveCartItems as saveCartItems};

const getCartItems = async (userId, countryCode) => {
    try {
        const value = await AsyncStorage.getItem(getKey(userId, countryCode));
        return JSON.parse(value);
    } catch (e) {
        console.warn(e);
        return [];
    }
}
export {getCartItems as getCartItems};



const clearLegacyCartItems = async (userId, countryCode) => {
    try {
        const value = JSON.stringify([]);
        return AsyncStorage.setItem(getKey(userId, countryCode, true), value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {clearLegacyCartItems as clearLegacyCartItems};


const getLegacyCartItems = async (userId, countryCode) => {
    try {
        const value = await AsyncStorage.getItem(getKey(userId, countryCode, true));
        return JSON.parse(value);
    } catch (e) {
        console.warn(e);
        return [];
    }
}
export {getLegacyCartItems as getLegacyCartItems};
