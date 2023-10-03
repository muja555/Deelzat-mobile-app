import React, {useEffect, useState} from 'react';
import {View, ActivityIndicator, Dimensions} from 'react-native';

import { bundleItemStyle as style } from './bundle-item.component.style';
import {Colors, LayoutStyle, LocalizedLayout} from "deelzat/style";
import Touchable from "deelzat/v2-ui/touchable";
import MoreVertical from "assets/icons/MoreVertical.svg";
import SendIcon from 'assets/icons/Send.svg'
import I19n, {isRTL} from "dz-I19n";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {
    trackFollowShopStateChange,
    trackShareProduct,
} from "modules/analytics/others/analytics.utils";
import {createDynamicLink, refactorImageUrl, shareText} from "modules/main/others/main-utils";
import ImageSize from "v2modules/main/others/image-size.const";
import {Space} from "deelzat/ui";
import {DzText, ExpandableText, ImageWithBlur} from "deelzat/v2-ui";
import ShopImage from "v2modules/shop/components/shop-image/shop-image.component";
import {useDispatch, useSelector} from "react-redux";
import {shopSelectors} from "modules/shop/stores/shop/shop.store";
import {authSelectors} from "modules/auth/stores/auth/auth.store";
import AuthRequiredModalService from "modules/auth/modals/auth-required/auth-required.modal.service";
import SIGNUP_SOURCE from "modules/analytics/constants/analytics-signup-source.const";
import ShopFollowPost from "modules/shop/inputs/shop-follow-shop-post";
import ShopApi from "modules/shop/apis/shop.api";
import ShopFollowService from "modules/shop/others/shop-follow.service";
import BookmarkButton from "v2modules/board/components/bookmark-button/bookmark-button.component";
import BookmarkGreenBlack from "assets/icons/BookmarkGreenBlack.svg";
import {homeShopStatsSelector} from "v2modules/shop/stores/home-shops-stat/home-shops-stat.selectors";
import {homeShopsStatThunks} from "v2modules/shop/stores/home-shops-stat/home-shops-stat.store";

const ITEM_WIDTH = Dimensions.get('window').width;

const BundleItem = (props) => {

    const {
        product = null,
        isFollowingProductShop = undefined,
        showDescription = false,
        viewSource,
        viewStyle = {},
        onPress = (product) => {},
        onPressShop = (product) => {},
        onOptionsPress = (bundle) => {},
    } = props;

    const dispatch = useDispatch();
    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
    const shopState = useSelector(shopSelectors.shopStateSelector);
    const [isLoadingShare, isLoadingShareSet] = useState(false);
    const shopStateFromCache = product?.shop?.id? useSelector(homeShopStatsSelector(product.shop.id)): undefined;
    const [isRequestingFollow, isRequestingFollowSet] = useState(false);
    const [isFollowingShop, isFollowingShopSet] = useState(isFollowingProductShop);
    const trackSource = {name: EVENT_SOURCE.BUNDLE, attr1: product?.id};


    useEffect(() => {

        if (isFollowingShop !== undefined || !isAuthenticated) {
            return;
        }

        if (shopStateFromCache) {
            isFollowingShopSet(shopStateFromCache?.is_current_user_following_shop)
        }
        else {
            dispatch(homeShopsStatThunks.requestShopStat(product?.shop?.id));
        }

    }, [shopStateFromCache, isAuthenticated]);


    useEffect(() => {
        return ShopFollowService.onShopFollowStateChanged(({shopId, isFollowed}) => {
            if (!!shopId && shopId === product.shop?.id) {
                isFollowingShopSet(isFollowed)
            }
        })
    }, []);


    if (!product) {
        return <></>;
    }

    const onShare = () => {
        isLoadingShareSet(true);
        (async () => {
            try {
                const dynamicLink = await createDynamicLink('product', product.id, {
                    title: product.title,
                    imageUrl: product.image,
                    descriptionText: product.title
                });
                await shareText(dynamicLink, `${I19n.t('شارك')} ${product.title}`);
                trackShareProduct(product, trackSource);
            } catch (e) {
                console.warn(e)
            }
            isLoadingShareSet(false);
        })();
    }


    const followShop = () => {
        (async () => {
            try {
                isRequestingFollowSet(true);
                const inputs = new ShopFollowPost();
                inputs.shop_id = product.shop.id;

                if(!isFollowingShop) {
                    await ShopApi.followShop(inputs);
                    trackFollowShopStateChange(true, product.shop, trackSource);
                } else {
                    await ShopApi.unFollowShop(inputs);
                    trackFollowShopStateChange(false, product.shop, trackSource);
                }

                ShopFollowService.shopFollowStateChanged({shopId: product.shop.id, isFollowed: !isFollowingShop})
                isFollowingShopSet(!isFollowingShop);
            }
            catch (e) {
                console.warn(e);
            }
            finally {
                isRequestingFollowSet(false);
            }
        })()
    };


    const onPressFollowShop = () => {
        if (!isAuthenticated) {
            AuthRequiredModalService.setVisible({
                message: I19n.t('أنشىء حساب لتتمكن من متابعة المتجر'),
                trackSource: {
                    name: SIGNUP_SOURCE.FOLLOW_SHOP,
                    attr1: viewSource,
                    attr2: product.shop?.id,
                },
                onAuthSuccess: followShop
            })
        }
        else {
            followShop()
        }
    };

    const isMyShop = !!shopState?.shop?.id && shopState?.shop?.id === product.shop?.id;
    const displayFollowBtn = !!product.shop && !isMyShop;
    const renderDescription = showDescription && !!product.body_html;

    return (
        <Touchable onPress={() => onPress(product)} style={viewStyle}>
            <View style={style.nameRow}>
                <Touchable style={style.shopNameAndImage} onPress={onPressShop}>
                    <ShopImage image={product.shop?.picture} style={style.shopImage}/>
                    <Space directions={'v'} />
                    <DzText style={[style.shopName, LocalizedLayout.TextAlignRe()]} numberOfLines={1}>
                        {product.shop?.name}
                    </DzText>
                </Touchable>
                <View style={[LayoutStyle.AlignItemsCenter, LayoutStyle.Row]}>
                    {
                        (displayFollowBtn) &&
                        <Touchable onPress={onPressFollowShop}
                                   disabled={isRequestingFollow}
                                   style={[style.followBtn,
                                       !isFollowingShop && {backgroundColor: Colors.MAIN_COLOR},
                                       isRequestingFollow && {opacity: 0.6}]}>
                            {
                                (isRequestingFollow) &&
                                <ActivityIndicator
                                    style={style.followBtnLoading}
                                    size={16}
                                    color={!isFollowingShop? 'white': Colors.MAIN_COLOR}/>
                            }
                            {
                                (!isRequestingFollow) &&
                                <DzText style={[style.followBtnText, !isFollowingShop && {color: 'white'}]}>
                                    {I19n.t(isFollowingShop ? 'يتابع' : 'تابع')}
                                </DzText>
                            }
                        </Touchable>
                    }
                    <Space directions={'v'} />
                    <Touchable onPress={() => onOptionsPress(product)} style={{marginEnd: -10}}>
                        <MoreVertical fill={Colors.Gray500} width={24} height={24}/>
                    </Touchable>
                </View>
            </View>
            {
                (renderDescription) &&
                    <>
                        <Space  directions={'h'}/>
                        <ExpandableText text={product.body_html}
                                        minimumLines={2}
                                        textStyle={style.description}/>
                        <Space size={'md'} directions={'h'}/>
                    </>
            }
            {
                (!renderDescription) &&
                <Space  directions={'h'}/>
            }
            <View style={style.imageContainer}>
                <ImageWithBlur
                    attatchToObj={product}
                    resizeMode='cover'
                    resizeMethod="resize"
                    style={style.image}
                    thumbnailUrl={refactorImageUrl(product.image, 1)}
                    imageUrl={refactorImageUrl(product.image, ITEM_WIDTH)}/>
            </View>
            <Space directions={'h'} size={'md'}/>
            <View style={style.nameRow}>
                <DzText style={[style.title, LocalizedLayout.TextAlignRe()]}>
                    {product.title}
                </DzText>
                {
                    (isLoadingShare) &&
                    <ActivityIndicator size="small" color={Colors.MAIN_COLOR}/>
                }
                {
                    (!isLoadingShare) &&
                    <Touchable style={LocalizedLayout.ScaleX()} onPress={() => onShare(product)}>
                        <SendIcon width={24} height={24}/>
                    </Touchable>
                }
                <BookmarkButton product={product}
                                width={24}
                                height={24}
                                color={Colors.N_BLACK}
                                FilledIcon={<BookmarkGreenBlack />}
                                trackSource={trackSource}/>
            </View>
        </Touchable>
    );
}

export default BundleItem;
