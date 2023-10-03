import {Dimensions, StyleSheet} from "react-native";
import {Colors, Font} from "deelzat/style";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const DESIGN_SCALE = 104 / 812;
const style = {
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    emptyImage: {
        width: 110,
        height: 110,
    },
    emptySavedSpace: {
        height: SCREEN_HEIGHT * DESIGN_SCALE
    },
    emptyText: {
        fontSize: 18,
        color: Colors.MAIN_COLOR,
        textAlign: 'center',
        ...Font.Bold,
    },
    listColumnWrapper: {
        justifyContent: 'space-between'
    },
    list: {
      width: '100%'
    },
    listContents: {
        flexGrow: 1,
        paddingTop: 20,
        paddingBottom: 40,
    },
    itemView: {
        width: '48%',
        borderWidth: 1,
        borderRadius:  12,
        borderColor: Colors.MAIN_COLOR,
        overflow: 'hidden',
    },
    imageImage: {
        height: 166,
        width: '100%',
        borderWidth: 1,
        borderColor: Colors.alpha('#000', 0.2)
    },
    itemInfoView: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 8,
    },
    itemPrice: {
        fontSize: 14,
        color: Colors.N_BLACK,
        ...Font.Bold,
    },
    itemName: {
        textAlign: 'left',
        fontSize: 12,
        color: Colors.N_BLACK_50
    },
    moveToBagBtn: {
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moveToBagText: {
        fontSize: 12,
        color: Colors.MAIN_COLOR,
    },
    closeBtn: {
        position: 'absolute',
        right: 8,
        top: 8,
        width: 24,
        height: 24,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.alpha('#fff', 0.5)
    },
};

const savedTabAllItemsStyle = StyleSheet.create(style);
export { savedTabAllItemsStyle as savedTabAllItemsStyle };
