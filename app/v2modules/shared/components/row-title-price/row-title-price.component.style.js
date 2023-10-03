import { StyleSheet } from "react-native";
import {Colors} from "deelzat/style";

const style = {
    rowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    rowTitle: {
        fontSize: 14,
        color: Colors.TEXT_GREY
    },
    rowValue: {
        fontSize: 14,
        color: Colors.BLACK
    },
};

const rowTitlePriceStyle = StyleSheet.create(style);
export { rowTitlePriceStyle as rowTitlePriceStyle };
