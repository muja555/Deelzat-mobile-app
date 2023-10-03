import { StyleSheet } from "react-native";
import { Colors, Font } from 'deelzat/style';

const style = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    content: {
        backgroundColor: Colors.N_GREY,
        width: 288,
        height: 362,
        borderRadius: 16,
        overflow: 'hidden'
    },
    background: {
        width: '100%',
        height: '100%',
    },
    content2: {
        position: 'absolute',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        paddingBottom: 19,
    },
    header: {
        paddingTop: 11,
        position: 'absolute',
        width: '100%',
        height: 20,
        zIndex: 10000,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingEnd: 11,
    },
    welcomeBack: {
        marginTop: 11,
        fontSize: 24,
        color: Colors.MAIN_COLOR,
        ...Font.Bold
    },
    midText: {
        fontSize: 16,
        color: Colors.MAIN_COLOR,
        textAlign: 'center',
        ...Font.Bold
    },
    copiedCodeToast: {
        position: 'absolute',
        width: '100%',
        zIndex: 1000,
        top: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    copyCodeView: {
        paddingVertical: 2,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: Colors.MAIN_COLOR_70
    },
    copiedCodeText: {
        fontSize: 11,
        color: 'white',
        ...Font.Bold
    },
    couponTouchBtn: {
        flexShrink: 1,
        width: 240,
        height: 120
    },
    checkCouponsBtn: {
        height: 48,
        width: 218,
    }
};

const couponInappMessageModalStyle = StyleSheet.create(style);
export { couponInappMessageModalStyle as couponInappMessageModalStyle };
