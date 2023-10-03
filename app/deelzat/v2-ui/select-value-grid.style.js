import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    item: {
        height: 38,
        paddingHorizontal: 10,
        paddingVertical: 9,
        backgroundColor: '#fff',
        marginEnd: 14,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
    itemSelected: {
        backgroundColor: Colors.MAIN_COLOR,
        borderColor: Colors.MAIN_COLOR
    },
    itemText: {
        color: Colors.N_BLACK_50
    },
    itemTextSelected: {
        color: '#fff'
    }
}

const selectValueGridStyle = StyleSheet.create(style);
export { selectValueGridStyle as multiValueGridStyle };
