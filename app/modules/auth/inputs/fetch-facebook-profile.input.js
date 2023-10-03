//@flow
import HrcInput from "deelzat/types/Input";
export default class FetchFacebookProfileInput extends HrcInput{

    userId: string;
    accessToken: string;

    constructor() {
        super();
    }

}
