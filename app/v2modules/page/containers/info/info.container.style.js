import { StyleSheet } from "react-native";
import {Colors, Font, LayoutStyle, Spacing} from "deelzat/style";
import {isRTL} from "dz-I19n";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
    },
    title: {
        flex: 1,
        fontSize: 18,
        color: Colors.MAIN_COLOR,
        textAlign: 'center',
        ...Font.Bold
    },
    endPlaceholder: {
        width: 36,
        height: 36
    },
    content: {
        //overflow: 'hidden',
        borderRadius: 12,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
    },
    headerText: {
        fontSize: 14,
        color: Colors.alpha(Colors.N_BLACK, 0.8),
        paddingEnd: 12,
        ...Font.Bold,
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 48,
    },
    headerViewAR: {
        justifyContent: 'flex-end',
        width: '100%',
        paddingEnd: 20
    },
    sectionSeparator: {
        width: '100%',
        height: 1,
        backgroundColor: Colors.alpha(Colors.N_BLACK, 0.2)
    },
    sectionText: {
        fontSize: 14,
        color: Colors.N_BLACK,
    },
};

const infoContainerStyle = StyleSheet.create(style);
export { infoContainerStyle as infoContainerStyle };
