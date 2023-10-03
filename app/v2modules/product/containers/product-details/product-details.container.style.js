import {Dimensions, StyleSheet} from "react-native";
import {Colors, Font, LayoutStyle, Spacing} from "deelzat/style";

const ACTION_VIEW_HEIGHT = 106;
const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    contents: {
        position: 'absolute',
        width: '100%',
        height: '50%',
        overflow: 'hidden',
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
    },
    scrollView: {
        borderTopRightRadius: 24,
        borderTopLeftRadius: 24,
        backgroundColor: 'white',
    },
    header: {
        position: 'absolute',
        width: '100%',
        ...Spacing.HorizontalPadding,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.2)
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.5),
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.5),
    },
    bookmarkUnchecked: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.2)
    },
    bookmarkChecked: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderColor: Colors.alpha(Colors.MAIN_COLOR, 0.5)
    },
    deliveryInfo: {
        height: 22,
        flexDirection: 'row',
        backgroundColor: Colors.alpha(Colors.MAIN_COLOR, 0.40),
        marginHorizontal: 15,
        borderRadius: 31,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notDeliveryInfo: {
        backgroundColor: Colors.alpha(Colors.DARK_LEMOM, 0.40),
    },
    deliveryText: {
        fontSize: 12,
        marginVertical: 2,
        color: Colors.alpha(Colors.N_BLACK, 0.5),
    },
    titleRow: {
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
    },
    productTitle: {
        fontSize: 18,
        color: Colors.N_BLACK,
        marginBottom: 5,
        ...Font.Bold
    },
    shopName: {
        color: Colors.LINK,
        fontSize: 14,
        textAlign: 'left',
    },
    price: {
        fontSize: 18,
        color: Colors.N_BLACK_DARK,
        ...Font.Bold,
    },
    compareAtPrice: {
        color: Colors.N_BLACK,
        fontSize: 12,
        textDecorationLine: 'line-through',
        marginBottom: -5,
        alignSelf: 'flex-end'
    },
    priceDiscount: {
        color: Colors.BLACK_RED,
    },
    soldOutText: {
        flex: 1,
        height: 40,
        textAlign: 'center',
        fontSize: 18,
        color: Colors.BLACK_RED,
        ...Font.Bold,
    },
    sectionTitle: {
        flex: 1,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        textAlign: 'left',
    },
    rowSpaceBetween: {
        zIndex: 500,
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    optionLabel: {
        fontSize: 14,
        textAlign: 'left',
        color: Colors.alpha(Colors.N_BLACK, 0.8),
    },
    optionsViewTopMargin: {
        marginTop: -25,
    },
    colorOptions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectedSize: {
        borderColor: Colors.alpha(Colors.N_BLACK, 0.3),
        backgroundColor: Colors.LIGHT_ORANGE,
    },
    infoLabel: {
        flex: 1,
        textAlign: 'left',
        fontSize: 14,
        color: Colors.N_BLACK,
    },
    verticalLine: {
        borderRadius: 12,
        width: 40,
        height: 4,
        backgroundColor: Colors.MAIN_COLOR,
        overflow: 'hidden',
    },
    shopInfo: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    touchableShopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    shopImage: {
        width: 36,
        height: 36,
        borderRadius: 36,
        borderColor: Colors.GREY,
        borderWidth: 0.5,
    },
    chatBtn: {
        width: 48,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        borderColor: Colors.MAIN_COLOR,
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    shopNameInfo: {
        color: Colors.N_BLACK,
        fontSize: 14,
        alignSelf: 'center',
        ...Font.Bold
    },
    shopCityInfo: {
        color: Colors.N_BLACK_50,
        fontSize: 12,
        alignSelf: 'flex-start',
        ...Font.Bold
    },
    actionButtonsView: {
        height: ACTION_VIEW_HEIGHT,
        flexDirection: 'row',
        width: '100%',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding
    },
    buyBtn: {
        flex: 1,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: Colors.MAIN_COLOR
    },
    buyText: {
        color: '#fff',
        fontSize: 14,
    },
    contactSellerBtnText: {
        color: '#fff',
        fontSize: 12,
    },
    addToBagBtn: {
        flex: 1,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        backgroundColor: '#fff',
        borderColor: Colors.MAIN_COLOR,
        borderWidth: 1,
    },
    addToBagText: {
        color: Colors.MAIN_COLOR,
        fontSize: 14,
    },
    labelHighlight: {
        color: Colors.BLACK_RED,
        ...Font.Bold
    },
    actionSheetButton: {
        height: 41,
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingBottom: ACTION_VIEW_HEIGHT
    },
    blurView: {
        position: 'absolute',
        height: '100%',
        width: '100%',
    },
    gradientView: {
        position: 'absolute',
        height: 32,
        width: '100%',

    },
    backButton: {
        width: 36,
        height: 36,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
    countBubble: {
        position: 'absolute',
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 20,
        overflow: 'hidden',
        paddingHorizontal: 8,
        paddingVertical: 2,
        height: 20,
        right: -8,
        top: -8,
    },
    countBubbleText: {
        fontSize: 10,
        color: 'white',
        justifyContent: 'center',
        alignSelf: 'center',
    },
};

const productDetailsContainerStyle = StyleSheet.create(style);
export { productDetailsContainerStyle as productDetailsContainerStyle };
