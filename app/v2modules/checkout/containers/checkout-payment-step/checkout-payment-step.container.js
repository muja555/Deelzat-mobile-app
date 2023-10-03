import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';

import { checkoutPaymentStepContainerStyle as style } from './checkout-payment-step.container.style';
import { Button, ButtonOptions, Space } from 'deelzat/ui';
import I19n, { getLocale } from 'dz-I19n';
import { LayoutStyle, Spacing } from 'deelzat/style';
import { DzText, Touchable } from 'deelzat/v2-ui';
import SelectPaymentOption from 'v2modules/shared/components/select-payment-options/select-payment-options.component';
import { useDispatch, useSelector } from 'react-redux';
import { checkoutSelectors, checkoutThunks } from 'v2modules/checkout/stores/checkout/checkout.store';
import { trackSelectCheckoutPaymentMethod } from 'modules/analytics/others/analytics.utils';
import AddonsList from 'v2modules/shared/components/addons-list/addons-list.component';
import { geoSelectors } from 'v2modules/geo/stores/geo/geo.store';
import CouponField from 'v2modules/shared/components/coupon-field/coupon-field.component';
import { getTotalCartItemsPrice } from 'modules/cart/others/cart.utils';
import RowTitlePrice from 'v2modules/shared/components/row-title-price/row-title-price.component';
import { authSelectors } from 'modules/auth/stores/auth/auth.store';
import PaymentMethodsConst from 'v2modules/checkout/constants/payment-methods.const';
import ApplePayIcon from 'assets/icons/ApplePay.svg';
import AuthModalService from 'modules/auth/modals/auth/auth.modal.service';
import EVENT_SOURCE from 'modules/analytics/constants/analytics-event-source.const';
import { formatPrice } from 'v2modules/checkout/others/checkout.utils';
import { refreshSessionData } from 'v2modules/checkout/stores/checkout/checkout.thunks';
import useCreateOrderModal from "v2modules/page/modals/create-order/create-order.modal";
import AuthModal from 'modules/auth/modals/auth/auth.modal';
import { TextField } from 'deelzat/v2-form';


const CreateOrderModal = useCreateOrderModal();
const CheckoutPaymentStepContainer = (props) => {

    const {
        isFocused,
    } = props;

    const scrollViewRef = useRef();
    const paymentViewRef = useRef();
    const dispatch = useDispatch();

    const [paymentMethod, paymentMethodSet] = useState();
    const [specialRequest, specialRequestSet] = useState('');

    const currencyCode = useSelector(geoSelectors.currencyCodeSelector);

    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);
    const sessionInfo = useSelector(checkoutSelectors.sessionDataSelector);
    const coupon = useSelector(checkoutSelectors.couponSelector);
    const buyerInfo = useSelector(checkoutSelectors.buyerInfoSelector);
    const addonsList = useSelector(checkoutSelectors.addonsListSelector);
    const checkoutItems = useSelector(checkoutSelectors.checkoutItemsSelector);
    const [paymentViewY, paymentViewYSet] = useState(0);
    const checkoutItemsPrice = useMemo(() => getTotalCartItemsPrice(checkoutItems), [checkoutItems]);

    const wasSignOut = useRef(!isAuthenticated);

    // Refresh checkout data if sign in while on this page
    useEffect(() => {
        if (wasSignOut.current && isAuthenticated) {
            dispatch(refreshSessionData({}));
        }
    }, [isAuthenticated]);


    const onLayoutPaymentView = useCallback(({nativeEvent: {layout: {y}}}) => {
        paymentViewYSet(y);
    }, []);

    const onChangePaymentMethod = useCallback((value) => {
        paymentMethodSet(value);
        trackSelectCheckoutPaymentMethod(value, sessionInfo?.coupon, sessionInfo?.total_price);
    }, [sessionInfo]);


    const onChangeAddons = useCallback((updatedAddons) => {
        dispatch(checkoutThunks.refreshSessionData({addonsList: updatedAddons}));
    }, []);


    const onChangeCoupon = useCallback((coupon) => {
        dispatch(checkoutThunks.refreshSessionData({coupon}));
    }, []);


    const onChangeSpecialRequest = useCallback((_specialRequest) => {
        specialRequestSet(_specialRequest);
        dispatch(checkoutThunks.refreshSessionData({specialRequest: _specialRequest}));
    }, []);


    const checkoutItemsTotal = useMemo(() => {
        return getTotalCartItemsPrice(checkoutItems);
    }, [checkoutItems]);


    const onPressSignIn = () => {
        AuthModalService.setVisible({
            show: true,
            trackSource: {name: EVENT_SOURCE.CHECKOUT}
        })
    }


    const onPressCheckout = () => {

        const isValidPaymentInfo = paymentViewRef?.current?.isValid();

        if (!isValidPaymentInfo) {
            scrollViewRef.current?.scrollTo({y: paymentViewY - 60});

        }
        else {

            const submitPayment = paymentViewRef?.current?.submitPayment();
            CreateOrderModal.show(true, {
                submitPayment,
                paymentMethod,
            });
        }
    }

    if (!isFocused) {
        return <View style={style.container}/>
    }


    return (
        <View style={style.container}>
            <AuthModal />
            <CreateOrderModal.Modal />
            <ScrollView
                ref={scrollViewRef}
                keyboardShouldPersistTaps='handled'
                keyboardDismissMode={'on-drag'}
                showsVerticalScrollIndicator={false}
                behavior='padding'>
                <View onLayout={onLayoutPaymentView}
                      style={Spacing.HorizontalPadding}>
                    <View style={{height: 33}} />
                    <SelectPaymentOption ref={paymentViewRef}
                                         totalPrice={sessionInfo?.total_price}
                                         selectedOption={paymentMethod}
                                         coupon={coupon}
                                         buyerInfo={buyerInfo}
                                         onChangePaymentMethod={onChangePaymentMethod}/>
                </View>
                <View style={{height: 26}}/>
                <View style={style.separator} />
                <View style={{height: 24}}/>
                <View style={Spacing.HorizontalPadding}>
                    <AddonsList addonsList={addonsList}
                                currencyCode={currencyCode}
                                onChangeAddons={onChangeAddons}/>
                </View>
                <View style={{height: 10}}/>
                <View style={style.separator}/>

                <View style={{height: 10}}/>


                <View style={Spacing.HorizontalPadding}>
                    <TextField
                        placeholder={I19n.t('طلبات خاصة')}
                        value={specialRequest || ''}
                        keyboardType="default"
                        inputStyle={[
                            style.inputStyle,
                            style.inputAreaStyle]}
                        onChangeText={(text) => onChangeSpecialRequest(text || '')}
                        textArea={true}
                        viewStyle={style.inputAreaHeight}
                        multiline={true}
                        numberOfLines={10}/>
                </View>



                <View style={{height: 10}}/>
                <View style={style.separator}/>
                <View style={{height: 24}}/>
                <View style={Spacing.HorizontalPadding}>
                    <CouponField coupon={coupon}
                                 currencyCode={currencyCode}
                                 checkoutItemsPrice={checkoutItemsPrice}
                                 onChangeCoupon={onChangeCoupon}/>
                    <View style={{height: 31}}/>
                    <DzText style={style.orderInfoTxt}>
                        {I19n.t('فاتورة المشتريات')}
                    </DzText>
                    <RowTitlePrice title={I19n.t('المجموع الفرعي')}
                                   currencyCode={currencyCode}
                                   value={checkoutItemsTotal}/>
                    {
                        (addonsList || [])
                            .filter(addon => addon.isSelected)
                            .map((addon, index) => {
                                return (
                                    <RowTitlePrice key={addon.text + "_" + index}
                                                   title={addon[getLocale()]}
                                                   currencyCode={currencyCode}
                                                   value={addon.cost_value}/>
                                )
                            })
                    }
                    <RowTitlePrice title={I19n.t('التوصيل')}
                                   currencyCode={currencyCode}
                                   value={sessionInfo?.delivery_fees}/>
                    <View style={style.rowView}>
                        <DzText style={style.total}>
                            {I19n.t('المجموع')}
                        </DzText>
                        <DzText style={style.totalPrice}>
                            {formatPrice(sessionInfo?.total_price + sessionInfo?.discount, currencyCode)}
                        </DzText>
                    </View>
                    {
                        (sessionInfo?.discount > 0) &&
                            <>
                                <View style={style.rowView}>
                                    <DzText style={style.total}>
                                        {I19n.t('الخصم')}
                                    </DzText>
                                    <DzText style={style.totalPrice}>
                                        {formatPrice(sessionInfo?.discount, currencyCode)}
                                    </DzText>
                                </View>
                                <View style={style.rowView}>
                                    <DzText style={style.totalDiscount}>
                                        {I19n.t('المجموع بعد الخصم')}
                                    </DzText>
                                    <DzText style={style.totalPriceDiscount}>
                                        {formatPrice(sessionInfo?.total_price, currencyCode)}
                                    </DzText>
                                </View>
                            </>

                    }
                    <View style={{height: 34}}/>
                    <View style={LayoutStyle.Flex} />
                    {
                        (!isAuthenticated) &&
                        <Touchable onPress={onPressSignIn}
                                   style={LayoutStyle.AlignItemsCenter}>
                            <DzText style={style.signInText}>
                                {I19n.t("مهتم تعرف حالة طلبك وين صار ومتى بوصلك؟")}
                            </DzText>
                            <DzText style={style.signInText}>
                                {I19n.t('تتبع طلبك بسهولة عن طريق')}
                            </DzText>
                            <DzText style={style.signInTextBtn}>
                                {I19n.t('SIGNING_IN')}
                            </DzText>
                            <View style={{height: 34}}/>
                        </Touchable>
                    }
                </View>
            </ScrollView>
            <View style={Spacing.HorizontalPadding}>
                <Button
                    type={paymentMethod === PaymentMethodsConst.APPLE_PAY? ButtonOptions.Type.BLACK : ButtonOptions.Type.PRIMARY}
                    textStyle={style.checkoutBtnText}
                    btnStyle={style.checkoutBtn}
                    disabled={!sessionInfo}
                    text={paymentMethod !== PaymentMethodsConst.APPLE_PAY && I19n.t('تأكيد الطلب')}
                    iconEnd={paymentMethod === PaymentMethodsConst.APPLE_PAY && <ApplePayIcon width={100} height={46}/>}
                    onPress={onPressCheckout}/>
                <Space directions={'h'} size={'md'} />
            </View>
        </View>
    );
};

export default CheckoutPaymentStepContainer;
