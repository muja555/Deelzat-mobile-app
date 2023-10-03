import React from 'react';
import {View, Text, TouchableHighlight} from 'react-native'
import {selectableListButtonStyle as style} from './selectable-list-button.style'
import CheckedIcon from "assets/icons/DoneOutline.svg";
import {Colors} from "../style";
import UncheckedIcon from "assets/icons/CircleOutline.svg";
import {DzText} from "../v2-ui";


const SelectableListButton = (props) => {
    const {
        onItemPress = () => {},
        isSelected = false,
        checkIndicatorSize = 17,
        title = '',
        disabled = false,
        textStyleSelected = {},
        textStyleUnselected = {},
        containerStyleSelected = {},
        containerStyleUnselected = {},
    } = props


    return (
        <TouchableHighlight
            key={title}
            activeOpactity={1}
            underlayColor="#fff"
            hitSlop={{top: 10, bottom: 10, left: 400, right: 400}}
            onPress={onItemPress}
            disabled={disabled}>
            <View style={[style.container,
                isSelected && containerStyleSelected,
                !isSelected && containerStyleUnselected,
                disabled && style.containerDisabled
            ]}>
                <View style={[style.selectListItemIcon, {width: checkIndicatorSize, height: checkIndicatorSize}]}>
                    {
                        isSelected &&
                        <CheckedIcon width={checkIndicatorSize} height={checkIndicatorSize} fill={Colors.ACCENT_BLUE}/>
                    }
                    {
                        !isSelected &&
                        <UncheckedIcon width={checkIndicatorSize} height={checkIndicatorSize}/>
                    }
                </View>
                <DzText style={[style.selectListItemTitle, isSelected && textStyleSelected, !isSelected && textStyleUnselected]}>
                    {title?.trim()}
                </DzText>
            </View>

        </TouchableHighlight>
    )

}

export default SelectableListButton
