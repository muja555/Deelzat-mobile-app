import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Dimensions, Platform } from 'react-native';
import CopyIcon from 'assets/icons/Copy.svg';
import { DzText, ImageWithBlur, Touchable } from 'deelzat/v2-ui';
import {
    extendArabicLetters,
    getDateDiff,
    refactorImageUrl,
} from 'modules/main/others/main-utils';
import {
    getCouponListItemTitle,
} from 'v2modules/page/containers/coupons-list/coupons-list.container.utils';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'deelzat/toast';
import DeelzatColored from 'assets/icons/DeelzatLogoColored.svg';
import I19n, { isRTL } from 'dz-I19n';

import { couponsListItemStyle as style } from './coupons-list-item.component.style';
import { Colors, LayoutStyle } from 'deelzat/style';
import CouponTypeConst from 'v2modules/checkout/constants/coupon-type.const';
import { useSelector } from 'react-redux';
import { geoSelectors } from 'v2modules/geo/stores/geo/geo.store';
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CouponsListItem = (props) => {
    const {
        coupon,
        onPressCoupon,
        isScaledDown,
    } = props;

    const currencyCode = useSelector(geoSelectors.currencyCodeSelector);
    const [backgrounds] = useState(JSON.parse(remoteConfig.getValue(RemoteConfigsConst.COUPONS_LIST_BACKGROUNDS).asString()));

    const title = getCouponListItemTitle(coupon, currencyCode);
    const timerRef = useRef();
    const bg = useMemo(() => {
        if (!backgrounds) {
            return null;
        }
        return backgrounds
            .find(bg => bg.type === (coupon?.type || CouponTypeConst.FIXED_AMOUNT))?.url;
    }, [coupon?.type, backgrounds]);

    const [isExpired, isExpiredSet] = useState(undefined);
    const [expirationTimeStr, expirationTimeStrSet] = useState('');


    const updateExpireDate = () => {
        const thisDate = new Date();
        const endDate = new Date(coupon.end_date);
        const _isExpired = thisDate > endDate;
        if (!_isExpired) {

            const dateDiff = getDateDiff(endDate, thisDate);

            const hourDiffStr = I19n.t('HOUR', { count: dateDiff.hour });
            const minsDiffStr = I19n.t('MIN', { count: dateDiff.minute });
            const secondsDiffStr = I19n.t('SEC', { count: dateDiff.second });

            let expireTime;
            if (isRTL()) {
                expireTime = dateDiff.hour > 0 ? hourDiffStr + ' و' : '';
                expireTime = `${expireTime}${minsDiffStr} و${secondsDiffStr}`;
            } else {
                expireTime = dateDiff.hour > 0 ? hourDiffStr : '';
                expireTime = `${expireTime}  ${minsDiffStr}  ${secondsDiffStr}`;
            }

            expirationTimeStrSet(`${I19n.t('صالح حتى:')}  ${expireTime}`);
        } else {
            expirationTimeStrSet(I19n.t('منتهي الصلاحية'));
        }

        isExpiredSet(_isExpired);
    };


    useEffect(() => {
        if (coupon) {
            updateExpireDate();
            timerRef.current = setInterval(() => {
                updateExpireDate();
            }, 1000);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };

    }, [coupon]);


    const onPressCopy = () => {
        Clipboard.setString(coupon?.code);
        Toast.info(I19n.t('لقد نسخت كود الكوبون'), require('assets/images/Coupon.png'));
    };


    return (
        <View
            opacity={isExpired ? (Platform.OS === 'android' ? 0.5 : 0.6) : 1}
            needsOffscreenAlphaCompositing={true}>
            <Touchable
                disabled={!onPressCoupon || !coupon}
                onPress={onPressCoupon}
                style={[style.couponView, isScaledDown && style.couponView_scaledDown, !isScaledDown && style.couponViewShadow]}>
                {
                    (bg) &&
                    <ImageWithBlur
                        style={[style.background, isScaledDown && style.background_scaledDown, isRTL() && { transform: [{ scaleX: -1 }] }]}
                        resizeMode='cover'
                        resizeMethod='resize'
                        thumbnailUrl={refactorImageUrl(bg, SCREEN_WIDTH)}
                        imageUrl={refactorImageUrl(bg, 0)} />
                }
                <View style={[style.contents, isScaledDown && style.contents_scaledDown]}>
                    {
                        (coupon) &&
                        <View style={[style.topInfo, isScaledDown && style.topInfo_scaledDown]}>
                            <View>
                                <DzText style={[style.couponTitle, isScaledDown && style.couponTitle_scaledDown]}>
                                    {title}
                                </DzText>
                                <DzText style={[style.couponTitle, isScaledDown && style.couponTitle_scaledDown, style.couponTitleShadow]}>
                                    {title}
                                </DzText>
                            </View>
                            <Touchable onPress={onPressCopy}
                                       style={[style.copyButton, isScaledDown && style.copyButton_scaledDown]}>
                                <View style={style.copyBtnContents}>
                                    <CopyIcon width={isScaledDown? 10: 12} height={isScaledDown? 10: 12} />
                                    <View style={{ width: isScaledDown? 2: 8 }} />
                                    <DzText style={[style.couponCode, isScaledDown && style.couponCode_scaledDown]}>
                                        {coupon.code}
                                    </DzText>
                                </View>
                            </Touchable>
                        </View>
                    }
                    {
                        (!coupon) &&
                        <View style={style.topInfoNoCoupon}>
                            <DzText style={style.couponTitle}>
                                {title}
                            </DzText>
                        </View>
                    }
                    {
                        (coupon) &&
                        <DzText style={[style.midText, isScaledDown && style.midText_scaledDown]}>

                        </DzText>
                    }
                    {
                        (!coupon) &&
                        <View
                            style={[LayoutStyle.Flex, LayoutStyle.AlignItemsCenter, LayoutStyle.JustifyContentCenter]}>
                            <DzText style={[style.midTextNoCoupon, !coupon && !isRTL() && { letterSpacing: 3 }]}>
                                {extendArabicLetters(I19n.t('هنا يمكنك التحقق من الكوبونات والعروض المتوفرة لديك من ديلزات لتستمتع بالتسوق')) + '.'}
                            </DzText>
                        </View>
                    }
                    <View style={[style.bottomView, isScaledDown && style.bottomView_scaledDown, !coupon && { justifyContent: 'center' }]}>
                        {
                            (isExpired !== undefined) &&
                            <DzText style={[style.expireDate, isScaledDown && style.expireDate_scaledDown, isExpired && { color: Colors.ERROR_COLOR_2 }]}>
                                {expirationTimeStr}
                            </DzText>
                        }
                        <DeelzatColored width={isScaledDown? 40: 50} height={isScaledDown? 14: 30} />
                    </View>
                </View>
            </Touchable>
        </View>
    );
};

export default CouponsListItem;
