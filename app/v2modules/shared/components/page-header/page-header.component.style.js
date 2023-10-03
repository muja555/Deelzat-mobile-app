import { StyleSheet } from "react-native";
import { Colors, Font } from 'deelzat/style';

const style = {
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
    },
    title: {
        flex: 1,
        fontSize: 18,
        color: Colors.N_BLACK,
        textAlign: 'center',
        ...Font.Bold
    },
    endPlaceholder: {
        width: 36,
        height: 36
    },
};

const pageHeaderStyle = StyleSheet.create(style);
export { pageHeaderStyle as pageHeaderStyle };
