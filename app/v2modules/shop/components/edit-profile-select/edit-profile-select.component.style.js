import {StyleSheet} from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        minHeight: 60,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
        borderWidth: 1,
        paddingStart: 20,
        paddingEnd: 19,
        paddingVertical: 11,
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    errorContainer: {
        borderColor: Colors.ERROR_COLOR_2
    },
    label: {
        fontSize: 14,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        textAlign: 'left',
        ...Font.Bold
    },
    errorMessageView: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    errorMessage: {
        color: Colors.ERROR_COLOR_2,
        textAlign: 'right'
    },
    selectError: {
        borderColor: Colors.ERROR_COLOR_2
    },
    input: {
        width: '100%',
        minHeight: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text: {
        color: '#000',
        flex: 1,
        textAlign: 'left',
        ...Font.Regular
    },
    placeholder: {
        color: Colors.GREY
    },
};

const editProfileSelectStyle = StyleSheet.create(style);
export {editProfileSelectStyle as editProfileSelectStyle};
