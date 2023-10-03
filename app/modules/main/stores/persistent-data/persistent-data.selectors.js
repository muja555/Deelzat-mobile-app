import { createSelector } from 'reselect';

const getPersistentDataState = (state) => state.persistentData;
export const persistentDataStateSelector = createSelector(getPersistentDataState, (persistentDataState) => persistentDataState);

export const persistentDataIsLoadingSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.loading);
export const persistentDataWasLoadedSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.loaded);

export const addonsListSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.addonsList)

export const citiesListSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.citiesList);
export const citiesByCountrySelector = (countryID) => (state) => state.persistentData.citiesList.filter(city => (!countryID  || city.country_id === countryID));
export const citiesByCountryCode = (countryCode) => (state) => {
    const countryID = state.persistentData.countriesList.find(country => (country.code === countryCode))?.objectID;
    if (countryID) {
        return state.persistentData.citiesList.filter(city => (city.country_id === countryID)) || [];
    }

    return [];
}

export const countriesListSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.countriesList);
export const shippableCountriesSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.shippableCountries);
export const countriesWithCodeSelector = (countryCode) => (state) => {
    const list = state.persistentData.countriesList.filter(country => (country.code === countryCode));
    return list.length > 0? list: state.persistentData.countriesList;
}

export const bannersSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.banners);

export const categoriesSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.categories);

export const subCategoriesSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.subCategories);

export const fieldsSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.fields);

export const activitiesSelector = createSelector(getPersistentDataState, (persistentData) => persistentData.activities);

export const trendingHomeSelector = createSelector(persistentDataStateSelector, (persistentData) => persistentData.trending?.filter(trend => trend.components.includes('home-page-trending')));

export const bundlesHomeSelector = createSelector(persistentDataStateSelector, (persistentData) => persistentData.bundles?.filter(trend => trend.components.includes('home-page-bundle')));

export const staticContentSelector = createSelector(persistentDataStateSelector, (persistentDataState) => persistentDataState.staticContent);
