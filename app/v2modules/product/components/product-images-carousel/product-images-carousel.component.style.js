import { StyleSheet } from "react-native";
import {Colors, LayoutStyle} from "deelzat/style";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        backgroundColor: '#000',
    },
    loadingView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    slideImage: {
        width: '100%',
        height: '100%',
    },
    carouselView: {
        backgroundColor: '#000'
    },
    blurView: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        top: 0,
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        zIndex: 1000000,
    },
    dotsContainer: {
        height: 3,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 60,
    },
    dotsView: {
        paddingVertical: 13,
        paddingHorizontal: 20,
        backgroundColor: Colors.alpha('#fff', 0.5),
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotStyle: {
        height: 6,
        width: 6,
        marginStart: 5,
        marginEnd: 5,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    activeDot: {
        height: 10,
        width: 10,
        borderRadius: 10,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
    },
    dotSpace: {
    },
    blurRectangle: {
        width: '100%',
        height: '100%',
    }
};

const productImagesCarouselStyle = StyleSheet.create(style);
export { productImagesCarouselStyle as productImagesCarouselStyle };
