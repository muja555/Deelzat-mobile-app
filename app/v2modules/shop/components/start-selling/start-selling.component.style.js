import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        paddingBottom: 56,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    inner: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigText: {
        fontSize: 18,
        color: Colors.MAIN_COLOR,
        textAlign: 'center',
        ...Font.Bold
    },
    btn: {
        borderRadius: 8,
        width: 225,
        height: 45,
        backgroundColor: Colors.MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        ...Font.Bold
    }
};

const startSellingStyle = StyleSheet.create(style);
export { startSellingStyle as startSellingStyle };
