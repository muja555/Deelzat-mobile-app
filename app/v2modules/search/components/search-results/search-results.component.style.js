import { StyleSheet } from "react-native";
import {Colors, Font, LayoutStyle} from "deelzat/style";

const style = {
    container: {
        flex: 1
    },
    resultsTabs: {
        flexDirection: 'row',
    },
    resultTabText: {
        fontSize: 14,
        color: Colors.N_BLACK_50,
    },
    resultTabTextSelected: {
        color: Colors.MAIN_COLOR,
    },
    tabSpace: {
        width: 20
    },
    resultRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    resultImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
    },
    resultTitle: {
        flex: 1,
        textAlign: 'left'
    },
    _emptyTextBigAR: {
        fontSize: 30,
        color: 'black',
        ...Font.Bold
    },
    _emptyText: {
        fontSize: 14,
        color: Colors.N_BLACK_50,
        textAlign: 'center',
    },
    emptyResults: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyResultsIcon: {

    },
    showMore: {
        marginTop: 5,
        marginBottom: 20,
        paddingStart: 5,
        fontSize: 16,
        color: Colors.LINK,
    }

};

const searchResultsStyle = StyleSheet.create(style);
export { searchResultsStyle as searchResultsStyle };
