import React, {useState} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';

import { bannerItemStyle as style } from './banner-item.component.style';
import {Colors, Spacing} from "deelzat/style";
import {getLocale} from "dz-I19n";
import {ImageWithBlur} from "deelzat/v2-ui";
import {DzText} from "deelzat/v2-ui";
import {refactorImageUrl} from "modules/main/others/main-utils";

const IMAGE_WIDTH = Dimensions.get('window').width;

const BannerItem = (props) => {

    const {
        item = {},
        onPress = () => {},
        imageStyle = {},
        index,
    } = props;

    return (
        <TouchableOpacity style={style.container}
                          activeOpacity={1}
                          disabled={!item.clickable}
                          onPress={onPress}>
            <ImageWithBlur
                useFastImage={!index}
                withLoader={false}
                imageUrl={refactorImageUrl(item[`image_${getLocale()}`], IMAGE_WIDTH)}
                thumbnailUrl={refactorImageUrl(item[`image_${getLocale()}`], 1)}
                containerStyle={style.imageContainer}
                style={imageStyle}
                resizeMode={'contain'}
                spinnerColor={'white'}/>
            {
                (!!item.button) &&
                <DzText style={[style.buttonText,
                    {color: item.button.textColor ?? 'white'},
                    {backgroundColor: item.button.backgroundColor ?? Colors.MAIN_COLOR},
                ]}>
                    {item.button[getLocale()]}
                </DzText>
            }
        </TouchableOpacity>
    )
};

export default BannerItem;
