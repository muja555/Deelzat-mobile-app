import { StyleSheet } from "react-native";

const style = {
    container: {
        backgroundColor: 'black',
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalBody: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
        padding: 16,
        height: '75%'
    },
    list: {
        flex: 1
    },
    titleView: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 16,
        marginBottom: 32
    },
    title: {
        fontSize: 16
    },
    btnView: {
        paddingTop: 16,
        marginHorizontal: 24,
    }
};

const productSelectCategoryModalStyle = StyleSheet.create(style);
export { productSelectCategoryModalStyle as productSelectCategoryModalStyle };
