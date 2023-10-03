import React, {memo} from 'react';
import {Dimensions, TouchableOpacity} from 'react-native';

import { activitiesItemStyle as style } from './activities-item.component.style';
import {ImageWithBlur} from "deelzat/v2-ui";
import {getLocale} from "dz-I19n";
import {refactorImageUrl} from "modules/main/others/main-utils";

const IMAGE_WIDTH = Dimensions.get('window').width * 2;

const ActivitiesItem = memo((props) => {

    const {
        item = {},
        viewStyle = {},
        onPress = () => {}
    } = props;


    return (
        <TouchableOpacity
            style={[style.container, viewStyle]}
            activeOpacity={1}
            onPress={() => {
                onPress(item)
            }}>
            <ImageWithBlur
                useFastImage={false}
                resizeMode='cover'
                resizeMethod="scale"
                style={style.image}
                imageUrl={refactorImageUrl(item[`image_${getLocale()}`], viewStyle.flex === 0.5 ? IMAGE_WIDTH / 2 : IMAGE_WIDTH)}
                thumbnailUrl={refactorImageUrl(item[`image_${getLocale()}`], 1)}
            />
        </TouchableOpacity>
    );
}, (prevProps, nextProps) =>
    prevProps.item?.objectID === nextProps.item?.objectID);

export default ActivitiesItem;
