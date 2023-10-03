//@flow
import HrcInput from "deelzat/types/Input";

export default class DeleteWishlistItemInput extends HrcInput{

    // route
    wishlistId: string;
    wishlistItemId: string;

    constructor() {
        super();
    }
}
