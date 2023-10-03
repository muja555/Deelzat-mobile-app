import React, {useCallback, useImperativeHandle, useState} from 'react';
import {View, Text, Keyboard, Platform, KeyboardAvoidingView} from 'react-native';

import { selectPaymentOptionsStyle as style } from './select-payment-options.component.style';
import {
    getPaymentOptions,
} from "./select-payment-options.utils";
import {DzText, Panel, SelectValueList} from "deelzat/v2-ui";
import I19n from "dz-I19n";
import PaymentMethodsConst from "v2modules/checkout/constants/payment-methods.const";
import {trackFillCreditCardField} from "modules/analytics/others/analytics.utils";
import PaymentApi from "v2modules/checkout/apis/payment.api";
import {Colors} from "deelzat/style";
import {CardField, useApplePay, useStripe} from '@stripe/stripe-react-native';

const ContainerView = Platform.select({
    ios: KeyboardAvoidingView,
    android: View,
});

const SelectPaymentOption = React.forwardRef((props, ref) => {
    const {
        selectedOption,
        totalPrice = 0,
        buyerInfo = {},
        coupon,
        onChangePaymentMethod = (value) => {},
    } = props;

    const {createPaymentMethod, handleCardAction, retrievePaymentIntent} = useStripe();
    const {isApplePaySupported, presentApplePay, confirmApplePayPayment } = useApplePay();

    const [isError, isErrorSet] = useState(false);

    const [isCreditCardValid, isCreditCardValidSet] = useState(false);

    useImperativeHandle(ref, () => ({
        isValid: () => {
            let isValid = !!selectedOption;
            if (selectedOption === PaymentMethodsConst.CREDIT_CARD)
                isValid = isCreditCardValid;

            isErrorSet(!isValid)
            return isValid
        },
        submitPayment: handleSubmit,
        getPaymentMethod: () => selectedOption,
    }));

    const paymentOptions =  getPaymentOptions(isApplePaySupported);


    const onChange = (value) => {
        isErrorSet(false);
        const selected = value?.length > 0 && value[0].value;
        onChangePaymentMethod(selected);
    }

    const onChangeCreditCard = (cardInfo) => {

        const isValidNumber = cardInfo.validNumber === 'Valid';
        const isValidExpiry = cardInfo.validExpiryDate === 'Valid';
        const isValidCVC = cardInfo.validCVC === 'Valid';

        const isValid = isValidNumber && isValidExpiry && isValidCVC;

        isErrorSet(false);
        isCreditCardValidSet(isValid);
        trackFillCreditCardField(isValid);
    }


    const handleSubmit = () => {
        if (selectedOption === PaymentMethodsConst.APPLE_PAY) {
            return PaymentApi.payWithApple({
                chargeableTotal: totalPrice,
                presentApplePay,
                confirmApplePayPayment,
                retrievePaymentIntent,
            });
        } else if (selectedOption === PaymentMethodsConst.CREDIT_CARD && totalPrice > 0) {
            return PaymentApi.submitPayment(
                {
                    chargeableTotal: totalPrice,
                    billingInfo: buyerInfo,
                    createPaymentMethod,
                    handleCardAction,
                })
        } else {
            return "0000"
        }
    }


    return (
        <View>
            <DzText style={[style.sectionTitle, isError && style.sectionTitleError]}>
                {I19n.t('تفاصيل الدفع')}
            </DzText>
            <View style={{height: 24}} />
            <SelectValueList options={paymentOptions}
                             value={selectedOption? [paymentOptions.find(v => v.value === selectedOption)]: undefined}
                             onChange={onChange}
                             multi={false}
                             labelBy={'label'}
                             keyBy={'value'}
                             iconBy={'icon'}
                             radioStyle={style.radio}
                             radioMark={<View style={style.selectedMark}/>}/>
            {
                (selectedOption === PaymentMethodsConst.CREDIT_CARD) &&
                <ContainerView
                    // ref={view => Smartlook.registerBlacklistedView(view)}
                    onResponderGrant={Keyboard.dismiss}
                    onStartShouldSetResponder={() => true}>
                    <CardField
                        postalCodeEnabled={false}
                        autofocus={true}
                        placeholder={{
                            number: '4242 4242 4242 4242',
                            expiration: "MM/YY",
                            cvc: 'CVC'
                        }}
                        cardStyle={{
                            backgroundColor: '#FFFFFF',
                            textColor: '#000000',
                            borderColor: isError? Colors.ERROR_COLOR: Colors.GREY,
                            borderRadius: 12,
                            borderWidth: 1,
                        }}
                        style={[style.ccField, !isError && style.ccFieldError]}
                        onCardChange={onChangeCreditCard}
                    />
                </ContainerView>
            }
        </View>
    );
});

export default SelectPaymentOption;
