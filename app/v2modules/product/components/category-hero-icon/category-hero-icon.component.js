import React, {useState} from 'react';
import {View} from 'react-native';

import { categoryHeroIconStyle as style } from './category-hero-icon.component.style';
import {SvgXml} from 'react-native-svg';
import {getLocale} from "dz-I19n";
import {DzText} from "deelzat/v2-ui";
import {useFetch} from "v2modules/main/others/cache.utils";

const CategoryHeroIcon = (props) => {

    const {
        category = null,
        viewStyle = {},
    } = props;

    const icon = useFetch(category?.bigIcon, false);

    if (!category) {
        return <></>;
    }


    return (
        <View style={[style.container, viewStyle]}>
            {
                (!!icon) &&
                <View style={style.circle}>
                    <SvgXml
                        width={60}
                        height={60}
                        xml={icon}/>
                </View>
            }
            <DzText style={style.title}>{category[getLocale()].title}</DzText>
        </View>
    );
};

export default CategoryHeroIcon;
