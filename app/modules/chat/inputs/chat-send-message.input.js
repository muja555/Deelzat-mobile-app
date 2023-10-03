//@flow
import HrcInput from "deelzat/types/Input";
export default class ChatSendMessageInput extends HrcInput{

    //payload
    sender_user: {};
    other_user: {};
    room_name: string;
    is_support_conv: boolean;
    message: {};

    constructor() {
        super();
        this._payload = [
            'sender_user',
            'other_user',
            'room_name',
            'message',
            'is_support_conv'
        ];
    }

}
