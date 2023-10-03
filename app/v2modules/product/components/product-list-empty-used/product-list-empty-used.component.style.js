import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        marginTop: "-30%",
        justifyContent: 'center',
        alignItems: 'center',
        ...Spacing.HorizontalPadding
    },
    bigTitleAR: {
        fontSize: 30,
        textAlign: 'left',
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    subTitle: {
        fontSize: 14,
        color: Colors.N_BLACK,
    }

};

const productListEmptyUsedStyle = StyleSheet.create(style);
export { productListEmptyUsedStyle as productListEmptyUsedStyle };
