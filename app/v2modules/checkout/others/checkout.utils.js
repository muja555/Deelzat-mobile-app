import AddressFieldNames from "v2modules/checkout/constants/address-field-names.const";
import {
    getBuyerAddressesList,
    getShippingAddressesList,
    saveBuyerAddressesList,
    saveShippingAddressesList
} from "./addresses.localstore";
import getJoi from "deelzat/joi";
import CouponTypeConst from "v2modules/checkout/constants/coupon-type.const";
import { getFullNumber, isValidMobile, separateMobileNumberCountryCode } from 'modules/main/others/phone.utils';
import omit from 'lodash/omit';
import store from 'modules/root/components/store-provider/store-provider';

/**
 *
 * @param options {withEmailField, withTitle}
 * @returns {*}
 */
const getValidationSchema = (options) => {

    const Joi = getJoi()

    const fieldKeys = {
        [AddressFieldNames.FIRST_NAME]: Joi.string().required(),
        [AddressFieldNames.LAST_NAME]: Joi.string().required(),
        [AddressFieldNames.MOBILE_COUNTY_CODE]: Joi.string().regex(/^(\+|00)\d/).required(),
        [AddressFieldNames.MOBILE_LOCAL_NUMBER]: Joi.string().required(),
        [AddressFieldNames.COUNTRY]: Joi.object().keys({objectID: Joi.string().required(),}).required(),
        [AddressFieldNames.CITY]: Joi.object().keys({name: Joi.string().required(),}).required(),
        [AddressFieldNames.ADDRESS]: Joi.string().min(10).required(),
    };

    if (options?.withEmailField) {
        fieldKeys[AddressFieldNames.EMAIL] = Joi.string().regex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            .required();
    }

    if (options?.withTitle) {
        fieldKeys[AddressFieldNames.TITLE] = Joi.string().required();
    }

    return Joi.object().keys(fieldKeys).options({ allowUnknown: true, abortEarly: false });
}


const validateFields = (fields, options) => {
    const fieldsErrors = {}

    const result = getValidationSchema(options).validate(fields);
    if (result.error && result.error.details) {
        const details = result.error.details;
        details.forEach((item) => {
            fieldsErrors[item.path[0]] = item;
        });
    }

    if (!fieldsErrors[AddressFieldNames.MOBILE_LOCAL_NUMBER] && !fieldsErrors[AddressFieldNames.MOBILE_COUNTY_CODE] &&
        !isValidMobile(getFullNumber(fields[AddressFieldNames.MOBILE_COUNTY_CODE], fields[AddressFieldNames.MOBILE_LOCAL_NUMBER]))) {
        fieldsErrors[AddressFieldNames.MOBILE_LOCAL_NUMBER] = 'err'
    }

    return fieldsErrors
}
export {validateFields as validateFields}


const saveAddresses = async (buyerInfo, shippingInfo) => {

    const addLabelToAddress = (info) => {
        const label = info[AddressFieldNames.FIRST_NAME] + " ," +
            info[AddressFieldNames.LAST_NAME] + " " +
            info[AddressFieldNames.COUNTRY]?.title + " ," +
            info[AddressFieldNames.CITY]?.name + " ," +
            info[AddressFieldNames.ADDRESS];

        return {...info, label: label.trim()}
    }

    // save buyerInfo if doesn't exist
    const _buyerInfo = addLabelToAddress(buyerInfo)
    const buyersList = await getBuyerAddressesList().catch(e => console.warn(e)) || []
    if (!buyersList.find(address => address.label === _buyerInfo.label)) {
        buyersList.push(_buyerInfo)
        await saveBuyerAddressesList(buyersList).catch(e => console.warn(e))
    }

    // save shippingInfo if doesn't exist
    const _shippingInfo = addLabelToAddress(shippingInfo)
    const shippingList = await getShippingAddressesList().catch(e => console.warn(e)) || []
    if (!shippingList.find(address => address.label === _shippingInfo.label)) {
        shippingList.push(_shippingInfo)
        await saveShippingAddressesList(shippingList).catch(e => console.warn(e))
    }
}
export {saveAddresses as saveAddresses}


const getAddonsTotalPrice = (addonsList = []) => {
    let addonsPrice = 0;
    addonsList.forEach(addon => {
        addonsPrice += (addon.isSelected? addon.cost_value : 0)
    })
    return addonsPrice
}
export {getAddonsTotalPrice as getAddonsTotalPrice}


const getCheckoutItemsPrice = (checkoutItems = []) => {
    let total = 0;
    checkoutItems.forEach(item => {
        let _price = 0;
        _price = item.variant?.price || item.product.price
        _price = _price * item.quantity
        total = total + _price
    })
    return total
}
export {getCheckoutItemsPrice as getCheckoutItemsPrice}


export function calculateCouponDiscount(checkoutItemsPrice, coupon, keepFloat = false) {

    if (coupon
        && (coupon.type === CouponTypeConst.PERCENTAGE_DISCOUNT || coupon.type === CouponTypeConst.PERCENTAGE_DISCOUNT_WITH_FREE_DELIVERY)) {
        const result = parseFloat((checkoutItemsPrice * coupon.discount) / 100);
        return keepFloat? result : result.toFixed()
    }
    if (coupon
        && (coupon.type === CouponTypeConst.FIXED_AMOUNT || coupon.type === CouponTypeConst.FIXED_AMOUNT_WITH_FREE_DELIVERY)) {
        return Math.min(coupon.discount, checkoutItemsPrice)
    }
    return 0
}


export function formatMobileFieldsFromAddress(addressFields) {

    if (addressFields && addressFields[AddressFieldNames.MOBILE_NUMBER]) {
        let mobileNumber = addressFields[AddressFieldNames.MOBILE_NUMBER];
        if (mobileNumber.startsWith('05')) {
            mobileNumber = mobileNumber.replace('05', '9725')
        } else if (mobileNumber.startsWith('00')) {
            mobileNumber = mobileNumber.substring(2);
        }

        if (!mobileNumber.startsWith('+')) {
            mobileNumber = "+" + mobileNumber;
        }

        const [countryCode, localNumber] = separateMobileNumberCountryCode(mobileNumber, true);

        addressFields[AddressFieldNames.MOBILE_COUNTY_CODE] = countryCode + "";
        addressFields[AddressFieldNames.MOBILE_LOCAL_NUMBER] = localNumber + "";
        return omit(addressFields, AddressFieldNames.MOBILE_NUMBER);
    }

    return addressFields;
}


export function mapRemoteAddressObjAsFields(userAddress) {

    const cities = store.getState().persistentData.citiesList || [];
    const countries = store.getState().persistentData.countriesList || [];

    return formatMobileFieldsFromAddress({
        [AddressFieldNames.TITLE]: userAddress?.title,
        [AddressFieldNames.FIRST_NAME]: userAddress?.first_name,
        [AddressFieldNames.LAST_NAME]: userAddress?.last_name,
        [AddressFieldNames.MOBILE_NUMBER]: userAddress?.phone,
        [AddressFieldNames.ADDRESS]: userAddress?.street,
        [AddressFieldNames.CITY]: cities?.find(city => city?.objectID === userAddress?.city_id),
        [AddressFieldNames.COUNTRY]: countries?.find(country => country?.objectID === userAddress?.country),
    });
}


export function formatPrice(value, currencyCode) {

    const str = (!value && value !== 0)?
        '--.--':
        parseFloat(value);

    return str + ' ' + currencyCode;
}


