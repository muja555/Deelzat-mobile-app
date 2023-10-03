//@flow
import HrcInput from "deelzat/types/Input";

export default class EditWishlistItemInput extends HrcInput{

    // route
    wishlistId: string;
    wishlistItemId: string;


    // payload
    product_id: number;

    constructor() {
        super();

        this._payload = [
            'product_id',
        ];
    }
}
