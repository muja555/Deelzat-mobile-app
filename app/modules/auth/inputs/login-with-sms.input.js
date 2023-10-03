//@flow
import HrcInput from "deelzat/types/Input";
import Keys from "environments/keys";

export default class LoginWithSmsInput extends HrcInput{


    //payload
    phoneNumber: string;
    code: string;
    scope: string;
    audience: string;


    constructor() {
        super();
        this.scope = 'openid profile email offline_access';
        this.audience = 'https://' + Keys.Auth0.domain + '/api/v2/';
        this._payload = [
            'phoneNumber',
            'code',
            'scope',
            'audience',
        ];
    }

}
