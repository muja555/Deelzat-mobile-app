import { Platform, StyleSheet } from 'react-native';
import {Colors, Font} from "deelzat/style";

const style = {
    container: {

    },
    sectionTitle: {
        fontSize: 14,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    inputStyle: {
        fontWeight: '200'
    },
    inputAreaStyle: {
        paddingTop: Platform.OS === 'android'? 10: 0
    },
    titleStyleError: {
        fontSize: 14,
        color: Colors.ERROR_COLOR
    },
    savedAddress: {
        color: Colors.TEXT_GREY,
        fontSize: 12,
        textAlign: 'left',
        marginBottom: 5,
    },
    addNewAddressBtn: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 5,
        borderStyle: 'dotted',
        borderColor: Colors.MAIN_COLOR
    },
    addNewAddressText: {
        color: Colors.MAIN_COLOR,
        fontSize: 14,
        marginStart: 10,
        ...Font.Bold
    },
    addressBtnSelected: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderColor: Colors.CERULEAN_BLUE,
        borderRadius: 5,
        borderWidth: 1,
        backgroundColor: Colors.ACCENT_BLUE_100
    },
    addressBtnUnselected: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderColor: Colors.MEDIUM_GREY,
        borderRadius: 5,
        borderWidth: 1,
    },
    addressBtnTextSelected: {
        color: Colors.CERULEAN_BLUE,
    },
    addressBtnTextUnselected: {
        color: Colors.TEXT_GREY
    },
    inputError: {
        borderColor: Colors.ERROR_COLOR
    },
    mobileFieldContainer: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: 'white',
        justifyContent: 'space-between',
    },
    mobileFieldInputStyle: {
        marginStart: 10,
        fontWeight: '200',
    },
    mobileFieldCodeViewStyle: {
        width: 80,
    },
    mobileFieldInputViewStyle: {
        flex: 1
    },
    errorMessage: {
        color: Colors.BLACK_RED,
        textAlign: 'left',
    },
    panelTitleError: {
        color: Colors.ERROR_COLOR,
    },
};

const addressFieldsStyle = StyleSheet.create(style);
export { addressFieldsStyle as addressFieldsStyle };
