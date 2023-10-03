import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        width: '100%',
        flexDirection: 'row',
    },
    tabLabelFocused: {
        color: Colors.MAIN_COLOR,
        fontSize: 14,
        ...Font.Bold
    },
    tabView: {
        flex: 1,
        height: '100%',
        backgroundColor: Colors.N_GREY_4,
        justifyContent: "center",
        alignItems: "center",
        overflow: 'hidden'
    },
    tabLabel: {
        fontSize: 14,
        color: Colors.N_BLACK_50,
    },
    tabStripe: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 3,
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.1)
    }
};

const profileTabsStyle = StyleSheet.create(style);
export { profileTabsStyle as profileTabsStyle };
