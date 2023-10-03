import * as Actions from './persistent-data.actions'
import PersistentDataApi from "modules/main/apis/persistent-data.api";
import AlgoliaIndicesConst from "modules/main/constants/algolia-indices.const";
import keyBy from "lodash/keyBy";
import CategoryApi from "modules/product/apis/category.api";
import {
    getSavedCategories,
    getSavedFields,
    getSavedSubCategories, saveCategories, saveFields, saveLastUpdateTime, saveSubCategories
} from "modules/main/others/persistent-data.localstore";

const populateFields = (fieldsHits) => {


    // Add 'ar' and 'en' field for options that doesn't has that.
    // So when component tries to read them it will find the value
    // Why: I haven't added them to Algolia as they don't need translation, ex: +6, XL..
    fieldsHits.forEach(item => {

        item.options?.forEach(option => {

            if (!option.ar) {
                option.ar = option.title;
            }

            if (!option.en) {
                option.en = option.title;
            }
        });
    });


    return keyBy(fieldsHits || [], 'objectID');
}


const getCategoriesAndSubs = (categoriesHits) => {

    const categories = categoriesHits.filter(item => item.type === 'main');

    let subCategoriesIds = [];
    categories.forEach((item) => {
        subCategoriesIds = subCategoriesIds.concat(item.children || []);
    });
    subCategoriesIds = subCategoriesIds.filter((item) => item !== false);

    let tempSubArr = categoriesHits.filter((item) => item.type === 'sub');
    const subCategories = keyBy(tempSubArr || [], 'objectID');

    return [categories, subCategories];
}


export const loadPersistentData = () => {
    return async (dispatch, getState) => {

        const loading = getState().persistentData.loading;
        const loaded = getState().persistentData.loaded;

        if (loading || loaded) {
            return Promise.resolve();
        }

        const loadDataFromCache = async () => {
            const categories = await getSavedCategories();
            const subCategories = await getSavedSubCategories();
            const fields = await getSavedFields();
            dispatch(Actions.SetCategories(categories));
            dispatch(Actions.SetSubCategories(subCategories));
            dispatch(Actions.SetFields(populateFields(fields)));
            dispatch(Actions.SetDataIsLoaded(true));
        }

        dispatch(Actions.SetDataIsLoading(true));

        // ** TESTING TEMP FOR NOW: (Offline data cache)
        // const cacheDuration = RemoteConfigsConst.DefaultValues[RemoteConfigsConst.PERSISTENT_DATA_CACHE_DURATION];
        // const lasUpdateTime = await getLastUpdateTime();
        const shouldRefreshCache = true;
        //const shouldRefreshCache = Date.now() - lasUpdateTime > cacheDuration;
        // console.log("persistent-data.thunks.js " + "cacheDuration", cacheDuration);
        // console.log("persistent-data.thunks.js " + "lasUpdateTime", lasUpdateTime);
        // console.log("persistent-data.thunks.js " + "Date.now() - lasUpdateTime", Date.now() - lasUpdateTime)
        // console.log("persistent-data.thunks.js " + "shouldRefreshCache", shouldRefreshCache);


        try {

            if (shouldRefreshCache) {
                CategoryApi.list()
                    .then((results) => {
                        const [categories, subCategories] = getCategoriesAndSubs(results);
                        dispatch(Actions.SetCategories(categories));
                        dispatch(Actions.SetSubCategories(subCategories));
                        saveCategories(categories);
                        saveSubCategories(subCategories);
                    })
                    .then(() => PersistentDataApi.getFields())
                    .then((fields) => {
                        dispatch(Actions.SetFields(populateFields(fields)));
                        dispatch(Actions.SetDataIsLoaded(true));

                        saveLastUpdateTime(Date.now());
                        saveFields(fields);
                    })
                    .catch((e) => {
                        console.warn(e);
                        loadDataFromCache();
                    });
            }
            else {
                loadDataFromCache();
            }


            const results = await PersistentDataApi.get();
            //TODO static JO until release
            const jordan = {
                "name": "Jordan",
                "code": "JO",
                "title": "الأردن",
                "ar": "الأردن",
                "en": "Jordan",
                "country_code": "+962",
                "is_shippable": true,
                "source_shipping_cost_type": "NONE",
                "source_shipping_cost_value": 0,
                "currency": "JOD",
                "is_active": true,
                "market_image": {
                    "ar": "https://firebasestorage.googleapis.com/v0/b/deelzat-76871.appspot.com/o/flags%2Fjo_en.jpg?alt=media&token=7bf3827d-e158-4c5d-855f-2787b49ca4d7",
                    "en": "https://firebasestorage.googleapis.com/v0/b/deelzat-76871.appspot.com/o/flags%2Fjo_en.jpg?alt=media&token=7bf3827d-e158-4c5d-855f-2787b49ca4d7"
                },
                "flag": "https://firebasestorage.googleapis.com/v0/b/deelzat-76871.appspot.com/o/flags%2FJordanFlag.jpg?alt=media&token=e317212f-c3c6-4989-a9f4-9504f8eab758",
                "objectID": "15115652001"
            };

            // todo GEO_TEMP
            // const enableMultiMarkets = isTestBuild();
            let cities = results[AlgoliaIndicesConst.NEW_CITIES];

            // if (enableMultiMarkets) {
            //     cities = cities.concat([
            //         {
            //             "name": "مدينة البرغر",
            //             "ar": "مدينة البرغر",
            //             "en": "Burger city",
            //             "destination_shipping_cost_type": "AMOUNT",
            //             "destination_shipping_cost_value": 20,
            //             "country_id": jordan.objectID,
            //             "objectID": "32271430443"
            //         },
            //         {
            //             "name": "مدينة غوثام",
            //             "ar": "مدينة غوثام",
            //             "en": "Gotham city",
            //             "destination_shipping_cost_type": "AMOUNT",
            //             "destination_shipping_cost_value": 15,
            //             "country_id": jordan.objectID,
            //             "objectID": "32271430444"
            //         }
            //     ]);
            // }
            dispatch(Actions.SetCitiesList(cities));


            const countries = results[AlgoliaIndicesConst.COUNTRIES];
            // if (enableMultiMarkets) {
            //     countries.push(jordan);
            // }

            dispatch(Actions.SetCountriesList(countries));

            dispatch(Actions.SetStaticContent(keyBy(results[AlgoliaIndicesConst.STATIC_CONTENT] || [], 'section')));

        }
        catch (e) {

            console.warn(e);
            dispatch(Actions.SetDataIsLoaded(false));
        }

        dispatch(Actions.SetDataIsLoading(false));
    }
}


export const loadAddons = () => {
    return async (dispatch, getState) => {

        PersistentDataApi.getAddons()
            .then((addons) => {
                dispatch(Actions.SetAddonsList(addons));
            })
            .catch(console.warn);

    }
}
