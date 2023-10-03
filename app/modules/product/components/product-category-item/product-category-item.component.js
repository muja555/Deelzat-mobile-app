import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DoneOutlineSvg from 'assets/icons/DoneOutline.svg';
import { productCategoryItemStyle as style } from './product-category-item.component.style';
import {Colors} from "deelzat/style";
import {getLocale} from "dz-I19n";
import {SvgXml} from "react-native-svg";
import {DzText} from "deelzat/v2-ui";
import {useFetch} from "v2modules/main/others/cache.utils";

const ProductCategoryItem = (props) => {

    const {
        selected = {},
        itemStyle = {},
        category = {},
        onPress = () => {}
    } = props;

    const icon = useFetch(category?.bigIcon, false);

    return (
        <TouchableOpacity activeOpacity={1} onPress={() =>  {onPress(category)}} style={[style.container, itemStyle]}>

            {
                (!!icon) &&
                <View pointerEvents="none">
                    <SvgXml
                        width={60}
                        onPress={undefined}
                        height={60}
                        xml={icon}/>
                </View>
            }

            {
                (selected && selected.objectID === category.objectID) &&
                <View style={style.checkView}>
                    <DoneOutlineSvg fill={Colors.MAIN_COLOR} height={15} width={15} />
                </View>
            }

            <DzText style={style.titleView}>
                {category[getLocale()].title}
            </DzText>
        </TouchableOpacity>
    );
};

export default ProductCategoryItem;
