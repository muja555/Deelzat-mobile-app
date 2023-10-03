import Http from "deelzat/http";
import ChatNotifyUserInput from "modules/chat/inputs/chat-notify-user.input";
import ChatSendMessageInput from "modules/chat/inputs/chat-send-message.input";
import EndPoints from "environments/end-points";

const ChatApi = {};

ChatApi.notifyUser = async (inputs: ChatNotifyUserInput) => {
    return Http.post('/app/messaging/notify', inputs.payload());
}


ChatApi.sendMessage = async (inputs: ChatSendMessageInput) => {

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs.payload())
    };

    return fetch(`${EndPoints.FIREBASE_FUNCTIONS}/messageSender`, requestOptions);
}


export default ChatApi;
