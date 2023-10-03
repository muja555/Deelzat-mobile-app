import { createAction } from "deelzat/store";

const SET_DATA_IS_LOADING = '[Persistent-Data] Set Data Is Loading';
export const SetDataIsLoading = createAction(
    SET_DATA_IS_LOADING
);

const SET_DATA_IS_LOADED = '[Persistent-Data] Set Data Is Loaded';
export const SetDataIsLoaded = createAction(
    SET_DATA_IS_LOADED
);

const SET_ADDONS_LIST = '[Persistent-Data] Set Addons List';
export const SetAddonsList = createAction(
    SET_ADDONS_LIST
);

const SET_CITIES_LIST = '[Persistent-Data] Set Cities List';
export const SetCitiesList = createAction(
    SET_CITIES_LIST
);

const SET_COUNTRIES_LIST = '[Persistent-Data] Set Countries List';
export const SetCountriesList = createAction(
    SET_COUNTRIES_LIST
);

const SET_CATEGORIES = '[Persistent-Data] Set Categories';
export const SetCategories = createAction(
    SET_CATEGORIES
);

const SET_SUB_CATEGORIES = '[Persistent-Data] Set Sub Categories';
export const SetSubCategories = createAction(
    SET_SUB_CATEGORIES
);

const SET_FIELDS = '[Persistent-Data] Set Fields';
export const SetFields = createAction(
    SET_FIELDS
);

const SET_STATIC_CONTENT = '[Persistent-Data] Set Static content';
export const SetStaticContent = createAction(
    SET_STATIC_CONTENT
);
