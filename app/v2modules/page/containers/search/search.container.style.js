import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputView: {
        height: 48,
        backgroundColor: Colors.SOMEHOW_WHITE,
        borderRadius: 12,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 11,
    },
    inputText: {
        flex: 1,
        fontSize: 14,
        paddingStart: 5,
        color: 'black',
        ...Font.Regular,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 8,
    },
    clearTextButton: {
        position: 'absolute',
        right: 8,
        width: 24,
        height: 24,
        backgroundColor: Colors.alpha('#fff', 0.5),
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const searchContainerStyle = StyleSheet.create(style);
export { searchContainerStyle as searchContainerStyle };
