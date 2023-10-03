import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View } from 'react-native';

import { salesContainerStyle as style } from './sales.container.style';
import { ButtonOptions, Space } from 'deelzat/ui';
import { Colors, LayoutStyle, LocalizedLayout, Spacing } from 'deelzat/style';
import BackSvg from 'assets/icons/BackIcon.svg';
import I19n from 'dz-I19n';
import IconButton from 'deelzat/v2-ui/icon-button';
import { getTabsOptions, SalesTabConst } from './sales.container.utils';
import { DzText, Touchable } from 'deelzat/v2-ui';
import CornerIcon from 'assets/icons/RoundCorner.svg';
import SalesTabConfirmed from 'v2modules/page/components/sales-tab-confirmed/sales-tab-confirmed.component';
import SalesTabPending from 'v2modules/page/components/sales-tab-pending/sales-tab-pending.component';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { persistentDataSelectors } from 'modules/main/stores/persistent-data/persistent-data.store';
import WillShowToast from 'deelzat/toast/will-show-toast';
import ImagePreviewModalService from 'v2modules/shared/modals/image-preview/image-preview.modal.service';
import PagerView from '@deelzat/react-native-pager-view';
import { trackClickOnPageTab } from 'modules/analytics/others/analytics.utils';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const TAB_BUTTON_HEIGHT = 43;
const SalesContainer = (props) => {
    const {
        shop = {},
    } = props.route?.params || {};

    const insets = useSafeAreaInsets();

    const markets = useSelector(persistentDataSelectors.shippableCountriesSelector);
    const [currencyCode, currencyCodeSet] = useState();

    const tabsPagerRef = useRef();
    const [TabOptions] = useState(getTabsOptions());
    const [tabs] = useState([SalesTabConst.IN_PROGRESS, SalesTabConst.CONFIRMED]);
    const [currentTab, currentTabSet] = useState(SalesTabConst.IN_PROGRESS);
    const currentIndex = useMemo(() => tabs.findIndex(t => t === currentTab), [currentTab]);

    useEffect(() => {
        const shopCountryCode = shop?.country_codes?.length > 0 ? shop?.country_codes[0] : 'PS';
        if (markets.length) {
            currencyCodeSet(
                markets.find(country => country.code === shopCountryCode)?.currency || 'ILS',
            );
        }
    }, [markets, shop?.country_codes]);


    const onTabButtonPress = (selectedTab) => {
        if (selectedTab !== currentTab) {
            currentTabSet(selectedTab);
            trackClickOnPageTab(selectedTab);
            tabsPagerRef.current.setPage(tabs.indexOf(selectedTab));
        }
    };


    const renderTabButtons = tabs.map((key, index) => {
        const focused = currentTab === key;
        const option = TabOptions[key];
        return (
            <Touchable
                activeOpacity={1}
                onPress={() => onTabButtonPress(tabs[index])}
                key={index}
                style={[style.tabBtn,
                    focused && style.tabBtnFocused,
                    focused && { backgroundColor: option?.backgroundColor },
                    { flex: 1 / tabs.length, height: TAB_BUTTON_HEIGHT }]}>
                <DzText style={[
                    style.tabBtnText,
                    focused && style.tabBtnTextFocused,
                    focused && { color: option?.focusedLabelColor },
                    option?.labelStyle]}>
                    {option?.label}
                </DzText>
                {
                    (!focused && currentIndex - index === 1) &&
                    <View style={style.endBottomCorner}>
                        <CornerIcon width={29}
                                    height={28}
                                    fill={TabOptions[currentTab].backgroundColor} />
                    </View>
                }
                {
                    (!focused && currentIndex - index === -1) &&
                    <View style={style.startBottomCorner}>
                        <CornerIcon width={29}
                                    height={28}
                                    fill={TabOptions[currentTab].backgroundColor} />
                    </View>
                }
            </Touchable>
        );
    });


    const onPressProduct = useCallback((productId, orderId) => {
        RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS, {
            skeleton: { id: productId },
            trackSource: { name: EVENT_SOURCE.SHOP_ORDERS, attr1: shop.id, attr2: orderId },
        });
    }, []);


    const onLongPressItem = useCallback((image) => {
        ImagePreviewModalService.setVisible({
            show: true,
            imageUrl: image,
        });
    }, []);

    const onPressOutItem = useCallback(() => {
        ImagePreviewModalService.setVisible({
            show: false,
        });
    }, []);

    return (
        <View style={[style.container, { paddingTop: insets.top }]}>
            <WillShowToast id={'sales'} />
            <Space directions={'h'} size={'md'} />
            <View style={[LayoutStyle.Row, Spacing.HorizontalPadding, LayoutStyle.AlignItemsCenter]}>
                <IconButton onPress={RootNavigation.goBack} btnStyle={[style.backButton, LocalizedLayout.ScaleX()]}
                            type={ButtonOptions.Type.MUTED_OUTLINE}>
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24} />
                </IconButton>
                <DzText style={style.title}>
                    {I19n.t('المبيعات')}
                </DzText>
                <View style={style.endPlaceholder} />
            </View>
            <View style={{ height: 29 }} />
            <View style={style.tabButtons}>
                {renderTabButtons}
            </View>
            <View style={[style.pageContainer,
                { backgroundColor: TabOptions[currentTab].backgroundColor },
                (currentIndex !== 0) && { borderTopLeftRadius: 24 },
                (currentIndex !== tabs.length - 1) && { borderTopRightRadius: 24 }]}>
                <PagerView style={LayoutStyle.Flex}
                           scrollEnabled={false}
                           ref={tabsPagerRef}
                           collapsable={false}
                           initialPage={0}>
                    <View style={[LayoutStyle.Flex, Spacing.HorizontalPadding]} key={SalesTabConst.IN_PROGRESS}>
                        <SalesTabPending shop={shop}
                                         onPressProduct={onPressProduct}
                                         onLongPressItem={onLongPressItem}
                                         onPressOutItem={onPressOutItem}
                                         currencyCode={currencyCode} />
                    </View>
                    <View style={[LayoutStyle.Flex, Spacing.HorizontalPadding]} key={SalesTabConst.CONFIRMED}>
                        <SalesTabConfirmed shop={shop}
                                           onPressProduct={onPressProduct}
                                           onLongPressItem={onLongPressItem}
                                           onPressOutItem={onPressOutItem}
                                           currencyCode={currencyCode} />
                    </View>
                </PagerView>
            </View>
        </View>
    );
};

export default SalesContainer;
