import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, ActivityIndicator, Animated, Platform } from 'react-native';

import { shopsContainerStyle as style } from './shops.container.style';
import { Space } from 'deelzat/ui';
import { Colors, LayoutStyle } from 'deelzat/style';
import SearchBar from 'v2modules/search/components/search-bar/search-bar.component';
import { useSelector } from 'react-redux';
import I19n, { getLocale, isRTL } from 'dz-I19n';
import CheckIcon from 'assets/icons/DoneOutline.svg';
import { persistentDataSelectors } from 'modules/main/stores/persistent-data/persistent-data.store';
import CategoryHeroIcon from 'v2modules/product/components/category-hero-icon/category-hero-icon.component';
import { DzText, Touchable } from 'deelzat/v2-ui';
import { appSelectors } from 'modules/main/stores/app/app.store';
import ShopApi from 'v2modules/shop/apis/shop.api';
import ShopCard from 'v2modules/shop/components/shop-card/shop-card.component';
import { shopSelectors } from 'modules/shop/stores/shop/shop.store';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';
import { routeToShop } from 'modules/root/components/deeplinks-router/deeplinks-router.utils';
import { geoSelectors } from 'v2modules/geo/stores/geo/geo.store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { blockedShopsSelectors } from 'v2modules/shop/stores/blocked-shops/blocked-shops.store';
import BlockedShopsService from 'v2modules/shop/others/shops.container.service';

const ShopsContainer = (props) => {
    const {
        preSelectedCategory,
        preSelectedSubCategories,
    } = props.route?.params || {};


    const insets = useSafeAreaInsets();
    const browseCountryCode = useSelector(geoSelectors.geoBrowseCountryCodeSelector);
    const appInitialized = useSelector(appSelectors.appInitializedSelector);
    const categories = useSelector(persistentDataSelectors.categoriesSelector);
    const allSubCategories = useSelector(persistentDataSelectors.subCategoriesSelector);
    const shopState = useSelector(shopSelectors.shopStateSelector);
    const blockedShops = useSelector(blockedShopsSelectors.blockedShopIdsSelector);

    const flatListRef = useRef(null);
    const categoriesScrollView = useRef();

    const [isFetching, isFetchingSet] = useState(false);
    const [subCategories, subCategoriesSet] = useState([]);

    const [inputParams, inputParamsSet] = useState({
        selectedCategory: undefined,
        selectedSubCategories: [],
    });

    const [page, setPage] = useState(1);
    const [shouldFetch, setShouldFetch] = useState(false);
    const [shops, shopsSet] = useState([]);
    const [reset, setReset] = useState(false);


    const [isHeaderVisible, isHeaderVisibleSet] = useState(true);
    const [headerHeight, headerHeightSet] = useState(0);
    const scrollOffset = useRef(0);
    const headerAnim = useRef(new Animated.Value(1)).current;
    const translateY = headerAnim?.interpolate({
        inputRange: [0, 1],
        outputRange: [!subCategories?.length? -95: -170, 0],
        extrapolate: 'clamp',
    });
    const opacityHeader = headerAnim?.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // Open page from dynamic link, select category after props become available
    useEffect(() => {
        if (preSelectedCategory) {
            inputParamsSet(params => ({
                ...params,
                selectedCategory: preSelectedCategory,
            }));
            setTimeout(() => {
                try {
                    const categoryIndex = categories.findIndex(category => category.objectID === preSelectedCategory.objectID);
                    categoriesScrollView.current.scrollTo({
                        y: 0,
                        x: categoryIndex * (16 + 16 + 60),
                    });
                } catch (e) {
                }

                if (preSelectedSubCategories) {
                    inputParamsSet(params => ({
                        ...params,
                        selectedSubCategories: preSelectedSubCategories,
                    }));
                }
            }, 500);
        }
    }, []);


    useEffect(() => {

        return BlockedShopsService.onEmitApplyUpdatedList(() => {
            const filteredShops = shops.filter(shop => {
                return !blockedShops.includes(shop?.id);
            });
            shopsSet(filteredShops);
        });

    }, [shops, blockedShops]);


    const fetchMore = useCallback((shouldReset) => {
        if (shouldReset === true) {
            shopsSet([]);
            setPage(1);
            setReset(true);
        } else {
            isFetchingSet(true);
        }
        setShouldFetch(true);
    }, []);

    useEffect(() => {
        if (!shouldFetch) {
            return;
        }

        isFetchingSet(true);
        let isSubscribed = true;
        ShopApi.getShops(inputParams.selectedCategory,
            inputParams.selectedSubCategories,
            page,
            browseCountryCode)
            .then((shops) => {
                if (isSubscribed) {
                    setShouldFetch(false);
                    if (reset) {
                        flatListRef?.current?.scrollToOffset({ animated: false, x: 0, y: 0 });
                        shopsSet(shops);
                        setReset(false);
                    } else {
                        shopsSet(oldList => [...oldList, ...shops]);
                    }
                    setPage(page + 1);
                }
            })
            .catch(console.warn)
            .finally(() => {
                isFetchingSet(false);
            })
        return () => {
            isSubscribed = false;
        };
    }, [shouldFetch]);


    useEffect(() => {
        Animated.timing(headerAnim, {
            toValue: isHeaderVisible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isHeaderVisible]);


    useEffect(() => {
        if (!appInitialized || !browseCountryCode) {
            return;
        }

        fetchMore(true);
    }, [appInitialized, browseCountryCode, inputParams]);


    const onScroll = useCallback((e) => {
            const offset = e.nativeEvent.contentOffset.y;
            if (offset < 0) return;

            if (scrollOffset.current - offset < -10 && isHeaderVisible) {
                isHeaderVisibleSet(false);
            } else if (scrollOffset.current - offset > 10 && !isHeaderVisible) {
                isHeaderVisibleSet(true);
            }
            scrollOffset.current = offset;
        },
        [isHeaderVisible]);


    const renderItem = useCallback(({ item, index }) => {
        const trackSource = {
            name: EVENT_SOURCE.SHOPS,
            attr1: inputParams.selectedCategory?.objectID,
            attr2: inputParams.selectedSubCategories?.map(sub => sub.objectID).join(','),
            index,
        };
        const onPress = () => {
            routeToShop(item, null, trackSource);
        };
        const showFollowButton = shopState?.shopId !== item.id;
        return (
            <ShopCard shop={item}
                      onPress={onPress}
                      onChangeFollowState={fetchMore}
                      trackSource={trackSource}
                      showFollowButton={showFollowButton} />
        );
    }, [shopState?.shopId]);


    const listHeader = useCallback(() => {
        if (shops.length > 0) {
            let headerHeight = subCategories?.length? isRTL()? 150: 170: isRTL()? 80: 80;
            if (Platform.OS === 'android') {
                headerHeight += subCategories?.length? 50: 40;
            }
            return (
                <View>
                    <View style={{height: insets.top  + headerHeight}}/>
                    <Space directions={'h'} size={'md'} />
                    <DzText style={style.label}>
                        {I19n.t('المتاجر')}
                    </DzText>
                    <Space directions={'h'} />
                </View>
            );
        }

        return (
            <View />
        );
    }, [subCategories?.length, shops.length]);


    const onLayoutHeader = useCallback(({ nativeEvent: { layout: { height } } }) => {
        if (height > headerHeight) {
            headerHeightSet(height);
        }
    }, [shops.length]);


    const listFooter = useCallback(() => {
        return (
            <ActivityIndicator size='small'
                               color={(shops.length > 0 && isFetching) ? Colors.MAIN_COLOR : 'transparent'}
                               style={style.loaderIndicator} />
        );
    }, [shops.length, isFetching]);


    const keyExtractor = useCallback((item, index) => `${index}_${item.id}_${item.is_followed}`, []);


    const listSeparator = useCallback(() => {
        return (
            <View>
                <Space directions={'h'} />
                <Space directions={'h'} size={'md'} />
            </View>
        );
    }, []);

    return (
        <View style={[style.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom }]}>
            <Space directions={'h'} size={'md'}/>
            <View style={[style.searchBar, {paddingTop: insets.top + 16}]}>
                <SearchBar btnStyle={style.btnStyle}/>
            </View>
            <Space directions={'h'}/>
            <Animated.View onLayout={onLayoutHeader}
                           style={[
                               style.listHeader,
                               { transform: [{ translateY }], opacity: opacityHeader},
                               { paddingTop: insets.top  + 66},
                           ]}>
                <ScrollView horizontal={true}
                            ref={categoriesScrollView}
                            contentContainerStyle={style.scrollViewCategories}
                            showsHorizontalScrollIndicator={false}
                            bounces={false}>
                    {
                        categories.map((category) => {
                            const isSelected = category.objectID === inputParams.selectedCategory?.objectID;
                            const onPress = () => {
                                let _subCategories = [];
                                if (!isSelected) {
                                    const catSubs = category.children?.map((item) => allSubCategories[item]).filter(sub => !!sub);
                                    _subCategories = _subCategories.concat(catSubs);
                                }
                                inputParamsSet(params => ({
                                    ...params,
                                    selectedCategory: !isSelected ? category : null,
                                    selectedSubCategories: [],
                                }));
                                subCategoriesSet(_subCategories);
                            };
                            return (
                                <Touchable key={category.objectID}
                                           onPress={onPress}
                                           style={LayoutStyle.Row}>
                                    <CategoryHeroIcon category={category}
                                                      viewStyle={style.categoryItem} />
                                    <Space directions={'v'} size={'md'} />
                                    {
                                        (isSelected) &&
                                        <View
                                            style={[style.checkIcon, { [isRTL() ? 'left' : 'right']: isRTL() ? 0 : 17 }]}>
                                            <CheckIcon fill={Colors.MAIN_COLOR} width={20} height={20} />
                                        </View>
                                    }
                                </Touchable>
                            );
                        })
                    }
                </ScrollView>
                {
                    (subCategories.length > 0) &&
                    <View style={style.subCategoriesView}>
                        <Space directions={'h'} />
                        <Space directions={'h'} size={'md'} />
                        {
                            <ScrollView horizontal={true}
                                        contentContainerStyle={style.subcategoriesScroll}
                                        showsHorizontalScrollIndicator={false}
                                        bounces={false}>
                                {
                                    subCategories.map(sub => {
                                        const selected = !!inputParams.selectedSubCategories.find(item => item.objectID === sub.objectID);
                                        const onPress = () => {
                                            inputParamsSet(params => {
                                                const oldSubs = params.selectedSubCategories;
                                                const newSubs = oldSubs.filter(item => item.objectID !== sub.objectID);
                                                if (!selected) {
                                                    newSubs.push(sub);
                                                }
                                                return {
                                                    ...params,
                                                    selectedSubCategories: newSubs,
                                                };
                                            });
                                        };
                                        return (
                                            <Touchable key={sub.objectID} style={LayoutStyle.Row} onPress={onPress}>
                                                <Space directions={'v'} size={'sm'} />
                                                <Space directions={'v'} />
                                                <View
                                                    style={[style.subCategoryBtn, selected && style.subCategoryBtnSelected]}>
                                                    <DzText style={[
                                                        style.subCategoryText,
                                                        selected && style.subCategoryTextSelected,
                                                        isRTL() && { height: 28, marginBottom: -5 },
                                                    ]}>
                                                        {sub[getLocale()]}
                                                    </DzText>
                                                </View>
                                                <Space directions={'v'} size={'sm'} />
                                                <Space directions={'v'} />
                                            </Touchable>
                                        );
                                    })
                                }
                            </ScrollView>
                        }
                    </View>
                }
            </Animated.View>
            {
                (!shops.length && isFetching) &&
                <ActivityIndicator size="large"
                                   color={Colors.MAIN_COLOR}
                                   style={[style.listLoader, {paddingTop: headerHeight}]}/>
            }
            <FlatList ref={flatListRef}
                      data={shops}
                      numColumns={2}
                      windowSize={19}
                      showsVerticalScrollIndicator={false}
                      renderItem={renderItem}
                      keyExtractor={keyExtractor}
                      onScroll={onScroll}
                      onEndReached={fetchMore}
                      onEndReachedThreshold={0.7}
                      useInteraction={false}
                      contentContainerStyle={style.listContents}
                      columnWrapperStyle={style.listColumnWrapper}
                      ItemSeparatorComponent={listSeparator}
                      ListFooterComponent={listFooter}
                      ListHeaderComponent={listHeader} />
        </View>
    );
};

export default ShopsContainer;
