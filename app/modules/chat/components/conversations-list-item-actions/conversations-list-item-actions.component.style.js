import {Dimensions, StyleSheet, Platform} from "react-native";
import { Colors, Font } from "deelzat/style";

const style = {
    container: {
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
        height: 50,
    },
    buttonsContainer: {
        height: '100%',
        width: 110,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        borderBottomStartRadius: 8,
        borderTopStartRadius: 8,
        borderColor: Colors.N_GREY_3,
        borderWidth: 1,
    },
    icon: {
        marginEnd: 16
    },
}

const conversationsListItemActionsStyle = StyleSheet.create(style);
export { conversationsListItemActionsStyle as conversationsListItemActionsStyle };
