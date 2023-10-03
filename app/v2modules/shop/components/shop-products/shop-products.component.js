import FilterIcon from 'assets/icons/Filter.svg';
import { Colors, Font, LayoutStyle } from 'deelzat/style';
import { Button, ButtonOptions, Space } from 'deelzat/ui';
import { DzText, Touchable } from 'deelzat/v2-ui';
import I19n, { getLocale } from 'dz-I19n';
import uniq from 'lodash/uniq';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';
import { trackAddToCart, trackRemoveProduct } from 'modules/analytics/others/analytics.utils';
import { cartThunks } from 'modules/cart/stores/cart/cart.store';
import { persistentDataSelectors } from 'modules/main/stores/persistent-data/persistent-data.store';
import ProductApi from 'modules/product/apis/product.api';
import ProductDeleteInput from 'modules/product/inputs/product-delete.input';
import ProductDetailsGetInput from 'modules/product/inputs/product-details-get.input';
import { prepareProductHits } from 'modules/product/others/product-listing.utils';
import { routeToChatRoom } from 'modules/root/components/deeplinks-router/deeplinks-router.utils';
import * as Actions from 'modules/shop/stores/shop/shop.actions';
import { shopSelectors, shopThunks } from 'modules/shop/stores/shop/shop.store';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import { default as ProductApiV2 } from 'v2modules/product/apis/product.api';
import ProductListEmptyUsed
    from 'v2modules/product/components/product-list-empty-used/product-list-empty-used.component';
import ProductListItemActions from 'v2modules/product/components/product-list-item/product-list-item-action.const';
import ProductList from 'v2modules/product/components/product-list/product-list.component';
import { insertWithTabFilters } from 'v2modules/product/containers/product-list/product-list.container.utils';
import GetProductsInput from 'v2modules/product/inputs/get-products.input';
import useEditProductPricesModal from 'v2modules/product/modals/edit-product-prices/edit-product-prices.modal';
import useProductOptionsModal from 'v2modules/product/modals/product-options/product-options.modal';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import useActionSheetModal from 'v2modules/shared/modals/action-sheet/action-sheet.modal';
import ImagePreviewModalService from 'v2modules/shared/modals/image-preview/image-preview.modal.service';
import StartSelling from 'v2modules/shop/components/start-selling/start-selling.component';
import MyProfileService from 'v2modules/shop/containers/my-profile/my-profile.container.service';
import { shopProductsStyle as style } from './shop-products.component.style';
import store from 'modules/root/components/store-provider/store-provider';
import ProductFiltersService from 'v2modules/product/others/product-filters.service';
import { buildFilters2 } from 'modules/browse/containers/browse-products/browse-products.utils';
import { trackFiltersApplied } from 'modules/analytics/others/analytics.utils';
import { countFilters } from 'modules/browse/others/filters.utils';
import get from 'lodash/get';

const ActionSheetModal = useActionSheetModal();
const EditProductPricesModal = useEditProductPricesModal();
const ProductOptionsModal = useProductOptionsModal();
const ShopProducts = (props) => {
    const { isFocused = false, profileParams = {} } = props;

    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();

    const markets = useSelector(persistentDataSelectors.shippableCountriesSelector);
    const allCategories = useSelector(persistentDataSelectors.categoriesSelector);
    const deletedProductsIds = useSelector(shopSelectors.deletedProductsSelector);
    const newlyAddedProduct = useSelector(shopSelectors.addedTempProductSelector);

    const [currencyCode, currencyCodeSet] = useState();

    const scrollOffset = useRef(0);

    const [uniquePageId] = useState(Math.random().toString(20).substring(7));
    const [selectedProduct, selectedProductSet] = useState();
    const [isEditingLoading, isEditingLoadingSet] = useState(false);
    const [isDeleteLoading, isDeleteLoadingSet] = useState(false);

    const [list, listSet] = useState([]);

    const [inputParams, inputParamsSet] = useState({
        page: 1,
        selectedCategory: undefined,
        selectedFilters: {},
    });

    const [isHeaderVisible, isHeaderVisibleSet] = useState(true);
    const [isLoading, isLoadingSet] = useState(true);
    const [fetchMore, fetchMoreSet] = useState(true);
    const [categoriesFilters, categoriesFiltersSet] = useState([]);
    const subCategoriesFilters = useRef([]);

    const headerAnim = useRef(new Animated.Value(1)).current;

    const [forceShowLoading, forceShowLoadingSet] = useState(false);

    const shopCountryCode = useMemo(
        () =>
            profileParams?.shop?.country_codes?.length > 0 ? profileParams?.shop?.country_codes[0] : 'PS',
        [profileParams?.shop],
    );


    useEffect(() => {
        const thisShopFilters = [
            [{ attribute: 'named_tags.shop', operator: ':', value: profileParams?.shop?.id }],
        ];

        const inputs = new GetProductsInput();
        inputs.externalFilters = insertWithTabFilters(thisShopFilters, profileParams?.tabName);
        inputs.category = inputParams.selectedCategory;
        inputs.page = inputParams.page;
        inputs.pageSize = 80;
        inputs.filters = inputParams.selectedFilters;

        isLoadingSet(true);
        let isMounted = true;
        ProductApiV2.getProducts(inputs, { withBlur: false, withShops: false, cacheable: true })
            .then((_list) => {
                if (!isMounted) return;

                listSet((oldList) => {
                    let newList;
                    let oldListFiltered = oldList;
                    // If received a product same as added, then clear the already saved
                    if (profileParams.isOwner && newlyAddedProduct) {
                        const isAddedProductInList = oldList.find((product) => product.id === newlyAddedProduct.id);
                        if (isAddedProductInList) {
                            oldListFiltered = oldListFiltered.filter(p => p.id === isAddedProductInList?.id);
                            dispatch(Actions.SetAddedProduct());
                        }
                    }

                    // merge hits
                    if (_list.length > 0 && oldListFiltered.length > 0) {
                        newList = prepareProductHits([...oldListFiltered, ..._list]) || [];
                    } else {
                        newList = [...oldListFiltered, ..._list];
                    }


                    newList = newList.filter((product) => !deletedProductsIds.includes(product.id + ''));

                    if (_list.length === 0) {
                        fetchMoreSet(false);
                        return oldListFiltered;
                    } else {
                        if (newList.length < 10) {
                            inputParamsSet((old) => ({
                                ...old,
                                page: old.page + 1,
                            }));
                        }
                        return newList;
                    }
                });
            })
            .catch(console.warn)
            .finally(() => {
                setTimeout(() => {
                    isLoadingSet(false);
                    forceShowLoadingSet(false);
                }, 30);
            });

        return () => {
            isMounted = false;
        };
    }, [inputParams]);


    useEffect(() => {
        const toAddToListCategories = [];
        const toAddToListSubs = [];
        list.forEach((product) => {
            const productCat = product.meta?.global?.category;
            const productSub = product.meta?.global?.subCategory;
            if (productCat) {
                toAddToListCategories.push(productCat);
            }
            if (productSub) {
                toAddToListSubs.push(productSub);
            }
        });

        const _newFilters = categoriesFilters;
        uniq(toAddToListCategories).forEach((catTitle) => {
            if (!categoriesFilters.find((cat) => cat?.all_titles?.includes(catTitle))) {
                const cat = allCategories.find((cat) => cat?.all_titles?.includes(catTitle));
                _newFilters.push(cat);
            }
        });
        categoriesFiltersSet(_newFilters);

        const subCategories = store.getState().persistentData.subCategories;
        const _newSubFilters = subCategoriesFilters.current;
        uniq(toAddToListSubs).forEach((catTitle) => {
            if (catTitle === 'اخرى') {
                catTitle = 'أخرى';
            }
            if (!subCategoriesFilters.current.find((cat) => cat?.all_titles?.includes(catTitle))) {
                const cat = Object.values(subCategories).find((cat) => cat?.all_titles?.includes(catTitle));
                _newSubFilters.push(cat);
            }
        });
        subCategoriesFilters.current = _newSubFilters;
    }, [list]);


    // Handle isOwner cases
    useEffect(() => {

        // Reflect list on deletedProductsIds
        if (profileParams.isOwner && deletedProductsIds.length) {
            const filtered = list.filter((product) => !deletedProductsIds.includes(product.id + ''));
            listSet(filtered);
        }

        // Reflect list on newly added product
        if (profileParams.isOwner && newlyAddedProduct) {

            const isNewProduct = get(newlyAddedProduct, 'meta.global.condition', 'جديد') === 'جديد';
            const isNewTab = profileParams?.tabName?.includes('NEW');

            if ((isNewProduct && isNewTab) || (!isNewProduct && !isNewTab)) {
                const isAddedProductInList = list.find((product) => product.id === newlyAddedProduct.id);
                if (!isAddedProductInList) {
                    listSet([...list, newlyAddedProduct]);
                }
            }
        }

    }, [newlyAddedProduct, deletedProductsIds, profileParams.isOwner]);


    useEffect(() => {
        Animated.timing(headerAnim, {
            toValue: isHeaderVisible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [isHeaderVisible]);


    const onPressFilter = () => {
        RootNavigation.push(MainStackNavsConst.PRODUCT_FILTERS, {
            filters: buildFilters2([...categoriesFilters, ...subCategoriesFilters.current]),
            selectedFilters: inputParams?.selectedFilters,
            productsListId: uniquePageId,
        });
    };

    useEffect(() => {

        return ProductFiltersService.onFiltersChanged((payload) => {
            if (payload.productsListId === uniquePageId) {
                trackFiltersApplied(payload.selectedValues, profileParams?.trackSource);
                forceShowLoadingSet(true);
                listSet([]);
                fetchMoreSet(true);
                inputParamsSet((old) => ({
                    page: 1,
                    selectedCategory: undefined,
                    selectedFilters: payload.selectedValues,
                }));
            }
        });
    }, [isFocused, profileParams?.trackSource, uniquePageId]);


    useEffect(() => {
        if (markets.length) {

            currencyCodeSet(
                markets.find((country) => country.code === (shopCountryCode || 'PS'))?.currency || 'ILS',
            );
        }
    }, [markets, shopCountryCode]);


    const onEditPress = (product) => {
        isEditingLoadingSet(true);
        const inputs = new ProductDetailsGetInput();
        inputs.productID = product.id;
        ProductApi.getProductDetails(inputs)
            .then((product) => {
                RootNavigation.navigate(MainStackNavsConst.PRODUCT_UPDATE, {
                    product,
                    trackSource: { name: EVENT_SOURCE.MY_SHOP },
                });
            })
            .then(() => {
                ActionSheetModal.show(false);
                isEditingLoadingSet(false);
            })
            .catch(console.warn);
    };


    const onDeletePress = (product) => {
        isDeleteLoadingSet(true);
        (async () => {
            try {
                const inputs = new ProductDeleteInput();
                inputs.shopId = profileParams?.shop?.id;
                inputs.productId = product.id;
                await ProductApi.delete(inputs);

                MyProfileService.refreshMyProfileStatus({ noLoader: true });
                dispatch(shopThunks.loadShop({ id: profileParams?.shop?.id }));
                dispatch(Actions.AddDeletedProductsId(product.id + ''));
                if (newlyAddedProduct?.id === product.id) {
                    dispatch(Actions.SetAddedProduct(product.id + ''));
                }
                trackRemoveProduct({ id: profileParams?.shop?.id }, product);
            } catch (e) {
                console.warn(e);
            }

            ActionSheetModal.show(false);
            isDeleteLoadingSet(false);
        })();
    };


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


    const ListFooterComponent = useCallback(
        () => (
            <View>
                <ActivityIndicator
                    style={[style.footerLoader, { marginBottom: insets.bottom + 20 }]}
                    size='small'
                    color={fetchMore ? Colors.MAIN_COLOR : 'transparent'}
                />
                <View style={{height: profileParams?.extraListBottom}} />
            </View>
        ),
        [fetchMore, profileParams?.extraListBottom],
    );


    const ListHeaderComponent = () => {
        return <View style={{ height: profileParams?.headerHeight + style.listHeader.height + 5 }} />;
    };


    const onEndReached = useCallback(() => {
        if (!isLoading && fetchMore) {
            inputParamsSet((old) => ({
                ...old,
                page: old.page + 1,
            }));
        }
    }, [isLoading, fetchMore]);


    const onAddToBagAction = (item, variant, count) => {
        const cartItem = {
            productID: item.id,
            variantID: variant?.id,
            quantity: count,
            product: { ...item, isSkeleton: true },
            variant: variant,
        };
        dispatch(cartThunks.changeCartItem(cartItem));
        trackAddToCart(cartItem, profileParams?.trackSource);
        ProductOptionsModal.show(false);
    };


    const onActionPress = (item, actionType, extraData, trackSource) => {
        if (actionType === ProductListItemActions.EDIT) {
            selectedProductSet(item);
            ActionSheetModal.show(true);
        } else if (actionType === ProductListItemActions.EDIT_PRICES) {
            EditProductPricesModal.show(true, {
                skeleton: item,
                shopId: profileParams?.shop?.id,
            });
        } else if (actionType === ProductListItemActions.ADD_TO_BAG) {
            ProductOptionsModal.show(true, {
                skeleton: item,
                onActionPress: onAddToBagAction,
                actionBtnText: I19n.t('أضف إلى السلة'),
            });
        } else if (actionType === ProductListItemActions.CONTACT_SELLER) {
            routeToChatRoom({ toUserId: extraData, shop: item.shop }, trackSource);
        }
    };


    const translateY = headerAnim?.interpolate({
        inputRange: [0, 1],
        outputRange: [-60, 0],
        extrapolate: 'clamp',
    });

    const decHeaderAnim = !(profileParams?.isOwner || profileParams?.shop.extra_data?.description?.trim())? 15: 0;
    const translateWithHeaderY = profileParams?.listPositionAnimation?.current?.interpolate({
        inputRange: [
            0,
            Math.max(profileParams?.headerHeight - profileParams?.headerMinHeight?.current, 0),
        ],
        outputRange: [profileParams?.headerHeight, profileParams?.headerMinHeight?.current - decHeaderAnim],
        extrapolate: 'clamp',
    });

    const onScroll = useCallback((e) => {
        const offset = e.nativeEvent.contentOffset.y;
        if (offset < 0) return;

        isHeaderVisibleSet((_isHeaderVisible) => {
            if (scrollOffset.current - offset < -15 && _isHeaderVisible && offset > 400) {
                return false;
            } else if (scrollOffset.current - offset > 15 && !_isHeaderVisible) {
                return true;
            }
            return _isHeaderVisible;
        });

        scrollOffset.current = offset;
    }, []);

    const showLoading =
        (list.length === 0 && isLoading) || forceShowLoading || !profileParams?.headerHeight;

    const onPressResetFilters = () => {
        forceShowLoadingSet(true);
        inputParamsSet({
            page: 1,
            selectedFilters: {},
            selectedCategory: undefined,
        });
    };

    return (
        <View style={style.container}>
            {isFocused && (
                <>
                    <ProductOptionsModal.Modal />
                    <EditProductPricesModal.Modal />
                    <ActionSheetModal.Modal onHide={() => ActionSheetModal.show(false)}>
                        <View>
                            <Button
                                btnStyle={style.editProductBtn}
                                textStyle={Font.Bold}
                                onPress={() => onEditPress(selectedProduct)}
                                loading={isEditingLoading}
                                disabled={isEditingLoading || isDeleteLoading}
                                size={ButtonOptions.Size.LG}
                                text={I19n.t('تعديل المنتج')}
                            />
                            <Space directions={'h'} size={'md'} />
                            <Button
                                btnStyle={style.deleteProductBtn}
                                textStyle={Font.Bold}
                                onPress={() => onDeletePress(selectedProduct)}
                                loading={isDeleteLoading}
                                disabled={isEditingLoading || isDeleteLoading}
                                size={ButtonOptions.Size.LG}
                                text={I19n.t('حذف المنتج')}
                            />
                        </View>
                    </ActionSheetModal.Modal>
                </>
            )}
            {showLoading && (
                <ActivityIndicator
                    style={[style.loadingView, { paddingTop: profileParams?.headerHeight }]}
                    size='large'
                    color={profileParams?.theme?.color1 || Colors.MAIN_COLOR}
                />
            )}
            {!showLoading && (
                <>
                    {countFilters(inputParams.selectedFilters) === 0 &&
                    list.length === 0 &&
                    profileParams?.isOwner && (
                        <StartSelling
                            text={
                                profileParams?.tabName?.includes('USED')
                                    ? I19n.t('لا يوجد لديك منتجات مستعملة للبيع')
                                    : ''
                            }
                            profileParams={profileParams}
                        />
                    )}
                    {countFilters(inputParams.selectedFilters) === 0 &&
                    list.length === 0 &&
                    !profileParams?.isOwner && (
                        <ProductListEmptyUsed
                            isUsedTab={profileParams?.tabName?.includes('USED')}
                            containerStyle={{ paddingTop: profileParams?.headerHeight }}
                        />
                    )}
                    {countFilters(inputParams.selectedFilters) > 0 && !list.length && (
                        <View style={[style.emptyView, { paddingTop: profileParams?.headerHeight }]}>
                            <DzText style={style.emptyViewText}>
                                {I19n.t('لا يوجد منتجات متوفرة بالوقت الحالي') + '  🙂'}
                            </DzText>
                            <Space directions={'h'} size={'lg'} />
                            <Touchable style={[style.emptyViewBtn, profileParams?.theme && {backgroundColor: profileParams?.theme.color1}]} onPress={onPressResetFilters}>
                                <DzText style={style.emptyViewBtnText}>{I19n.t('إعادة ضبط الفلاتر')}</DzText>
                            </Touchable>
                        </View>
                    )}
                    {list.length > 0 && (
                        <ProductList
                            displayMinimalLook={true}
                            products={list}
                            currencyCode={currencyCode}
                            allowEdit={profileParams?.isOwner}
                            trackSource={profileParams?.trackSource}
                            btnColor={profileParams?.theme?.color1}
                            onActionPress={onActionPress}
                            onLongPressItem={onLongPressItem}
                            onPressOutItem={onPressOutItem}
                            onEndReached={onEndReached}
                            contentContainerStyle={style.contentContainerStyle}
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
                                    listener: onScroll,
                                    useNativeDriver: true,
                                },
                            )}
                            scrollEnabled={true}
                            bounces={false}
                            ListHeaderComponent={ListHeaderComponent}
                            ListFooterComponent={ListFooterComponent}
                        />
                    )}
                </>
            )}
            {(list.length > 0 || forceShowLoading || (countFilters(inputParams.selectedFilters) > 0 && !list.length)) && (
                <Animated.View
                    style={[
                        { position: 'absolute', backgroundColor: 'transparent', width: '100%' },
                        { transform: [{ translateY: translateWithHeaderY }] },
                    ]}
                >
                    <Animated.View style={[style.listHeader, { transform: [{ translateY }] }]}>
                        <View style={style.filtersRow}>
                            <Touchable style={[style.filterBtn, profileParams?.theme?.color1 && {backgroundColor: profileParams.theme.color1}]} onPress={onPressFilter}>
                                <FilterIcon width={20} height={20} />
                            </Touchable>
                        </View>
                        <View style={LayoutStyle.Flex} />
                        {categoriesFilters.length > 1 && (
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={style.categoriesList}
                            >
                                {categoriesFilters.map((item) => {
                                    const selected = inputParams?.selectedCategory?.objectID === item.objectID;
                                    const onPress = () => {
                                        forceShowLoadingSet(true);
                                        listSet([]);
                                        fetchMoreSet(true);
                                        inputParamsSet((prev) => ({
                                            page: 1,
                                            selectedFilters: {},
                                            selectedCategory: selected ? undefined : item,
                                        }));
                                    };
                                    return (
                                        <Touchable key={item.objectID} onPress={onPress}>
                                            <DzText
                                                style={[style.cateogryLabel, selected && { color: profileParams?.theme?.color1 || Colors.MAIN_COLOR }]}
                                            >
                                                {item[getLocale()].title}
                                            </DzText>
                                        </Touchable>
                                    );
                                })}
                            </ScrollView>
                        )}
                    </Animated.View>
                </Animated.View>
            )}
        </View>
    );
};

export default ShopProducts;
