import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
    },
    title: {
        flex: 1,
        fontSize: 18,
        color: Colors.N_BLACK,
        textAlign: 'center',
        ...Font.Bold
    },
    endPlaceholder: {
        width: 36,
        height: 36
    },
    separator: {
        marginTop: 12,
        marginBottom: 12,
        width: '100%',
        height: 4,
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
    itemNumTxt: {
        color: Colors.N_BLACK,
        fontSize: 12,
        ...Font.Bold
    },
    infoView: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: Colors.N_GREY,
        borderRadius: 12,
        padding: 12,
    },
    productImage: {
        width: 92,
        height: 100,
        borderRadius: 12,
    },
    productName: {
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        fontSize: 12,
        ...Font.Bold
    },
    statusUnderNameText: {
        color: Colors.N_BLACK_50
    },
    price: {
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    tallVerticalLine: {
        height: 52,
        width: 2,
        backgroundColor: Colors.MAIN_COLOR,
    },
    unfilledCircle: {
        width: 24,
        height: 24,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: Colors.MAIN_COLOR
    },
    statusStepTxt: {
        fontSize: 12,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    statusStepCancelled: {
        fontSize: 12,
        color: Colors.ERROR_COLOR_2,
        ...Font.Bold
    },
    statusStepDateTxt: {
        fontSize: 12,
        color: Colors.N_BLACK_50,
    },
    cancelBtn: {
        marginStart: '21%',
        marginEnd: '21%',
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    isCancelledBtn: {
        color: Colors.ERROR_COLOR_2,
        borderColor: Colors.ERROR_COLOR_2,
        backgroundColor: Colors.ERROR_COLOR_2
    },
    cancelText: {
        fontSize: 14,
        color: Colors.MAIN_COLOR,
    },
    isCancelledText: {
        color: 'white',
        fontSize: 14,
        ...Font.Bold
    },
    sizeView: {
        height: 33,
        width: 30,
        backgroundColor: Colors.MAIN_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    sizeLabel: {
        fontSize: 12,
        color: 'white',
        ...Font.Bold
    },
    colorView: {
        width: 24,
        height: 24,
        borderRadius: 13,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        elevation: 2,
        shadowRadius: 1.0,
    },
    variantView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 20,
    },
    itemQuantity: {
        fontSize: 12,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        ...Font.Bold
    },
    variantLabel: {
        textAlign: 'left',
        fontSize: 11,
        color: Colors.N_BLACK_50
    },
    priceText: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    itemPrice: {
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    itemName: {
        textAlign: 'left',
        fontSize: 12,
        marginTop: 2,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        ...Font.Bold,
    },
    detailTitle: {
        fontSize: 12,
        color: Colors.N_BLACK_50,
        ...Font.Bold
    },
    detailText: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    detailTextBold: {
        fontSize: 12,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    footerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingTop: 15,
    },
    detailsSeparator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
    specialRequests: {
        fontSize: 12,
        color: Colors.LIGHT_ORANGE,
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
    freeDeliveryCouponText: {
        fontSize: 16,
        color: Colors.MAIN_COLOR,
        ...Font.Bold,
    },
    freeDeliveryPriceAmount: {
        fontSize: 16,
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
};

const orderDetailsContainerStyle = StyleSheet.create(style);
export { orderDetailsContainerStyle as orderDetailsContainerStyle };
