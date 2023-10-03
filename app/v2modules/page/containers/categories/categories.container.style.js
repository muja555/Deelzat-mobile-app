import { StyleSheet } from "react-native";
import {Colors, Font, Spacing, LayoutStyle} from "deelzat/style";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding,
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
    },
    title: {
        flex: 1,
        fontSize: 18,
        color: Colors.N_BLACK,
        textAlign: 'center',
        ...Font.Bold
    },
    endPlaceholder: {
        width: 36,
        height: 36
    },
    inputView: {
        height: 38,
        backgroundColor: Colors.Gray100,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 11,
    },
    inputText: {
        flex: 1,
        fontSize: 12,
        paddingStart: 5,
        color: 'black',
        ...Font.Regular,
    },
    categoryView: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.Gray200,
    },
    categoryHeader: {
        height: 56,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryTitle: {
        flex: 1,
        fontSize: 14,
        textAlign: 'left',
        color: Colors.alpha(Colors.N_BLACK, 0.8)
    },
    subCategoryView: {
        flexDirection: 'row',
        height: 35,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
    subCategoryTitle: {
        textAlign: 'left',
        fontSize: 14,
        color: Colors.alpha(Colors.N_BLACK, 0.8)
    },
    subCatArrow: {
        transform: [{rotate: isRTL()? '90deg': '270deg'}]
    },
    iconView: {
        width: 24,
        height: 24,
    }
};

const categoriesContainerStyle = StyleSheet.create(style);
export { categoriesContainerStyle as categoriesContainerStyle };
