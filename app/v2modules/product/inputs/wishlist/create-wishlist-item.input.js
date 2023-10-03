//@flow
import HrcInput from "deelzat/types/Input";

export default class CreateWishlistItemInput extends HrcInput{

    // route
    wishlistId: string;


    // payload
    product_id: number;

    constructor() {
        super();

        this._payload = [
            'product_id'
        ];
    }
}
