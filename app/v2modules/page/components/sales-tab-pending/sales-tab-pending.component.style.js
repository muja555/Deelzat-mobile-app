import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        flex: 1
    },
    contentContainerStyle: {
        paddingTop: 17,
    },
    itemView: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 9,
        backgroundColor: Colors.alpha('#fff', 0.7),
        borderRadius: 12,
    },
    orderNumGrey: {
        fontSize: 12,
        color: Colors.N_BLACK_50,
    },
    orderNumBlack: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    itemName: {
        textAlign: 'left',
        fontSize: 12,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        ...Font.Bold,
    },
    itemVariant: {
        textAlign: 'left',
        fontSize: 12,
        color: Colors.N_BLACK,
        ...Font.Bold,
    },
    itemImage: {
        width: 92,
        height: 100,
        borderRadius: 12,
    },
    priceText: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    itemPrice: {
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    itemQuantity: {
        fontSize: 12,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        ...Font.Bold
    },
    footerLoader: {
        height: 70,
    },
    midBigConfirmBtn: {
        width: 270,
        height: 75,
        backgroundColor: Colors.MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    midBigConfirmText: {
        fontSize: 18,
        color: '#fff',
    },
    midBigRejectBtn: {
        width: 270,
        height: 75,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: Colors.alpha(Colors.ERROR_COLOR_2, 0.4)
    },
    midBigRejectText: {
        fontSize: 18,
        color: Colors.ERROR_COLOR_2,
    },
    noOrderText: {
        fontSize: 24,
        color: Colors.MAIN_COLOR,
        textAlign: 'center',
    },
    readyToPickUp: {
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    dayPickUp: {
        alignSelf: 'center',
        fontSize: 18,
        color: Colors.N_BLACK,
    },
    closeBtn: {
        position: 'absolute',
        [isRTL()? 'right': 'left']: 8,
        top: 40,
        width: 24,
        height: 24,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.alpha('#fff', 0.5)
    },
    pickUpValueContainer: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.alpha(Colors.N_GREY_4, 0.95),
        position: 'absolute',
        alignItems: 'center',
    },
    timeOptionBtn: {
        height: 51,
        width: '100%',
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    timeOptionText: {
        fontSize: 14,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        ...Font.Bold
    },
    confirmTimeBtn: {
        flexDirection: 'row',
        alignSelf: 'center',
        height: 75,
        width: '72%',
        backgroundColor: Colors.alpha(Colors.MAIN_COLOR, 0.7),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    confirmTimeText: {
        fontSize: 18,
        color: '#fff',
        ...Font.Bold
    },
    itemInfoView: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingStart: 11,
    },
    timeOptionBtnSelected: {
        borderColor: Colors.alpha(Colors.CERULEAN_BLUE_2, 0.5),
        borderWidth: 2,
    },
    pickUpScrollView: {
        width: '100%'
    },
    confirmLoader: {
        marginHorizontal: 5
    },
    itemLoadingView: {
        width: '100%',
        height: '100%',
        zIndex: 40,
        position: 'absolute',
        backgroundColor: Colors.alpha('#fff', 0.5),
        justifyContent: 'center',
        alignItems: 'center',
    },
    sizeView: {
        height: 33,
        width: 30,
        backgroundColor: Colors.MAIN_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
    },
    sizeLabel: {
        fontSize: 12,
        color: 'white',
        ...Font.Bold
    },
    colorView: {
        width: 24,
        height: 24,
        borderRadius: 13,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        elevation: 2,
        shadowRadius: 1.0,
    },
    variantView: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 33,
    },
    itemDate: {
        fontSize: 12,
        color: Colors.N_BLACK_50
    },
};

const salesTabPendingStyle = StyleSheet.create(style);
export { salesTabPendingStyle as salesTabPendingStyle };
