import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        ...Spacing.HorizontalPadding
    },
    optionContainer: {
        height: 76,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row",
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 24,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
        borderWidth: 1
    },
    optionTitle: {
        textAlign: 'left',
        fontSize: 14,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        ...Font.Bold
    },
    optionDesc: {
        textAlign: 'left',
        fontSize: 12,
        color: Colors.alpha(Colors.N_BLACK, 0.3),
    },
};

const myMenuStyle = StyleSheet.create(style);
export { myMenuStyle as myMenuStyle };
