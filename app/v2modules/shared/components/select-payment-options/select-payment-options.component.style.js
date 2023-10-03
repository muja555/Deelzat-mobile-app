import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {

    },
    titleStyle: {
        color: Colors.BLACK_RED
    },
    radio: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: Colors.N_BLACK
    },
    selectedMark: {
        width: 6,
        height: 6,
        borderRadius: 9,
        backgroundColor: Colors.MAIN_COLOR
    },
    ccField: {
        height: 50,
        width: '100%',
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    ccFieldError: {
        borderColor: Colors.ERROR_COLOR,
    },
    labelError: {
        color: Colors.ERROR_COLOR,
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: 14,
        ...Font.Bold,
    },
    sectionTitleError: {
        color: Colors.ERROR_COLOR_2
    },
};

const selectPaymentOptionsStyle = StyleSheet.create(style);
export { selectPaymentOptionsStyle as selectPaymentOptionsStyle };
