//@flow
import HrcInput from "deelzat/types/Input";

export default class DeleteCartItemInput extends HrcInput{

    // route
    cartId: string;
    cartItemId: string;

    constructor() {
        super();
    }
}
