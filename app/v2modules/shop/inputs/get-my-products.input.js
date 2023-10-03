//@flow
import HrcInput from "deelzat/types/Input";
export default class GetMyProductsInput extends HrcInput{

    // route
    shopId: string;

    //query
    page: number;
    page_size: number;


    constructor() {
        super();
        this._query = [
            'page',
            'page_size'
        ];
    }

}
