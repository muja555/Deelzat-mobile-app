import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        height: '100%',
        backgroundColor: 'white'
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 10,
    },
    searchContainer: {
        marginHorizontal: 24,
        height: 35,
        maxHeight: 38,
        minHeight: 38,
        backgroundColor: Colors.N_GREY,
        borderColor: Colors.N_GREY,
        marginBottom: 10
    },
    searchInput: {
        fontSize: 12,
        //backgroundColor: Colors.N_GREY
    },
    containerTabs: {
        backgroundColor: 'white',
    },
    loader: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        height: '100%',
        zIndex: 2000,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchResultsContainer: {
        position: 'absolute',
        left: 0,
        width: '100%',
        height: '100%',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
    },
    headerTitle: {
        flex: 1,
        fontSize: 18,
        color: Colors.N_BLACK,
        textAlign: 'center',
        ...Font.Bold
    },
    endPlaceholder: {
        width: 36,
        height: 36
    },
}

const inboxContainerStyle = StyleSheet.create(style);
export { inboxContainerStyle as inboxContainerStyle };
