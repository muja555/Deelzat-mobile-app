import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 24,
        paddingBottom: 34,
        ...Spacing.HorizontalPadding
    },
    closeView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    detailsTxt: {
        width: '100%',
        textAlign: 'left',
        fontSize: 14,
        color: Colors.N_BLACK_50,
        ...Font.Bold
    },
    image: {
        height: 125,
        width: 114,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.alpha('#000', 0.2)
    },
    productTitle: {
        fontSize: 18,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        textAlign: 'left',
        ...Font.Bold
    },
    price: {
        fontSize: 18,
        color: Colors.N_BLACK_DARK,
        ...Font.Bold,
    },
    compareAtPrice: {
        color: Colors.N_BLACK,
        fontSize: 12,
        textDecorationLine: 'line-through',
        marginBottom: -5,
    },
    priceDiscount: {
        color: Colors.BLACK_RED,
    },
    soldOutText: {
        height: 40,
        textAlign: 'center',
        fontSize: 18,
        color: Colors.BLACK_RED,
        ...Font.Bold,
    },
    selectedSize: {
        borderColor: Colors.alpha(Colors.N_BLACK, 0.3),
        backgroundColor: Colors.LIGHT_ORANGE,
    },
    colorOptions: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionsViewTopMargin: {
        marginTop: -25,
    },
    variantLabel: {
        color: Colors.N_BLACK_50,
        fontSize: 12,
        textAlign: 'left',
    },
    actionBtn: {
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: Colors.MAIN_COLOR
    },
    actionText: {
        color: '#fff',
        fontSize: 14,
    },
};

const productOptionsModalStyle = StyleSheet.create(style);
export { productOptionsModalStyle as productOptionsModalStyle };
