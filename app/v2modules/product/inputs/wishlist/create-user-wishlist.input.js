//@flow
import HrcInput from "deelzat/types/Input";
export default class CreateUserWishlistInput extends HrcInput{

    country_code: string;
    items: [];

    constructor() {
        super();
        this._payload = [
            'country_code',
            'items'
        ];
    }
}
