import AsyncStorage from '@react-native-async-storage/async-storage';

const FavouriteProductsConst = {};
FavouriteProductsConst.SAVED_PRODUCTS = "SAVED_PRODUCTS";
FavouriteProductsConst.SAVED_PRODUCTS_NEW = "SAVED_PRODUCTS_V3";

const getKey = (userId, countryCode, old) => {
    return (old? FavouriteProductsConst.SAVED_PRODUCTS: FavouriteProductsConst.SAVED_PRODUCTS_NEW)
        + (userId? `_${userId}`: '')
        + (countryCode? `_${countryCode}`: '');
}

const saveFavouriteProducts = async (favouriteProducts = [], userId, countryCode) => {
    try {
        const value = JSON.stringify(favouriteProducts);
        return AsyncStorage.setItem(getKey(userId, countryCode), value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveFavouriteProducts as saveFavouriteProducts};


const getFavouriteProducts = async (userId, countryCode) => {

    try {
        const value = await AsyncStorage.getItem(getKey(userId, countryCode));
        return JSON.parse(value);
    } catch (e) {
        console.warn(e);
        return [];
    }
}
export {getFavouriteProducts as getFavouriteProducts};


const getLegacyFavouriteProducts = async (userId, countryCode) => {
    try {
        const value = await AsyncStorage.getItem(getKey(userId, countryCode, true));
        return JSON.parse(value);
    } catch (e) {
        console.warn(e);
        return [];
    }
}
export {getLegacyFavouriteProducts as getLegacyFavouriteProducts};


const clearLegacyFavouriteProducts = async (userId, countryCode) => {
    try {
        const value = JSON.stringify([]);
        return AsyncStorage.setItem(getKey(userId, countryCode, true), value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
}
export {clearLegacyFavouriteProducts as clearLegacyFavouriteProducts};
