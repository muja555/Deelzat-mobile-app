import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding,
    },
    loadingView: {
        flex: 1,
    },
    summaryTitle: {
        textAlign: 'left',
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold,
    },
    subTotal: {
        flex: 1,
        textAlign: 'left',
        fontSize: 14,
        color: Colors.N_BLACK_50
    },
    price: {
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    btnStyle: {
        borderRadius: 12
    },
    btnText: {
        color: '#fff',
        fontSize: 14,
    },
    space46: {
        height: 46
    },
    emptyTextBig: {
        color: Colors.N_BLACK,
        fontSize: 24,
        ...Font.Bold
    },
    emptyTextSmall: {
        textAlign: 'center',
        fontSize: 13,
        color: Colors.N_BLACK_50,
    },
};

const bagContainerStyle = StyleSheet.create(style);
export { bagContainerStyle as bagContainerStyle };
