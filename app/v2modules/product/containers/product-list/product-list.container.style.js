import {Dimensions, StyleSheet} from "react-native";
import {Spacing, Colors, LayoutStyle, Font} from "deelzat/style";

const HEADER_HEIGHT = 60;
const HEADER_HEIGHT_WITH_CATS = HEADER_HEIGHT + 35;
const SCREEN_HEIGHT = Dimensions.get('window').height / 2;

const style = {
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.2),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        ...Spacing.HorizontalPadding
    },
    tabView: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingView: {
        flex: 1,
        backgroundColor: 'white',
    },
    footerLoader: {
        height: 70,
    },
    listHeader: {
        paddingTop: 10,
        paddingBottom: 5,
        width: '100%',
        height: HEADER_HEIGHT,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    listHeaderWithCategories: {
        height: HEADER_HEIGHT_WITH_CATS,
    },
    listHeaderPlaceholderWithCategories: {
        height: HEADER_HEIGHT_WITH_CATS,
    },
    filterBtn: {
        width: 36,
        height: 36,
        backgroundColor: Colors.MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    shareBtn: {
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        borderRadius: 12,
        borderWidth: 1,
        paddingStart: 6,
        paddingEnd: 8,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
    },
    shareText: {
        marginStart: 7,
        color: Colors.N_BLACK_50,
        fontSize: 12,
    },
    listHeaderPlaceholder: {
        height: HEADER_HEIGHT,
    },
    emptyView: {
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyViewText: {
        textAlign: 'center',
        color: Colors.N_BLACK,
        fontSize: 16,
    },
    emptyViewBtn: {
        width: '80%',
        height: 38,
        borderRadius: 12,
        backgroundColor: Colors.MAIN_COLOR,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyViewBtnText: {
        fontSize: 14,
        color: '#fff'
    },
    emptyUsedProducts: {
        flexGrow: 1,
    },
    singleTabView: {
        overflow: 'hidden',
        flex: 1
    },
    cateogryLabel: {
        color: Colors.N_BLACK,
        fontSize: 14,
        marginEnd: 5,
        marginStart: 10,
        ...Font.Bold
    },
    filtersRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        ...Spacing.HorizontalPadding
    },
    categoriesList: {
        marginTop: 5,
        justifyContent: 'flex-start',
        flexGrow: 1,
        flexDirection: 'row',
        paddingEnd: 20,
        paddingStart: 15,
    },
    previewImage: {
        width: '80%',
        height: '60%',
        borderRadius: 12
    }
};

const productListContainerStyle = StyleSheet.create(style);
export { productListContainerStyle as productListContainerStyle };
