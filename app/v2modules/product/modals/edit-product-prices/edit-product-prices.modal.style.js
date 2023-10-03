import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        maxHeight: '80%',
        backgroundColor: Colors.N_GREY_4,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingBottom: 34,
    },
    closeView: {
        marginBottom: 'auto',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
    },
    image: {
        height: 105,
        width: 96,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.alpha('#000', 0.2)
    },
    productTitle: {
        fontSize: 14,
        color: Colors.N_BLACK,
        textAlign: 'left',
        ...Font.Bold
    },
    originalPriceTitle: {
        fontSize: 14,
        color: Colors.alpha(Colors.N_BLACK, 0.5),
        ...Font.Bold
    },
    originalPrice: {
        fontSize: 14,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    priceOriginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    toCancelDiscountTxt: {
        fontSize: 12,
        color: 'black',
    },
    cancelDiscountBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
        borderRadius: 20,
        backgroundColor: Colors.alpha('#fff', 0.5),
    },
    mappingLoader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorView: {
        flexDirection: 'row'
    },
    colorCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'red',
        marginEnd: 4,
    },
    colorTitle: {
        flex: 1,
        textAlign: 'left',
    },
    colorErrorMessage: {
        color: Colors.ERROR_COLOR
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    productPriceQuantityControlView: {
        flex: 1,
    },
    controlRowHeadView: {
        padding: 8,
        marginEnd: 12,
        minWidth: 40,
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.GREY,
    },
    buttonView: {
        backgroundColor: Colors.N_GREY_4,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1000,
        paddingStart: 24,
        paddingEnd: 24,
    },
    priceModes: {
        fontSize: 18,
    },
    priceModesLabel: {
        fontSize: 10
    }
};

const editProductPricesModalStyle = StyleSheet.create(style);
export { editProductPricesModalStyle as editProductPricesModalStyle };
