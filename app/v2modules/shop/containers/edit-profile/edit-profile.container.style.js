import { StyleSheet } from 'react-native';
import { Colors, Font } from 'deelzat/style';

const style = {
    container: {
        top: 0,
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    headerBtn: {
        height: 28,
        width: 90,
        borderRadius: 8,
    },
    headerBtnText: {
        fontSize: 12,
    },
    navigator: {
        flex: 1,
        backgroundColor: Colors.N_GREY_4,
    },
    changeImageBtn: {
        height: 45,
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteImageBtn: {
        height: 45,
        backgroundColor: Colors.BLACK_RED,
        borderColor: Colors.BLACK_RED,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    frame: {
        width: '100%',
        height: '100%',
    },
    imageView: {
        width: 66,
        height: 66,
    },
    profileImage: {
        position: 'absolute',
        top: 6.5,
        left: 6.5,
        width: 53,
        height: 53,
        zIndex: 10,
        borderRadius: 12,
    },
    editImage: {
        position: 'absolute',
        bottom: 2,
        right: -20,
    },
    aboutText: {
        marginHorizontal: 2,
        textAlign: 'center',
        color: Colors.N_BLACK,
        fontSize: 13,
    },
    aboutTextInput: {
        textAlign: 'center',
        width: '100%',
        fontWeight: '200',
        paddingVertical: -5,
        borderWidth: 0,
        ...Font.Regular,
    },
    aboutView: {
        flexDirection: 'row',
        marginHorizontal: 24,
    },
    aboutEditIcon: {
        justifyContent: 'center',
    },
    suggestionsTitle: {
        color: Colors.MAIN_COLOR,
        fontSize: 12,
    },
    privacyHeader: {
        fontSize: 12,
        color: Colors.alpha(Colors.N_BLACK, 0.3),
    },
};

const editProfileContainerStyle = StyleSheet.create(style);
export { editProfileContainerStyle as editProfileContainerStyle };
