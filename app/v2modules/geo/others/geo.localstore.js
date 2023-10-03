import AsyncStorage from '@react-native-async-storage/async-storage';

const GeoLocalStoreConst = {};
GeoLocalStoreConst.GEO_COUNTRY_CODE = "GEO.GEO_COUNTRY_CODE";
GeoLocalStoreConst.BROWSE_COUNTRY_CODE = "GEO.BROWSE_COUNTRY_CODE";

const saveBrowseCountryCode = async (browseCountryCode) => {
    try {
        return AsyncStorage.setItem(GeoLocalStoreConst.BROWSE_COUNTRY_CODE, browseCountryCode);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveBrowseCountryCode as saveBrowseCountryCode};

const getBrowseCountryCode = () => {
    try {
        return AsyncStorage.getItem(GeoLocalStoreConst.BROWSE_COUNTRY_CODE);
    } catch (e) {
        console.warn(e);
        return Promise.resolve(undefined);
    }
}
export {getBrowseCountryCode as getBrowseCountryCode};


const saveGeoCountryCode = async (geoCountryCode) => {
    try {
        return AsyncStorage.setItem(GeoLocalStoreConst.GEO_COUNTRY_CODE, geoCountryCode);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveGeoCountryCode as saveGeoCountryCode};

const getGeoCountryCode = () => {
    try {
        return AsyncStorage.getItem(GeoLocalStoreConst.GEO_COUNTRY_CODE);
    } catch (e) {
        console.warn(e);
        return Promise.resolve(undefined);
    }
}
export {getGeoCountryCode as getGeoCountryCode};
