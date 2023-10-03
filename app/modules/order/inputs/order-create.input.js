//@flow
import HrcInput from "deelzat/types/Input";
import AddressFieldNames from "v2modules/checkout/constants/address-field-names.const";
import CouponTypeConst from "v2modules/checkout/constants/coupon-type.const";
import {calculateCouponDiscount} from "v2modules/checkout/others/checkout.utils";
import DeviceInfo from "react-native-device-info";
import {getFullNumber} from "modules/main/others/phone.utils";
import {getTotalCartItemsPrice} from "modules/cart/others/cart.utils";

export default class OrderCreateInput extends HrcInput {

    // payload
    checkoutId: string;
    totalPrice: number;
    paymentIntent: string;
    paymentMethod: string;


    constructor() {
        super();
    }

    payload() {
        const payload = {};

        payload.checkout_id = this.checkoutId;
        payload.total_price = this.totalPrice;
        payload.payment_intent_id = this.paymentIntent;
        payload.cod = payload.payment_intent_id === '0000' // is cash no delivery

        return payload;
    }
}
