import {StyleSheet, Dimensions} from "react-native";
import {Colors, Font} from "deelzat/style"

const screenHeight = Dimensions.get('window').height;

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingBottom: 16,
        borderRadius: 8
    },
    contents: {
        flex: 1,
        paddingHorizontal: 24,
    },
    header: {
        paddingStart: 16,
        paddingTop: 20
    },
    logo: {
        height: 50,
        width: '100%'
    },
    title: {
        width: '100%',
        textAlign: 'center',
        fontSize: 24,
        ...Font.Bold
    },
    socialBtnWrapper: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    socialBtn: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.Gray400,
        marginHorizontal: 4
    },
    socialBtnFacebook: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderColor: Colors.Gray400,
        marginHorizontal: 4,
        backgroundColor: '#1877F2',
    },
    socialBtnApple: {
        flex: 1,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderColor: Colors.Gray400,
        marginHorizontal: 4,
        backgroundColor: 'black'
    },
    socialIcon: {
        height: 30,
        width: '100%',
    },
    orLine: {
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: Colors.BORDER_GREY,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orLineTextWrapper: {
        backgroundColor: "#fff",
        width: 80,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -10,
    },
    input: {
        height: 48,
        borderColor: Colors.BORDER_GREY,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16

    },
    inputLabel: {
        color: Colors.BROWN_GREY,
        textAlign: 'left',
    },
    footer: {
        padding: 16,
        alignItems: 'center',
    },
    appVersion: {
        color: Colors.GREY
    },
    loadingIndicator: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockPasswordlesTimer: {
        marginTop: 10,
        color: Colors.ERROR_COLOR_2,
        fontSize: 13,
        textAlign: 'center',
    },
    signinForTerms1: {
        color: Colors.DARKER_GREY,
        fontSize: 12,
    },
    signinForTerms2: {
        color: Colors.LINK,
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    legalTermsText: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    overlayLoaderView: {
        zIndex: 1000,
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'absolute',
        width: '100%',
        height: '100%',
        paddingTop: '100%',
        backgroundColor: Colors.alpha('#000', 0.6),
    },
};

const authStyle = StyleSheet.create(style);
export { authStyle as authStyle };
