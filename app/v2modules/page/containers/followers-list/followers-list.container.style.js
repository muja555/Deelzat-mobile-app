import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    bigLoader: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
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
    loadingView: {
        flex: 1,
    },
    shopName: {
        fontSize: 14,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    listTab: {
        flexGrow: 1,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding
    },
    resultRow: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    resultImage: {
        width: 50,
        height: 50,
        borderRadius: 6,
    },
    resultTitle: {
        flex: 1,
        textAlign: 'left'
    },
};

const followersListContainerStyle = StyleSheet.create(style);
export { followersListContainerStyle as followersListContainerStyle };
