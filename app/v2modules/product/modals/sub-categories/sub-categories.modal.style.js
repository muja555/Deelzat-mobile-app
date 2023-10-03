import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        paddingTop: 20,
        maxHeight: '80%',
        ...Spacing.HorizontalPadding,
    },
    listContents: {
        paddingBottom: 40,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        color: Colors.N_BLACK,
        fontSize: 18,
    },
    cellView: {
        height: 115,
        flex: 1
    },
    cellImage: {
        flex: 1,
        borderRadius: 12,
    },
};

const subCategoriesModalStyle = StyleSheet.create(style);
export { subCategoriesModalStyle as subCategoriesModalStyle };
