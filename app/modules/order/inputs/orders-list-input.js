//@flow
import HrcInput from "deelzat/types/Input";
export default class OrdersListInput extends HrcInput{

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
