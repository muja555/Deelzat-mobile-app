import { StyleSheet } from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: Colors.SOMEHOW_WHITE,
        paddingHorizontal: 42,
        paddingVertical: 31,
    },
};

const reportModalStyle = StyleSheet.create(style);
export { reportModalStyle as reportModalStyle };
