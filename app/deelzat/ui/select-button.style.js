import {StyleSheet} from "react-native";
import {Colors} from "deelzat/style"

const _style = {
    container: {
        borderRadius: 24,
        minHeight: 48,
        borderWidth: 1,
        paddingHorizontal: 16,
        justifyContent: 'center',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    btn_type_PRIMARY: {
        backgroundColor: '#fff',
        borderColor:  Colors.MEDIUM_GREY,
    },
    btn_type_PRIMARY_selected: {
        backgroundColor: Colors.MAIN_COLOR,
        borderColor:  Colors.MAIN_COLOR,
    },
    btn_type_DISABLED: {
        backgroundColor: '#fff',
        borderColor:  Colors.MEDIUM_GREY,
    },
    label: {
        fontSize: 16,
        marginEnd: 8,
        color: Colors.BROWN_GREY,
    },
    label_selected: {
        fontSize: 16,
        marginEnd: 8,
        color: '#fff',
    }
}


const style = StyleSheet.create(_style);
export { style as style };
