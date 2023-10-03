import { StyleSheet } from "react-native";
import {Colors, Font, LayoutStyle, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyTextBigAR: {
        fontSize: 30,
        color: 'black',
        ...Font.Bold
    },
    emptyText: {
        fontSize: 14,
        textAlign: 'center',
        color: Colors.N_BLACK_50,
        ...Spacing.HorizontalPadding,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    recentTitle: {
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold,
    },
    clearBtn: {
        minWidth: 89,
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearText: {
        fontSize: 14,
        color: 'white',
    },
    recentRow: {
        flexDirection: 'row',
        backgroundColor: Colors.Gray200,
        borderRadius: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 44,
        paddingStart: 20,
        paddingEnd: 20,
        marginBottom: 8,
    },
    recentText: {
        maxWidth: '80%',
        fontSize: 14,
        color: 'black',
        ...Font.Bold
    },
    recentView: {

    }
};

const recentSearchStyle = StyleSheet.create(style);
export { recentSearchStyle as recentSearchStyle };
