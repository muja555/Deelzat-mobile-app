import React, { useState } from 'react';
import { View, Text } from 'react-native';

import { Colors, LayoutStyle, LocalizedLayout } from 'deelzat/style';
import IconButton from 'deelzat/v2-ui/icon-button';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import { ButtonOptions } from 'deelzat/ui';
import BackSvg from 'assets/icons/BackIcon.svg';
import { DzText } from 'deelzat/v2-ui';
import { pageHeaderStyle as style } from './page-header.component.style';

const PageHeader = (props) => {
    const {
        title = '',
        viewStyle = {},
        titleStyle = {},
        backBtnStyle = {},
        onPressBack,
    } = props;

    return (
        <View style={[LayoutStyle.Row, LayoutStyle.AlignItemsCenter, viewStyle]}>
            <IconButton onPress={onPressBack || RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX(), backBtnStyle]} type={ButtonOptions.Type.MUTED_OUTLINE}>
                <BackSvg stroke={Colors.N_BLACK} width={24} height={24}/>
            </IconButton>
            <DzText style={[style.title, titleStyle]}>
                {title}
            </DzText>
            <View style={style.endPlaceholder}/>
        </View>
    );
};

export default PageHeader;
