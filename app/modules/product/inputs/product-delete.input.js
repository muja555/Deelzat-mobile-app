//@flow
import HrcInput from "deelzat/types/Input";
export default class ProductDeleteInput extends HrcInput{

    // route
    shopId: string;
    productId: string;


    constructor() {
        super();
    }

}
