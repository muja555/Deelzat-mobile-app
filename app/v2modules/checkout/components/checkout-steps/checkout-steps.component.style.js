import { StyleSheet } from 'react-native';
import Colors from 'deelzat/style/colors';

const style = {
    container: {
        width: '100%',
        alignItems: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepCircle: {
        width: 24,
        height: 24,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: Colors.N_GREY,
    },
    circleChecked: {
        borderColor: Colors.MAIN_COLOR,
    },
    circleCheckedAnim: {
        borderColor: Colors.MAIN_COLOR,
        position: 'absolute',
        width: '100%',
        height: '100%'
    },
    lineView: {
        height: 2,
    },
    line: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: Colors.N_GREY,
    },
    lineMarked: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: Colors.MAIN_COLOR,
        zIndex: 2,
    },
    stepTitle: {
        color: Colors.N_BLACK,
        fontSize: 12,
    },
};

const checkoutStepsStyle = StyleSheet.create(style);
export { checkoutStepsStyle as checkoutStepsStyle };
