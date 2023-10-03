import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        paddingHorizontal: 34,
        justifyContent: 'center',
        alignItems: 'center',

    },
    inner: {
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    planetStyle: {
      marginEnd: "-40%",
    },
    comingSoon: {
        fontSize: 36,
        color: Colors.MAIN_COLOR,
        marginStart: "-40%",
        ...Font.Bold
    }
};

const otherBoardStyle = StyleSheet.create(style);
export { otherBoardStyle as otherBoardStyle };
