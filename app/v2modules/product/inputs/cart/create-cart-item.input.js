//@flow
import HrcInput from "deelzat/types/Input";

export default class CreateCartItemInput extends HrcInput{

    // route
    cartId: string;


    // payload
    product_id: number;
    variant_id: string;
    quantity: number;

    constructor() {
        super();

        this._payload = [
            'product_id',
            'variant_id',
            'quantity',
        ];
    }
}
