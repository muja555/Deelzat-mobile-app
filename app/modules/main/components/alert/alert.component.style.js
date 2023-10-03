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
        textAlign: 'left',
        fontSize: 18,
        ...Font.Bold
    },
    btn: {
        width: '100%'
    }
};

const alertStyle = StyleSheet.create(style);
export { alertStyle as alertStyle };
