import { StyleSheet } from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: Colors.SOMEHOW_WHITE,
        paddingHorizontal: 42,
        paddingVertical: 31,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },

    message: {
        fontSize: 16,
    },

    btn: {
        width: '100%'
    }
};

const actionSheetStyle = StyleSheet.create(style);
export { actionSheetStyle as actionSheetStyle };
