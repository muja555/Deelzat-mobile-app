import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {

    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        ...Spacing.HorizontalPadding,
    },
    title: {
        flex: 1,
        textAlign: 'left',
        fontSize: 14,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    innerContainer: {
        flexGrow: 1,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    listSeparator: {
        width: 20,
    },
    itemContainer: {
        borderTopStartRadius: 8,
        borderTopEndRadius: 8,
        overflow: 'hidden',
    },
    image: {
        height: '100%',
        width: '100%',
    },
    itemInfoView: {
        bottom: 0,
        backgroundColor: Colors.Gray150,
        alignItems: 'center',
        borderBottomStartRadius: 8,
        borderBottomEndRadius: 8,
        paddingBottom: 3,
        ...Spacing.HorizontalPadding,
    },
    itemTitle: {
        textAlign: 'center',
        color: Colors.N_BLACK,
        fontSize: 12,
    },
    itemTitleView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemPrice: {
        fontSize: 13,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    separator: {
        height: 4,
        width: '100%',
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
};

const recommendedListStyle = StyleSheet.create(style);
export { recommendedListStyle as recommendedListStyle };
