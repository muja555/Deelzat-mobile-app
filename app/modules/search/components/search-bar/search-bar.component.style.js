import { StyleSheet } from "react-native";
import {Font, LayoutStyle} from "deelzat/style";

const style = {
    searchSection: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#D1D1D1',
        borderRadius: 16,
    },
    searchSectionCollapsed: {
        borderWidth: 0,
        borderRadius: 0,
    },
    searchIcon: {
        marginStart: 2,
        width: 40,
        marginBottom: 2,
    },
    searchIconInner: {
        width: 30,
        height: 20,
    },
    input: {
        fontSize: 12,
        paddingLeft: 20,
        paddingRight: 10,
        flex: 1,
        paddingVertical: -5,
        ...Font.Regular,
    },
    clearTextButton: {
        position: 'absolute',
        right: 0,
        alignSelf: 'center'
    },
    inputContainer: {
        flex: 1
    }
};

const searchBarStyle = StyleSheet.create(style);
export { searchBarStyle as searchBarStyle };
