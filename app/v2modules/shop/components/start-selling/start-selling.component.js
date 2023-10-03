import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import RoadMap from 'assets/icons/RoadMap.svg';
import I19n from 'dz-I19n';

import { startSellingStyle as style } from './start-selling.component.style';
import { DzText, Touchable } from 'deelzat/v2-ui';
import { Space } from 'deelzat/ui';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';

const StartSelling = (props) => {
  const { text, profileParams} = props;

  const onPress = () => {
    RootNavigation.push(MainStackNavsConst.ADD_PRODUCT, {
      trackSource: { name: EVENT_SOURCE.MY_SHOP },
    });
  };

  return (
    <View
      style={[
        style.container,
        profileParams?.headerHeight > 0 && { paddingTop: profileParams.headerHeight },
      ]}
    >
      <View style={style.inner}>
        <RoadMap width={150} height={112} />
        <Space directions={'h'} size={'md'} />
        <DzText style={[style.bigText, profileParams?.theme && {color: profileParams?.theme?.color1}]}>
          {text || I19n.t('أضف منتجاتك وابدأ بالبيع لتفعيل متجرك')}
        </DzText>
        <Space directions={'h'} size={'md'} />
        <Touchable onPress={onPress} style={[style.btn, profileParams?.theme && {backgroundColor: profileParams.theme.color1}]}>
          <DzText style={[style.btnText, profileParams?.theme && {color: 'white'}]}>{I19n.t('ابدأ بالبيع')}</DzText>
        </Touchable>
      </View>
    </View>
  );
};

export default StartSelling;
