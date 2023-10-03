import CheckoutDataApi from 'v2modules/checkout/apis/checkout-data.api';
import * as Actions from './checkout.actions';
import GetCheckoutSessionInput from 'v2modules/checkout/inputs/get-checkout-session.input';
import { CheckoutStoreState } from 'v2modules/checkout/stores/checkout/checkout.state';
import { shareApiError } from 'modules/main/others/main-utils';
import * as Sentry from '@sentry/react-native';
import Toast from 'deelzat/toast';
import I19n from 'dz-I19n';


export const refreshSessionData = (withData: CheckoutStoreState) => {
    return (dispatch, getState) => {

        // Merge new changes
        const currentState = getState()?.checkout || {};
        const state = {...currentState, ...withData};
        dispatch(Actions.SetData(state));


        // Request new session info
        const inputs = new GetCheckoutSessionInput();

        inputs.specialRequest = state.specialRequest;
        inputs.addonsList = state.addonsList;
        inputs.coupon = state.coupon;
        inputs.buyerInfo = state.buyerInfo;
        inputs.shippingInfo = state.shippingInfo;

        if (state.cartId) {
            inputs.cartId = state.cartId;
        }
        else {
            inputs.checkoutItems = state.checkoutItems;
        }

        CheckoutDataApi.getCheckoutData(inputs)
            .then((_session) => {
                dispatch(Actions.SetSessionData(_session));
            })
            .catch((e) => {
                shareApiError(e, "[api-error] checkout step 1 error:");

                console.warn("[api-error] checkout step 1 error::", JSON.stringify(e));
                try {Sentry.captureException(e)} catch (x){}
                try {Sentry.captureMessage("[api-error] checkout step 1 error: " + JSON.stringify(e) )} catch (y){}

                Toast.danger(I19n.t('نعتذر حصل خطأ ما'));

            });


        return Promise.resolve();
    }
};
