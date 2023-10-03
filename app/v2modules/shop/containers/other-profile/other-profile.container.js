import WillShowToast from 'deelzat/toast/will-show-toast';
import { Button, ButtonOptions, Space } from 'deelzat/ui';
import I19n from 'dz-I19n';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';
import SIGNUP_SOURCE from 'modules/analytics/constants/analytics-signup-source.const';
import { trackBlockShopStateChange, trackFollowShopStateChange } from 'modules/analytics/others/analytics.utils';
import AuthRequiredModalService from 'modules/auth/modals/auth-required/auth-required.modal.service';
import { authSelectors } from 'modules/auth/stores/auth/auth.store';
import { routeToChatRoom } from 'modules/root/components/deeplinks-router/deeplinks-router.utils';
import ShopApi from 'modules/shop/apis/shop.api';
import ShopFollowPost from 'modules/shop/inputs/shop-follow-shop-post';
import ShopFollowersCountGetInput from 'modules/shop/inputs/shop-followers-count-get.input';
import ShopGetInput from 'modules/shop/inputs/shop-get.input';
import ShopFollowService from 'modules/shop/others/shop-follow.service';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BackHandler, LayoutAnimation, UIManager, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import Profile from 'v2modules/shop/components/profile/profile.component';
import ProfileTabConst from 'v2modules/shop/constants/profile-tab.const';
import { notMeProfileContainerStyle as style } from './other-profile.container.style';
import { getBtnStyleFrom, getBtnTextStyleFrom, getThemeFromThemeId } from 'modules/main/others/main-utils';
import useActionSheetModal from 'v2modules/shared/modals/action-sheet/action-sheet.modal';
import useReportModal from 'v2modules/shared/modals/report/report.modal';
import { Font } from 'deelzat/style';
import GetProductsInput from 'v2modules/product/inputs/get-products.input';
import { insertWithTabFilters } from 'v2modules/product/containers/product-list/product-list.container.utils';
import { default as ProductApiV2 } from 'v2modules/product/apis/product.api';
import { blockedShopsActions } from 'v2modules/shop/stores/blocked-shops/blocked-shops.store';
import BlockedShopsService from 'v2modules/shop/others/shops.container.service';

const LAYOUT_ANIM_CONFIG = {
    duration: 500,
    update: {
        type: LayoutAnimation.Types.spring,
        springDamping: 0.7,
    },
};

const ReportModal = useReportModal();
const ActionSheetModal = useActionSheetModal();

const OtherProfileContainer = (props) => {
    const { skeleton = {} } = props.route.params;

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
    const [isFollowingLoading, isFollowingLoadingSet] = useState(false);
    const [isFollowing, isFollowingSet] = useState(false);
    const [shop, shopSet] = useState(skeleton);
    const [shopStats, shopStatsSet] = useState();
    // For flickering issue on Android due to Layout LayoutAnimation.configureNext is configuring tabs changes too
    const [tabs, tabsSet] = useState([ProfileTabConst.LOADER, ProfileTabConst.LOADER]);

    const [leftHeaderBtnProps, leftHeaderBtnPropsSet] = useState({});
    const [rightHeaderBtnProps, rightHeaderBtnPropsSet] = useState({});

    const [isBlockingShop, isBlockingShopSet] = useState(false);
    const selectedTheme = useMemo(() => getThemeFromThemeId(shop?.theme_id), [shop?.theme_id]);

    const [trackSource] = useState({ name: EVENT_SOURCE.SHOP, attr1: shop?.id, attr2: shop?.name });

    useEffect(() => {
        UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
        const shopFollowStatusListener = ShopFollowService.onShopFollowStateChanged(({ shopId }) => {
            if (shopId === shop.id) {
                getShopStats();
            }
        });
        const onKeyboardBackPressed = () => {
            RootNavigation.goBack();
            return true;
        };
        BackHandler.addEventListener('hardwareBackPress', onKeyboardBackPressed);

        return () => {
            shopFollowStatusListener();
            BackHandler.removeEventListener('hardwareBackPress', onKeyboardBackPressed);
        };
    }, []);


    const getShopStats = () => {
        const inputsStats = new ShopFollowersCountGetInput();
        inputsStats.shop_id = shop.id;
        ShopApi.followersCountGet(inputsStats)
            .then((_shopState) => {
                LayoutAnimation.configureNext(LAYOUT_ANIM_CONFIG);
                shopStatsSet(_shopState);
            })
            .catch((e) => {
                shopStatsSet({});
            });
    };


    useEffect(() => {
        if (!shop.id) {
            return;
        }

        const input = new ShopGetInput();
        input.shop_id = shop.id;
        ShopApi.get(input)
            .then((_shop) => {
                LayoutAnimation.configureNext(LAYOUT_ANIM_CONFIG);
                shopSet(_shop);
            })
            .catch(console.warn);

        getShopStats();
    }, [skeleton.id]);



    // Check if there used products to display USED_PRODUCTS tab
    useEffect(() => {

        let isMounted = true;
        const thisShopFilters = [
            [{ attribute: 'named_tags.shop', operator: ':', value: shop?.id }],
        ];

        const inputs = new GetProductsInput();
        inputs.externalFilters = insertWithTabFilters(thisShopFilters, 'USED');
        inputs.page = 1;
        inputs.pageSize = 1;
        inputs.filters = {};
        ProductApiV2.getProducts(inputs, { withBlur: false, withShops: false })
            .then((_list) => {
                if (_list.length > 0) {
                    tabsSet([ProfileTabConst.NEW_PRODUCTS, ProfileTabConst.USED_PRODUCTS]);
                }
            })
            .catch(console.warn);

        return () => {
            isMounted = false;
        };

    }, []);


    useEffect(() => {
        if (shopStats && tabs.includes(ProfileTabConst.LOADER) && !tabs.includes(ProfileTabConst.USED_PRODUCTS)) {
            tabsSet([ProfileTabConst.NEW_PRODUCTS]);
        }
        isFollowingSet(shopStats?.is_current_user_following_shop);
    }, [shopStats]);


    // Update contact seller btn
    useEffect(() => {
        leftHeaderBtnPropsSet({
            text: I19n.t('للتواصل'),
            textStyle: getBtnTextStyleFrom(selectedTheme),
            type: ButtonOptions.Type.PRIMARY_OUTLINE,
            headerBtn: getBtnStyleFrom(selectedTheme),
            onPress: () => {
                const shopAuthId = shop?.users_ids?.length && shop.users_ids[0];
                routeToChatRoom({ toUserId: shopAuthId, shop }, trackSource);
            },
        });
    }, [shop, selectedTheme]);


    // Update follow shop btn
    useEffect(() => {
        rightHeaderBtnPropsSet({
            text: I19n.t(isFollowing ? 'يتابع' : 'تابع'),
            textStyle: getBtnTextStyleFrom(selectedTheme, !isFollowing),
            headerBtn: getBtnStyleFrom(selectedTheme, !isFollowing),
            loadingColor: isFollowing ? 'white' : selectedTheme?.color1,
            type: ButtonOptions.Type.PRIMARY_OUTLINE,
            onPress: onPressFollowBtn,
            loading: isFollowingLoading,
            disabled: isFollowingLoading,
        });
    }, [isFollowingLoading, isFollowing, isAuthenticated, shop, shopStats, selectedTheme]);


    const followUnFollowShop = () => {
        const isFollowed = shopStats?.is_current_user_following_shop;

        isFollowingLoadingSet(true);
        const inputs = new ShopFollowPost();
        inputs.shop_id = shop.id;
        (isFollowed ? ShopApi.unFollowShop(inputs) : ShopApi.followShop(inputs))
            .then(() => isFollowingLoadingSet(false))
            .then(() => {
                trackFollowShopStateChange(!isFollowed, shop, trackSource);
                ShopFollowService.shopFollowStateChanged({ shopId: shop.id, isFollowed: !isFollowed });
                getShopStats();
                isFollowingSet(!isFollowed);
            })
            .catch((e) => {
                isFollowingSet(!isFollowed);
                console.warn(e);
            });
    };


    const onPressFollowBtn = () => {

        if (isAuthenticated) {
          followUnFollowShop();

        } else {
          AuthRequiredModalService.setVisible({
            message: I19n.t('أنشىء حساب لتتمكن من متابعة المتجر'),
            trackSource: {
              name: SIGNUP_SOURCE.FOLLOW_SHOP,
              attr1: EVENT_SOURCE.SHOP,
              attr2: shop.id,
            },
            onAuthSuccess: followUnFollowShop,
          });
        }
    };

    const onPressReport = () => {
        ActionSheetModal.show(false);
        ReportModal.show(true);
    }


    const onPressReportIcon = useCallback(() => {
        ActionSheetModal.show(true);
    }, []);



    const onPressBlock = () => {

        isBlockingShopSet(true);

        if (shop?.id) {
            dispatch(blockedShopsActions.AddBlockedShopId(shop?.id));
            trackBlockShopStateChange(true, shop);
        }

        setTimeout(() => {
            ActionSheetModal.show(false);
            isBlockingShopSet(false);
            RootNavigation.goBack();

            BlockedShopsService.applyUpdatedList();
        }, 1000);
    }


    return (
        <View style={style.container}>
            <WillShowToast id={'add-to-cart-other-profile'} />
            <ActionSheetModal.Modal
                onHide={() => {ActionSheetModal.show(false)}}>
                <View>
                    <Button
                        btnStyle={style.actionSheetButton}
                        textStyle={Font.Bold}
                        onPress={onPressReport}
                        size={ButtonOptions.Size.LG}
                        text={I19n.t('الإبلاغ عن المتجر')}/>
                    <Space directions={'h'} size={'md'} />
                    <Button
                        btnStyle={style.actionSheetButton}
                        textStyle={Font.Bold}
                        loading={isBlockingShop}
                        disabled={isBlockingShop}
                        onPress={onPressBlock}
                        size={ButtonOptions.Size.LG}
                        text={I19n.t('حجب هذا المتجر')} />
                </View>
            </ActionSheetModal.Modal>
            <ReportModal.Modal itemId={shop?.id}
                               isShop={true}/>
            <Profile
                shop={shop}
                shopStats={shopStats}
                isOwner={false}
                trackSource={trackSource}
                tabs={tabs}
                onReportShop={onPressReportIcon}
                theme={selectedTheme}
                leftHeaderBtnProps={leftHeaderBtnProps}
                rightHeaderBtnProps={rightHeaderBtnProps}
            />
        </View>
    );
};

export default OtherProfileContainer;
