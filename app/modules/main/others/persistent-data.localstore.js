import AsyncStorage from '@react-native-async-storage/async-storage';

const PersistentDataLocalStoreConst = {};
PersistentDataLocalStoreConst.CATEGORIES = "PersistentData.CATEGORIES";
PersistentDataLocalStoreConst.SUB_CATEGORIES = "PersistentData.SUB_CATEGORIES";
PersistentDataLocalStoreConst.FIELDS = "PersistentData.FIELDS";
PersistentDataLocalStoreConst.STATIC_CONTENT = "PersistentData.STATIC_CONTENT";
PersistentDataLocalStoreConst.LAST_UPDATE_TIME = "PersistentData.LAST_UPDATE_TIME";


const saveCategories = async (categories = []) => {
    try {
        const value = JSON.stringify(categories);
        return AsyncStorage.setItem(PersistentDataLocalStoreConst.CATEGORIES, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveCategories as saveCategories};

const getSavedCategories = async () => {
    try {
        const value = await AsyncStorage.getItem(PersistentDataLocalStoreConst.CATEGORIES);
        return JSON.parse(value);
    } catch (e) {
        //console.warn(e);
        return undefined;
    }
}
export {getSavedCategories as getSavedCategories};



const saveSubCategories = async (categories = []) => {
    try {
        const value = JSON.stringify(categories);
        return AsyncStorage.setItem(PersistentDataLocalStoreConst.SUB_CATEGORIES, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveSubCategories as saveSubCategories};

const getSavedSubCategories = async () => {
    try {
        const value = await AsyncStorage.getItem(PersistentDataLocalStoreConst.SUB_CATEGORIES);
        return JSON.parse(value);
    } catch (e) {
        //console.warn(e);
        return undefined;
    }
}
export {getSavedSubCategories as getSavedSubCategories};



const saveFields = async (fields = []) => {
    try {
        const value = JSON.stringify(fields);
        return AsyncStorage.setItem(PersistentDataLocalStoreConst.FIELDS, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveFields as saveFields};

const getSavedFields = async () => {
    try {
        const value = await AsyncStorage.getItem(PersistentDataLocalStoreConst.FIELDS);
        return JSON.parse(value);
    } catch (e) {
        //console.warn(e);
        return undefined;
    }
}
export {getSavedFields as getSavedFields};



const saveStaticContent = async (fields = []) => {
    try {
        const value = JSON.stringify(fields);
        return AsyncStorage.setItem(PersistentDataLocalStoreConst.STATIC_CONTENT, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveStaticContent as saveStaticContent};

const getSavedStaticContent = async () => {
    try {
        const value = await AsyncStorage.getItem(PersistentDataLocalStoreConst.STATIC_CONTENT);
        return JSON.parse(value);
    } catch (e) {
        //console.warn(e);
        return undefined;
    }
}
export {getSavedStaticContent as getSavedStaticContent};



const saveLastUpdateTime = async (lastUpdateTime = 0) => {
    try {
        const value = JSON.stringify(lastUpdateTime);
        return AsyncStorage.setItem(PersistentDataLocalStoreConst.LAST_UPDATE_TIME, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveLastUpdateTime as saveLastUpdateTime};

const getLastUpdateTime = async () => {
    try {
        const value = await AsyncStorage.getItem(PersistentDataLocalStoreConst.LAST_UPDATE_TIME);
        return JSON.parse(value);
    } catch (e) {
        console.warn(e);
        return 0;
    }
}
export {getLastUpdateTime as getLastUpdateTime};
