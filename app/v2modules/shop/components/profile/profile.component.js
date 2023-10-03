import PagerView from '@deelzat/react-native-pager-view';
import CalendarIcon from 'assets/icons/Calendar.svg';
import FrameIcon from 'assets/icons/ImageFrame.png';
import LocationIcon from 'assets/icons/Location2.png';
import MenuIcon from 'assets/icons/Menu.svg';
import ShareIcon from 'assets/icons/Share2.svg';
import { Colors, LayoutStyle, LocalizedLayout } from 'deelzat/style';
import { Button, Space } from 'deelzat/ui';
import ArrowIcon from 'assets/icons/UglyArrow.svg';
import { DzText, ImageWithBlur, Touchable } from 'deelzat/v2-ui';
import I19n, { getLocale } from 'dz-I19n';
import {
    trackClickOnPageTab,
    trackClickOnSettings,
    trackShareShop, trackViewFollowingList,
    trackViewScreen,
} from 'modules/analytics/others/analytics.utils';
import MoreVertical from 'assets/icons/MoreVertical.svg';
import { apprvNumbers, createDynamicLink, refactorImageUrl } from 'modules/main/others/main-utils';
import { persistentDataSelectors } from 'modules/main/stores/persistent-data/persistent-data.store';
import moment from 'moment-timezone';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Platform, Share, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import ProfileTabs from 'v2modules/shop/components/profile-tab-bar/profile-tab-bar.component';
import { getProfileTabOptions } from 'v2modules/shop/components/profile-tab-bar/profile-tab-bar.component.utils';
import ShopImage from 'v2modules/shop/components/shop-image/shop-image.component';
import { profileStyle as style } from './profile.component.style';
import FollowersListTabBarConst from 'v2modules/page/containers/followers-list/followers-list-tab-bar.const';
import ProfileTabConst from 'v2modules/shop/constants/profile-tab.const';

const Profile = (props, ref) => {
    const {
        theme,
        shop = {},
        shopStats,
        isOwner = false,
        tabs = [],
        rightHeaderBtnProps = {},
        leftHeaderBtnProps = {},
        trackSource,
        onReportShop,
    } = props;

    const insets = useSafeAreaInsets();
    const MIN_HEIGHT = useRef(105 + insets.top);

    // to complete the animation faster if it had fewer contents
    const isHalfAnimation = useRef(false);

    const [TABS_OPTIONS] = useState(getProfileTabOptions());
    const tabsPagerRef = useRef();
    const shopCountryCode = shop?.country_codes ? shop?.country_codes[0] : 'PS';
    const cities = useSelector(persistentDataSelectors.citiesByCountryCode(shopCountryCode));

    const [currentTab, currentTabSet] = useState(tabs[0]);
    const [headerHeight, headerHeightSet] = useState(0);
    const [joinedSince, joinedSinceSet] = useState();
    const [isShareLoaderVisible, isShareLoaderVisibleSet] = useState(false);

    const cityLabel = useMemo(() => {
        const cityObj = cities.find((city) => city['ar'] === shop?.address?.city);
        return cityObj ? cityObj[getLocale()] : '';
    }, [cities, shop?.address?.city]);


    const listPositionAnimation = useRef(new Animated.Value(0));
    const nonNativeHeaderAnim = useRef(new Animated.Value(0));

    useEffect(() => {
        listPositionAnimation.current.addListener(Animated.event([{ value: nonNativeHeaderAnim.current }], { useNativeDriver: false }));
    }, []);

    useEffect(() => {
        if (!shop?.createdAt) return;

        moment.locale(getLocale());
        let date = moment(shop?.createdAt, 'YYYY-MM-DD').toDate();
        date = moment(new Date(date)).format('MMM YYYY');
        joinedSinceSet(date);
    }, [shop?.createdAt]);


    useEffect(() => {
        if (tabs.length && !tabs.includes(ProfileTabConst.LOADER)) {
            const indexFromNew = tabs.findIndex((tab) => tab === currentTab)
            currentTabSet(indexFromNew !== -1? tabs[indexFromNew]: tabs[0]);
            tabsPagerRef?.current?.setPageWithoutAnimation(indexFromNew !== -1? indexFromNew: 0)
        }
    }, [tabs]);


    useEffect(() => {
        listPositionAnimation.current.setValue(0);
        trackViewScreen(currentTab);
    }, [currentTab]);


    useEffect(() => {
        isHalfAnimation.current = shopStats?.products?.count > 4 && shopStats?.products?.count <= 7;
    }, [shopStats?.products?.count]);


    const onProfileImagePress = useCallback(() => {
        RootNavigation.push(MainStackNavsConst.IMAGE_GALLERY, {
            images: [shop.user?.picture ?? shop.picture],
        });
    }, [shop]);


    const onPressTab = useCallback(
        (tabKey) => {
            trackClickOnPageTab(tabKey);
            tabsPagerRef.current.setPage(tabs.indexOf(tabKey));
            currentTabSet(tabKey);
        },
        [tabs],
    );


    const onLayout = useCallback(({
                          nativeEvent: {
                              layout: { height },
                          },
                      }) => {
        headerHeightSet(height);
    }, []);

    const onPressFollowingStatus = () => {
        RootNavigation.push(MainStackNavsConst.FOLLOWERS_LIST, { shop });
        trackViewFollowingList(shop, isOwner);
    };


    const onPressFollowerStatus = () => {
        RootNavigation.push(MainStackNavsConst.FOLLOWERS_LIST, {
            shop,
            initialTab: FollowersListTabBarConst.FOLLOWERS
        });
        trackViewFollowingList(shop, isOwner);
    }


    const onPressSettings = () => {
        trackClickOnSettings();
        RootNavigation.push(MainStackNavsConst.SETTINGS);
    };


    const onPressShare = () => {
        isShareLoaderVisibleSet(true);
        (async () => {
            try {
                const dynamicLink = await createDynamicLink('shop', shop.id, {
                    title: shop?.name,
                    imageUrl: shop.user?.picture ?? shop.picture,
                    descriptionText: shop?.name,
                });
                await Share.share({
                    url: dynamicLink,
                    message: Platform.OS !== 'ios' && dynamicLink,
                });
                trackShareShop(shop, false, trackSource);
            } catch (e) {
                console.error(e);
            } finally {
                isShareLoaderVisibleSet(false);
            }
        })();
    };

    const shopFirstLastName = `${shop?.user?.firstName?.trim() ?? ''} ${shop?.user?.lastName?.trim() ?? ''}`.trim();
    const shopAboutText =
        shop.extra_data?.description?.trim() ||
        (isOwner ? I19n.t('قم بتعديل تفاصيل الحساب لتتمكن من إضافة وصف خاص بك.') : '');


    const decrementAmount = !shopAboutText ? 15 : -2;
    const inputEnd = Math.max(headerHeight - MIN_HEIGHT.current, 0);
    const animInputRange = [0, isHalfAnimation.current ? inputEnd / 2 : inputEnd];

    const shopNameWidth = nonNativeHeaderAnim?.current?.interpolate({
        inputRange: animInputRange,
        outputRange: [1, 0.35],
        extrapolate: 'clamp',
    });

    const translateY = listPositionAnimation?.current?.interpolate({
        inputRange: animInputRange,
        outputRange: [0, -(headerHeight - MIN_HEIGHT.current) - decrementAmount],
        extrapolate: 'clamp',
    });

    const shopNameAnim = listPositionAnimation?.current?.interpolate({
        inputRange: animInputRange,
        outputRange: [0, MIN_HEIGHT.current - 40 - insets.top - decrementAmount],
        extrapolate: 'clamp',
    });

    const rightBtnAnim = listPositionAnimation?.current?.interpolate({
        inputRange: animInputRange,
        outputRange: [0, MIN_HEIGHT.current + 20 - insets.top - decrementAmount],
        extrapolate: 'clamp',
    });

    const leftBtnAnim = listPositionAnimation?.current?.interpolate({
        inputRange: animInputRange,
        outputRange: [0, MIN_HEIGHT.current - insets.top - decrementAmount],
        extrapolate: 'clamp',
    });

    const productsCountAnim = listPositionAnimation?.current?.interpolate({
        inputRange: animInputRange,
        outputRange: [0, MIN_HEIGHT.current + 65 - insets.top - decrementAmount],
        extrapolate: 'clamp',
    });

    const componentsFadeAnim = listPositionAnimation?.current?.interpolate({
        inputRange: animInputRange,
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });


    const shareBtn = (
        <>
            {shop?.id && (
                <Touchable onPress={onPressShare} style={style.shareBtn}>
                    <ShareIcon width={24} height={24}
                               fill={theme?.color2 || Colors.MAIN_COLOR} />
                </Touchable>
            )}
        </>
    );

    const menuBtn = (
        <>
            {isOwner && (
                <Touchable style={LayoutStyle.Row} onPress={onPressSettings}>
                    <MenuIcon width={24} height={24} />
                </Touchable>
            )}
        </>
    )

    const optionsMenu = (
        <>
            {
                (!isOwner) && (
                    <Touchable  style={style.topBtn} onPress={onReportShop}>
                        <MoreVertical fill={Colors.Gray500} width={24} height={24}/>
                    </Touchable>
                )
            }
        </>
    )


    return (
        <View style={style.container}>
            <Spinner visible={isShareLoaderVisible} textContent={''} />
            <Animated.View style={[style.header, { transform: [{ translateY }] }]}>
                {
                    (theme) &&
                    <ImageWithBlur style={[style.headerBackground, { height: headerHeight }]}
                                   useFastImage={true}
                                   imageUrl={refactorImageUrl(theme.background_url, 0)}
                                   thumbnailUrl={refactorImageUrl(theme.background_url, 1)}
                    />
                }
                <View
                    style={[style.headerContents, { paddingTop: insets.top + 16 }, !theme && { backgroundColor: 'white' }]}
                    onLayout={onLayout}>
                    {
                        (!isOwner) &&
                        <>
                            <Animated.View style={[style.headerBtnIconsContainer, { opacity: componentsFadeAnim }]}>
                                <View style={LayoutStyle.Flex}>
                                    <Touchable hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
                                               onPress={RootNavigation.goBack}
                                               style={[style.backButton, LocalizedLayout.ScaleX()]}>
                                        <ArrowIcon stroke={Colors.N_BLACK} width={24} height={24} />
                                    </Touchable>
                                </View>
                                <View style={LayoutStyle.Row}>
                                    {shareBtn}
                                    {optionsMenu}
                                </View>
                            </Animated.View>
                            <View style={{ height: 10 }} />
                        </>
                    }
                    <View style={style.infoHeader}>
                        <Animated.View
                            style={{ opacity: componentsFadeAnim, transform: [{ translateY: leftBtnAnim }] }}
                        >
                            <Touchable style={style.imageView} onPress={onProfileImagePress}>
                                <Image source={FrameIcon} tintColor={theme?.color1 || Colors.MAIN_COLOR}
                                       style={[style.frame, theme && { tintColor: theme.color1 || Colors.MAIN_COLOR }]} />
                                <ShopImage
                                    image={shop.user?.picture ?? shop.picture}
                                    resizeMethod='scale'
                                    style={style.profileImage}
                                />
                            </Touchable>
                        </Animated.View>

                        <View style={LayoutStyle.Flex}>
                            <View style={[LayoutStyle.Row, LayoutStyle.Flex,  {marginEnd: -10}]}>
                                <View style={[LayoutStyle.Flex, LayoutStyle.AlignItemsCenter]}>
                                    <View style={style.statusView}>
                                        <Animated.View
                                            style={[
                                                LayoutStyle.AlignItemsCenter,
                                                {
                                                    opacity: componentsFadeAnim,
                                                    transform: [{ translateY: leftBtnAnim }],
                                                },
                                            ]}
                                            key={'followers_label'}
                                        >
                                            <Touchable
                                                style={LayoutStyle.AlignItemsCenter}
                                                key={'followeing_label'}
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                disabled={!shopStats?.shop_followers?.count}
                                                onPress={onPressFollowerStatus}
                                            >
                                                <DzText style={[style.numberValue, theme && { color: theme?.color2 }]}>
                                                    {!shopStats ? 0 : apprvNumbers(shopStats?.shop_followers?.count) || 0}
                                                </DzText>
                                                <DzText style={style.numberLabel}>{I19n.t('متابع')}</DzText>
                                            </Touchable>
                                        </Animated.View>
                                        {shopStats?.products?.count > 0 && (
                                            <Animated.View
                                                style={[
                                                    LayoutStyle.AlignItemsCenter,
                                                    { transform: [{ translateY: productsCountAnim }] },
                                                ]}
                                                key={'products_label'}
                                            >
                                                <DzText
                                                    style={[style.numberValue, theme && { color: theme?.color2 }]}>{apprvNumbers(shopStats?.products?.count) || 0}</DzText>
                                                <DzText style={style.numberLabel}>{I19n.t('منتج')}</DzText>
                                            </Animated.View>
                                        )}
                                        <Animated.View
                                            style={{
                                                opacity: componentsFadeAnim,
                                                transform: [{ translateY: leftBtnAnim }],
                                            }}
                                        >
                                            <Touchable
                                                style={LayoutStyle.AlignItemsCenter}
                                                key={'followeing_label'}
                                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                                disabled={!shopStats?.following?.count}
                                                onPress={onPressFollowingStatus}
                                            >
                                                <View style={LayoutStyle.AlignItemsCenter}>
                                                    <DzText
                                                        style={[style.numberValue, theme && { color: theme?.color2 }]}>
                                                        {!shopStats ? 0 : apprvNumbers(shopStats?.following?.count) || 0}
                                                    </DzText>
                                                    <DzText style={style.numberLabel}>{I19n.t('يتابع')}</DzText>
                                                </View>
                                            </Touchable>
                                        </Animated.View>
                                    </View>
                                </View>
                                {
                                    (isOwner) &&
                                    <Animated.View style={[style.headerBtnIconsContainer, { opacity: componentsFadeAnim }]}>
                                        {shareBtn}
                                        {menuBtn}
                                        {optionsMenu}
                                    </Animated.View>
                                }
                            </View>
                            <View style={{ height: 10 }} />
                            <View style={style.buttonsContainer}>
                                <Animated.View
                                    style={{ opacity: componentsFadeAnim, transform: [{ translateY: leftBtnAnim }] }}
                                >
                                    <Button {...leftHeaderBtnProps}
                                            btnStyle={[style.headerBtn, leftHeaderBtnProps?.headerBtn]}
                                            textStyle={[style.headerBtnText, leftHeaderBtnProps?.textStyle]} />
                                </Animated.View>
                                <Space directions={'v'} size={['sm', '']} />
                                <Animated.View style={{ transform: [{ translateY: rightBtnAnim }] }}>
                                    <Button  {...rightHeaderBtnProps}
                                             btnStyle={[style.headerBtn, rightHeaderBtnProps?.headerBtn]}
                                             textStyle={[style.headerBtnText, rightHeaderBtnProps?.textStyle]} />
                                </Animated.View>
                            </View>
                        </View>
                    </View>
                    <Space directions={'h'} sizes={'sm'} />
                    <Animated.View
                        style={{ opacity: componentsFadeAnim, transform: [{ translateY: leftBtnAnim }] }}
                    >
                        <DzText
                            style={[
                                style.firstLastName,
                                LocalizedLayout.TextAlignRe(),
                                { opacity: shopFirstLastName ? 1 : 0 },
                            ]}
                            key={'firstLastName'}
                        >
                            {shopFirstLastName || 'TEMP'}
                        </DzText>
                    </Animated.View>
                    {shop.name && shop.name !== ' ' && (
                        <Animated.View
                            style={[style.storeView, { transform: [{ translateY: shopNameAnim }] }]}
                            key={'shopName'}
                        >
                            <DzText
                                style={[style.store, theme && { color: theme.color2 }]}>{I19n.t('المتجر') + ':'}</DzText>
                            <DzText style={style.store}> </DzText>
                            <DzText style={[LocalizedLayout.TextAlignRe(), style.storeName, { flex: shopNameWidth }]}
                                    useAnimated={true}
                                    numberOfLines={1}>{shop.name}</DzText>
                        </Animated.View>
                    )}
                    <Animated.View style={{ opacity: componentsFadeAnim }}>
                        {
                            (!!shopAboutText) &&
                            <DzText
                                style={[
                                    style.aboutText,
                                    LocalizedLayout.TextAlignRe(),
                                ]}
                            >
                                {shopAboutText || 'TEMP'}
                            </DzText>
                        }
                    </Animated.View>
                    <View style={{ height: 12 }} />
                    <Animated.View
                        style={[
                            LayoutStyle.Row,
                            LayoutStyle.AlignItemsCenter,
                            {
                                paddingHorizontal: 15,
                                opacity: componentsFadeAnim,
                            },
                        ]}
                    >
                        {
                            (!!cityLabel) &&
                            <View
                                style={[
                                    LayoutStyle.Row,
                                    LayoutStyle.AlignItemsCenter,
                                    { opacity: cityLabel ? 1 : 0 },
                                ]}
                                key={'locationInfo'}>
                                <Image source={LocationIcon} resizeMethod={'scale'} tintColor={theme?.color2}
                                       style={[style.locationIcon, theme && { tintColor: theme?.color2 }]} />
                                <View style={{ width: 7 }} />
                                <DzText style={style.infoGrey}>{cityLabel}</DzText>
                                <View style={{ width: 54 }} />
                            </View>
                        }
                        <View
                            style={[
                                LayoutStyle.Row,
                                LayoutStyle.AlignItemsCenter,
                                { opacity: joinedSince ? 1 : 0 },
                            ]}
                            key={'joinedDate'}
                        >
                            <CalendarIcon width={24} height={24} fill={theme?.color2 || Colors.MAIN_COLOR} />
                            <View style={{ width: 7 }} />
                            <DzText style={style.infoGrey}>{I19n.t('انضمّ في') + ' ' + joinedSince}</DzText>
                        </View>
                    </Animated.View>
                    <View style={{ height: 20 }} />
                    <ProfileTabs tabs={tabs}
                                 tintColor={theme?.color1}
                                 currentTab={currentTab}
                                 onPressTab={onPressTab} />
                </View>
            </Animated.View>
            <PagerView
                style={style.navigator}
                scrollEnabled={false}
                ref={tabsPagerRef}
                collapsable={false}
                initialPage={0}
            >
                {tabs.map((tab, index) => {
                    const tabOption = TABS_OPTIONS[tab];
                    return (
                        <View style={LayoutStyle.Flex} key={`${tab.key}-${index}`}>
                            <tabOption.screen
                                isFocused={tab === currentTab}
                                profileParams={{
                                    headerHeight,
                                    shop,
                                    theme,
                                    trackSource,
                                    isOwner,
                                    tabName: tabOption.key,
                                    headerMinHeight: MIN_HEIGHT,
                                    extraListBottom: isHalfAnimation.current ? 50 : 0,
                                    listPositionAnimation,
                                }}
                            />
                        </View>
                    );
                })}
            </PagerView>
        </View>
    );
};

export default Profile;
