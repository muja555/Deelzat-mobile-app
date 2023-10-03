import { StyleSheet } from "react-native";
import { Colors } from 'deelzat/style';

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    navigator: {
        flex: 1,
        backgroundColor: Colors.N_GREY_4,
    }
};

const checkoutContainerStyle = StyleSheet.create(style);
export { checkoutContainerStyle as checkoutContainerStyle };
