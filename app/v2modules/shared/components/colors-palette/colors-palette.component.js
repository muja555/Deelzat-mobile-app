import React from 'react';
import {TouchableOpacity, View} from 'react-native';

import {colorsPaletteStyle as style} from './colors-palette.component.style';
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
            return (
                <View key={item.color} style={[style.colorView,
                    {opacity: !!item.disabled? 0.3 : 1},
                    isSelected && style.colorViewSelected]}>
                    <TouchableOpacity
                        activeOpacity={1}
                        disabled={item.disabled}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        onPress={() => { onColorPress(item) }}
                        style={[style.color, { backgroundColor: item.color }]}>
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
