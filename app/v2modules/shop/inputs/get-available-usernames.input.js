//@flow
import HrcInput from "deelzat/types/Input";
export default class GetAvailableUsernamesInput extends HrcInput{

    //query
    name: string;

    constructor() {
        super();
        this._query = [
            'name',
        ];
    }

}
