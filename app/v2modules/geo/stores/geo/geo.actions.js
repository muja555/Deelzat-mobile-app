import { createAction } from "deelzat/store";

const SET_GEO_COUNTRY_CODE = '[Geo] Set Geo Country Code';
export const SetGeoCountryCode = createAction(
    SET_GEO_COUNTRY_CODE
);

const SET_BROWSE_COUNTRY_CODE = '[Geo] Set Browse Country Code';
export const SetBrowseCountryCode = createAction(
    SET_BROWSE_COUNTRY_CODE
);


const SET_ALLOW_TO_SHOW_SWITCH_MARKET = '[Geo] Set Allow To Show Switch Market';
export const SetAllowToShowSwitchMarket = createAction(
    SET_ALLOW_TO_SHOW_SWITCH_MARKET
);

const SET_CURRENCY_CODE = '[Geo] Set Currency Code';
export const SetCurrencyCode = createAction(
    SET_CURRENCY_CODE
);
