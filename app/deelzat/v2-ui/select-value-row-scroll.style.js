import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        flexDirection: 'row',
    },
    button: {
        height: 36,
        marginEnd: 12,
        borderRadius: 8,
        paddingHorizontal: 18,
        paddingVertical: 9,
        backgroundColor: Colors.N_GREY,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonSelected: {
        backgroundColor: Colors.MAIN_COLOR,
        fontSize: 14,
    },
    label: {
        color: Colors.N_BLACK
    },
    labelSelected: {
        color: '#fff'
    }
}

const selectValueRowScrollStyle = StyleSheet.create(style);
export { selectValueRowScrollStyle as selectValueRowScrollStyle };
