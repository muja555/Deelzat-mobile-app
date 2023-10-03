import React from 'react';
import SelectValue from "./select-value";
import {ScrollView, Text} from "react-native";
import Touchable from "./touchable";
import {selectValueRowScrollStyle as style} from "./select-value-row-scroll.style";
import {isArraysEqual} from "modules/main/others/main-utils";
import DzText from "./dz-text";

const SelectValueRowScroll = (props) => {
    const {
        value = [],
        keyBy = 'key',
        labelBy = 'label',
        labelPostfix = '',
    } = props;

    const renderOption = ({item, index, onItemPress}) => {
        const selected = !!(value || []).find((i) => {
            if (Array.isArray(i[keyBy]) && Array.isArray(item[keyBy])) {
                return isArraysEqual(i[keyBy], item[keyBy], 'value');
            }
            else {
                return i[keyBy] === item[keyBy];
            }
        });
        return (
            <Touchable style={[style.button, selected && style.buttonSelected]}
                       activeOpacity={1}
                       hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                       disabled={!!item.disabled}
                       onPress={() => onItemPress(item)}
                       key={item[keyBy] + "" + index}>
                <DzText style={[style.label, selected && style.labelSelected]}>
                    {item[labelBy] +  labelPostfix}
                </DzText>
            </Touchable>
        )
    }

    return (
        <ScrollView horizontal={true}
                    bounces={false}
                    showsHorizontalScrollIndicator={false}>
            <SelectValue renderOption={renderOption} {...props}/>
        </ScrollView>
    )
}

export default SelectValueRowScroll;
