import { StyleSheet } from "react-native";
import { Colors, Font, Spacing } from 'deelzat/style';

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    titleText: {
        marginHorizontal: 2,
        textAlign: 'center',
        color: Colors.N_BLACK,
        fontSize: 14,
        ...Font.Bold
    },
    titleTextInput: {
        textAlign: 'center',
        width: '100%',
        borderWidth: 0,
        ...Font.Bold,
    },
    saveBtn: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        zIndex: 10,
        ...Spacing.HorizontalPadding
    },
    saveBtnText: {

    }
};

const addAddressContainerStyle = StyleSheet.create(style);
export { addAddressContainerStyle as addAddressContainerStyle };
