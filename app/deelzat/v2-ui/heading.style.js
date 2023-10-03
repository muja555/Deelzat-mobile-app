import { StyleSheet } from "react-native";
import {Colors, Font} from "./../style";

const _style = {
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        flex: 1,
        textAlign: 'left',
        fontSize: 20,
        ...Font.Bold,
    },
    text_H1: {
    },
    text_H2: {
        fontSize: 18,
    },
    text_H3: {
        fontSize: 16,
    },
    linkText: {
        color: Colors.MAIN_COLOR
    }
};

const style = StyleSheet.create(_style);
export { style as style };
