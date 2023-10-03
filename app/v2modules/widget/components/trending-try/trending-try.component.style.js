import { StyleSheet } from "react-native";
import {Font, Colors, Spacing} from "deelzat/style";

const style = {
    container: {
    },
    title: {
        textAlign: 'center',
        fontSize: 24,
        color: Colors.N_BLACK,
        ...Font.Bold,
    },
    innerContainer: {
        flexGrow: 1,
        flexDirection: 'row',
    },
    listSeparator: {
        width: 20,
    },
    loadingView: {
        marginBottom: 8,
        marginTop: 3,
    }
};

const trendingTryStyle = StyleSheet.create(style);
export { trendingTryStyle as trendingTryStyle };
