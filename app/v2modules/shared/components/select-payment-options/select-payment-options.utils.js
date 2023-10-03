import PaymentMethodsConst from "v2modules/checkout/constants/payment-methods.const";
import I19n from "dz-I19n";
import React from 'react';
import CreditCardIcon from "assets/icons/CreditCard.svg";
import CashIcon from "assets/icons/Cash.svg";
import ApplePayIcon from "assets/icons/ApplePayBlack.svg";

const PaymentOptionsConfig = {};

PaymentOptionsConfig[PaymentMethodsConst.CASH_ON_DELIVERY] = {
    value: PaymentMethodsConst.CASH_ON_DELIVERY,
    label: I19n.t('الدفع عند الاستلام'),
    icon: <CashIcon width="24" height="24" />

}
PaymentOptionsConfig[PaymentMethodsConst.CREDIT_CARD] = {
    value: PaymentMethodsConst.CREDIT_CARD,
    label: I19n.t('الدفع ببطاقة إئتمانية'),
    icon: <CreditCardIcon width="24" height="24" />
}
PaymentOptionsConfig[PaymentMethodsConst.APPLE_PAY] = {
    value: PaymentMethodsConst.APPLE_PAY,
    label: I19n.t(''),
    icon: <ApplePayIcon  width="50" height="50" />

}


export const getPaymentOptions = (isApplePaySupported) => {

    const options = [
        PaymentOptionsConfig[PaymentMethodsConst.CASH_ON_DELIVERY]
    ];

    if (isApplePaySupported) {
        options.push(PaymentOptionsConfig[PaymentMethodsConst.APPLE_PAY]);
    }

    options.push(PaymentOptionsConfig[PaymentMethodsConst.CREDIT_CARD]);

    return options;
};
