import {StyleSheet} from "react-native";
import Colors from "./../style/colors";
import Font from "../style/fonts";
import {LayoutStyle} from "../style";

const style = {
    container: {
        flex: 1,
    },
    head: {
      flexDirection: 'row'
    },
    label: {
        color: Colors.DARK_GREY,
        marginBottom: 6
    },
    textFieldView: {
        borderRadius: 12,
        height: 40,
        borderColor: Colors.GREY,
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingStart: 8

    },
    textAreaView: {
        height: 80,
    },
    textField: {
        paddingVertical: -5,
        flex: 1,
        paddingStart: 8,
        ...Font.Regular,
    },
    errorMessageView: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    errorMessage: {
        color: Colors.ERROR_COLOR,
        textAlign: 'right'
    },
    validMessage: {
        color: Colors.MAIN_COLOR,
        textAlign: 'right'
    },
    select: {
        width: '100%',
        backgroundColor: '#fff',
        height: 45,
        justifyContent: 'center',
        borderRadius: 8,
        borderColor: Colors.GREY,
        borderWidth: 1,
        paddingHorizontal: 8
    },
    selectError: {
        borderColor: Colors.ERROR_COLOR
    },

    // radio
    radioOptionsView: {
        flexDirection: 'row',
    },
    radioOptionView: {
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.GREY,
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 16
    },
    radioOptionViewSelected: {
        borderColor: Colors.ACCENT_BLUE,
        backgroundColor: Colors.ACCENT_BLUE_100,
    },
    radioOptionLabel: {
        color: Colors.GREY,
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        ...Font.Bold
    },
    radioOptionLabelSelected: {
        color: Colors.ACCENT_BLUE,
    },
    radioOptionDescription: {
        color: Colors.GREY,
        marginTop: 8,
        textAlign: 'center'
    },
    radioOptionDescriptionSelected: {
        color: '#000'
    },
    radioEmptyCheck: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: Colors.GREY,
    },
    radioOptionIcon: {
        color: '#000',
        fontSize: 48
    },
};

const formStyle = StyleSheet.create(style);
export { formStyle as formStyle }
