import { StyleSheet } from "react-native";
import {Colors, Font} from 'deelzat/style'

const viewHeight = 40;
const newViewHeight = 56;

const style = {
    container: {
        height: viewHeight,
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    newContainerHeight: {
        height: newViewHeight
    },
    selectedButton: {
        borderBottomWidth : 3,
        borderBottomColor: Colors.ACCENT_BLUE,
    },
    newSelectedButton: {
        borderBottomWidth : 4,
        borderBottomColor: Colors.MAIN_COLOR,
    },
    optionButton: {
        width: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.GREY,
    },
    buttonText: {
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginBottom: 8
    },
    selectedButtonText: {
        color: Colors.MAIN_COLOR,
        ...Font.Bold
    },
    shadowView: {
        position: 'absolute',
        resizeMode: 'stretch',
        top: viewHeight,
        zIndex: 1000,
        height: 8,
        width: '100%',
        opacity: 0.5,
    },
    newShadowView: {
        top: newViewHeight,
    }
};

const CollapsibleTopTabsButtonsStyle = StyleSheet.create(style);
export { CollapsibleTopTabsButtonsStyle as CollapsibleTopTabsButtonsStyle };
