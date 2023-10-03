import { StyleSheet } from "react-native";
import {Colors, Font, Spacing} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        ...Spacing.HorizontalPadding
    },
    soonText: {
      color: Colors.MAIN_COLOR,
      fontSize: 64,
      alignSelf: 'flex-start',
      ...Font.Bold
    },
    futureLabelAR: {
        color: 'black',
        fontSize: 24,
        textAlign: 'center',
        alignSelf: 'center',
    },
    centerIcon: {
        alignSelf: 'center',
    },
    futureLabel: {
        color: 'black',
        fontSize: 24,
        alignSelf: 'center',
    },
    startIcon: {
        flex: 1,
        alignSelf: 'flex-start',
    },
    actionSheetButton: {
        height: 41,
        backgroundColor: Colors.MAIN_COLOR,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footerLoader: {
        height: 70,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    feedTitle: {
        height: 50,
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 18,
        color: Colors.N_BLACK,
        ...Font.Bold
    }
};

const deelDailyContainerStyle = StyleSheet.create(style);
export { deelDailyContainerStyle as deelDailyContainerStyle };
