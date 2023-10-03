import {StyleSheet} from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
    },
    innerContainer: {
        padding: 26,
        paddingBottom: 10,
        justifyContent: 'center'
    },
    title: {
        fontSize: 16,
        textAlign: 'left',
    },
    namesContainer: {
        flexDirection: 'row',
        width: '100%',
        height: 110,
        backgroundColor: 'white',
        justifyContent: 'space-between'
    },
    nameField: {
        width: '50%',
        height: '100%',
    },
    inputStyle: {
        ...Font.Regular,
        paddingBottom: -10,
    },
    inputViewStyle: {
        width: '100%',
        marginBottom: 14,
    },
    errorMessage: {
        fontSize: 10,
        marginTop: -5,
        color: Colors.ERROR_COLOR
    },
};

const fillChatNameStyle = StyleSheet.create(style);
export { fillChatNameStyle as fillChatNameStyle };
