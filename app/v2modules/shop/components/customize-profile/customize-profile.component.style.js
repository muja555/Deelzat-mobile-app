import { StyleSheet } from "react-native";
import { Colors, Font, Spacing } from 'deelzat/style';

const style = {
    container: {
        flex: 1
    },
    listColumnWrapper: {
        justifyContent: 'space-between'
    },
    contentContainerStyle: {
      paddingTop: 20,
    },
    itemContainer: {
        flex: 0.46,
    },
    itemContainerBigAvatar: {
        flex: 0.47,
    },
    themeImage: {
        width: '100%',
        height: 117.8,
        borderRadius: 8,
    },
    bigAvatar: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 8,
    },
    avatarImage: {
        width: 70.7,
        height: 70.7,
        borderRadius: 11.16
    },
    themeBtn: {
        flex: 1,
        height: 32,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        borderRadius: 8
    },
    checkAnim: {
        width: 24,
        height: 24,
    },
    sectionTitle: {
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        fontSize: 14,
        ...Font.Bold
    },
    previewModal: {
        flex: 0,
        padding: 0,
        width: '60%',
        aspectRatio: 0.53,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        borderRadius: 50
    },
    resetBtnText: {
        color: 'white',
        fontSize: 12,
        top: 7,
        position: 'absolute',
        width: '100%',
        height: '100%',
        textAlign: 'center',
        ...Font.Bold,
    }
};

const customizeProfileStyle = StyleSheet.create(style);
export { customizeProfileStyle as customizeProfileStyle };
