import React, { useEffect, useState } from 'react';
import { View, ScrollView, Animated } from 'react-native';
import I19n from 'dz-I19n';
import ArrowIcon from 'assets/icons/ArrowRight.svg';
import { myMenuStyle as style } from './my-menu.component.style';
import { DzText, Touchable } from 'deelzat/v2-ui';
import { Colors, LayoutStyle, LocalizedLayout } from 'deelzat/style';
import { Space } from 'deelzat/ui';
import BookmarkIcon from 'assets/icons/Bookmark.svg';
import AddressIcon from 'assets/icons/Location1.svg';
import SalesIcon from 'assets/icons/Sale.svg';
import OrdersIcon from 'assets/icons/Orders.svg';
import CouponIcon from "assets/icons/Coupon.svg";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';

const MenuItem = (props) => {
  const { title, desc, icon, onPress = () => {} } = props;

  return (
    <Touchable onPress={onPress} style={style.optionContainer}>
      {icon}
      <Space directions={'v'} />
      <Space directions={'v'} size={'md'} />
      <View style={LayoutStyle.Flex}>
        <DzText style={style.optionTitle}>{title}</DzText>
        <DzText style={style.optionDesc}>{desc}</DzText>
      </View>
      <View style={LocalizedLayout.ScaleX()}>
        <ArrowIcon fill={Colors.alpha(Colors.N_BLACK, 0.3)} width={10} height={10} />
      </View>
    </Touchable>
  );
};

const MyMenu = (props) => {
  const { profileParams = { headerHeight: 0 } } = props;

  const [enableCouponsList] = useState(remoteConfig.getBoolean(RemoteConfigsConst.ENABLE_COUPONS_FEATURE));

  const onSavedPress = () => {
    RootNavigation.push(MainStackNavsConst.SAVED_PRODUCTS);
  };

  const onSalesPress = () => {
    RootNavigation.push(MainStackNavsConst.SALES, { shop: profileParams?.shop });
  };

  const onOrdersPress = () => {
    RootNavigation.push(MainStackNavsConst.ORDERS);
  };

  const onPressSavedAddresses = () => {
    RootNavigation.push(MainStackNavsConst.SAVED_ADDRESSES);
  };

  const onCouponPress = () => {
      RootNavigation.push(MainStackNavsConst.COUPONS_LIST);
  }

  return (
    <Animated.ScrollView
      bounces={false}
      scrollEventThrottle={16}
      onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: profileParams?.listPositionAnimation?.current },
              },
            },
          ],
          {
            useNativeDriver: true,
          },
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={style.container}
    >
      <View style={{ height: profileParams?.headerHeight }} />
      <Space directions={'h'} size={'md'} />

      <MenuItem
        title={I19n.t('الطلبات')}
        desc={I19n.t('تحقق من حالة طلباتك')}
        icon={<OrdersIcon stroke={profileParams?.theme?.color1 || Colors.MAIN_COLOR} width={16} height={20} />}
        onPress={onOrdersPress}
      />

      <Space directions={'h'} size={'md'} />

      <MenuItem
        title={I19n.t('المفضلة')}
        desc={I19n.t('منتجاتك المفضلة')}
        icon={<BookmarkIcon fill={profileParams?.theme?.color1 || Colors.MAIN_COLOR} width={16} height={20} />}
        onPress={onSavedPress}
      />

      <Space directions={'h'} size={'md'} />

      <MenuItem
          title={I19n.t('العناوين المحفوظة')}
          desc={I19n.t('إحفظ العنوانين مسبقاً لعملية شراء سريعة')}
          icon={<AddressIcon fill={profileParams?.theme?.color1 || Colors.MAIN_COLOR} width={20} height={20} />}
          onPress={onPressSavedAddresses}
      />

      <Space directions={'h'} size={'md'} />

      <MenuItem
        title={I19n.t('المبيعات')}
        desc={I19n.t('تحقق من مبيعاتك والتحصيلات')}
        icon={<SalesIcon fill={profileParams?.theme?.color1 || Colors.MAIN_COLOR} width={16} height={20} />}
        onPress={onSalesPress}
      />

        {
            (enableCouponsList) &&
               <>
                   <Space directions={'h'} size={'md'} />

                   <MenuItem
                       title={I19n.t('الكوبونات')}
                       desc={I19n.t('لمعرفة الكوبونات الخاصة بك')}
                       icon={<CouponIcon stroke={profileParams?.theme?.color1 || Colors.MAIN_COLOR} width={16} height={20} />}
                       onPress={onCouponPress}
                   />

                   <View style={{height: 160}} />
               </>
        }

    </Animated.ScrollView>
  );
};

export default MyMenu;
