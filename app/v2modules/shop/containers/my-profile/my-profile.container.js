import { useIsFocused } from '@react-navigation/native';
import { ButtonOptions } from 'deelzat/ui';
import I19n from 'dz-I19n';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';
import USER_PROP from 'modules/analytics/constants/analytics-user-propery.const';
import {
    setFacebookUserParams,
    setUserProperty,
    trackOpenConversation,
} from 'modules/analytics/others/analytics.utils';
import { authSelectors } from 'modules/auth/stores/auth/auth.store';
import COMPONENTS_PAGE from 'modules/main/constants/components-pages.const';
import { appSelectors } from 'modules/main/stores/app/app.store';
import store from 'modules/root/components/store-provider/store-provider';
import ShopApi from 'modules/shop/apis/shop.api';
import ShopFollowersCountGetInput from 'modules/shop/inputs/shop-followers-count-get.input';
import ShopFollowService from 'modules/shop/others/shop-follow.service';
import { shopSelectors, shopThunks } from 'modules/shop/stores/shop/shop.store';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import FloatingAddProductButton
    from 'v2modules/main/components/floating-add-product-button/floating-add-product-button.component';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import LoggedOutProfile from 'v2modules/page/components/logged-out-profile/logged-out-profile.component';
import ProductApi from 'v2modules/product/apis/product.api';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import Profile from 'v2modules/shop/components/profile/profile.component';
import ProfileTabConst from 'v2modules/shop/constants/profile-tab.const';
import MyProfileService from './my-profile.container.service';
import { profileContainerStyle as style } from './my-profile.container.style';
import { getBtnStyleFrom, getBtnTextStyleFrom } from 'modules/main/others/main-utils';
import UserInfoApi from 'modules/main/apis/user-info.api';
import UserInfoUpdateInput from 'modules/main/inputs/user-info-update.input';
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';
import GlobalSpinnerService from 'modules/main/components/global-spinner/global-spinner.service';

const MyProfileContainer = () => {
    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const appInitialized = useSelector(appSelectors.appInitializedSelector);
    const shopState = useSelector(shopSelectors.shopStateSelector);

    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
    const authUser = useSelector(authSelectors.auth0UserSelector);

    const [shop, shopSet] = useState();
    const [tabs, tabsSet] = useState([ProfileTabConst.LOADER]);
    const [shopStats, shopStatsSet] = useState({ loaded: !shopState?.shop?.id });

    const [leftHeaderBtnProps, leftHeaderBtnPropsSet] = useState({});
    const [rightHeaderBtnProps, rightHeaderBtnPropsSet] = useState({});

    const [trackSource, trackSourceSet] = useState();

    const requestShopStats = () => {
        const inputs = new ShopFollowersCountGetInput();
        inputs.shop_id = shopState.shop.id;
        (async () => {
            try {
                const _shopStats = await ShopApi.followersCountGet(inputs);
                shopStatsSet({ ..._shopStats, loaded: true });
            } catch (e) {
                shopStatsSet({  loaded: true });
                console.warn(e);
            }
        })();
    };

    useEffect(() => {
        trackSourceSet({
            name: EVENT_SOURCE.MY_SHOP,
            attr1: shopState?.shop?.id,
            attr2: shopState?.shop?.name,
        });

    }, [shopState?.shop]);

    useEffect(() => {
        if (!authUser) {
            tabsSet([ProfileTabConst.LOADER]);
        }
    }, [authUser]);

    useEffect(() => {
        if (!appInitialized) {
            return;
        }
        if (!shopState?.shop?.id) {
            return;
        }

        requestShopStats();
    }, [shopState?.shop?.id, appInitialized]);

    useEffect(() => {

        if (appInitialized && shopState?.shop) {
            shopSet(shopState.shop);

        } else if (appInitialized && authUser) {
            UserInfoApi.getUserInfo()
                .then((res) => {
                    shopSet({
                        user: res?.metadata,
                    });
                })
                .catch((e) => {

                    console.warn(e);

                    // Create new user
                    if (JSON.stringify(e).includes('TypeError->Cannot read property')) {

                        const inputs = new UserInfoUpdateInput();
                        let firstName, lastName;

                        const splitNickName = authUser.nickName?.split(' ');
                        if (splitNickName?.length === 2) {
                            firstName = splitNickName[0];
                            lastName = splitNickName[1];
                        }

                        const metaData =  {
                            firstName: firstName || authUser.nickname || authUser.name || '',
                            lastName: lastName || authUser.nickname || authUser.name || '',
                            email: authUser.email,
                            mobileNumber: authUser.phone_number || authUser.phone,
                            picture: authUser.picture?.includes('cdn.auth0.com')? remoteConfig.getString(RemoteConfigsConst.DEFAULT_AVATAR): authUser.picture
                        };

                        inputs.metadata = metaData;

                        shopSet({
                            user: inputs.metadata
                        });

                        UserInfoApi.updateUserInfo(inputs)
                            .then((res) => {
                                shopSet({
                                    user: res?.metadata,
                                });
                            })
                            .catch(console.warn);
                    }

                });
        }
    }, [appInitialized, authUser, shopState?.shop]);


    useEffect(() => {
        if (shopStats) {
            setUserProperty(USER_PROP.SHOP_PRODUCTS_COUNT, shopStats?.products?.count || 0);
        }


        if (shopStats.loaded) {
            const _tabs =
                shopStats?.products?.count > 0
                    ? [ProfileTabConst.NEW_PRODUCTS, ProfileTabConst.USED_PRODUCTS, ProfileTabConst.MENU]
                    : [ProfileTabConst.START_SELLING, ProfileTabConst.MENU];
            tabsSet(_tabs);
        }

        return ShopFollowService.onShopFollowStateChanged((payload) => {
            if (shopState?.shop?.id) {
                requestShopStats();
            }
        });
    }, [shopStats]);


    useEffect(() => {
        return MyProfileService.onRefreshMyProfileStatus((payload) => {
            if (!payload?.noLoader) {
                tabsSet([ProfileTabConst.LOADER]);
            }

            (async () => {
                await ProductApi.clearCache();

                dispatch(shopThunks.refreshShop());
                if (!shopState?.shop?.id) {
                    tabsSet([ProfileTabConst.NEW_PRODUCTS, ProfileTabConst.MENU]);
                } else {
                    requestShopStats();
                }
            })();
        });
    }, [shopState]);


    // Update contact seller btn
    useEffect(() => {
        leftHeaderBtnPropsSet({
            text: I19n.t('فريق ديلزات'),
            headerBtn: getBtnStyleFrom(shopState?.theme),
            type: ButtonOptions.Type.PRIMARY_OUTLINE,
            textStyle: getBtnTextStyleFrom(shopState?.theme),
            onPress: onPressContactSupport,
        });
    }, [shopState]);


    // Update follow shop btn
    useEffect(() => {
        rightHeaderBtnPropsSet({
            text: I19n.t('تعديل الحساب'),
            headerBtn: getBtnStyleFrom(shopState?.theme, true),
            type: ButtonOptions.Type.PRIMARY,
            textStyle: getBtnTextStyleFrom(shopState?.theme, true),
            onPress: onEditPress,
        });
    }, [shop, shopStats, shopState]);


    useEffect(() => {
        if (shop) {
            setFacebookUserParams(shop);
        }
    }, [shop]);


    const onPressContactSupport = () => {
        const supportAccount = store?.getState()?.chat?.supportAccount;
        if (supportAccount?.userId) {
            RootNavigation.push(MainStackNavsConst.CHAT_ROOM, { toUserId: supportAccount?.userId });
            trackOpenConversation(supportAccount?.userId, { name: EVENT_SOURCE.CHAT_ROOM });
        }
    };

    const onEditPress = () => {
        RootNavigation.push(MainStackNavsConst.EDIT_PROFILE, {
            shop,
            initialTheme: shopState.theme,
            showShopNameField: shopStats?.products?.count > 0,
        });
    };


    // Hide Global spinner was originated from
    useEffect(() => {
        if (isAuthenticated) {
           setTimeout(() => {
               GlobalSpinnerService.setVisible(false);
           }, 1000);
        }
    }, [isAuthenticated]);


    if (!appInitialized) {
        return <></>;
    }

    return (
        <View style={style.container} contentContainerStyle={style.contentScroll}>
            {!isAuthenticated && isFocused && (
                <View style={style.loggedOutProfile}>
                    <LoggedOutProfile />
                </View>
            )}
            {isAuthenticated && (
                <>
                    {shopStats?.products?.count > 0 && (
                        <FloatingAddProductButton trackingPageName={COMPONENTS_PAGE.MY_SHOP} />
                    )}
                    <Profile
                        shop={shop ?? {}}
                        shopStats={shopStats}
                        isOwner={true}
                        trackSource={trackSource}
                        tabs={tabs}
                        theme={shopState.theme}
                        leftHeaderBtnProps={leftHeaderBtnProps}
                        rightHeaderBtnProps={rightHeaderBtnProps}
                    />
                </>
            )}
        </View>
    );
};

export default MyProfileContainer;
