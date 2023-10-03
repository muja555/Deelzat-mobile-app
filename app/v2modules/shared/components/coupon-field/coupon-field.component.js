import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {couponFieldStyle as style} from "./coupon-field.component.style";
import {DzText, Touchable} from "deelzat/v2-ui";
import I19n from "dz-I19n";
import CouponIcon from "assets/icons/Coupon.svg";
import {Space} from "deelzat/ui";
import {Colors} from "deelzat/style";
import useAddCouponModal from "v2modules/shared/modals/add-coupon/add-coupon.modal";
import {trackOnDeleteCoupon} from "modules/analytics/others/analytics.utils";
import CouponTypeConst from "v2modules/checkout/constants/coupon-type.const";
import {calculateCouponDiscount} from "v2modules/checkout/others/checkout.utils";
import SuccessIcon from "assets/icons/DoneOutline.svg";
import EVENT_SOURCE from "modules/analytics/constants/analytics-event-source.const";
import CouponApi from 'v2modules/checkout/apis/coupon.api';
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';
import MainStackNavsConst from 'v2modules/main/constants/main-stack-navs.const';
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import RemoteConfigsConst from 'modules/root/constants/remote-configs.const';

const trackSource = {name: EVENT_SOURCE.CHECKOUT};
const AddCouponModal = useAddCouponModal();
const CouponField = (props) => {
    const {
        coupon,
        checkoutItemsPrice = 0,
        onChangeCoupon = (coupon) => {},
        currencyCode = '',
    } = props;


    const [enableCouponsList] = useState(remoteConfig.getBoolean(RemoteConfigsConst.ENABLE_COUPONS_FEATURE));


    const [availableCoupons, availableCouponsSet] = useState([]);

    useEffect(() => {
        CouponApi.getCoupons()
            .then(res => {
                let _list = res?.coupons || [];
                _list = _list.filter(coupon => {
                    const thisDate = new Date();
                    const endDate = new Date(coupon.end_date);
                    return thisDate < endDate;
                });
                availableCouponsSet(_list);
            })
            .catch(console.warn);
    }, [coupon]);


    const onPressAddCouponFromList = () => {
        RootNavigation.push(MainStackNavsConst.COUPONS_LIST, {isSelectingCheckoutMode: true, preList: availableCoupons});
    }

    const onPressField = () => {
        AddCouponModal.show(true);
    }


    const onPressDelete = () => {
        trackOnDeleteCoupon(coupon?.code, trackSource);
        onChangeCoupon();
    }


    const discountText = () => {
        if (coupon.type === CouponTypeConst.FREE_DELIVERY) {
            return I19n.t("لقد حصلت على توصيل مجاني") +  '   🎉'
        } else {
            const amount = calculateCouponDiscount(checkoutItemsPrice, coupon, true);
            return  I19n.t("لقد قمت بتوفير") + ' ' + amount  + ` ${currencyCode} ` +   "\u200F" +(coupon.type === CouponTypeConst.PERCENTAGE_DISCOUNT? ` (${coupon?.discount}%)`: '') + " 🎉"
        }
    }


    return  (
        <View>
            <AddCouponModal.Modal
                trackSource={trackSource}
                checkoutItemsPrice={checkoutItemsPrice}
                onChangeCoupon={onChangeCoupon} />
            {
                (!coupon) &&
                    <>
                        <DzText style={style.gotCouponTitle}>
                            {I19n.t('هل تمتلك كود خصم؟')}
                        </DzText>
                        <Space directions={'h'} size={['sm']}/>
                        <Touchable style={style.addCouponView}
                                   onPress={onPressField}>
                            <CouponIcon style={style.smallCouponIcon}/>
                            <Space directions={'v'} size={'md'}/>
                            <DzText style={style.enterCoupon}>
                                {I19n.t('أدخل كود الخصم')}
                            </DzText>
                        </Touchable>
                        {
                            (enableCouponsList) &&
                            <Touchable style={{ flex: 1, justifyContent: 'flex-end', opacity: availableCoupons.length? 1: 0}}
                                       hitSlop={{ top: 10, bottom: 10, left: 20, right: 20 }}
                                       disabled={!availableCoupons?.length}
                                       onPress={onPressAddCouponFromList}>
                                <DzText style={style.availableCoupons}>
                                    {(availableCoupons?.length > 0) ? I19n.t('الكوبونات المتوفرة'): 'TEMP'}
                                </DzText>
                            </Touchable>
                        }
                    </>
            }
            {
                (coupon) &&
                <View style={style.couponSummary}>
                    <View style={style.iconContainer}>
                        <SuccessIcon width={30} height={30} fill={Colors.MAIN_COLOR}/>
                    </View>
                    <View style={style.textsContainer}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <DzText style={style.title}>
                                {I19n.t("تم إضافة كود الخصم")}
                            </DzText>
                            <TouchableOpacity style={style.deleteButton}
                                              activeOpacity={0.8}
                                              onPress={onPressDelete}>
                                <DzText style={style.deleteText}>
                                    {I19n.t("حذف")}
                                </DzText>
                            </TouchableOpacity>
                        </View>
                        <DzText style={style.couponText}>
                            {I19n.t('كود الخصم') +  ":"  + " " + coupon.code}
                        </DzText>
                        <DzText style={style.discountText}>
                            {discountText()}
                        </DzText>
                    </View>
                </View>
            }
        </View>
    );
};

export default CouponField;
