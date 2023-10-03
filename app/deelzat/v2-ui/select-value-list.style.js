import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    rowView: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
    optionLabel: {
        flex: 1,
        textAlign: 'left',
        fontSize: 14,
        color: Colors.N_BLACK,
    },
    radioView: {
        width: 24,
        height: 24,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
        justifyContent: 'center',
        alignItems: 'center',
    }
}


const selectValueListStyle = StyleSheet.create(style);
export { selectValueListStyle as selectListStyle };
