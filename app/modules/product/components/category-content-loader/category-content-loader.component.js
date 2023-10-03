import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { categoryContentLoaderStyle as style } from './category-content-loader.component.style';
import ContentLoader, {Rect} from "react-content-loader/native";
import {Colors} from "deelzat/style";

const CategoryContentLoader = () => {

    return (
        <View style={style.container}>
            <ContentLoader
                backgroundColor={Colors.LIGHT_GREY}
                foregroundColor={'#fff'}
                gradientRatio={0.1}
                speed={1}
                interval={0.1}>
                <Rect x="0" y="0" rx="20" ry="20" width="100%" height="40" />

                <Rect x="0" y="60" rx="10" ry="10" width="47.5%" height="150" />
                <Rect x="52.5%" y="60" rx="10" ry="10" width="47.5%" height="150" />

                <Rect x="0" y="220" rx="10" ry="10" width="47.5%" height="150" />
                <Rect x="52.5%" y="220" rx="10" ry="10" width="47.5%" height="150" />

                <Rect x="0" y="390" rx="10" ry="10" width="47.5%" height="150" />
                <Rect x="52.5%" y="390" rx="10" ry="10" width="47.5%" height="150" />
            </ContentLoader>
        </View>
    );
};

export default CategoryContentLoader;
