import { createReducer, on } from "deelzat/store";
import * as Actions  from "./checkout.actions"
import checkoutInitialState from "./checkout.state";
import { CheckoutStoreState } from 'v2modules/checkout/stores/checkout/checkout.state'

const checkoutReducer = createReducer(
    checkoutInitialState,
    [

        on(Actions.SetData, (state,  { payload } ) => {
            const defaultState = CheckoutStoreState();
            return {
                ...defaultState,
                addonsList: state.addonsList,
                ...payload
            };
        }),


        on(Actions.SetSessionData, (state,  { payload } ) => {
            return {
                ...state,
                session: payload
            };
        }),

        on(Actions.SetSavedAddress, (state,  { payload } ) => {
            return {
                ...state,
                selectedSavedAddress: payload
            };
        }),

        on(Actions.SetCoupon, (state,  { payload } ) => {
            return {
                ...state,
                coupon: payload
            };
        }),

        on(Actions.SetAddonsList, (state,  { payload } ) => {
            return {
                ...state,
                addonsList: payload
            };
        }),


        on(Actions.ResetData, (state,  { payload } ) => {
            return CheckoutStoreState();
        }),

    ]);

export default checkoutReducer;
