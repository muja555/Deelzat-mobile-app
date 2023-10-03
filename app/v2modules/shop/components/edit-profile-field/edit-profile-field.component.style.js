import { StyleSheet } from "react-native";
import {Colors, Font, LayoutStyle} from "deelzat/style";

const style = {
    container: {
        minHeight: 60,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
        borderWidth: 1,
        paddingHorizontal: 20,
        paddingVertical: 11,
        alignItems: 'flex-start',
        justifyContent: 'space-between'
    },
    errorContainer: {
        borderColor: Colors.ERROR_COLOR_2,
        paddingEnd: 10,
    },
    validContainer: {
        borderColor: Colors.MAIN_COLOR,
        paddingEnd: 10,
    },
    label: {
        flex: 1,
        fontSize: 14,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        textAlign: 'left',
        ...Font.Bold
    },
    textInput: {
        width: "100%",
        fontWeight: '200',
        paddingVertical: -5,
        borderWidth: 0,
        ...Font.Regular
    },
    textArea: {
        height: 80,
    },
    head:{
        width: '100%',
        flexDirection: 'row',
    },
    messageView: {
        flex: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',

    },
    errorMessage: {
        color: Colors.ERROR_COLOR_2,
        textAlign: 'left',
    },
    validMessage: {
        color: Colors.MAIN_COLOR,
        textAlign: 'left',
    }
};

const editProfileFieldStyle = StyleSheet.create(style);
export { editProfileFieldStyle as editProfileFieldStyle };
