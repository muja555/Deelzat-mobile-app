//@flow
import HrcInput from "deelzat/types/Input";
import Keys from "environments/keys";

export default class LoginWithEmailInput extends HrcInput{

    //payload
    email: string;
    code: string;
    scope: string;
    audience: string;


    constructor() {
        super();
        this.scope = 'openid profile email offline_access';
        this.audience = 'https://' + Keys.Auth0.domain + '/api/v2/';
        this._payload = [
            'email',
            'code',
            'scope',
            'audience'
        ];
    }

}
