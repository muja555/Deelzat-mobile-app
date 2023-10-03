import {Platform, StyleSheet} from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        height: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    shoppingIcon: {
        marginBottom: 30,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.BLACK,
        fontSize: 14,
        marginBottom: 20,
        maxWidth: '80%',
    },
    icon: {
        width: 240,
        height: 240,
    }
}

const emptyConversationsStyle = StyleSheet.create(style);
export { emptyConversationsStyle as emptyConversationsStyle };
