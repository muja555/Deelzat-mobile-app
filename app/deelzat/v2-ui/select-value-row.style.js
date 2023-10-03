import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flexDirection: 'row',
        padding: 6,
        borderRadius: 12,
        backgroundColor: Colors.N_GREY,
        justifyContent: 'space-between',
    },
    buttonEnd: {
        marginEnd: 1
    },
    buttonStart: {
        marginStart: 1
    },
    button: {
        height: 36,
        paddingHorizontal: '3%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selected: {
        backgroundColor: '#fff'
    },
    text: {
        fontSize: 14,
        color: Colors.N_BLACK
    }

}

const selectValueRowStyle = StyleSheet.create(style);
export { selectValueRowStyle as multiValueRowStyle };
