import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
    },
    selectListItemIcon: {
        width: 20,
        marginEnd: 8,
        marginStart: 2,
    },
    selectListItemTitle: {
        flexShrink: 1,
        fontSize: 14,
        color: Colors.BLACK,
        ...Font.Bold
    },
    containerDisabled: {
        opacity: 0.3
    }
}

const selectableListButtonStyle = StyleSheet.create(style);
export { selectableListButtonStyle as selectableListButtonStyle };
