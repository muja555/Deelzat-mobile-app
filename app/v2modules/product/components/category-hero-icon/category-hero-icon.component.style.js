import { StyleSheet } from "react-native";
import {Colors} from "deelzat/style";

const style = {
    container: {
        alignItems: 'center',
    },
    circle: {
        width: 60,
        height: 60,
        marginBottom: 6,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        flexWrap: 'wrap'
    }

};

const categoryHeroIconStyle = StyleSheet.create(style);
export { categoryHeroIconStyle as categoryHeroIconStyle };
