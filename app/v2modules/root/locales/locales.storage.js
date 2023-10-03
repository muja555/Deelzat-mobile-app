import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocale } from 'dz-I19n';


const LocalesStorage = {};
LocalesStorage.LOCALE = "LocalesStorage.LOCALES";

const saveLanguageLocale = async (locale) => {
    try {
        return AsyncStorage.setItem(LocalesStorage.LOCALE, locale);
    } catch (e){
        console.warn(e);
        return Promise.resolve();
    }
};
export {saveLanguageLocale as saveLanguageLocale};

const getLanguageLocale = async () => {

    let defaultLocale = getLocale();
    try {
        return await AsyncStorage.getItem(LocalesStorage.LOCALE) || defaultLocale;
    } catch (e) {
        console.warn(e);
        return Promise.resolve(defaultLocale);
    }

}
export {getLanguageLocale as getLanguageLocale};
