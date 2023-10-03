//@flow
import HrcInput from "deelzat/types/Input";


export default class PasswordLessWithEmailInput extends HrcInput{

    //payload
    email: string;
    send: string;
    scope: string;

    constructor() {

        super();

        this.send = 'code';
        this.scope = 'openid profile email offline_access';

        this._payload = [
            'email',
            'send',
            'scope',
            'audience'
        ];


    }

}
