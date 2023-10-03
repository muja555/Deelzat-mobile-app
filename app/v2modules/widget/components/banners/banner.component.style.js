import { StyleSheet } from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        backgroundColor: Colors.N_BLACK,
    },
    paginationDots: {
        position: 'absolute',
        bottom: 0,
        right: 10,
    },
    paginationDotsRTL: {
        transform: [{scaleX: -1}],
    },
    inactiveDotStyleContainer: {
        height: 10,
        width: 10,
        marginHorizontal: 1,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    dotStyle: {
        height: 8,
        width: 8,
        marginHorizontal: -10,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0,
        elevation: 4,
        shadowRadius: 2,
        backgroundColor: 'white',
    },
    activeDot: {
        marginHorizontal: -10,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.4,
        elevation: 4,
        shadowRadius: 2,
        backgroundColor: Colors.MAIN_COLOR,
    },
    inactiveDotLastItemStyle: {
        height: 3,
        width: 3,
    },
    loadingView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    blurView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        zIndex: 500,
    },
    blurRectangle: {
        width: '100%',
        height: '100%',
    },
    gradientView: {
        height: 30,
        marginTop: -15,
        width: '100%',
        zIndex: -10
    },
};

const bannerStyle = StyleSheet.create(style);
export { bannerStyle as bannerStyle };
