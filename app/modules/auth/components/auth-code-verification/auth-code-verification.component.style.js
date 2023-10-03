import {StyleSheet} from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
        padding: 32
    },
    inputLabel: {
        color: Colors.BROWN_GREY,
        textAlign: 'left',
    },
    input: {
        height: 48,
        borderColor: Colors.BORDER_GREY,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16
    },
    cancelBtn: {
        marginBottom: 20,
    }
};

const authCodeVerificationStyle = StyleSheet.create(style);
export { authCodeVerificationStyle as authCodeVerificationStyle };
