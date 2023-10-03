import React from 'react';
import {multiValueRowStyle as style} from "./select-value-row.style";
import {Text, View} from "react-native";
import isEqual from "lodash/isEqual";
import {DzText, Touchable} from "./index";
import SelectValue from "./select-value";

const SelectValueRow = (props) => {
    const {
        options = [],
        value = [],
        keyBy = 'key',
        labelBy = 'label',
    } = props;

    const renderOption = ({item, index, onItemPress}) => {
        const selected = (value || []).find((i) => isEqual(i[keyBy], item[keyBy]));
        return (
            <Touchable style={[
                style.button,
                selected && style.selected,
                {flex: 1 / options.length},
                index !== 0 && style.buttonStart,
                index !== options.length - 1 && style.buttonEnd,
            ]}
                       onPress={() => onItemPress(item)}
                       key={item[keyBy]}>
                <DzText style={style.text}>
                    {item[labelBy]}
                </DzText>
            </Touchable>
        )

    }

    return (
        <View style={style.container}>
            <SelectValue renderOption={renderOption} {...props}/>
        </View>
    )
}

export default SelectValueRow;
