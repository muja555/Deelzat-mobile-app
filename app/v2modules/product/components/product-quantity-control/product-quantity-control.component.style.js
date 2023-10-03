import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    value: {
        fontSize: 18,
        color: Colors.ORANGE_PINK,
        height: 30,
        minWidth: 40,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        paddingHorizontal: 4,
        ...Font.Bold
    },
    btn: {
        backgroundColor: Colors.Gray200,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    btnText: {
        color: Colors.Gray400,
        fontSize: 20,
        ...Font.Bold
    },
    sectionTitle: {
        fontSize: 14,
        color: Colors.alpha(Colors.N_BLACK, 0.8)
    }
};

const productQuantityControlStyle = StyleSheet.create(style);
export { productQuantityControlStyle as productQuantityControlStyle };
