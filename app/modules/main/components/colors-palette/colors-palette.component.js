import React from 'react';
import {TouchableOpacity, View} from 'react-native';

import {colorsPaletteStyle as style} from './colors-palette.component.style';
import DoneOutlineSvg from "assets/icons/DoneOutline.svg";
import {Colors} from "deelzat/style";
import findIndex from "lodash/findIndex";

const ColorsPalette = (props) => {

    const {
        selected = [],
        onChange = (values) => {},
        colors = [],
        multi = true,
    } = props;

    const onColorPress = (item) => {
        const isSelected = findIndex(selected, (i) => i.color === item.color) > -1;
        if (isSelected) {
            onChange(selected.filter((i) => i.color !== item.color));
        }
        else {
            const newSelected = multi? [...selected] : [];
            newSelected.push(item);
            onChange(newSelected);
        }
    };


    const colorsPaletteContent = colors
        .map((item)  => {
            const isSelected = findIndex(selected, (i) => i.color === item.color) > -1;
            const fillColor = item.color === '#ffffff' ? Colors.GREY : '#fff';
            return (
                <View key={item.color} style={[style.colorView, {opacity: !!item.disabled? 0.3 : 1}]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        disabled={item.disabled}
                        onPress={() => { onColorPress(item) }}
                        style={[style.color, { backgroundColor: item.color }]}>
                        { isSelected &&  <DoneOutlineSvg fill={fillColor} style={style.check} />}
                    </TouchableOpacity>
                </View>
            );
        });

    return (
        <View style={style.container}>
            {colorsPaletteContent}
        </View>
    );
};

export default ColorsPalette;
