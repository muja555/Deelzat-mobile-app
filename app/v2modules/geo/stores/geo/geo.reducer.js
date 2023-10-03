import { createReducer, on } from "deelzat/store";
import * as Actions  from "./geo.actions"
import geoInitialState from "./geo.state";

const geoReducer = createReducer(
    geoInitialState,
    [

        on(Actions.SetGeoCountryCode, (state,  { payload } ) => {
            return {
                ...state,
                geoCountryCode: payload
            };
        }),

        on(Actions.SetBrowseCountryCode, (state,  { payload } ) => {
            return {
                ...state,
                browseCountryCode: payload
            };
        }),

        on(Actions.SetAllowToShowSwitchMarket, (state,  { payload } ) => {
            return {
                ...state,
                allowToShowSwitchMarket: payload
            };
        }),

        on(Actions.SetCurrencyCode, (state,  { payload } ) => {
            return {
                ...state,
                currencyCode: payload
            };
        }),

    ]);

export default geoReducer;
