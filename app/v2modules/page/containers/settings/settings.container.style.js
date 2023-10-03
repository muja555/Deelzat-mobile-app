import { StyleSheet } from "react-native";
import {Colors, Font, LayoutStyle, Spacing} from "deelzat/style";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding
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
    signOutBtn: {
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 12,
        borderColor:  Colors.BLACK_RED
    },
    signOutText: {
        fontSize: 14,
        color: Colors.BLACK_RED
    }
};

const settingsContainerStyle = StyleSheet.create(style);
export { settingsContainerStyle as settingsContainerStyle };
