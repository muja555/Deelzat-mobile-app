import { Platform, StyleSheet } from 'react-native';
import { Colors, Font } from 'deelzat/style';

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollView: {
        flexGrow: 1,
    },
    separator: {
        width: '100%',
        height: 4,
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.1),
    },
    orderInfoTxt: {
        textAlign: 'left',
        color: Colors.N_BLACK,
        fontSize: 18,
        ...Font.Bold
    },
    rowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    rowTitle: {
        fontSize: 14,
        color: Colors.TEXT_GREY
    },
    rowValue: {
        fontSize: 14,
        color: Colors.BLACK
    },
    totalDiscount: {
        fontSize: 18,
        color: Colors.MAIN_COLOR,
        ...Font.Bold,
    },
    totalPriceDiscount: {
        fontSize: 18,
        color: Colors.MAIN_COLOR,
        ...Font.Bold,
    },
    total: {
        fontSize: 18,
        color: Colors.N_BLACK_50
    },
    totalPrice: {
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    signInText: {
        fontSize: 14,
        color: Colors.N_BLACK_50,
    },
    signInTextBtn: {
        fontSize: 14,
        color: Colors.LINK_2,
        ...Font.Bold
    },
    inputStyle: {
        fontWeight: '200'
    },
    inputAreaStyle: {
        paddingTop: Platform.OS === 'android'? 10: 0
    },
    inputAreaHeight: {
        height: 97
    }
};

const checkoutPaymentStepContainerStyle = StyleSheet.create(style);
export { checkoutPaymentStepContainerStyle as checkoutPaymentStepContainerStyle };
