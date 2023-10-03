import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: '#fff',
        padding: 26,
        paddingStart: 26,
        paddingEnd: 26,
        paddingBottom: 10,
        justifyContent: 'center'
    },
    title: {
        marginTop: 5,
        fontSize: 16,
        alignSelf: 'center',
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    couponError: {
        paddingStart: 16,
        color: Colors.BLACK_RED,
        alignSelf: 'flex-start',
        textAlign: 'left',
        width: '100%',
        fontSize: 14,
    },
    inputError: {
        borderColor: Colors.BLACK_RED,
        paddingBottom: -5,
    },
    applyBtnText: {
        color: '#fff',
        fontSize: 14,
    },
    applyBtn: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: Colors.MAIN_COLOR
    },
    cancelBtn: {
        height: 48,
        borderRadius: 12,
    }
};

const addCouponModalStyle = StyleSheet.create(style);
export { addCouponModalStyle as addCouponModalStyle };
