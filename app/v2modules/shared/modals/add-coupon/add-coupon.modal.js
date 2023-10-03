import React, { useState } from 'react';
import {View, Text, KeyboardAvoidingView, Platform} from 'react-native';
import Modal from "react-native-modal";
import I19n from "dz-I19n";

import { addCouponModalStyle as style } from './add-coupon.modal.style';
import {Button, ButtonOptions, Space} from "deelzat/ui";
import {TextField} from "deelzat/v2-form";
import CouponAddInput from "v2modules/checkout/inputs/coupon-add.input";
import DeviceInfo from "react-native-device-info";
import CouponApi from "v2modules/checkout/apis/coupon.api";
import {trackRedeemCouponFailed, trackRedeemCouponSuccess} from "modules/analytics/others/analytics.utils";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {DzText} from "deelzat/v2-ui";
import {useSelector} from "react-redux";
import {geoSelectors} from "v2modules/geo/stores/geo/geo.store";

function AddCouponModal() {

    this.show = () => {};

    this.Modal = (props) => {
        const {
            onChangeCoupon = () => {},
            checkoutItemsPrice = 0,
            trackSource,
        } = props;

        const insets = useSafeAreaInsets();
        const currencyCode = useSelector(geoSelectors.currencyCodeSelector);
        const [isVisible, isVisibleSet] = useState(false);
        const [couponText, couponTextSet] = useState('');
        const [errorMessage, errorMessageSet] = useState('');
        const [isLoading, isLoadingSet] = useState(false);

        this.show = (show = true, showOptions = {}) => {
            isVisibleSet(show);
        };


        const onHide = () => {
            isVisibleSet(false);
        };


        const onChangeText = (text) => {
            errorMessageSet('');
            couponTextSet(text);
        }


        const displayError = (message, amount) => {
            let _errorMessage = I19n.t('يرجى إدخال كود خصم صحيح وفعال');

            if (message === 'Min-Amount') {
                _errorMessage = I19n.t('لتستفيد من كود الخصم، الحد الأدنى للسلة هو') + ` ${amount} ${currencyCode}`
                    + I19n.t(', أضف إلى سلتك منتجات بقيمة') + ` ${(amount - checkoutItemsPrice)} ${currencyCode} ` + I19n.t('لتتمتع بالخصم');
            }
            else if (message === 'Expired Coupon') {
                _errorMessage = I19n.t('كود الخصم بك منتهي الصلاحية');

            } else if (message === 'Exceeded Max Uses') {
                _errorMessage = 'لا يمكن استعمال الكوبون مرة أخرى'
            }

            errorMessageSet(_errorMessage)
        }


        const onPressApply = () => {
            (async () => {

                isLoadingSet(true);

                try {

                    const inputs = new CouponAddInput();
                    inputs.coupon = couponText;
                    inputs.deviceId = DeviceInfo.getUniqueId();
                    const result = await CouponApi.applyCoupon(inputs);

                    if (result?.coupon?.min_amount > checkoutItemsPrice) {
                        const errorMsg = 'Min-Amount';
                        displayError(errorMsg, result?.coupon?.min_amount);
                        isLoadingSet(false);
                        trackRedeemCouponFailed(couponText, errorMsg, trackSource)
                    }
                    else {
                        trackRedeemCouponSuccess(couponText, trackSource)
                        onChangeCoupon(result.coupon);
                        isLoadingSet(false);
                        onHide();
                    }
                } catch (e) {
                    console.warn(e);
                    const message = e?.data?.full_messages?.length > 0? e?.data?.full_messages[0] : ''
                    displayError(message);

                    isLoadingSet(false);
                    trackRedeemCouponFailed(couponText, message, trackSource)
                }
            })()
        }

        return (
            <Modal
                onBackButtonPress={onHide}
                onBackdropPress={onHide}
                useNativeDriver={true}
                isVisible={isVisible}
                hideModalContentWhileAnimating={true}
                style={style.container}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'none'}
                                      style={style.content}>
                    <View style={Platform.OS === 'ios' && {paddingBottom: insets.bottom}}>
                        <DzText style={style.title}>
                            {I19n.t('إضافة كود خصم')}
                        </DzText>
                        <Space directions={'h'} size={'lg'}/>
                        <View>
                            <TextField value={couponText}
                                       inputStyle={errorMessage.length && style.inputError}
                                       returnKeyType="done"
                                       autoCapitalize="none"
                                       placeholder={I19n.t('كود الخصم')}
                                       onSubmitEditing={onPressApply}
                                       onChangeText={onChangeText}
                                       blurOnSubmit={true}/>
                        </View>
                        <Space directions={'h'} size={'md'}/>
                        <DzText style={style.couponError}>
                            {errorMessage}
                        </DzText>
                        <Space directions={'h'} size={'lg'}/>
                        <Button
                            onPress={onPressApply}
                            size={ButtonOptions.Size.LG}
                            type={ButtonOptions.Type.PRIMARY}
                            textStyle={style.applyBtnText}
                            btnStyle={style.applyBtn}
                            disabled={couponText.length === 0 || isLoading}
                            loading={isLoading}
                            text={I19n.t('تأكيد الخصم')}
                        />
                        <Space directions={'h'}/>
                        <Button
                            onPress={onHide}
                            btnStyle={style.cancelBtn}
                            type={ButtonOptions.Type.MUTED_OUTLINE}
                            text={I19n.t('إلغاء')}
                        />
                        <Space directions={'h'}/>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    };
};


const useAddCouponModal = () => {
    return new AddCouponModal();
};
export default useAddCouponModal;
