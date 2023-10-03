import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        alignItems: "center",
    },
    saleView: {
        position: 'absolute',
        right: 0,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 12,
        minWidth: 51,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.alpha(Colors.LIGHT_ORANGE, 1)
    },
    saleText: {
        fontSize: 10,
        color: '#fff',
        ...Font.Bold
    },
    image: {
        borderWidth: 1,
        borderColor: Colors.alpha('#000', 0.2),
        borderRadius: 13,
    },
    seeAll: {
        textAlign: 'center',
        color: Colors.LINK,
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    discount: {
        position: 'absolute',
        bottom: 8,
        left: 8,
        fontSize: 16,
        color: Colors.alpha(Colors.N_GREY, 0.9),
        ...Font.Bold
    },
    orangeCorner: {
        position: 'absolute',
        bottom: 4,
        left: 0,
    },
    productsContainer: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row'
    }
};
const newlyDiscountsStyle = StyleSheet.create(style);
export { newlyDiscountsStyle as newlyDiscountsStyle };
