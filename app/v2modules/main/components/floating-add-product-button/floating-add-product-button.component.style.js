import {Dimensions, StyleSheet} from "react-native";

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCALE_DESIGN = 48 / 728;
const IMAGE_SIDE =  SCREEN_WIDTH / 5;

const style = {
    container: {
        position: "absolute",
        zIndex: 5000,
        bottom: 10 * SCALE_DESIGN,
        right: 12 * SCALE_DESIGN,
    },
    image: {
        width: IMAGE_SIDE,
        height: IMAGE_SIDE
    }
};

const floatingAddProductButtonStyle = StyleSheet.create(style);
export { floatingAddProductButtonStyle as floatingAddProductButtonStyle };
