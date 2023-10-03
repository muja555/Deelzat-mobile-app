import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flex: 1
    },
    contentContainerStyle: {
        paddingTop: 17,
    },
    orderNumGrey: {
        fontSize: 12,
        color: Colors.N_BLACK_50,
    },
    orderNumBlack: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    confirmed: {
        fontSize: 12,
        color: Colors.MAIN_COLOR,
        textAlign: 'left',
        ...Font.Bold
    },
    rejected: {
        fontSize: 12,
        color: Colors.BLACK_RED,
        textAlign: 'left',
        ...Font.Bold
    },
    itemDate: {
        fontSize: 12,
        color: Colors.N_BLACK_50
    },
    itemInfo: {
        flexDirection: 'row',
        paddingVertical: 13,
        paddingStart: 14,
        paddingEnd: 19,
        backgroundColor: Colors.alpha('#fff', 0.7),
        borderRadius: 12,
    },
    itemInfoView: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingStart: 11,
    },
    itemName: {
        flexWrap: 'wrap',
        textAlign: 'left',
        fontSize: 12,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        ...Font.Bold,
    },
    itemVariant: {
        marginTop: 5,
        textAlign: 'left',
        fontSize: 12,
        color: Colors.N_BLACK_50,
        ...Font.Bold,
    },
    itemPrice: {
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    listSeparator: {
        marginTop: 30,
        marginBottom: 20,
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.1),
        height: 1,
    },
    noOrderText: {
        fontSize: 24,
        color: Colors.MAIN_COLOR,
        textAlign: 'center',
    },
    itemImage: {
        width: 92,
        height: 100,
        borderRadius: 12,
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
        height: 33,
    },
    itemQuantity: {
        fontSize: 12,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        ...Font.Bold
    },
};

const salesTabConfirmedStyle = StyleSheet.create(style);
export { salesTabConfirmedStyle as salesTabConfirmedStyle };
