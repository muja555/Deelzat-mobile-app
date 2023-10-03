import { StyleSheet } from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    content: {
        zIndex: 20,
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    backgroundImage: {
        marginStart: '-6.6%',
        width: '107%',
        height: '105%',
    },
    foregroundSvg: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 10,
    },
    searchBtn: {
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.5),
        borderWidth: 0,
    },
    searchView: {
        position: 'absolute',
        width: '100%',
    },
    actionSheetButton: {
        height: 41,
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLoader: {
        height: 70,
    },
};

const homeContainerStyle = StyleSheet.create(style);
export { homeContainerStyle as homeContainerStyle };
