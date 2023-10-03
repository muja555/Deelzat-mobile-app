import { StyleSheet } from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        padding: 16
    },
    controlRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    productPriceQuantityControlView: {
        flex: 1
    },
    controlRowHeadView: {
        padding: 8,
        backgroundColor: '#fff',
        marginEnd: 12,
        minWidth: 40,
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.GREY,
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
    }
};

const productEditPricesStyle = StyleSheet.create(style);
export { productEditPricesStyle as productEditPricesStyle };
