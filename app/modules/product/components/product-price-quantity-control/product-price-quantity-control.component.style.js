import { StyleSheet } from "react-native";
import {Colors, Font, LayoutStyle} from "deelzat/style"

const style = {
    container: {
        flex: 1,
    },
    row: {
        marginHorizontal: -4,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    control: {
        flex: 1,
        paddingHorizontal: 4
    },
    textFieldPrepend: {
        color: Colors.DARK_GREY,
        fontSize: 12,
        ...Font.Bold
    },
    hasError: {
        borderColor: Colors.ERROR_COLOR,
        paddingVertical: -5,
        fontWeight: '200',
    },
    textFieldDirection: {
        borderRadius: 8,
        paddingVertical: -5,
        fontWeight: '200',
        backgroundColor: '#fff'
    }
};

const productPriceQuantityControlStyle = StyleSheet.create(style);
export { productPriceQuantityControlStyle as productPriceQuantityControlStyle };
