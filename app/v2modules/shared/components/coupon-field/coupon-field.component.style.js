import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {

    },
    addCouponView: {
        height: 48,
        flexDirection: 'row',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 17,
        backgroundColor: Colors.Gray000
    },
    enterCoupon: {
        flex: 1,
        textAlign: 'left',
        color: Colors.N_BLACK_50,
        fontSize: 14,
    },
    gotCouponTitle: {
        flex: 1,
        textAlign: 'left',
        fontSize: 14,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    couponSummary: {
        flexDirection: 'row',
        backgroundColor: Colors.alpha(Colors.MAIN_COLOR, 0.1),
        borderColor: Colors.alpha(Colors.MAIN_COLOR, 0.5),
        padding: 16,
        borderWidth: 1,
        borderRadius: 8,
    },
    textsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    iconContainer: {
        marginEnd: 16,
    },
    title: {
        alignSelf: 'flex-start',
        color: 'black',
        fontSize: 16,
        marginBottom: 6,
        ...Font.Bold
    },
    couponText: {
        fontSize: 14,
        width: '100%',
        textAlign: 'left',
        color: Colors.DARK_GREY,
        marginBottom: 8,
    },
    discountText: {
        fontSize: 16,
        width: '100%',
        textAlign: 'left',
        color: 'black',
        marginBottom: 6,
    },
    deleteButton: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: -5,
    },
    deleteText: {
        flexWrap: 'wrap',
        color: Colors.DARK_GREY,
        fontSize: 14,
    },
    smallCouponIcon: {
        marginTop: -3,
    },
    availableCoupons: {
        marginTop: 5,
        marginEnd: 3,
        flex: 1,
        textAlign: 'right',
        color: Colors.LINK_2,
        fontSize: 12,
        textDecorationLine: 'underline',
    }

};

const couponFieldStyle = StyleSheet.create(style);
export { couponFieldStyle as couponFieldStyle };
