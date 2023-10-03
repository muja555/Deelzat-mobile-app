import {StyleSheet} from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        marginBottom: 8,
        marginTop: 3,
    },
    innerContainer: {
        borderRadius: 12,
        elevation: 4,
        backgroundColor: 'transparent',
        shadowColor: "#393939",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 12,
    },
    bookmarkBtn: {
        position: 'absolute',
        bottom: 2,
        left: 5,
    },
    shopInfo: {
        width: '100%',
        position: 'absolute',
        top: 8,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        paddingStart: 8,
        paddingEnd: 12,
    },
    shopName: {
        flexWrap: 'wrap',
        flexShrink: 1,
        color: 'white',
        textAlign: 'left',
        fontSize: 11,
        textShadowColor: 'black',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 2,
        ...Font.Bold,
    },
    shopImage: {
        width: 16,
        height: 16,
        borderRadius: 16,
        marginEnd: 5,
    },
    gradient: {
        position: 'absolute',
        opacity: 0.6,
        left: 0,
        right: 0,
        borderRadius: 12,
        overflow: 'hidden'
    },
    price: {
        position: 'absolute',
        bottom: 6,
        right: 7,
        fontSize: 14,
        color: Colors.alpha(Colors.N_GREY, 0.9),
        ...Font.Bold
    }
};

const trendingTryItemStyle = StyleSheet.create(style);
export { trendingTryItemStyle as trendingTryItemStyle };
