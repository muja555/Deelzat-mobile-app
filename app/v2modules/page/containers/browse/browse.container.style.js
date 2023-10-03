import { StyleSheet } from "react-native";
import {Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    categoriesContent: {
        flexDirection: 'row',
        ...Spacing.HorizontalPadding
    },
    activitiesList: {
       paddingHorizontal: 16
    },
    categoryItem: {
        width: 70
    }
};

const browseContainerStyle = StyleSheet.create(style);
export { browseContainerStyle as browseContainerStyle };
