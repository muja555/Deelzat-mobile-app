import React from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import {formStyle as style} from "./style";
import {Colors} from "../style";
import DoneOutlineSvg from "assets/icons/DoneOutline.svg";
import {DzText} from "../v2-ui";


const Radio = (props) => {

    const {
        label = '',
        errorMessage = '',
        options = [],
        value = null,
        onChange = (value) => {},
        keyBy = 'key',
        labelBy = 'label',
        descriptionBy = 'description',
        iconBy = 'icon',
        radioOptionIconStyle = {},
        labelStyle = {},
    } = props;

    const optionsContent = options.map((item) => {

        const isSelected = !!value && value[keyBy] === item[keyBy];
        const description = item[descriptionBy];
        const icon = item[iconBy];

        return (
            <TouchableOpacity
                key={item[keyBy]}
                activeOpacity={1}
                style={[style.radioOptionView, isSelected ? style.radioOptionViewSelected : null]}
                onPress={() => { onChange(item); }}>
                { isSelected &&  <DoneOutlineSvg fill={Colors.ACCENT_BLUE} height={14} width={14} />}
                { !isSelected &&  <View style={style.radioEmptyCheck} />}
                <DzText style={[style.radioOptionLabel, isSelected && style.radioOptionLabelSelected, labelStyle]}>{item[labelBy]}</DzText>
                {
                    (!!description && description !== '') &&
                    <DzText style={[style.radioOptionDescription, isSelected ? style.radioOptionDescriptionSelected : null]}>{description}</DzText>
                }
                {
                    (!!icon && typeof(icon) === 'string' && icon !== '') &&
                    <DzText style={[style.radioOptionIcon, radioOptionIconStyle]}>{icon}</DzText>
                }
                {
                    (!!icon && typeof(icon) !== 'string') &&
                    icon
                }

            </TouchableOpacity>
        )
    });

    return (
        <View>
            <View style={style.head}>
                {
                    (label !== '') &&
                    <DzText style={[style.label, labelStyle]}>{label}</DzText>
                }
                {
                    (errorMessage !== '') &&
                        <View style={style.errorMessageView}>
                            <DzText style={style.errorMessage}>{errorMessage}</DzText>
                        </View>
                }
            </View>
            <View style={style.radioOptionsView}>
                {optionsContent}
            </View>
        </View>
    )


};

export default Radio;
