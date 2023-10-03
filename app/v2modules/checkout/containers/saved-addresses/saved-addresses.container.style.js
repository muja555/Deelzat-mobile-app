import { StyleSheet } from 'react-native';
import { Colors, Font, Spacing } from 'deelzat/style';

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    loadingView: {
        flex: 1,
    },
    emptyView: {
        width: '100%',
        flex: 1,
        ...Spacing.HorizontalPadding
    },
    emptyViewTextView: {
        paddingLeft: 50,
        paddingRight: 50,
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyViewText: {
        fontSize: 19,
        color: Colors.MAIN_COLOR,
        textAlign: 'center',
    },
    addBtn: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        borderColor: Colors.MAIN_COLOR,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    addBtnText: {
        fontSize: 14,
        color: Colors.MAIN_COLOR,
    },
    contentContainerStyle: {
        paddingTop: 40,
        ...Spacing.HorizontalPadding
    },
    separator: {
        height: 1,
        width: '100%',
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
    addressTitle: {
        fontSize: 14,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    firstNameLastName: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    infoText: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    actionText: {
        color: Colors.LIGHT_ORANGE,
        fontSize: 12,
        ...Font.Bold
    },
    stickyAddBtnView: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        ...Spacing.HorizontalPadding,
    },
    deleteLoader: {
        position: 'absolute',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
};

const savedAddressesContainerStyle = StyleSheet.create(style);
export { savedAddressesContainerStyle as savedAddressesContainerStyle };
