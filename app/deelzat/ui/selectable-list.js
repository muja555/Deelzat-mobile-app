import React from 'react';
import {View} from 'react-native'
import isEqual from "lodash/isEqual";
import SelectableListButton from "./selectable-list-button";

const SelectableList = (props) => {
    const {
        isMultiSelect = false,
        options = [],
        value = [],
        onChange = () => {},
        keyBy = 'key',
        labelBy = 'label',
        textStyleSelected = {},
        textStyleUnselected = {},
        containerStyleSelected = {},
        containerStyleUnselected = {},
    } = props;

    const onItemPress = (item) => {

        let newValue = [];
        if (value) {
            const exist = value.find((i) => isEqual(i[keyBy], item[keyBy]));
            newValue = isMultiSelect? value.filter((i) => !isEqual(i[keyBy], item[keyBy])) : [];
            if(!exist) {
                newValue.push(item);
            }
        }
        else {
            newValue.push(item);
        }
        onChange(newValue);
    };

    const optionsList = options.map((item, index) => {

        const selected = (value || []).find((i) => isEqual(i[keyBy], item[keyBy]));
        return <SelectableListButton isSelected={selected}
                                     title={item[labelBy]}
                                     key={item[keyBy] + index}
                                     onItemPress={() => onItemPress(item)}
                                     textStyleSelected={textStyleSelected}
                                     textStyleUnselected={textStyleUnselected}
                                     containerStyleSelected={containerStyleSelected}
                                     containerStyleUnselected={containerStyleUnselected}/>
    })

    return (
        <View>
            {optionsList}
        </View>
    )
}

export default SelectableList;
