import React from "react";
import {selectListStyle as style} from "./select-value-list.style";
import MarkIcon from "assets/icons/Mark.svg";
import {Text, View} from "react-native";
import {DzText, Touchable} from "./index";
import SelectValue from "./select-value";

const SelectValueList = (props) => {
    const {
        options = [],
        value = [],
        onChange = ([]) => {},
        keyBy = 'key',
        labelBy = 'label',
        iconBy,
        withSeparator = true,
        radioStyle = {},
        radioMark,
        rowStyle = {},
        labelStyle = {},
    } = props;

    const renderOption = ({item, index, onItemPress}) => {

        const selected = !!(value || []).find((i) => i[keyBy] === item[keyBy]);
        const icon = item[iconBy];

        return (
            <Touchable
                activeOpactity={1}
                underlayColor="#fff"
                disabled={item.disabled}
                hitSlop={{top: 10, bottom: 10, left: 400, right: 400}}
                onPress={() => onItemPress(item)}
                key={item[keyBy] + ""}>
                {
                    (index !== 0 && withSeparator) &&
                    <View style={style.separator}/>
                }
                <View style={[style.rowView, rowStyle, item.disabled && {opacity: 0.8}]}>
                    {
                        (!!icon) &&
                        icon
                    }
                    {
                        (!!icon) &&
                        <View style={{width: 24}}/>
                    }
                    <DzText style={[style.optionLabel, labelStyle]}>
                        {item[labelBy]}
                    </DzText>
                    <View style={[style.radioView, radioStyle]}>
                        {
                            (selected && !radioMark) &&
                            <MarkIcon width={11} height={9}/>
                        }
                        {
                            (selected && !!radioMark) &&
                            radioMark
                        }
                    </View>
                </View>
            </Touchable>
        )
    }

    return (
        <View>
            <SelectValue renderOption={renderOption} {...props}/>
        </View>
    )
}

export default SelectValueList;
