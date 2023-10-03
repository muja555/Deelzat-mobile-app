//@flow
import HrcInput from "deelzat/types/Input";

export default class GetWishlistItemsInput extends HrcInput{

    // route
    wishlistId: string;

    constructor() {
        super();
    }
}
