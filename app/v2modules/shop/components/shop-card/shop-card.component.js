import React, {memo, useEffect, useState} from 'react';
import { View, Text } from 'react-native';
import I19n from "dz-I19n";

import { shopCardStyle as style } from './shop-card.component.style';
import ShopImage from "v2modules/shop/components/shop-image/shop-image.component";
import {DzText, Touchable} from "deelzat/v2-ui";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import {useSelector} from "react-redux";
import {authSelectors} from "modules/auth/stores/auth/auth.store";
import ShopFollowService from "modules/shop/others/shop-follow.service";
import ShopFollowPost from "modules/shop/inputs/shop-follow-shop-post";
import ShopApi from "modules/shop/apis/shop.api";
import {trackFollowShopStateChange} from "modules/analytics/others/analytics.utils";
import AuthRequiredModalService from "modules/auth/modals/auth-required/auth-required.modal.service";
import SIGNUP_SOURCE from "modules/analytics/constants/analytics-signup-source.const";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import {LayoutStyle} from "deelzat/style";

const ShopCard = (props) => {
    const {
        shop = {},
        onPress = () => {},
        onChangeFollowState = () => {},
        showFollowButton = true,
        trackSource,
    } = props;

    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
    const [isRequestingFollow, isRequestingFollowSet] = useState(false);
    const [thiShopIsFollowed, thisShopIsFollowedSet] = useState(isAuthenticated && shop.is_followed);

    useEffect(() => {
        return ShopFollowService.onShopFollowStateChanged(({shopId, isFollowed}) => {
            if (shopId === shop.id) {
                thisShopIsFollowedSet(isFollowed)
            }
        })
    }, []);

    const followShop = () => {
        (async () => {
            try {
                isRequestingFollowSet(true);
                const inputs = new ShopFollowPost();
                inputs.shop_id = shop.id;

                if(!thiShopIsFollowed) {
                    await ShopApi.followShop(inputs);
                    trackFollowShopStateChange(true, shop, trackSource);
                } else {
                    await ShopApi.unFollowShop(inputs);
                    trackFollowShopStateChange(false, shop, trackSource);
                }

                ShopFollowService.shopFollowStateChanged({shopId: shop.id, isFollowed: !thiShopIsFollowed})
                thisShopIsFollowedSet(!thiShopIsFollowed);
                onChangeFollowState();
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
                    attr1: EVENT_SOURCE.SHOPS,
                    attr2: shop.id,
                },
                onAuthSuccess: followShop
            })
        }
        else {
            followShop()
        }
    };


    return (
        <Touchable onPress={onPress} style={style.container}>
            <ShopImage image={shop.user?.picture}
                       resizeMethod='resize'
                       style={style.image}/>
            <Space directions={'h'}/>
            <DzText style={style.shopName}>
                {shop.name}
            </DzText>
            <View style={LayoutStyle.Flex}/>
            <Space directions={'h'}/>
            <DzText style={style.stats}>
                <DzText style={style.number}>
                    {shop.followers_count || 0}
                </DzText>
                <DzText>
                    {" " + I19n.t('متابع') + "/ "}
                </DzText>
                <DzText style={style.number}>
                    {shop.products_count || 0}
                </DzText>
                <DzText>
                    {" " + I19n.t('منتج')}
                </DzText>
            </DzText>
            <Space directions={'h'}/>
            {
                (showFollowButton) &&
                <Button btnStyle={[style.followBtn, !thiShopIsFollowed && style.followingBtn]}
                        textStyle={[style.followText, !thiShopIsFollowed && style.followingText]}
                        text={I19n.t(thiShopIsFollowed? 'يتابع' :  'تابع')}
                        type={!thiShopIsFollowed? ButtonOptions.Type.PRIMARY: ButtonOptions.Type.PRIMARY_OUTLINE}
                        onPress={onPressFollowShop}
                        disabled={isRequestingFollow}
                        loading={isRequestingFollow}/>
            }
        </Touchable>
    );
}


export default ShopCard;
