import { StyleSheet } from "react-native";
import {Colors, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonWithDotsContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    dotsView: {
        flexDirection: 'row',
        width: '30%',
        alignSelf: 'center',
        flex: 1,
    },
    dotView: {
      backgroundColor: Colors.MAIN_COLOR,
      borderRadius: 10,
      height: 5,
    },
    skipBtn: {
        position: 'absolute',
        right: 24,
    },
    skipText: {
        color: Colors.alpha(Colors.N_BLACK, 0.9),
    },
    svg: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '15%'
    },
    imageStyle: {
        width: '60%',
        aspectRatio: 0.824
    }
};

const onBoardingContainerStyle = StyleSheet.create(style);
export { onBoardingContainerStyle as onBoardingContainerStyle };
