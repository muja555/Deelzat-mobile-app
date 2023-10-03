import { StyleSheet } from "react-native";
import { Colors, Font } from 'deelzat/style';

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    shopName: {
        textAlign: 'left',
        flex: 1,
        color: Colors.N_BLACK,
        fontSize: 12,
        ...Font.Bold
    },
    frame: {
        width: '100%',
        height: '100%',
    },
    imageView: {
        width: 45,
        height: 45,
    },
    profileImage: {
        position: 'absolute',
        top: 2.5,
        left: 2.5,
        width: 40,
        height: 40,
        zIndex: 10,
        borderRadius: 12,
    },
    blockedList: {
        paddingHorizontal: 36,
        paddingBottom: 30
    },
    blockBtn: {
        height: 28,
        minWidth: 91,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        backgroundColor: Colors.MAIN_COLOR
    },
    blockBtnText: {
        color: 'white',
        fontSize: 12
    }
};

const blockedShopsContainerStyle = StyleSheet.create(style);
export { blockedShopsContainerStyle as blockedShopsContainerStyle };
