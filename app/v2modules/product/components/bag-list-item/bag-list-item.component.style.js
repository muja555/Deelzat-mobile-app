import { StyleSheet } from "react-native";
import {Colors, Font, LayoutStyle} from "deelzat/style";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        backgroundColor: Colors.Gray000,
        borderRadius: 12,
        flexDirection: 'row',
        paddingTop: 10,
        paddingBottom: 18,
        paddingStart: 12,
        paddingEnd: 10,
    },
    image: {
        height: 100,
        width: 92,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.alpha('#000', 0.2),
        alignSelf: 'center',
    },
    closeBtn: {
        width: 24,
        height: 24,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.N_BLACK_50
    },
    price: {
        color: Colors.N_BLACK,
        fontSize: 18,
        ...Font.Bold
    },
    oldPrice: {

    },
    newPrice: {

    },
    title: {
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        fontSize: 12,
        ...Font.Bold
    },
    variantLabel: {
        textAlign: 'left',
        fontSize: 11,
        color: Colors.N_BLACK_50
    },
    missingLabel: {
        textAlign: 'left',
        fontSize: 10,
        color: Colors.BLACK_RED
    },
    moveToSaved: {
        color: Colors.MAIN_COLOR,
        fontSize: 14,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 80,
        height: 35,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 9,
        marginEnd: -15,
    },
    quantityText: {
        textAlign: 'center',
        flex: 1,
        fontSize: 14,
        color: Colors.LIGHT_ORANGE,
        ...Font.Bold
    },
    variantNotAvailable: {
        color: Colors.ERROR_COLOR_2,
        fontSize: 11,
        flex: 1,
        marginBottom: 4,
        textAlign: 'left',
    },
};

const bagListItemStyle = StyleSheet.create(style);
export { bagListItemStyle as bagListItemStyle };
