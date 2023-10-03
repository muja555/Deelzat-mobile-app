import {StyleSheet} from "react-native";
import { Colors, Font } from "deelzat/style";

const style = {
    allContainer: {
        borderBottomColor: Colors.LIGHT_GREY,
        borderBottomWidth: 2,
    },
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 50,
        paddingHorizontal: 24,
        paddingTop: 10,
    },
    textContainer: {
        height: '100%',
        width: '100%',
        flex: 1,
        marginStart: 24,
        paddingTop: 1,
    },
    lastMessageText: {
        textAlign: 'left',
        color: Colors.N_BLACK,
        opacity: 0.8,
        flex: 1,
        fontSize: 12,
    },
    senderImage: {
        height: 50,
        width: 50,
        borderRadius: 50,
        overflow: 'hidden'
    },
    senderName: {
        textAlign: 'left',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        color: Colors.N_BLACK,
        fontSize: 14,
        ...Font.Bold
    },
    messageTime: {
        opacity: 0.5,
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    senderNameContainer: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    messageTextAndUnreadCountContainer: {
        marginTop: 8,
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    lastMessageTextUnread: {
        fontSize: 14,
        color: Colors.MAIN_COLOR,
        ...Font.Bold
    },
    unreadCountContainer: {
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 20,
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 2,
        height: 20,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    unreadCount: {
        fontSize: 10,
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    spaceEnd: {
        width: 24,
        height: '100%',
        backgroundColor: 'blue',
    },
    onlineDot: {
        alignSelf: 'center',
        marginStart: 8,
        backgroundColor: Colors.SUPER_GREEN,
        height: 8,
        width: 8,
        borderRadius: 8,
        overflow: 'hidden',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'flex-start'
    }
}

const conversationSupportStyle = StyleSheet.create(style);
export { conversationSupportStyle as conversationSupportStyle };
