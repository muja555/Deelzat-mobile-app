import { StyleSheet } from "react-native";
import Colors from './colors';

const style = {
    Muted: {
        color: Colors.Gray600
    },
    Primary: {
        color: Colors.MAIN_COLOR
    },
    Dark: {
        color: Colors.Gray900
    },
    Danger: {
        color: Colors.ERROR_COLOR
    },
    White: {
        color: '#fff'
    }
};

const TextStyle = StyleSheet.create(style);
export { TextStyle as TextStyle };
