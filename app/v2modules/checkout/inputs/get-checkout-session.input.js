//@flow
import HrcInput from "deelzat/types/Input";
import AddressFieldNames from "v2modules/checkout/constants/address-field-names.const";
import DeviceInfo from "react-native-device-info";
import {getFullNumber} from "modules/main/others/phone.utils";

export default class GetCheckoutSessionInput extends HrcInput {

    // payload
    buyerInfo: {};
    shippingInfo: {};
    specialRequest: string;
    checkoutItems: [];
    cartId;
    addonsList: [];
    coupon;
    addressId;

    constructor() {
        super();
    }


    payload() {

        const getFullMobile = (fields) => {
            return getFullNumber(fields[AddressFieldNames.MOBILE_COUNTY_CODE],
                fields[AddressFieldNames.MOBILE_LOCAL_NUMBER]);
        }

        const mapProducts = (checkoutItems) => {
            return checkoutItems.map(item => {
                const itemMap = {
                    product_id: item.productID + "",
                    price: parseFloat(item.variant?.price || item.product.price),
                    quantity: item.quantity
                };

                if (item.variantID)
                    itemMap.variant_id = item.variantID + ""

                return itemMap
            })
        }

        const payload = {};

        if (this.coupon) {
            payload.coupon_code = this.coupon.code;
        }

        if (this.specialRequest) {
            payload.special_request = this.specialRequest;
        }

        payload.device_id = DeviceInfo.getUniqueId();
        payload.addons = [];
        (this.addonsList || []).forEach(addon => {
            if (addon.isSelected) {
                const fieldsData = addon.required_fields.map(field => {
                    return {
                        code: field.text,
                        value: field.value
                    }
                })
                payload.addons.push({
                    id: addon.objectID + "",
                    fields_data: fieldsData
                })
            }
        });

        payload.customer = {};
        payload.customer.first_name = this.buyerInfo[AddressFieldNames.FIRST_NAME]
        payload.customer.last_name = this.buyerInfo[AddressFieldNames.LAST_NAME]
        payload.customer.phone = getFullMobile(this.buyerInfo);
        payload.customer.email = this.buyerInfo[AddressFieldNames.EMAIL];


        payload.billing_details = {};
        payload.billing_details.country = this.buyerInfo[AddressFieldNames.COUNTRY]?.objectID;
        payload.billing_details.city = this.buyerInfo[AddressFieldNames.CITY]?.objectID || this.buyerInfo[AddressFieldNames.CITY]?.name;
        payload.billing_details.street = this.buyerInfo[AddressFieldNames.ADDRESS];


        if (this.shippingInfo) {
            payload.delivery_details = {};
            payload.delivery_details.first_name = this.shippingInfo[AddressFieldNames.FIRST_NAME];
            payload.delivery_details.last_name = this.shippingInfo[AddressFieldNames.LAST_NAME];
            payload.delivery_details.country = this.shippingInfo[AddressFieldNames.COUNTRY]?.objectID;
            payload.delivery_details.city_id = this.shippingInfo[AddressFieldNames.CITY].objectID;
            payload.delivery_details.street = this.shippingInfo[AddressFieldNames.ADDRESS];
            payload.delivery_details.phone = getFullMobile(this.shippingInfo);
        }
        else {
            payload.address_id = this.addressId;
        }


        if (this.cartId) {
            payload.cart_id = this.cartId;
        }
        else if (this.checkoutItems) {

            const products = mapProducts(this.checkoutItems);

            if (products.length === 1) {
                payload.product = products[0];
            }
            else {
                payload.products = products;
            }
        }

        return payload;
    }

}
