import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, ActivityIndicator, Animated, ScrollView } from 'react-native';

import { productListContainerStyle as style } from './product-list.container.style';
import { ButtonOptions, Space } from 'deelzat/ui';
import SearchBar from 'v2modules/search/components/search-bar/search-bar.component';
import { Colors, LayoutStyle, LocalizedLayout, Spacing } from 'deelzat/style';
import BackSvg from 'assets/icons/BackIcon.svg';
import IconButton from 'deelzat/v2-ui/icon-button';
import { useIsFocused } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@deelzat/material-top-tabs';
import ProductListNavsConst from 'v2modules/product/constants/product-list-navs.const';
import ProductListTabBar from 'v2modules/product/components/product-list-tab-bar/product-list-tab-bar.component';
import I19n, { getLocale } from 'dz-I19n';
import {
    logAlgoliaEventProductListFiltered,
    logAlgoliaEventProductListViewed,
    screenListener,
    trackAddToCart,
    trackFiltersApplied,
    trackShareProductsList,
    trackViewProductsList,
} from 'modules/analytics/others/analytics.utils';
import ProductList from 'v2modules/product/components/product-list/product-list.component';
import ProductApi from 'v2modules/product/apis/product.api';
import GetProductsInput from 'v2modules/product/inputs/get-products.input';
import { prepareProductHits } from 'modules/product/others/product-listing.utils';
import FilterIcon from 'assets/icons/Filter.svg';
import { DzText, Touchable } from 'deelzat/v2-ui';
import ShareIcon from 'assets/icons/Share2.svg';
import { buildFilters } from 'modules/browse/containers/browse-products/browse-products.utils';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import ProductFiltersService from 'v2modules/product/others/product-filters.service';
import {
    getEmptyViewContents,
    getReferenceCategoryFromList,
    insertWithTabFilters,
} from './product-list.container.utils';
import { generateDeeplinkDigest } from 'modules/browse/others/filters.utils';
import { createDynamicLink, shareText } from 'modules/main/others/main-utils';
import Spinner from 'react-native-loading-spinner-overlay';
import ProductListEmptyUsed
    from 'v2modules/product/components/product-list-empty-used/product-list-empty-used.component';
import { useSelector } from 'react-redux';
import { persistentDataSelectors } from 'modules/main/stores/persistent-data/persistent-data.store';
import useProductOptionsModal from 'v2modules/product/modals/product-options/product-options.modal';
import ProductListItemActions from 'v2modules/product/components/product-list-item/product-list-item-action.const';
import { routeToChatRoom } from 'modules/root/components/deeplinks-router/deeplinks-router.utils';
import { cartThunks } from 'modules/cart/stores/cart/cart.store';
import { useDispatch } from 'react-redux';
import WillShowToast from 'deelzat/toast/will-show-toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { geoSelectors } from 'v2modules/geo/stores/geo/geo.store';
import uniq from 'lodash/uniq';
import ImagePreviewModalService from 'v2modules/shared/modals/image-preview/image-preview.modal.service';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import * as CheckoutActions from 'v2modules/checkout/stores/checkout/checkout.actions';
import CheckoutStepsConst from 'v2modules/checkout/constants/checkout-steps.const';

const Tab = createMaterialTopTabNavigator();
const ProductOptionsModal = useProductOptionsModal();
const ProductListContainer = (props) => {
    const {
        category,
        subCategory,
        externalFilters = [], // filled from external source as collections, banners
        screenSelectedFilters = {},
        isJustDiscounts,
        trackSource,
    } = props.route.params || {};

    const [uniquePageId] = useState(Math.random().toString(20).substring(7));
    const isFocused = useIsFocused();
    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const allFields = useSelector(persistentDataSelectors.fieldsSelector);
    const allCategories = useSelector(persistentDataSelectors.categoriesSelector);
    const filters = useRef([]);
    const [showNewUsedTabs, showNewUsedTabsSet] = useState(undefined); // undefined => value is underemined yet
    const [selectedFilters, selectedFiltersSet] = useState(screenSelectedFilters);
    const [showFullLoader, showFullLoaderSet] = useState(false);
    const isTracked = useRef(false);
    // In case the initial category/subCategory undefined (ex: search list/activity/banner ..etc)
    const shouldRebuildFilters = useRef(!category);

    useEffect(() => {
        const [_showNewUsedTabs, _filters] = buildFilters(category, subCategory, allFields);
        showNewUsedTabsSet(_showNewUsedTabs);
        filters.current = _filters;

        if (!isTracked.current) {
            trackViewProductsList(category, subCategory, trackSource);
            isTracked.current = true;
        }
    }, [allFields]);

    useEffect(() => {
        if (isFocused) {
            ProductOptionsModal.show(false);
        }

        return ProductFiltersService.onFiltersChanged((payload) => {
            if (payload.productsListId === uniquePageId) {
                trackFiltersApplied(payload.selectedValues, trackSource);
                selectedFiltersSet(payload.selectedValues);
            }
        });
    }, [isFocused]);

    const ListTab = useCallback(
        (props) => {
            const {
                category,
                subCategory,
                externalFilters = [], // filled from external source as collections, banners
                tabKey,
            } = props?.route?.params || props;

            const currencyCode = useSelector(geoSelectors.currencyCodeSelector);
            const [list, listSet] = useState([]);
            const [page, pageSet] = useState(1);
            const scrollOffset = useRef(0);
            const [categoriesFilters, categoriesFiltersSet] = useState([]);
            const [selectedCategory, selectedCategorySet] = useState();
            const [isHeaderVisible, isHeaderVisibleSet] = useState(true);
            const [isLoading, isLoadingSet] = useState(true);
            const [fetchMore, fetchMoreSet] = useState(true);
            const hasTrackedAlgoliaListView = useRef(false);
            const headerAnim = useRef(new Animated.Value(1)).current;
            const startFilteringBasedOnCats = useRef(false);

            useEffect(() => {
                Animated.timing(headerAnim, {
                    toValue: isHeaderVisible ? 1 : 0,
                    duration: 200,
                    useNativeDriver: true,
                }).start();
            }, [isHeaderVisible]);

            useEffect(() => {
                if (list.length > 0) {
                    isLoadingSet(false);
                }

                // Fill categories list if not from preselcted category
                if (!category) {
                    const toAddToList = [];
                    list.forEach((product) => {
                        const productCat = product.meta?.global?.category;
                        if (productCat) {
                            toAddToList.push(productCat);
                        }
                    });

                    const _newFilters = categoriesFilters;
                    uniq(toAddToList).forEach((catTitle) => {
                        if (!categoriesFilters.find((cat) => cat.all_titles?.includes(catTitle))) {
                            const cat = allCategories.find((cat) => cat.all_titles?.includes(catTitle));
                            _newFilters.push(cat);
                        }
                    });
                    categoriesFiltersSet(_newFilters);
                }
            }, [list]);

            useEffect(() => {
                const getPageSize = () => {
                    if (isJustDiscounts) {
                        return 200;
                    }

                    return 80;
                };

                let isMounted = true;
                isLoadingSet(true);
                const inputs = new GetProductsInput();
                inputs.category = category || selectedCategory;
                inputs.subCategory = subCategory;
                inputs.externalFilters = insertWithTabFilters(externalFilters, tabKey);
                inputs.filters = selectedFilters;
                inputs.page = page;
                inputs.pageSize = getPageSize();
                ProductApi.getProducts(inputs, { withBlur: false, withShops: false, isJustDiscounts })
                    .then((_list) => {
                        if (!isMounted) return;

                        let newList = [];
                        if (_list.length > 0 && list.length > 0) {
                            newList = prepareProductHits([...list, ..._list]) || [];
                        } else {
                            newList = [...list, ..._list];
                        }

                        if (!_list?.length) {
                            fetchMoreSet(false);
                        } else {
                            listSet(newList);
                            // Keep fetching more until the page is scrollable
                            if (newList.length < 10) {
                                pageSet(page + 1);
                            }
                        }
                        isLoadingSet(false);

                        return newList;
                    })
                    .then((newList) => {
                        // To indicate the first view, track Algolia list view
                        if (
                            newList?.length > 0 &&
                            !hasTrackedAlgoliaListView.current &&
                            Object.keys(selectedFilters).length === 0
                        ) {
                            logAlgoliaEventProductListViewed(newList);
                            hasTrackedAlgoliaListView.current = true;
                        }
                        // Track Algolia list filtered
                        else if (page === 1 && Object.keys(selectedFilters).length > 0) {
                            logAlgoliaEventProductListFiltered(inputs.payload().filtersQuery);
                        }
                    })
                    .catch(console.warn);

                return () => {
                    isMounted = false;
                };
            }, [page]);

            const ListFooterComponent = useCallback(
                () => (
                    <ActivityIndicator
                        style={style.footerLoader}
                        size='small'
                        color={fetchMore ? Colors.MAIN_COLOR : 'transparent'}
                    />
                ),
                [fetchMore],
            );

            const ListHeaderComponent = useCallback(
                () => (
                    <View
                        style={[
                            style.listHeaderPlaceholder,
                            categoriesFilters.length > 1 && style.listHeaderPlaceholderWithCategories,
                        ]}
                    />
                ),
                [categoriesFilters],
            );

            const contentContainerStyle = useMemo(
                () => [
                    Spacing.HorizontalPadding,
                    tabKey === ProductListNavsConst.USED && list.length === 0 && style.emptyUsedProducts,
                ],
                [list?.length, tabKey],
            );

            const ListEmptyComponent = useCallback(() => {
                if (isLoading) {
                    return <></>;
                }

                if (tabKey === ProductListNavsConst.USED) {
                    return <ProductListEmptyUsed isUsedTab={true} containerStyle={{paddingTop: 150}} />;
                }

                const { title, buttonText, buttonOnPress } = getEmptyViewContents(selectedFilters, () =>
                    selectedFiltersSet({}),
                );
                return (
                    <View style={style.emptyView}>
                        <DzText style={style.emptyViewText}>{title}</DzText>
                        <Space directions={'h'} size={'lg'} />
                        <Touchable style={style.emptyViewBtn} onPress={buttonOnPress}>
                            <DzText style={style.emptyViewBtnText}>{buttonText}</DzText>
                        </Touchable>
                    </View>
                );
            }, [isLoading]);

            const onEndReached = useCallback(() => {
                if (!isLoading && fetchMore) {
                    pageSet(page + 1);
                }
            }, [isLoading, fetchMore]);

            const onScroll = useCallback(
                (e) => {
                    const offset = e.nativeEvent.contentOffset.y;
                    if (offset < 0) return;

                    if (scrollOffset.current - offset < -10 && isHeaderVisible) {
                        isHeaderVisibleSet(false);
                    } else if (scrollOffset.current - offset > 10 && !isHeaderVisible) {
                        isHeaderVisibleSet(true);
                    }
                    scrollOffset.current = offset;
                },
                [isHeaderVisible],
            );

            const translateY = headerAnim?.interpolate({
                inputRange: [0, 1],
                outputRange: [-60 + (categoriesFilters.length > 1 ? -35 : 0), 0],
                extrapolate: 'clamp',
            });

            useEffect(() => {
                if (startFilteringBasedOnCats.current) {
                    pageSet(0);
                    isLoadingSet(true);
                    setTimeout(() => {
                        listSet([]);
                        pageSet(1);
                    }, 50);
                }
            }, [selectedCategory]);

            // Generate filters (ex: anything not from category/sub_category select)
            useEffect(() => {
                if (list.length > 0 && shouldRebuildFilters.current) {
                    shouldRebuildFilters.current = false;
                    const referencedCategory = getReferenceCategoryFromList(list);
                    const [_showNewUsedTabs, _filters] = buildFilters(
                        referencedCategory,
                        referencedCategory,
                        allFields,
                    );
                    filters.current = _filters;
                }
            }, [list, allFields, allCategories]);

            const onLongPressItem = useCallback((product) => {
                ImagePreviewModalService.setVisible({
                    show: true,
                    imageUrl: product?.image,
                });
            }, []);

            const onPressOutItem = useCallback(() => {
                ImagePreviewModalService.setVisible({
                    show: false,
                });
            }, []);

            if (list.length === 0 && isLoading) {
                return (
                    <ActivityIndicator style={style.loadingView} size='large' color={Colors.MAIN_COLOR} />
                );
            }

            const onPressFilter = () => {
                RootNavigation.push(MainStackNavsConst.PRODUCT_FILTERS, {
                    filters: filters.current,
                    selectedFilters,
                    productsListId: uniquePageId,
                });
            };

            const onPressShareButton = () => {
                showFullLoaderSet(true);
                (async () => {
                    try {
                        const deeplinkDigest = generateDeeplinkDigest(
                            tabKey,
                            category,
                            subCategory,
                            externalFilters,
                            selectedFilters,
                        );
                        const dynamicLink = await createDynamicLink('PRODUCTS', deeplinkDigest, {
                            title: 'Deelzat ديلزات',
                            imageUrl: 'https://i.ibb.co/q1sMKdT/logo2.jpg',
                            descriptionText: 'Deelzat ديلزات',
                        });
                        await shareText(dynamicLink);
                        trackShareProductsList(category, subCategory, selectedFilters, trackSource);
                    } catch (e) {
                        console.warn(e);
                    }
                    showFullLoaderSet(false);
                })();
            };

            const onBuyAction = (item, variant, count) => {
                ProductOptionsModal.show(false);
                setTimeout(() => {

                    dispatch(CheckoutActions.SetData({
                        clearCartOnSuccess: false,
                        checkoutItems: [{
                            productID: item.id,
                            variantID: variant?.id,
                            quantity: count,
                            product: item,
                            variant: variant,
                        }],
                        trackSource,
                    }));
                    RootNavigation.push(MainStackNavsConst.CHECKOUT, {initialStep: CheckoutStepsConst.INFO});

                }, 100);
            };

            const onAddToBagAction = (item, variant, count) => {
                const cartItem = {
                    productID: item.id,
                    variantID: variant?.id,
                    quantity: count,
                    product: { ...item, isSkeleton: true },
                    variant: variant,
                };
                dispatch(cartThunks.changeCartItem(cartItem));
                trackAddToCart(cartItem, trackSource);
                ProductOptionsModal.show(false);
            };

            const onActionPress = (item, actionType, extraData, trackSource) => {
                if (actionType === ProductListItemActions.ADD_TO_BAG) {
                    ProductOptionsModal.show(true, {
                        skeleton: item,
                        onActionPress: onAddToBagAction,
                        actionBtnText: I19n.t('أضف إلى السلة'),
                    });
                } else if (actionType === ProductListItemActions.BUY) {
                    ProductOptionsModal.show(true, {
                        skeleton: item,
                        onActionPress: onBuyAction,
                    });
                } else if (actionType === ProductListItemActions.CONTACT_SELLER) {
                    routeToChatRoom({ toUserId: extraData, shop: item.shop }, trackSource);
                }
            };

            const categoriesView =
                categoriesFilters.length > 1 ? (
                    <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={style.categoriesList}
                    >
                        {categoriesFilters.map((item) => {
                            const selected = selectedCategory?.objectID === item.objectID;
                            const onPress = () => {
                                startFilteringBasedOnCats.current = true;
                                selectedCategorySet(selected ? undefined : item);
                            };
                            return (
                                <Touchable key={item.objectID} onPress={onPress}>
                                    <DzText style={[style.cateogryLabel, selected && { color: Colors.MAIN_COLOR }]}>
                                        {item[getLocale()].title}
                                    </DzText>
                                </Touchable>
                            );
                        })}
                    </ScrollView>
                ) : (
                    <></>
                );

            return (
                <View style={style.tabView}>
                    <ProductList
                        products={list}
                        currencyCode={currencyCode}
                        onEndReached={onEndReached}
                        contentContainerStyle={contentContainerStyle}
                        onScroll={onScroll}
                        trackSource={trackSource}
                        onActionPress={onActionPress}
                        onLongPressItem={onLongPressItem}
                        onPressOutItem={onPressOutItem}
                        scrollEventThrottle={200}
                        ListEmptyComponent={ListEmptyComponent}
                        ListFooterComponent={ListFooterComponent}
                        ListHeaderComponent={ListHeaderComponent}
                    />
                    <Animated.View
                        style={[
                            style.listHeader,
                            { transform: [{ translateY }] },
                            categoriesFilters.length > 1 && style.listHeaderWithCategories,
                        ]}
                    >
                        <View style={style.filtersRow}>
                            <Touchable style={style.filterBtn} onPress={onPressFilter}>
                                <FilterIcon width={20} height={20} />
                            </Touchable>
                            <Touchable onPress={onPressShareButton} style={style.shareBtn}>
                                <ShareIcon width={24} height={24} />
                                <DzText style={style.shareText}>{I19n.t('مشاركة')}</DzText>
                            </Touchable>
                        </View>
                        <View style={LayoutStyle.Flex} />
                        {categoriesView}
                    </Animated.View>
                </View>
            );
        },
        [selectedFilters],
    );

    return (
        <View style={[style.container, { paddingTop: insets.top }]}>
            <WillShowToast id={'add-to-cart-product-list'} />
            <ProductOptionsModal.Modal />
            <Spinner visible={showFullLoader} textContent={''} animation={'fade'} />
            <Space directions={'h'} size={'md'} />
            <View style={style.header}>
                <IconButton
                    onPress={RootNavigation.goBack}
                    btnStyle={[style.backButton, LocalizedLayout.ScaleX()]}
                    type={ButtonOptions.Type.MUTED_OUTLINE}
                >
                    <BackSvg stroke={Colors.N_BLACK} width={24} height={24} />
                </IconButton>
                <Space directions={'v'} />
                <SearchBar />
            </View>
            <Space directions={'h'} size={'md'} />
            {showNewUsedTabs === true && (
                <Tab.Navigator
                    useNativeDriver={true}
                    animationEnabled={true}
                    tabBar={(props) => <ProductListTabBar {...props} />}
                    screenOptions={{ animationEnabled: true, useNativeDriver: true, swipeEnabled: true }}
                >
                    <Tab.Screen
                        key={ProductListNavsConst.NEW}
                        name={ProductListNavsConst.NEW}
                        initialParams={{
                            ...props.route.params,
                            externalFilters: externalFilters,
                            tabKey: ProductListNavsConst.NEW,
                        }}
                        listeners={screenListener}
                        component={ListTab}
                    />

                    <Tab.Screen
                        key={ProductListNavsConst.USED}
                        name={ProductListNavsConst.USED}
                        initialParams={{
                            ...props.route.params,
                            externalFilters: externalFilters,
                            tabKey: ProductListNavsConst.USED,
                        }}
                        listeners={screenListener}
                        component={ListTab}
                    />
                </Tab.Navigator>
            )}
            {
                // It could be undefined before building filters
                showNewUsedTabs === false && (
                    <View style={style.singleTabView}>
                        <ListTab {...props.route.params} selectedFilters={selectedFilters} />
                    </View>
                )
            }
        </View>
    );
};

export default ProductListContainer;
