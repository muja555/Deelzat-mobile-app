import { StyleSheet } from "react-native";
import { Colors, Font } from 'deelzat/style';

const CARD_HEIGHT = 160;
const CARD_HEIGHT_SCALED_DOWN = 122;
const style = {
    container: {
        flex: 1
    },
    couponView: {
        height: CARD_HEIGHT,
        flex: 1,
        borderRadius: 16,
        backgroundColor: '',
    },
    couponViewShadow: {
        elevation: 3,
        shadowColor: "#393939",
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    couponView_scaledDown: {
        height: CARD_HEIGHT_SCALED_DOWN,
    },
    background: {
        width: '100%',
        height: CARD_HEIGHT,
        borderRadius: 16,
    },
    background_scaledDown: {
        height: CARD_HEIGHT_SCALED_DOWN,
    },
    contents: {
        position: 'absolute',
        width: '100%',
        height: CARD_HEIGHT,
        borderRadius: 16
    },
    contents_scaledDown: {
        height: CARD_HEIGHT_SCALED_DOWN,
    },
    topInfo: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        paddingTop: 12,
        paddingStart: 11,
        justifyContent: 'space-between',
        paddingEnd: 11
    },
    topInfo_scaledDown: {
        paddingEnd: 7,
    },
    topInfoNoCoupon: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 12
    },
    couponTitle: {
        color: Colors.ORANGE_PINK,
        fontSize: 16,
        textAlign: 'center',
        zIndex: 1,
        ...Font.Bold
    },
    couponTitle_scaledDown: {
        fontSize: 14,
    },
    couponTitleShadow: {
        position: 'absolute',
        top: 2,
        color: 'white',
        zIndex: 0,
    },
    copyBtnContents: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    copyButton: {
        flexDirection: 'row',
        height: 24,
        minWidth: 140,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 7,
        paddingEnd: 6,
        paddingStart: 6,
        paddingTop: 2,
        paddingBottom: 2,
    },
    copyButton_scaledDown: {
        height: 20,
        minWidth: 80,
    },
    couponCode: {
        fontSize: 16,
        color: Colors.N_BLACK,
        marginTop: -2,
        ...Font.Bold
    },
    couponCode_scaledDown: {
        fontSize: 12,
    },
    midText: {
        flex: 1,
        color: Colors.N_BLACK,
        fontSize: 12,
    },
    midText_scaledDown: {
        fontSize: 10,
    },
    midTextNoCoupon: {
        color: Colors.N_BLACK,
        fontSize: 12,
        textAlign: 'center',
        justifyContent: 'center',
        marginTop: -10,
    },
    bottomView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingStart: 12,
        paddingEnd: 12,
        height: 40,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        backgroundColor: 'white',
    },
    bottomView_scaledDown: {
      height: 30
    },
    expireDate: {
        fontSize: 12,
        color: Colors.N_BLACK
    },
    expireDate_scaledDown: {
        fontSize: 10,
        color: Colors.N_BLACK
    },
};

const couponsListItemStyle = StyleSheet.create(style);
export { couponsListItemStyle as couponsListItemStyle };
