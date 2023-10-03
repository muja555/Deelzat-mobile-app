import { StyleSheet } from "react-native";
import {Colors, Font, LayoutStyle, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        marginStart: 24,
    },
    midHeader: {
        width: '100%',
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
        fontSize: 18,
        color: Colors.N_BLACK,
        textAlign: 'center',
        ...Font.Bold
    },
    headerCountView: {
        marginStart: 5,
        overflow: 'hidden',
        borderRadius: 20,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.MAIN_COLOR,
    },
    headerCount: {
        color: '#fff',
        fontSize: 10,
        ...Font.Bold,
    },
    resetText: {
        color: Colors.CERULEAN_BLUE_2,
        fontSize: 14,
        marginEnd: 24,
    },
    sectionLabel: {
        flex: 1,
        textAlign: 'left',
        color: Colors.N_BLACK_50,
        fontSize: 14,
    },
    scrollView: {
        paddingBottom: 80,
    },
    bottomView: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        flexDirection: 'row',
        paddingTop: 12,
        ...Spacing.HorizontalPadding,
    },
    cancelBtn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.MAIN_COLOR,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginEnd: 11,
    },
    applyBtn: {
        flex: 1,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.MAIN_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        marginStart: 11,
    },
    cancelText: {
        color: Colors.MAIN_COLOR,
        fontSize: 14,
    },
    applyText: {
        color: '#fff',
        fontSize: 14,
    }
};

const productFiltersContainerStyle = StyleSheet.create(style);
export { productFiltersContainerStyle as productFiltersContainerStyle };
