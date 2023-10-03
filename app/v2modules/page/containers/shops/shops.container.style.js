import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    searchBar: {
        position: 'absolute',
        zIndex: 201,
        flexDirection: 'row',
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding
    },
    btnStyle: {
        borderRadius: 12,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.2)
    },
    label: {
        color: Colors.N_BLACK,
        fontSize: 18,
        alignSelf: 'flex-start',
        ...Spacing.HorizontalPadding,
        ...Font.Bold
    },
    checkIcon: {
        borderRadius:  15,
        backgroundColor: '#fff',
        position: 'absolute',
    },
    categorySeparator: {
        width: 12
    },
    subCategoryBtn: {
        borderRadius: 12,
        height: 33,
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: Colors.alpha(Colors.Gray900, 0.2)
    },
    subCategoryText: {
        fontSize: 12,
        color: Colors.N_BLACK
    },
    subCategoryBtnSelected: {
        backgroundColor: Colors.MAIN_COLOR
    },
    subCategoryTextSelected: {
        color: '#fff'
    },
    subCategoriesView: {
        height: 60,
    },
    listColumnWrapper: {
        justifyContent: 'space-between',
        ...Spacing.HorizontalPadding
    },
    listContents: {
        flexGrow: 1,
        backgroundColor: 'white'
    },
    loaderIndicator: {
        height: 70
    },
    shopsLoader: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryItem: {
        width: 80
    },
    subcategoriesScroll: {
        flexGrow: 1,
    },
    listHeader: {
        position: 'absolute',
        zIndex: 200,
        paddingTop: 10,
        paddingBottom: 5,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    listLoader: {
        position: 'absolute',
        zIndex: 100,
        width: '100%',
        height: '100%',
    },
    scrollViewCategories: {
        paddingStart: 15,
    }
};

const shopsContainerStyle = StyleSheet.create(style);
export { shopsContainerStyle as shopsContainerStyle };
