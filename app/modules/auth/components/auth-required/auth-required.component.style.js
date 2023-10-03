import {StyleSheet} from "react-native";

const style = {
    container: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        backgroundColor: '#fff',
    },
    innerContainer: {
        padding: 26,
        paddingBottom: 10,
    },
    title: {
        fontSize: 16,
        textAlign: 'left',
    },
    button: {
        borderRadius: 12,
    }
};

const authRequiredStyle = StyleSheet.create(style);
export { authRequiredStyle as authRequiredStyle };
