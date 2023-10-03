import { createReducer, on } from "deelzat/store";
import * as Actions  from "./persistent-data.actions"
import persistentDataState from "./persistent-data.state";

const persistentDataReducer = createReducer(
    persistentDataState,
    [
        on(Actions.SetDataIsLoading, (state,  { payload } ) => {
            return {
                ...state,
                loading: payload
            };
        }),

        on(Actions.SetDataIsLoaded, (state,  { payload } ) => {
            return {
                ...state,
                loaded: payload
            };
        }),
        on(Actions.SetAddonsList, (state,  { payload } ) => {
            return {
                ...state,
                addonsList: payload
            };
        }),
        on(Actions.SetCitiesList, (state,  { payload } ) => {
            return {
                ...state,
                citiesList: payload
            };
        }),
        on(Actions.SetCountriesList, (state,  { payload } ) => {
            return {
                ...state,
                countriesList: payload,
                shippableCountries: (payload || []).filter(country => country.is_shippable)
            };
        }),
        on(Actions.SetCategories, (state,  { payload } ) => {
            return {
                ...state,
                categories: payload
            };
        }),
        on(Actions.SetSubCategories, (state,  { payload } ) => {
            return {
                ...state,
                subCategories: payload
            };
        }),
        on(Actions.SetFields, (state,  { payload } ) => {
            return {
                ...state,
                fields: payload
            };
        }),
        on(Actions.SetStaticContent, (state,  { payload } ) => {
            return {
                ...state,
                staticContent: payload
            };
        }),
    ]
)

export default persistentDataReducer;
