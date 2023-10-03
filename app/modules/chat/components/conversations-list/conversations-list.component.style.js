import {StyleSheet} from "react-native";

const style = {
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    list: {
        paddingTop: 35,
        backgroundColor: 'white',
        paddingBottom: 40,
        flexGrow: 1
    },
    separator: {
        height: 24,
    },
    loader: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyListContainer: {
        height: '100%',
        width: '100%',
    },
    supportContainerEmptyList: {
        height: 90,
        marginTop: 25,
        marginBottom: 20,
    },
    supportContainer: {
        height: 90,
        marginBottom: 20,
    }

}

const conversationsListStyle = StyleSheet.create(style);
export { conversationsListStyle as conversationsListStyle };
