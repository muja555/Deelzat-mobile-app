import {Dimensions, StyleSheet} from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const SCREEN_WIDTH = Dimensions.get("window").width;

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding
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
    footerLoader: {
        height: 70
    },
    emptyView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyOrdersTitle: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.N_BLACK,
        ...Font.Bold,
    },
    emptyOrdersDesc: {
        fontSize: 14,
        textAlign: 'center',
        color: Colors.alpha(Colors.BLACK, 0.8),
    },
    browseBtn: {
        height: 48,
        width: SCREEN_WIDTH - (48 * 2),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.MAIN_COLOR
    },
    browseBtnText: {
        color: 'white',
        fontSize: 14
    },
    bigLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainerStyle: {
        flexGrow: 1,
        paddingTop: 15,
    },
    productImage: {
        width: 60,
        height: 65,
        marginEnd: 8,
        borderRadius: 12
    },
    orderNumGrey: {
        fontSize: 12,
        color: Colors.N_BLACK_50,
    },
    orderNumBlack: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    info: {
        width: '100%',
        backgroundColor: Colors.N_GREY,
        borderRadius: 12,
    },
    imagesContainer: {
        flexGrow: 1,
        flexDirection: 'row',
        paddingStart: 12,
    },
    separator: {
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.1),
        height: 1,
        width: '100%',
    },
    innerInfo: {
        flexDirection: 'row',
    },
    orderStatusTxt: {
        marginTop: 5,
        fontSize: 12,
        color: Colors.N_BLACK,
        ...Font.Bold,
    },
    statusImage: {
        marginTop: 2,
        height: 30,
        width: 30,
    },
    orderPrice: {
        color: Colors.N_BLACK,
        fontSize: 18,
        ...Font.Bold
    },
    viewDetailsTxt: {
        color: Colors.MAIN_COLOR,
        fontSize: 12
    },
    viewDetailsBtn: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginEnd: -5,
    },
    itemDate: {
        fontSize: 12,
        color: Colors.N_BLACK_50
    },
};

const ordersContainerStyle = StyleSheet.create(style);
export { ordersContainerStyle as ordersContainerStyle };
