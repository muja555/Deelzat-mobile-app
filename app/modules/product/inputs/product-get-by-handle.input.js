//@flow
import HrcInput from "deelzat/types/Input";
export default class ProductGetByHandleInput extends HrcInput{

    // route
    shopId: string;
    handle: string;


    constructor() {
        super();
    }

}
