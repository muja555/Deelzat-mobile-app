import { StyleSheet } from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        overflow:'hidden',
    },
    radio: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.N_BLACK,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedMark: {
        width: 6,
        height: 6,
        borderRadius: 9,
        backgroundColor: Colors.MAIN_COLOR
    },
    rowView: {
        flexDirection: 'row',
        minHeight: 50,
        alignItems: 'center',
    },
    optionLabel: {
        flex: 1,
        textAlign: 'left',
        fontSize: 14,
        marginEnd: 2,
        color: Colors.N_BLACK,
    },
    addonCost: {
        color: Colors.N_BLACK_50,
        fontSize: 14,
        marginEnd: 31
    },
    fieldLabel: {
        fontSize: 12,
        color: Colors.N_BLACK
    }
};

const addonListItemStyle = StyleSheet.create(style);
export { addonListItemStyle as addonListItemStyle };
