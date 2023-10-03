//@flow
import HrcInput from "deelzat/types/Input";
export default class ProductsDetailsGetInput extends HrcInput{

    // route
    productIDs: string; // string contains product ids separated by comma

    constructor() {
        super();
    }

}

