import AsyncStorage from '@react-native-async-storage/async-storage';
import RemoteConfigsConst from "modules/root/constants/remote-configs.const";

const AppLocalStoreConst = {};
AppLocalStoreConst.SELECTED_API_NAME = "SELECTED_API_NAME_3";
AppLocalStoreConst.IS_ONBOARDING_COMPLETE = "AppLocalStoreConst.IS_ONBOARDING_COMPLETE";
AppLocalStoreConst.DISPLAY_SPLASH = "DISPLAY_SPLASH";
AppLocalStoreConst.IN_APP_POPUP = "IN_APP_POPUP";


const saveSelectedApiName = async (selectedApiName) => {
    try {
        return AsyncStorage.setItem(AppLocalStoreConst.SELECTED_API_NAME, selectedApiName);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
};
export {saveSelectedApiName as saveSelectedApiName};

const getSelectedApiName = () => {
    try {
        return AsyncStorage.getItem(AppLocalStoreConst.SELECTED_API_NAME);
    } catch (e) {
        console.warn(e);
        return Promise.resolve(RemoteConfigsConst.API_PROD);
    }
}
export {getSelectedApiName as getSelectedApiName};

const setOnBoardingHasCompleted = () => {
    try {
        return AsyncStorage.setItem(AppLocalStoreConst.IS_ONBOARDING_COMPLETE, 'true');
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
}
export {setOnBoardingHasCompleted as setOnBoardingHasCompleted};


const isOnBoardingCompleted = async () => {
    try {
        const value = await AsyncStorage.getItem(AppLocalStoreConst.IS_ONBOARDING_COMPLETE);
        return value
    } catch (e) {
        console.warn(e);
        return Promise.reject(e);
    }
}
export {isOnBoardingCompleted as isOnBoardingCompleted};


const setDisplaySplashOnStart = (show) => {
    try {
        return AsyncStorage.setItem(AppLocalStoreConst.DISPLAY_SPLASH, show + '');
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
}
export {setDisplaySplashOnStart as setDisplaySplashOnStart};


const shouldDisplaySplashOnStart = async () => {
    try {
        const value = await AsyncStorage.getItem(AppLocalStoreConst.DISPLAY_SPLASH);
        return JSON.parse(value)
    } catch (e) {
        console.warn(e);
        return Promise.resolve(false);
    }
}
export {shouldDisplaySplashOnStart as shouldDisplaySplashOnStart};


const getInAppPopupToShowOnLaunch =  async () => {
    try {
        const value = await AsyncStorage.getItem(AppLocalStoreConst.IN_APP_POPUP);
        return JSON.parse(value);
    } catch (e) {
        return {};
    }
}
export {getInAppPopupToShowOnLaunch as getInAppPopupToShowOnLaunch};



const setInAppPopupToShowOnLaunch =  async (InAppPopup) => {
    try {
        const value = JSON.stringify(InAppPopup);
        return AsyncStorage.setItem(AppLocalStoreConst.IN_APP_POPUP, value);
    } catch (e){
        console.warn(e);
        return Promise.reject(e);
    }
}
export {setInAppPopupToShowOnLaunch as setInAppPopupToShowOnLaunch};
