import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    listSeparator: {
        width: 24,
        height: 24,
    },
    listRowMultiple: {
        flexDirection: 'row',
    },
    listItemStart: {
        flex: 0.5,
        paddingEnd: 6,
    },
    listItemEnd: {
        flex: 0.5,
        paddingStart: 6,
    },
    buttonText: {
        position: 'absolute',
        bottom: 24,
        minWidth: 100,
        alignSelf: 'flex-end',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontSize: 14,
        borderRadius: 8,
        backgroundColor: 'white',
        marginStart: 17,
        paddingStart: 17,
        marginEnd: 17,
        paddingEnd: 17,
        paddingTop: 10,
        paddingBottom: 10,
        ...Font.Bold,
    },

};

const activitiesStyle = StyleSheet.create(style);
export { activitiesStyle as activitiesStyle };
