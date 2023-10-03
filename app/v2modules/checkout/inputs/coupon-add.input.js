//@flow
import HrcInput from "deelzat/types/Input";

export default class CouponAddInput extends HrcInput {

    // route
    coupon: string;
    deviceId: string;

    constructor() {
        super();
    }
}
