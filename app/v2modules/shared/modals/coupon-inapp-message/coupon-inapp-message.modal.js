import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, View } from 'react-native';
import Modal from 'react-native-modal';

import I19n, { isRTL } from 'dz-I19n';
import { couponInappMessageModalStyle as style } from './coupon-inapp-message.modal.style';
import CouponInAppMessageModalService
    from 'v2modules/shared/modals/coupon-inapp-message/coupon-inapp-message.modal.service';
import CloseIcon from 'assets/icons/Close.svg';
import { Colors } from 'deelzat/style';
import { DzText, Touchable } from 'deelzat/v2-ui';
import CouponsListItem from 'v2modules/page/components/coupons-list-item/coupons-list-item.component';
import Clipboard from '@react-native-clipboard/clipboard';
import { Button } from 'deelzat/ui';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import CouponAddInput from 'v2modules/checkout/inputs/coupon-add.input';
import CouponApi from 'v2modules/checkout/apis/coupon.api';
import DeviceInfo from 'react-native-device-info';
import DeeplinkTypeConst from 'modules/root/constants/deeplink-type.const';
import { getInAppPopupToShowOnLaunch, setInAppPopupToShowOnLaunch } from 'modules/main/others/app.localstore';
import { useSelector } from 'react-redux';
import { appSelectors } from 'modules/main/stores/app/app.store';
import DeepLinkingService from 'modules/root/others/deeplinking.service';
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';

let CouponPopUpBg;
function CouponInAppMessageModal() {

    this.show = () => {};

    this.Modal = () => {

        const [isVisible, isVisibleSet] = useState(false);
        const [isMounted, isMountedSet] = useState(false);
        const [coupon, couponSet] = useState();
        const [notificationTitle, notificationTitleSet] = useState();
        const couponToastAnim = useRef(new Animated.Value(0)).current;

        const inAppPopup = useSelector(appSelectors.inAppPopupSelector);

        const [enableCouponsList] = useState(remoteConfig.getBoolean(RemoteConfigsConst.ENABLE_COUPONS_FEATURE));

        useEffect(() => {
            if (inAppPopup?.type === DeeplinkTypeConst.FREE_COUPON) {
                CouponInAppMessageModalService.setVisible({
                    show: true,
                    couponCode: inAppPopup?.data
                });
            }
        }, [inAppPopup]);


        useEffect(() => {

            if (!enableCouponsList) {
                return;
            }

            setTimeout(() => {
                (async () => {
                    const inAppPopup = await getInAppPopupToShowOnLaunch();
                    if (inAppPopup?.type === DeeplinkTypeConst.FREE_COUPON) {

                        CouponInAppMessageModalService.setVisible({
                            show: true,
                            couponCode: inAppPopup?.data
                        });

                        setInAppPopupToShowOnLaunch({});

                        DeepLinkingService.navigateToLink({
                            type: DeeplinkTypeConst.FREE_COUPON,
                            id: inAppPopup?.route_to_page,
                        });
                    }
                })();
            }, 2000);

            return CouponInAppMessageModalService.onSetVisible(({show, title, couponCode}) => {

                const inputs = new CouponAddInput();
                inputs.coupon = couponCode;
                inputs.deviceId = DeviceInfo.getUniqueId();
                CouponApi.applyCoupon(inputs)
                    .then((res) => {
                        couponSet(res?.coupon);
                        notificationTitleSet(title);

                        showModal(show);
                    })
                    .catch(console.warn);
            })
        }, [enableCouponsList]);


        const showModal = (show = true) => {
            if (!show) { // hide
                isVisibleSet(show);
                onHide();
            }
            else {

                if (!CouponPopUpBg) {
                    CouponPopUpBg = require('assets/images/CouponPopupBG.png');
                }

                isMountedSet(true);
                isVisibleSet(show);
            }
        };


        const onHide = () => {
            isVisibleSet(false);
            setTimeout(() => {
                isMountedSet(false);
                notificationTitleSet();
                couponSet();
            }, 100);
        };


        const onPressCoupon = () => {
            Clipboard.setString(coupon?.code);
            Animated.timing(
                couponToastAnim, {toValue: 1, duration: 250, useNativeDriver: true,}
            ).start();
            setTimeout(() => {
                Animated.timing(
                    couponToastAnim, {toValue: 0, duration: 250, useNativeDriver: true,}
                ).start();
            }, 1300)
        };


        const onPressCheckCoupons = () => {
            onHide();
            RootNavigation.push(MainStackNavsConst.COUPONS_LIST);
        }


        // To hide the glitch that appears on first onHide()
        if (!isMounted) {
            return (
                <></>
            )
        }


        return (
            <Modal
                onBackButtonPress={onHide}
                useNativeDriver={true}
                isVisible={isVisible}
                animationInTiming={100}
                animationOutTiming={100}
                backdropTransitionInTiming={100}
                backdropTransitionOutTiming={100}
                animationIn={"fadeIn"}
                animationOut={"fadeOut"}
                style={style.container}>
                <View style={style.content}>
                    <Image
                        source={CouponPopUpBg}
                        resizeMethod={'scale'}
                        style={style.background}/>
                    <View style={style.content2}>
                        <Animated.View style={[style.copiedCodeToast, {opacity: couponToastAnim}]}>
                            <View style={style.copyCodeView}>
                                <DzText style={style.copiedCodeText}>
                                    {I19n.t('لقد نسخت كود الكوبون')}
                                </DzText>
                            </View>
                        </Animated.View>
                        <View style={style.header}>
                            <Touchable onPress={onHide} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
                                <CloseIcon
                                    stroke={Colors.N_BLACK}
                                    width={20}
                                    height={20}/>
                            </Touchable>
                        </View>
                        <DzText style={style.welcomeBack}>
                            {notificationTitle || I19n.t('أهلاً بعودتك!')}
                        </DzText>
                        <View style={{height: 12}} />
                        <Touchable onPress={onPressCoupon} style={style.couponTouchBtn}>
                            <CouponsListItem coupon={coupon}
                                             isScaledDown={true}/>
                        </Touchable>
                        <View style={{height: 22}} />
                        <DzText style={style.midText}>
                            {I19n.t('إليك كوبون لتستمتع به!')}
                        </DzText>
                        <View style={{ width: '80%' }}>
                            <DzText style={[style.midText]}>
                                {I19n.t('لا تفوت الفرصة.')}
                            </DzText>
                        </View>
                        <View style={{flex: 1}}/>
                        <Button btnStyle={style.checkCouponsBtn}
                                onPress={onPressCheckCoupons}
                                text={I19n.t('تتبع كوبوناتك')} />
                    </View>
                </View>
            </Modal>
        );
    };
};


const useCouponInaAppMessageModal = () => {
    return new CouponInAppMessageModal();
};
export default useCouponInaAppMessageModal;
