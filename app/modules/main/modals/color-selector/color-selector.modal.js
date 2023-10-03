import React from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import Modal from "react-native-modal";

import {colorSelectorModalStyle as style} from './color-selector.modal.style';
import ColorsPalette from "modules/main/components/colors-palette/colors-palette.component";
import I19n from 'dz-I19n';
import {DzText} from "deelzat/v2-ui";

const ColorSelectorModal = (props) => {

    const {
        isVisible = false,
        selected = [],
        onChange = (values) => {},
        colors = [],
        onHide = () => {}
    } = props;

    return (
        <Modal
            onBackButtonPress={onHide}
            onBackdropPress={onHide}
            useNativeDriver={true}
            isVisible={isVisible}
            style={style.container}>
            <View style={style.content}>
                <View style={style.head}>
                    <TouchableOpacity
                        activeOpacity={1}
                        style={style.doneView}
                        onPress={onHide}>
                        <DzText style={style.doneText}> {I19n.t('تم')} </DzText>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <ColorsPalette
                        style={style.colorsView}
                        selected={selected}
                        onChange={onChange}
                        colors={colors} />
                </ScrollView>
            </View>
        </Modal>
    );
};

export default ColorSelectorModal;
