import { StyleSheet } from "react-native";
import {Colors, Font, Spacing, LayoutStyle} from "deelzat/style";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
    },
    title: {
        flex: 1,
        fontSize: 18,
        color: Colors.N_BLACK,
        textAlign: 'center',
        ...Font.Bold
    },
    endPlaceholder: {
        width: 36,
        height: 36
    },
    tabButtons: {
        width: '100%',
        flexDirection: 'row',
    },
    tabBtn: {
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
        fontSize: 18,
        ...Font.Bold
    },
    pageContainer: {
        flex: 1,
        overflow: 'hidden',
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

const salesContainerStyle = StyleSheet.create(style);
export { salesContainerStyle as salesContainerStyle };
