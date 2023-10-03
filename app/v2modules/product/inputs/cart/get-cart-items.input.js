//@flow
import HrcInput from "deelzat/types/Input";

export default class GetCartItemsInput extends HrcInput{

    // route
    cartId: string;

    constructor() {
        super();
    }
}
