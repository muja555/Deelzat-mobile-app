import {StyleSheet, Dimensions} from "react-native";
import {Colors, Font, LayoutStyle} from "deelzat/style";

const SCREEN_WIDTH = Dimensions.get('window').width;
const style = {
    container: {
        flex: 1,
        backgroundColor: Colors.MAIN_COLOR,
    },
    component: {
        zIndex: 1,
        width: '102%',
        marginStart:  '-1%',
        height: '100%',
        position: 'absolute',
        overflow: 'hidden',
        borderTopStartRadius: 25,
        borderTopEndRadius: 25,
        top: 22,
        paddingBottom: 22,
    },
    shadowView: {
        width: SCREEN_WIDTH - 2,
        alignSelf: 'center',
        height: 50,
        marginTop: 10,
    },
    header: {
        flexDirection: 'row',
        paddingTop: 20,
        paddingBottom: 5,
        minHeight: 60,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    otherUserName: {
        flex: 1,
        flexWrap: 'wrap',
        fontSize: 18,
        textAlign: 'left',
        color: 'white',
        marginStart: 12,
        ...Font.Bold
    },
    otherUserImage: {
        height: 50,
        width: 50,
        borderRadius: 50,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.LIGHT_GREY,
    },
    backButton: {
        borderRadius: 8,
        width: 36,
        height: 36,
        marginEnd: 16,
        borderColor: '#fff'
    },
    avatarButton: {
        width: '80%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    yellowNote: {
        position: 'absolute',
        zIndex: 99999,
        top: 20,
        left: '4%',
        width: '92%',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.GREY,
        backgroundColor: Colors.YELLOW_2,
        borderWidth: 1,
        borderRadius: 12,
        padding: 5,
    },
    yellowNoteText: {
        fontSize: 11,
        textAlign: 'center',
        lineHeight: 20,
    },
    supportLink: {
        color: 'blue',
        textDecorationLine: 'underline',
        alignItems: 'flex-end',
    },
    supportLinkButton: {
        flexWrap : 'wrap',
        backgroundColor: 'red',
        alignItems: 'flex-end',
    }
}

const chatRoomContainerStyle = StyleSheet.create(style);
export { chatRoomContainerStyle as chatRoomContainerStyle };
