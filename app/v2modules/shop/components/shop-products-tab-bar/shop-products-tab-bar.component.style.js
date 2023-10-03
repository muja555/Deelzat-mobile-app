import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        height: 50,
        flexDirection: "row",
    },
    btn: {
        flex: 0.5,
        justifyContent: "center",
        alignItems: "center",
        borderBottomWidth: 3,
        borderColor: Colors.MAIN_COLOR
    },
    btnInactive: {
        borderColor: Colors.alpha(Colors.N_BLACK, 0.2),
    },
    label: {
        fontSize: 12,
        color: Colors.MAIN_COLOR,
        ...Font.Bold
    },
    labelInactive: {
        color: Colors.N_BLACK_50,
        ...Font.Regular
    }
};

const shopProductsTabBarStyle = StyleSheet.create(style);
export { shopProductsTabBarStyle as shopProductsTabBarStyle };
