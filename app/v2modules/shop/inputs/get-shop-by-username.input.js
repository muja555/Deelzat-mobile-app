//@flow
import HrcInput from "deelzat/types/Input";
export default class GetShopByUsernameInput extends HrcInput{

    //query
    username

    constructor() {
        super();
        this._query = [
            'username',
        ];
    }

}
