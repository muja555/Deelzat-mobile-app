import { StyleSheet } from "react-native";
import {Spacing, Colors} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        alignItems: "center",
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionsView: {
        flexDirection: 'row',
    },
    btnStyle: {
        borderRadius: 12,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.2)
    },
    countBubble: {
        position: 'absolute',
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 20,
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 2,
        height: 20,
        right: -8,
        top: -8,
    },
    countBubbleText: {
        fontSize: 10,
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
};

const searchBarStyle = StyleSheet.create(style);
export { searchBarStyle as searchBarStyle };
