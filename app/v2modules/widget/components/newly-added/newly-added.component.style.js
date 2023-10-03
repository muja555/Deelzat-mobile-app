import {Platform, StyleSheet} from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        marginTop: 50,
        flexDirection: "row",
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.alpha('#000', 0.2),
    },
    seeAll: {
        textAlign: 'center',
        color: Colors.LINK,
        fontSize: 16,
        textDecorationLine: 'underline',
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
        overflow: Platform.OS === 'ios'? 'visible': 'hidden'
    },
    bookmarkBtn: {
        position: 'absolute',
        bottom: 2,
        left: 5,
        zIndex: 10,
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
    gradient: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        opacity: 0.5,
        left: 0,
        right: 0,
        top: 0,
        overflow: 'hidden',
        zIndex: 5,
        resizeMode: 'stretch',
        borderRadius: Platform.OS === 'ios'? 12: 0
    },
    productsContainer: {
        width: '100%',
        flexWrap: 'wrap',
        flexDirection: 'row'
    }
};

const newlyAddedStyle = StyleSheet.create(style);
export { newlyAddedStyle as newlyAddedStyle };
