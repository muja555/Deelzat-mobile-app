import { StyleSheet } from "react-native";
import {Colors, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        margin: 0,
    },
    content: {
        backgroundColor: 'white',
        flex: 1,
        ...Spacing.HorizontalPadding
    },
    closeBtnContainer: {
        width: '100%',
        flexDirection: 'row',
        position: 'absolute',
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.GREY
    },
    actionBtn: {
        height: 48,
        borderRadius: 12
    },
    bigTitle: {
        color: Colors.N_BLACK,
        fontSize: 18
    },
    orderNumGrey: {
        fontSize: 12,
        color: Colors.N_BLACK_50,
    },
    orderNumBlack: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    message: {
        fontSize: 14,
        color: Colors.N_BLACK_50,
        textAlign: 'center'
    },
    messageDark: {
        color: Colors.N_BLACK
    },
    loadingView: {
        flex: 1,
    },
    textLink: {
        textDecorationLine: 'underline',
        color: Colors.CERULEAN_BLUE,
        fontSize: 14,
    },
};

const createOrderModalStyle = StyleSheet.create(style);
export { createOrderModalStyle as createOrderModalStyle };
