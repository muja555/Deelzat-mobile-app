import React, {useState} from 'react';
import {Colors} from "../style";
import {StyleSheet} from "react-native";
import {DzText, Touchable} from "./index";
import I19n from "dz-I19n";
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'deelzat/toast';

const _style = {
    textStyle: {
        color: Colors.N_BLACK,
        fontSize: 12,
        textAlign: 'left',
    },
    showMoreHandle: {
        color: Colors.MAIN_COLOR,
        fontSize: 12,
    },
};
const style = StyleSheet.create(_style);

const EXPAND_STATE = {
    EXPANDED: 'EXPANDED',
    COLLAPSED: 'COLLAPSED',
    NONE: 'NONE',
};
Object.freeze(EXPAND_STATE);

const ExpandableText = (props) => {

    const {
        text = '',
        minimumLines = 3,
        textStyle = {},
        copyOnLongPress = false,
    } = props;

    const [description, descriptionSet] = useState({
        state: EXPAND_STATE.NONE,
        trimmed: ''
    });

    const onLayout = (e) => {
        const lines = e.nativeEvent.lines;
        if (!description.trimmed && lines.length > minimumLines) {
            let newText = lines.slice(0, minimumLines)
                .map(i => i.text)
                .join('')
                .slice(0, -1);
            if (!newText.endsWith("...")) {
                newText = newText +  " ... ";
            }
            descriptionSet({
                state: EXPAND_STATE.COLLAPSED,
                trimmed: newText,
            });
        }
    }

    const onExpandDescription = () => {
        descriptionSet(prev => ({
            trimmed: prev.trimmed,
            state: prev.state !== EXPAND_STATE.EXPANDED ? EXPAND_STATE.EXPANDED : EXPAND_STATE.COLLAPSED
        }));
    }


    const onTitleLongPress = () => {
        Clipboard.setString(text);
        Toast.info(I19n.t('تم النسخ'));
    }


    return (
         <Touchable  disabled={description?.state === EXPAND_STATE.NONE}
                     onLongPress={copyOnLongPress? onTitleLongPress: undefined}
                     onPress={onExpandDescription}>
             <DzText onTextLayout={onLayout}
                     style={[style.textStyle, textStyle]}
                     numberOfLines={0}>
                 <DzText style={[style.textStyle, textStyle]}>
                     {description.state === EXPAND_STATE.COLLAPSED? description.trimmed :  text}
                 </DzText>
                 {
                     (description.state !== EXPAND_STATE.NONE) &&
                     <DzText style={style.showMoreHandle}>
                         {description.state === EXPAND_STATE.COLLAPSED ? I19n.t('أظهر المزيد') :
                             ("  " + I19n.t('أظهر أقل') + "  ")
                         }
                     </DzText>
                 }
             </DzText>
         </Touchable>
     );
}

export default ExpandableText;
