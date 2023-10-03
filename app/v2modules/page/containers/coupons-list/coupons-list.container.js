import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, Dimensions } from 'react-native';

import { couponsListContainerStyle as style } from './coupons-list.container.style';
import { Colors, LayoutStyle, Spacing } from 'deelzat/style';
import { Space } from 'deelzat/ui';
import PageHeader from 'v2modules/shared/components/page-header/page-header.component';
import I19n, { getLocale, isRTL } from 'dz-I19n';
import { useDispatch, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CouponApi from 'v2modules/checkout/apis/coupon.api';

import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';
import { geoSelectors } from 'v2modules/geo/stores/geo/geo.store';
import WillShowToast from 'deelzat/toast/will-show-toast';
import moment from 'moment-timezone';
import CouponsListItem from 'v2modules/page/components/coupons-list-item/coupons-list-item.component';
import * as Actions from 'v2modules/checkout/stores/checkout/checkout.actions';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import { checkoutThunks } from 'v2modules/checkout/stores/checkout/checkout.store';


const CouponsListContainer = (props) => {

    const {
        isSelectingCheckoutMode = false,
        preList,
    } = props.route?.params || {};

    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const [isLoading, isLoadingSet] = useState(true);
    const [list, listSet] = useState(preList || []);

    useEffect(() => {

        // For formatting time
        moment.locale('EN');

        if (!preList) {
            CouponApi.getCoupons()
                .then(res => {
                    const _list = res?.coupons || [];
                    listSet(_list);
                    isLoadingSet(false);
                })
                .catch(console.warn);
        }
    }, []);


    const renderItem = useCallback(({item}) => {

        const onPressCoupon = () => {
            dispatch(Actions.SetCoupon(item));
            dispatch(checkoutThunks.refreshSessionData({coupon: item}));
            RootNavigation.goBack();
        };

        return (
            <CouponsListItem coupon={item}
                             onPressCoupon={isSelectingCheckoutMode? onPressCoupon: null} />
        );
    }, []);


    const ListEmptyComponent = useCallback(() => {
        if (list.length > 0) {
            return <></>
        }

        if (isLoading) {
            return (
                <View style={LayoutStyle.Flex}>
                    <ActivityIndicator size="large"
                                       style={style.bigLoader}
                                       color={Colors.MAIN_COLOR} />
                </View>
            )
        }

        return (
            <View style={[LayoutStyle.Flex, LayoutStyle.JustifyContentCenter, {marginTop: -100}]}>
                <View>
                    <CouponsListItem coupon={null} />
                </View>
            </View>
        )
    }, [list, isLoading]);


    const ListHeader = useCallback(() => {
        return (
            <View style={{height: (insets.top || 12) + 60}} />
        )
    }, [insets.top]);


    const ListSeparator = useCallback(() => {
        return (
            <View style={{ height: 22 }} />
        );
    }, []);


    const keyExtractor = useCallback((item, index) => item.id, []);

    return (
        <View style={[style.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <WillShowToast id={'coupons-list'} />
            <FlatList data={list}
                      renderItem={renderItem}
                      keyExtractor={keyExtractor}
                      ItemSeparatorComponent={ListSeparator}
                      showsVerticalScrollIndicator={false}
                      ListHeaderComponent={ListHeader}
                      ListEmptyComponent={ListEmptyComponent}
                      contentContainerStyle={style.list} />
            <View style={[Spacing.HorizontalPadding, {top: insets.top, position: 'absolute', width: '100%'}]}>
                <Space directions={'h'} size={'md'} />
                <PageHeader title={I19n.t('الكوبونات')}
                            backBtnStyle={{backgroundColor: 'white'}}
                            titleStyle={{ color: Colors.MAIN_COLOR }} />
            </View>
        </View>
    );
};

export default CouponsListContainer;
