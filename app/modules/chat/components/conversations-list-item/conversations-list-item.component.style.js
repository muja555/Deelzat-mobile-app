import {Dimensions, StyleSheet} from "react-native";
import { Colors, Font } from "deelzat/style";

const screenWidth = Dimensions.get('window').width
const style = {
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        height: 50,
        paddingHorizontal: 24,
    },
    textContainer: {
        height: '100%',
        width: '100%',
        flex: 1,
        marginStart: 24,
        paddingTop: 1,
        alignItems: 'flex-start'
    },
    lastMessageText: {
        textAlign: 'left',
        color: Colors.N_BLACK,
        opacity: 0.8,
        fontSize: 12,
    },
    senderImage: {
        height: 50,
        width: 50,
        borderRadius: 50,
        overflow: 'hidden'
    },
    senderName: {
        maxWidth: '80%',
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
        marginTop: -5,
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
        marginTop: -10,
        justifyContent: 'center',
        alignSelf: 'center',
    },
    unreadCount: {
        fontSize: 10,
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    deleteActionFeedback: {
        position: 'absolute',
        width: screenWidth,
        height: '100%',
        backgroundColor: Colors.ERROR_COLOR,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    feedbackText: {
        fontSize: 14,
        color: 'white',
        marginStart: 5,
    },
    spaceEnd: {
        width: 24,
        height: '100%',
        backgroundColor: 'blue',
    },
    swipeIndicator: {
        borderTopStartRadius: 10,
        borderBottomStartRadius: 10,
        width: 5,
        backgroundColor: Colors.GREY,
        height: '80%',
        alignSelf: 'center',
        marginEnd: -24,
        marginStart: 10,
    }
}

const conversationsListStyle = StyleSheet.create(style);
export { conversationsListStyle as conversationsListStyle };
