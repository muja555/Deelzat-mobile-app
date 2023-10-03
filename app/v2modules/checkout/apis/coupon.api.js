import Http from "deelzat/http";
import CouponAddInput from "v2modules/checkout/inputs/coupon-add.input";

const CouponApi = {};

CouponApi.applyCoupon = async (inputs: CouponAddInput) => {
    return Http.get(  `/app/coupons/${inputs.coupon}?device_id=${inputs.deviceId}`, {})
};


CouponApi.getCoupons = async () => {
    return Http.get(  `/app/users/coupons`, {})
};


export default CouponApi;
