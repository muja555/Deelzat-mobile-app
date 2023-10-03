import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.12,
        shadowRadius: 16,
    },
    image: {
        height: '100%',
        borderRadius: 16,
        elevation: 3.5,
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
        paddingStart: 17,
        paddingEnd: 17,
        paddingTop: 10,
        paddingBottom: 10,
        ...Font.Bold,
    },
};

const activitiesItemStyle = StyleSheet.create(style);
export { activitiesItemStyle as activitiesItemStyle };
