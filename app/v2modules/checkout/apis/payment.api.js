import Http from "deelzat/http";
import store from "modules/root/components/store-provider/store-provider";
import AddressFieldNames from "v2modules/checkout/constants/address-field-names.const";

function getCurrency() {
    const state = store.getState();
    return state?.geo?.currencyCode || 'ILS';
}


function getGeoCountry() {
    const state = store.getState();
    return state?.geo?.geoCountryCode || 'PS';
}

function getBillingDetails(billingInfo) {
    return {
        name: billingInfo[AddressFieldNames.FIRST_NAME] + ' ' + billingInfo[AddressFieldNames.LAST_NAME],
        email: billingInfo[AddressFieldNames.EMAIL],
        phone: billingInfo[AddressFieldNames.MOBILE_NUMBER],
        addressCountry: billingInfo[AddressFieldNames.COUNTRY]?.code,
        addressCity: billingInfo[AddressFieldNames.CITY]?.en || billingInfo[AddressFieldNames.CITY]?.name
    };
}


const PaymentApi = {};

PaymentApi.getPaymentIntent = async ({amount, currency, paymentMethodId}) => {
    return Http.post('/app/payments/paymentIntent/', {
        payment_method: paymentMethodId,
        currency,
        amount
    })
};

PaymentApi.payWithApple = async ({
                                     chargeableTotal,
                                     presentApplePay,
                                     confirmApplePayPayment,
                                     retrievePaymentIntent
                                 }) => {
    return new Promise(async (resolve, reject) => {

        try {

            const {paymentMethod, error} = await presentApplePay({
                cartItems: [{label: 'Deelzat', amount: chargeableTotal.toFixed(2)}],
                country: getGeoCountry(),
                currency: getCurrency(),
            });

            if (paymentMethod?.id) {
                const paymentIntent = await PaymentApi.getPaymentIntent({
                    paymentMethodId: paymentMethod.id,
                    amount: chargeableTotal,
                    currency: getCurrency(),
                });

                const actionRes = await confirmApplePayPayment(paymentIntent.client_secret);
                const newPaymentIntent = await retrievePaymentIntent(paymentIntent.client_secret);


                if (actionRes?.error) {
                    reject(actionRes?.error);
                } else {
                    resolve(newPaymentIntent.paymentIntent?.id);
                }

            } else if (error) {
                reject(error);
            }

        } catch (e) {

            reject(e)
        }
    })
};

/**
 *  Returns paymentIntentId to be used in complete order
 */
PaymentApi.submitPayment = async ({chargeableTotal, billingInfo, createPaymentMethod, handleCardAction}) => {
    return new Promise(async (resolve, reject) => {
        try {

            const billingDetails = getBillingDetails(billingInfo);

            const { paymentMethod, error }  = await createPaymentMethod({
                type: 'Card',
                billingDetails
            });

            if (paymentMethod?.id) {

                const paymentIntent = await PaymentApi.getPaymentIntent({
                    paymentMethodId: paymentMethod.id,
                    amount: chargeableTotal,
                    currency: getCurrency(),
                });


                const actionRes = await handleCardAction(paymentIntent.client_secret, {  type: 'Card',
                    billingDetails});

                if (actionRes?.error) {
                    reject(actionRes?.error);
                } else {
                    resolve(actionRes?.paymentIntent?.id);
                }

            } else if (error) {
                reject(error);
            }

        } catch (e) {
            reject(e);
        }
    });
};


export default PaymentApi;
