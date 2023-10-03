import React, { useState } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import { productEditHeaderStyle as style } from './product-edit-header.component.style';
import BackSvg from "assets/icons/BackIcon.svg";
import I19n from 'dz-I19n';
import {LocalizedLayout} from "deelzat/style";
import {DzText} from "deelzat/v2-ui";

const ProductEditHeader = (props) => {

    const  {
        onBack = () => {},
        title = I19n.t('إضافة منتج'),
        stepIndex = 0,
        stepsCount = 1,
    } = props;

    return (
        <View style={style.container}>
            <View style={style.head}>
                <View style={[style.btnView, LocalizedLayout.ScaleX()]}>
                    <TouchableOpacity
                        onPress={() => { onBack() }}
                        hitSlop={{top: 100, bottom: 100, left: 100, right: 100}}
                        activeOpacity={1} >
                        <BackSvg width={24} height={24}/>
                    </TouchableOpacity>
                </View>
                <View style={style.titleView}>
                    <DzText style={style.title}>
                        {title}
                    </DzText>
                </View>
                <View style={style.btnView} />
            </View>
            <View style={style.progressBarView}>
                <View style={[style.progressBar, {width: stepsCount > 0 ? ((stepIndex/stepsCount) * 100 + '%') : 0}]}/>
            </View>

        </View>
    );
};

export default ProductEditHeader;
