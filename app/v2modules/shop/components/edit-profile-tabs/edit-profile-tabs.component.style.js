import { StyleSheet } from "react-native";
import { Colors, Font } from 'deelzat/style';
import { isRTL } from 'dz-I19n';

const style = {
    container: {
        height: 42,
        width: '100%',
        flexDirection: 'row',
    },
    tabButtons: {
        width: '100%',
        flexDirection: 'row',
    },
    tabBtn: {
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBtnFocused: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    tabBtnText: {
        color: Colors.N_BLACK_50,
        fontSize: 14,
    },
    tabBtnTextFocused: {
        color: Colors.MAIN_COLOR,
        fontSize: 14,
        ...Font.Bold
    },
    startBottomCorner: {
        position: 'absolute',
        left: 5,
        bottom: -1,
        transform: [{scaleX: isRTL()? 1.5: -1.5}, { scaleY: 1.1}],
    },
    endBottomCorner: {
        position: 'absolute',
        right: 5,
        bottom: -1,
        transform: [{scaleX: isRTL()? -1.5: 1.5}, {scaleY: 1.1}],
    }
};

const editProfileTabsStyle = StyleSheet.create(style);
export { editProfileTabsStyle as editProfileTabsStyle };
