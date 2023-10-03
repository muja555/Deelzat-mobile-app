import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flex: 1
    },
    headerTitle: {
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    section: {
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1),
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
    },
    languageOption: {
        textAlign: 'left',
        fontSize: 14,
        color: Colors.N_BLACK,
        ...Font.Bold
    },
    languageOptionSelected: {
        color: Colors.MAIN_COLOR,
        ...Font.Bold
    },
    sectionText: {
        marginTop: 10,
        fontSize: 12,
        color: Colors.N_BLACK,
    },
    separateLanguageSelected: {
        alignSelf: 'center',
        fontSize: 16,
        color: Colors.MAIN_COLOR,
        ...Font.Bold
    },
    separateLanguageView: {
        alignSelf: 'center',
    }

};

const settingsStyle = StyleSheet.create(style);
export { settingsStyle as settingsStyle };
