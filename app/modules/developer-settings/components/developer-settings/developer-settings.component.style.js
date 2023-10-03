import { StyleSheet } from "react-native";
import {Colors, Font} from "deelzat/style";

const style = {
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 25,
        paddingBottom: 45,
        borderRadius: 8
    },
    header: {
        width: '100%',
        paddingTop: 20,
        backgroundColor: "#fff",
    },
    btnView: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: Colors.alpha(Colors.N_BLACK, 0.1)
    },
    fieldContainer: {
        marginTop: 16,
    },
    endPointsList: {
        marginTop: 5,
    },
    settingsButton: {
        marginTop: 20,
    },
    logoutButton: {
        marginTop: 20,
    },

};

const developerSettingsStyle = StyleSheet.create(style);
export { developerSettingsStyle as developerSettingsStyle };
