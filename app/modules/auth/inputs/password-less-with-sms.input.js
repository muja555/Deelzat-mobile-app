//@flow
import HrcInput from "deelzat/types/Input";

export default class PasswordLessWithSmsInput extends HrcInput{

    //payload
    phoneNumber: string;
    send: string;
    scope: string;


    constructor() {

        super();

        this.send = 'code';
        this.scope = 'openid profile email offline_access';

        this._payload = [
            'phoneNumber',
            'send',
            'scope',
        ];


    }

}
