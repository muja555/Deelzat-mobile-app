//@flow
import HrcInput from "deelzat/types/Input";
export default class ChatNotifyUserInput extends HrcInput{

    // payload
    to_user_id: string;
    from_user_id: string;
    sender_name: string;
    avatar: string;
    message: string;

    constructor() {
        super();
        this._payload = [
            'to_user_id',
            'from_user_id',
            'sender_name',
            'avatar',
            'message',
        ];
    }

}
