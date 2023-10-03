//@flow
import HrcInput from "deelzat/types/Input";
export default class GetFeedProductsInput extends HrcInput{

    page: number;
    deviceId: string;

    constructor() {
        super();
        this._query = [
            'deviceId',
            'page',
        ];
    }

}
