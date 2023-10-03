import {StyleSheet} from "react-native";
import {Font} from "deelzat/style";

const style = {
    container: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
        padding: 32,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 18,
        ...Font.Bold
    },

    message: {
        fontSize: 16,
    },

    btn: {
        width: '100%'
    }
};

const confirmStyle = StyleSheet.create(style);
export { confirmStyle as confirmStyle };
