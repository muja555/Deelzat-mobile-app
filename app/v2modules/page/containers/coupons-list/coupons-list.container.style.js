import { StyleSheet } from "react-native";
import { Colors, Font } from 'deelzat/style';

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    list: {
        flexGrow: 1,
        paddingStart: 28,
        paddingEnd: 28,
        paddingBottom: 28
    },
    bigLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
};

const couponsListContainerStyle = StyleSheet.create(style);
export { couponsListContainerStyle as couponsListContainerStyle };
