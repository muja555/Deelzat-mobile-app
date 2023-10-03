//@flow
import HrcInput from "deelzat/types/Input";
import Keys from "environments/keys";

export default class LoginWithSocialInput extends HrcInput{

    //payload
    connection: string;
    scope: string;
    audience: string;
    prompt: string;


    constructor() {
        super();
        this.scope = 'openid profile email offline_access read:current_user';
        this.audience = 'https://' + Keys.Auth0.domain + '/api/v2/';
        this.prompt = 'select_account';
        this._payload = [
            'connection',
            'code',
            'scope',
            'audience',
            'prompt'
        ];
    }

}
