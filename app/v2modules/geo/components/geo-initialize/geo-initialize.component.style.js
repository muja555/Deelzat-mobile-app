import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        height: 427,
        width: 280,
        borderRadius: 12,
        backgroundColor: Colors.N_GREY_4
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
    },
    content: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingHorizontal: 25,
        paddingVertical: 22,
    },
    title: {
        textAlign: 'center',
        color: Colors.N_BLACK,
        fontSize: 22,
        ...Font.Bold
    },
    titleOrange: {
        color: Colors.LIGHT_ORANGE,
        fontSize: 22,
        ...Font.Bold
    },
    titleMain: {
        color: Colors.MAIN_COLOR,
        fontSize: 22,
        ...Font.Bold
    },
    subTitle: {
        color: Colors.N_BLACK,
        fontSize: 18,
        ...Font.Bold
    },
    flagsView: {
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    flag: {
        width: 50,
        height: 35,
    },
    flagTitle: {
        color: Colors.N_BLACK,
        fontSize: 18,
        ...Font.Bold
    }
};

const geoInitializeStyle = StyleSheet.create(style);
export { geoInitializeStyle as geoInitializeStyle };
