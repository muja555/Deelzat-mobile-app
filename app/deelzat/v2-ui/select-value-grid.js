import React, {memo} from 'react';
import {View} from "react-native";
import {multiValueGridStyle as style} from "./select-value-grid.style";
import {DzText, Touchable} from "./index";
import SelectValue from "./select-value";

const SelectValueGrid = (props) => {
    const {
        value = [],
        keyBy = 'key',
        labelBy = 'label',
        selectedStyle = {},
    } = props;

    const renderOption = ({item, index, onItemPress}) => {

        const selected = !!(value || []).find((i) => i[keyBy] === item[keyBy]);

        const onPress = () => {
            onItemPress(item);
        }
        return (
           <OptionView key={index+''+selected}
                       onPress={onPress}
                       isSelected={selected}
                       isDisabled={item.disabled}
                       label={item[labelBy]}
                       selectedStyle={selectedStyle}/>
        )
    }

    return(
        <View style={style.container}>
            <SelectValue renderOption={renderOption} {...props}/>
        </View>
    )
}

export default SelectValueGrid;


const OptionView = memo((props) => {
    const {
        isSelected,
        isDisabled,
        label,
        onPress,
        selectedStyle
    } = props;

    return (
        <Touchable
            style={[style.item,
                isSelected && {...style.itemSelected, ...selectedStyle},
                {opacity: isDisabled? 0.3 : 1}]}
            activeOpacity={1}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            disabled={!!isDisabled}
            onPress={onPress}>
            <DzText style={[style.itemText, isSelected && style.itemTextSelected]}>
                {label}
            </DzText>
        </Touchable>
    )
}, ((prevProps, nextProps) => {
   return  prevProps.isSelected === nextProps.isSelected
     && prevProps.isDisabled === nextProps.isDisabled
    // &&  prevProps.label === nextProps.label
    && prevProps.onPress === nextProps.onPress;
}))
