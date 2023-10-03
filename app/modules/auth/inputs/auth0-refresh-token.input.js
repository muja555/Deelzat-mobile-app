//@flow
import HrcInput from "deelzat/types/Input";

export default class Auth0RefreshTokenInput extends HrcInput{

    //payload
    refreshToken: number;
    scope: string;

    constructor() {
        super();
        this.scope = 'openid profile email offline_access';
        this._payload = [
            'refreshToken',
            'scope'
        ];
    }

}
