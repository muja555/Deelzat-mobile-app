//@flow
import HrcInput from "deelzat/types/Input";
import Keys from 'environments/keys';
export default class LoginWithNativeFacebookInput extends HrcInput{

    //payload
    subjectToken: string;
    subjectTokenType: string;
    scope: string;
    userProfile

    constructor() {
        super();

        this.scope = 'openid profile email offline_access read:current_user';
        this.subjectTokenType = 'http://auth0.com/oauth/token-type/facebook-info-session-access-token';
        this.audience = 'https://' + Keys.Auth0.domain + '/api/v2/';
        this._payload = [
            'subjectToken',
            'subjectTokenType',
            'scope',
            'audience',
            'userProfile'
        ];
    }

}
