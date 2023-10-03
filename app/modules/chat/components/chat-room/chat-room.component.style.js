import {Dimensions, StyleSheet, Platform} from "react-native";
import { Colors, Font } from "deelzat/style";

const screenWidth = Dimensions.get('window').width;
const inputMarginEnd = screenWidth - 30 - 24
const screenHeight = Dimensions.get('window').height;

const style = {
    container: {
        backgroundColor: 'white',
        flex: 1,
        marginHorizontal: 1,
        overflow: 'hidden',
    },
    inputToolbarContainerOuter: {
        marginHorizontal: 24,
        overflow: 'hidden',
        height: 50,
        borderRadius: 12,
        marginTop: -25,
    },
    inputToolbarContainerOuterWithImages: {
        marginTop: -110,
    },
    inputToolbarContainerOuterCanSend: {
        marginEnd: 35,
    },
    inputToolbarContainer: {
        position: 'absolute',
        borderTopColor: 'transparent',
        backgroundColor: 'transparent',
        borderRadius: 12,
        height: 50,
    },
    inputToolbarContainerColor: {
        backgroundColor: Colors.N_GREY,
        flex: 1,
        borderRadius: 12,
        height: 50,
    },
    inputText: {
        paddingTop: Platform.OS !== 'android'? 15: 0,
        backgroundColor: 'transparent',
        paddingStart: 10,
        fontSize: 14,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        fontWeight: '400',
        ...Font.Regular
    },
    inputTextWithMarginEnd: {
        marginEnd: inputMarginEnd
    },
    sendBtn: {
        position: 'absolute',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        right: 0,
        bottom: Platform.OS === 'ios'? 20 :  10,
    },
    sendBtnDisabled: {
        opacity: 0.3
    },
    messageTextLeft: {
        color: 'white',
        fontSize: 14,

        textAlign: 'left',
        paddingTop: 5,
        ...Font.Bold,
    },
    messageTextRight: {
        color: 'black',
        fontSize: 14,

        textAlign: 'left',
        marginTop: 16,
        ...Font.Bold,
    },
    bubbleWrapperLeft: {
        backgroundColor: Colors.MAIN_COLOR_70,
    },
    bubbleWrapperRight: {
        backgroundColor: Colors.N_GREY,
    },
    messageTimeLeft: {
        color: 'white',
    },
    messageTimeRight: {
        color: Colors.BROWN_GREY
    },
    cameraIcon: {
        position: 'absolute',
        backgroundColor: Colors.N_GREY,
        top: Platform.OS === 'ios'? -15 : -8
    },
    singleImageContainer: {
        width: 230,
        margin: 5,
        marginBottom: 8
    },
    activityIndicator: {
        width: '100%',
        paddingTop: screenHeight/2.5,
        height: screenHeight
    },
    chatImagesContainer: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: 'white',
    },
    actionsContainer: {
        alignItems: 'center',
        paddingBottom: Platform.OS === 'ios'? 15 : 0,
        paddingStart: 15,
    },
    linkLeft: {
        color: 'white'
    },
    linkRight: {
        color: 'blue'
    },
    mediaView: {
        flexDirection: 'row',
        position: 'absolute',
        left: 25,
        height: 62,
        borderRadius: 12,
        backgroundColor: Colors.N_GREY,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12
    },
    mediaViewBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    mediaViewCircle: {
        height: 36,
        width: 36,
        borderRadius: 36,
        backgroundColor: Colors.MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mediaViewText: {
        width: 70,
        fontSize: 12,
        color: Colors.MAIN_COLOR,
        textAlign: 'center'
    },
    outsideMediaView: {
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    sendFailureTxt: {
        color: Colors.ERROR_COLOR_2,
        fontSize: 10,
        ...Font.Bold
    },
    lastMsgStatus: {
        flexDirection: 'row',
        fontSize: 10,
        width: 200,
        marginTop: 5,
    },
    seenText: {
        fontSize: 10,
        color: Colors.DARK_GREY
    },
    seenView: {
        flexDirection: 'row',
        alignItems: 'center'
    }
}

const chatRoomStyle = StyleSheet.create(style);
export { chatRoomStyle as chatRoomStyle };
