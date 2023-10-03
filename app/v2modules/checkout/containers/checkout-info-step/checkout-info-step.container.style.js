import { StyleSheet } from 'react-native';
import { Colors, Font, Spacing } from 'deelzat/style';

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding,
    },
    chooseFromAddrBtn: {
        height: 48,
        flexDirection: 'row',
        paddingStart: 8,
        paddingEnd: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.Gray000,
        borderRadius: 12
    },
    sectionTitle: {
        textAlign: 'center',
        fontSize: 14,
        ...Font.Bold,
    },
    sectionTitleError: {
       color: Colors.ERROR_COLOR_2
    },
    chooseFromAddrTxt: {
        flex: 1,
        fontSize: 14,
        color: Colors.N_BLACK,
        textAlign: 'left',
        ...Font.Bold,
    },
    arrowSaveBtn: {
        marginTop: -2,
        transform: [{ rotate: '90deg' }],
    },
    radio: {
        width: 12,
        height: 12,
        borderWidth: 1,
        borderColor: Colors.N_BLACK,
        marginEnd: 16,
    },
    selectedMark: {
        width: 6,
        height: 6,
        borderRadius: 9,
        backgroundColor: Colors.MAIN_COLOR,
    },
    copyAddressRow: {
        height: 35,
        flexDirection: 'row-reverse',
    },
    orTxt: {
        textAlign: 'center',
        fontSize: 14,
        color: Colors.N_BLACK_50,
        ...Font.Bold,
    },
    proceedBtn: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding,
    },
    checkoutBtnText: {},
    checkoutBtn: {
        height: 48,
        borderRadius: 12,
        zIndex: 1,
    },
};

const checkoutInfoStepContainerStyle = StyleSheet.create(style);
export { checkoutInfoStepContainerStyle as checkoutInfoStepContainerStyle };
