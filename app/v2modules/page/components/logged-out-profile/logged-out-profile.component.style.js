import { StyleSheet } from "react-native";
import {Colors, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        ...Spacing.HorizontalPadding
    },
    signInBtn: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.MAIN_COLOR
    },
    signInText: {
        fontSize: 14,
        color: '#fff'
    }
};

const loggedOutProfileStyle = StyleSheet.create(style);
export { loggedOutProfileStyle as loggedOutProfileStyle };
