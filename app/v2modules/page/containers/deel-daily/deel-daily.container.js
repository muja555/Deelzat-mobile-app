import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { deelDailyContainerStyle as style } from './deel-daily.container.style';
import FeedApi from "v2modules/product/apis/feed.api";
import GetFeedProductsInput from "v2modules/product/inputs/get-feed-products.input";
import DeviceInfo from "react-native-device-info";
import { useDispatch, useSelector } from 'react-redux';
import {appSelectors} from "modules/main/stores/app/app.store";
import {ActivityIndicator, FlatList, RefreshControl, SafeAreaView, View} from "react-native";
import COMPONENTS_PAGE from "modules/main/constants/components-pages.const";
import FloatingAddProductButton
    from "v2modules/main/components/floating-add-product-button/floating-add-product-button.component";
import useActionSheetModal from "v2modules/shared/modals/action-sheet/action-sheet.modal";
import useReportModal from "v2modules/shared/modals/report/report.modal";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import {Colors, Font} from "deelzat/style";
import BundleItem from "v2modules/bundle/components/bundle-item/bundle-item.component";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import { trackBlockShopStateChange, trackClickOnFeedProduct } from 'modules/analytics/others/analytics.utils';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import I19n from "dz-I19n";
import SearchBar from "v2modules/search/components/search-bar/search-bar.component";
import {DzText} from "deelzat/v2-ui";
import {authSelectors} from "modules/auth/stores/auth/auth.store";
import DeelDailyContainerService from "./deel-daily.container.service";
import {routeToShop} from "modules/root/components/deeplinks-router/deeplinks-router.utils";
import WillShowToast from "deelzat/toast/will-show-toast";
import { blockedShopsActions, blockedShopsSelectors } from 'v2modules/shop/stores/blocked-shops/blocked-shops.store';
import BlockedShopsService from 'v2modules/shop/others/shops.container.service';

const ActionSheetModal = useActionSheetModal();
const ReportModal = useReportModal();
const DeelDailyContainer = () => {

    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
    const appInitialized = useSelector(appSelectors.appInitializedSelector);
    const [page, pageSet] = useState(1);
    const [selectedProduct, selectedProductSet] = useState();
    const [products, productSet] = useState([]);
    const [fetchMore, fetchMoreSet] = useState(true);
    const [isLoading, isLoadingSet] = useState(true);
    const [isRefreshing, isRefreshingSet] = useState(false);

    const dispatch = useDispatch();
    const blockedShops = useSelector(blockedShopsSelectors.blockedShopIdsSelector);
    const [isBlockingShop, isBlockingShopSet] = useState(false);

    const contentContainerStyle = useMemo(() => products.length === 0 && {flexGrow: 1}, [products.length]);
    const reload = (withRefresh) => {
        pageSet(0);
        isLoadingSet(true);
        if (withRefresh) {
            isRefreshingSet(true);
        }
        setTimeout(() => {
            productSet([]);
            pageSet(1);
            if (withRefresh) {
                isRefreshingSet(false);
            }
        }, 50)
    }


    useEffect(() => {
        return DeelDailyContainerService.onEmitReloadPage(() => {
            reload(false);
        })
    }, []);


    useEffect(() => {
        reload();
    }, [isAuthenticated]);


    useEffect(() => {

        return BlockedShopsService.onEmitApplyUpdatedList(() => {
            const filteredProducts = products.filter(product => {
                return !blockedShops.includes(product?.shop?.id);
            });

            productSet(filteredProducts);
        });

    }, [products, blockedShops])


    useEffect(() => {

        if (appInitialized && page > 0) {

            fetchMoreSet(true);
            const inputs = new GetFeedProductsInput();
            inputs.page = page;
            inputs.deviceId = DeviceInfo.getUniqueId();
            FeedApi.getFeedProducts(inputs)
                .then(_list => {

                    if (!_list?.length) {
                        fetchMoreSet(false);
                    } else {
                        const shuffeled = _list.sort(() => (Math.random() > 0.5) ? 1 : -1)
                        const newList = [...products, ...shuffeled];
                        productSet(newList);
                    }

                    isLoadingSet(false);
                })
                .catch(console.warn);
        }
    }, [appInitialized, page]);


    const renderItem = useCallback(({item, index}) => {

        const onOptionsPress = (item) => {
            selectedProductSet(item);
            ActionSheetModal.show(true);
        }

        const onPress = () => {
            const trackSource = {name: EVENT_SOURCE.FEED, attr1: item.objectID, index};
            RootNavigation.push(MainStackNavsConst.PRODUCT_DETAILS, {
                skeleton: item,
                trackSource: trackSource
            });

            trackClickOnFeedProduct(item, index);
        }

        const onPressShop = () => {
            routeToShop(item.shop,
                item,
                {name: EVENT_SOURCE.FAVOURITES, attr1: item.id, index})
        }

        return (
            <BundleItem testID={`feed-${index}`}
                        product={item}
                        viewSource={EVENT_SOURCE.FEED}
                        isFollowingProductShop={item.is_followed}
                        showDescription={true}
                        onPress={onPress}
                        onPressShop={onPressShop}
                        onOptionsPress={onOptionsPress}/>
        )
    }, [])


    const keyExtractor = useCallback((item, index) => {
        return `${item.id} ${index}`;
    }, []);


    const renderSeparator = useCallback(() => {
        return (
            <Space directions={'h'} size={'lg'}/>
        )
    }, []);


    const ListFooterComponent = useCallback(() => (
        <ActivityIndicator style={[style.footerLoader, products.length === 0 && {height: '100%'}]}
                           size="small"
                           color={fetchMore? Colors.MAIN_COLOR : 'transparent'} />

    ), [fetchMore, products.length]);


    const onEndReached = useCallback((w) => {
        if (products.length > 0 && !isLoading && fetchMore) {
            pageSet(prev => prev + 1);
        }
    }, [isLoading, fetchMore, products.length]);


    const ListHeaderComponent = useCallback(() => {
        if (products.length) {
            return (
                <>
                    <Space directions={'h'} size={'md'}/>
                    <DzText style={style.feedTitle}>
                        {I19n.t('المستجدات')}
                    </DzText>
                </>
            )
        }

        return (
            <></>
        )
    }, [products.length]);


    const onPressReport = () => {
        ActionSheetModal.show(false);
        ReportModal.show(true);
    }


    const onPressBlock = () => {

        isBlockingShopSet(true);

        if (selectedProduct?.shop?.id) {
            dispatch(blockedShopsActions.AddBlockedShopId(selectedProduct?.shop?.id));
            trackBlockShopStateChange(true, selectedProduct?.shop);
        }


        setTimeout(() => {
            ActionSheetModal.show(false);
            isBlockingShopSet(false);

            BlockedShopsService.applyUpdatedList();
        }, 1000);
    }

    return (
        <SafeAreaView style={style.container}>
            <WillShowToast id={'deeldaily-page'}/>
            <FloatingAddProductButton trackingPageName={COMPONENTS_PAGE.DEEL_DAILY}/>
            <ReportModal.Modal itemId={selectedProduct?.id}
                               isShop={true}/>
            <ActionSheetModal.Modal
                onHide={() => {ActionSheetModal.show(false)}}>
                <View>
                    <Button
                        btnStyle={style.actionSheetButton}
                        textStyle={Font.Bold}
                        onPress={onPressReport}
                        size={ButtonOptions.Size.LG}
                        text={I19n.t('إبلاغ')}/>
                    <Space directions={'h'} size={'md'}/>
                    <Button
                        btnStyle={style.actionSheetButton}
                        textStyle={Font.Bold}
                        loading={isBlockingShop}
                        disabled={isBlockingShop}
                        onPress={onPressBlock}
                        size={ButtonOptions.Size.LG}
                        text={I19n.t('حجب هذا المتجر')}/>
                </View>
            </ActionSheetModal.Modal>
            <Space directions={'h'} size={'md'}/>
            <View style={style.header}>
                <SearchBar/>
            </View>
            <Space directions={'h'}/>
            <FlatList
                data={products}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                keyExtractor={keyExtractor}
                contentContainerStyle={contentContainerStyle}
                bounces={true}
                onEndReached={onEndReached}
                onEndReachedThreshold={70}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => reload(true)} />
                }
                ListHeaderComponent={ListHeaderComponent}
                ItemSeparatorComponent={renderSeparator}
                ListFooterComponent={ListFooterComponent}/>

        </SafeAreaView>
    );
};

export default DeelDailyContainer;
