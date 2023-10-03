import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    reason: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: Colors.GREY,
    },
    reasonText: {
        textAlign: 'left',
        fontSize: 16
    },
    titleView: {
        padding: 20
    },
    titleText: {
        textAlign: 'left',
        fontSize: 18,
        ...Font.Bold
    },
    actionSheetButton: {
        height: 41,
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
};

const reportStyle = StyleSheet.create(style);
export { reportStyle as reportStyle };
