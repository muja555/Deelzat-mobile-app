//@flow
import HrcInput from "deelzat/types/Input";
export default class ProductClaimInput extends HrcInput{


    //payload
    claimable_info: string;
    reason: string;


    constructor() {
        super();
        this._payload = [
            'claimable_info',
            'reason',
        ];
    }

}
