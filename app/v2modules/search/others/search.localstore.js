import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchStoreConst = {};
SearchStoreConst.RECENT_SEARCH = "SearchStoreConst.RECENT_SEARCH";

const saveRecentSearch = async (recentSearch = []) => {
    try {
        const value = JSON.stringify(recentSearch);
        return AsyncStorage.setItem(SearchStoreConst.RECENT_SEARCH, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveRecentSearch as saveRecentSearch};


const getRecentSearch = async () => {
    try {
        const value = await AsyncStorage.getItem(SearchStoreConst.RECENT_SEARCH);
        return JSON.parse(value) || [];
    } catch (e) {
        console.warn(e);
        return Promise.reject(e);
    }
}
export {getRecentSearch as getRecentSearch};
