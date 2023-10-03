import React, {useCallback, useEffect, useState} from 'react';
import {View, FlatList, SafeAreaView, Dimensions, Image} from 'react-native';
import { homeContainerStyle as style } from './home.container.style';
import Banner from "v2modules/widget/components/banners/banner.component";
import WidgetDataFilterCont from "v2modules/widget/constants/widget-data-filter.cont";
import GroupsInput from "v2modules/widget/inputs/groups.input";
import WidgetCategoriesConst from "v2modules/widget/constants/widget-categories.const";
import GroupsApi from "v2modules/widget/apis/groups.api";
import TrendingTry from "v2modules/widget/components/trending-try/trending-try.component";
import {Colors, Font, Spacing} from "deelzat/style";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import I19n, {isRTL} from "dz-I19n";
import SearchBar from "v2modules/search/components/search-bar/search-bar.component";
import useReportModal from "v2modules/shared/modals/report/report.modal";
import useActionSheetModal from "v2modules/shared/modals/action-sheet/action-sheet.modal";
import FloatingAddProductButton
    from "v2modules/main/components/floating-add-product-button/floating-add-product-button.component";
import COMPONENTS_PAGE from "modules/main/constants/components-pages.const";
import ProductApi from "v2modules/product/apis/product.api";
import {useSelector} from "react-redux";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";
import BookmarkShadow from "assets/icons/BackgoundBack.png";
import NewlyDiscounts from "v2modules/widget/components/newly-discounts/newly-discounts.component";
import HomeContainerService from "./home.container.service";
import NewlyAdded from "v2modules/widget/components/newly-added/newly-added.component";
import OnBoardingService from "v2modules/page/containers/onboarding/onboarding.container.service";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import NavigationService from "v2modules/main/others/navigation.service";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

const ActionSheetModal = useActionSheetModal();
const ReportModal = useReportModal();
const SCREEN_WIDTH = Dimensions.get('window').width;
// As seen on Figma, width / height
const BANNER_SCALE = 375 / 305;

const BANNERS_FILTER = WidgetDataFilterCont.HOME_PAGE_BANNER;
const HOME_COMPONENTS_FILTER = WidgetDataFilterCont.HOME_PAGE;

const HomeContainer = () => {

    const browseCountryCode = useSelector(geoSelectors.geoBrowseCountryCodeSelector);

    const [isRefreshing, isRefreshingSet] = useState(false);
    const [homeData, homeDataSet] = useState([]);

    const requestHomeData = () => {

        const input = new GroupsInput();
        input.countryCode = browseCountryCode;
        input.componentFilter = HOME_COMPONENTS_FILTER;
        GroupsApi.getItems(input)
            .then(homeDataSet)
            .then(() => isRefreshingSet(false))
            .catch(console.warn);
    }


    useEffect(() => {
        const onBoardingServiceOff = OnBoardingService.onShowOnBoarding(({pages}) => {
            RootNavigation.push(MainStackNavsConst.ON_BOARDING, {pages});
        });

        const navigationService = NavigationService.onNavigateTo((payload) => {
            RootNavigation.push(payload.key)
        });

        return () => {
            onBoardingServiceOff();
            navigationService();
        }
    }, []);



    useEffect(() => {
        return HomeContainerService.onEmitReloadPage(() => {
            isRefreshingSet(true);
            homeDataSet([]);
            ProductApi.clearCache();
            setTimeout(requestHomeData, 200);
        })
    }, [browseCountryCode]);


    useEffect(() => {
        if (!browseCountryCode) {
            return;
        }

        requestHomeData();
    }, [browseCountryCode]);


    const renderTrendingBundlesItem = useCallback(({item, index}) => {

        if (item.category === WidgetCategoriesConst.TRENDING) {
            return (
                <TrendingTry useMashupResults={index === 0} item={item}/>
            )
        }
        else if (item.category === WidgetCategoriesConst.DISCOUNTS) {
            return (
                <View>
                    <NewlyDiscounts numberOfProducts={item.number_of_products}/>
                    <Space directions={'h'} size={'lg'}/>
                </View>
            )
        }
        else if (item.category === WidgetCategoriesConst.NEWLY_ADDED) {
            return (
                <View>
                    <NewlyAdded numberOfProducts={item.number_of_products}/>
                    <Space directions={'h'} size={'lg'}/>
                </View>
            )
        }

        return <></>

    }, [homeData]);


    const renderBanner = useCallback(() => {
        return (
            <>
                <Banner componentFilter={BANNERS_FILTER}
                        height={SCREEN_WIDTH / BANNER_SCALE}
                        width={SCREEN_WIDTH}/>
                <Space size={'lg'} directions={'h'} />
                <SafeAreaView style={style.searchView}>
                    <Space directions={'h'} size={'md'}/>
                    <View style={Spacing.HorizontalPadding}>
                        <SearchBar iconColor={'white'} btnStyle={style.searchBtn}/>
                    </View>
                </SafeAreaView>
            </>
        )
    }, []);

    const keyExtractor = useCallback((item, index) => `${item.objectID}_${index}`, []);

    const onPressReport = () => {
        ActionSheetModal.show(false);
        ReportModal.show(true);
    }


    const onRefresh = useCallback(() => {
        isRefreshingSet(true);
        homeDataSet([]);
        ProductApi.clearCache();
        setTimeout(requestHomeData, 200);
    }, [browseCountryCode]);


    const renderFooter = useCallback(() => {
        return (
            <Space directions={'h'} size={'lg'}/>
        )
    }, []);


    return (
        <View style={style.container}>
            <Image style={[style.backgroundImage, {marginStart: isRTL()? '-6.6%': -1}]} source={BookmarkShadow} />
            <View style={style.content}>
                <FloatingAddProductButton trackingPageName={COMPONENTS_PAGE.HOME}/>
                <ActionSheetModal.Modal
                    onHide={() => {ActionSheetModal.show(false)}}>
                    <View>
                        <Button
                            btnStyle={style.actionSheetButton}
                            textStyle={Font.Bold}
                            onPress={onPressReport}
                            size={ButtonOptions.Size.LG}
                            text={I19n.t('إبلاغ')}/>
                    </View>
                </ActionSheetModal.Modal>
                <FlatList
                    data={homeData}
                    renderItem={renderTrendingBundlesItem}
                    showsVerticalScrollIndicator={false}
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                    keyExtractor={keyExtractor}
                    initialNumToRender={10}
                    bounces={false}
                    onEndReachedThreshold={70}
                    ListFooterComponent={renderFooter}
                    ListHeaderComponent={renderBanner}/>
            </View>
        </View>
    );
};

export default HomeContainer;
