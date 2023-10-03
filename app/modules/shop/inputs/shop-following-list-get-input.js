//@flow
import HrcInput from "deelzat/types/Input";
export default class ShopFollowingListGetInput extends HrcInput{

    //query
    page: number;
    page_size: number;

    // route
    shop_id: number;

    constructor() {
        super();

        this._query = [
            'page',
            'page_size'
        ];
    }

}
