import { StyleSheet } from "react-native";
import {Font} from "deelzat/style";

const style = {
    container: {
        flex: 1
    },
    gif: {
        width: '150%',
        marginLeft: '-25%',
        height: '50%'
    },
    text: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        ...Font.Bold
    },
    stayTuned: {
        fontSize: 36,
        color: '#fff',
        textAlign: 'center',
        ...Font.Bold
    },
    textsView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingBottom: '10%',
    }
};

const savedTabBoardsStyle = StyleSheet.create(style);
export { savedTabBoardsStyle as savedTabBoardsStyle };
