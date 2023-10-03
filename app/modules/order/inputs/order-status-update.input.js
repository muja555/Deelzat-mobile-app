//@flow
import HrcInput from "deelzat/types/Input";
import OrderStatusConst from "modules/order/constants/order-status.const";
export default class OrderStatusUpdateInput extends HrcInput{

    // route
    shopId: number;
    orderId: number;

    //payload
    status: string;
    pickUpDay: {};
    pickUpTime: [];

    //query

    constructor() {
        super();
        this._payload = [
            'status',
        ];
    }


    payload() {
        const payload = super.payload();
        if (payload.status === OrderStatusConst.CONFIRMED) {
            payload.pickup = {
                date: this.pickUpDay.value + ' day',
                time: this.pickUpTime.map((item) => item.value).join(','),
            }
        }
        return payload;
    }

}
