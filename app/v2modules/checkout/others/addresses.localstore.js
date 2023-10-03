import AsyncStorage from '@react-native-async-storage/async-storage';
import AddressFieldNames from "v2modules/checkout/constants/address-field-names.const";
import { formatMobileFieldsFromAddress } from 'v2modules/checkout/others/checkout.utils';

const CheckoutStoreConst = {};
CheckoutStoreConst.BUYER_ADDRESSES = "BUYER_ADDRESSES";
CheckoutStoreConst.SHIPPING_ADDRESSES = "SHIPPING_ADDRESSES";

const saveShippingAddressesList = async (shippingAddressesList = []) => {
    try {
        const value = JSON.stringify(preSaveAddress(shippingAddressesList));
        return AsyncStorage.setItem(CheckoutStoreConst.SHIPPING_ADDRESSES, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveShippingAddressesList as saveShippingAddressesList};


const getShippingAddressesList = async () => {
    try {
        const value = await AsyncStorage.getItem(CheckoutStoreConst.SHIPPING_ADDRESSES);
        return preProcessAddress(JSON.parse(value));
    } catch (e) {
        console.warn(e);
        return Promise.reject(e);
    }
}
export {getShippingAddressesList as getShippingAddressesList};


/**
 * Add internation prefix all previous saved mobile numbers
 * @param savedAddresses
 */
function preProcessAddress(savedAddresses) {
    return savedAddresses?.filter(address => address[AddressFieldNames.ADDRESS]?.length >= 10)
        .map(address => formatMobileFieldsFromAddress(address))
}

/**
 * Remove loading zeros
 * @param savedAddresses
 */
function preSaveAddress(savedAddresses) {
    return savedAddresses?.filter(address => address[AddressFieldNames.ADDRESS]?.length >= 10)
        .map(address => formatMobileFieldsFromAddress(address))
}
