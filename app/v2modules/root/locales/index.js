import i18next from "i18next";
import intervalPlural from 'i18next-intervalplural-postprocessor';
import {getLocales} from 'react-native-localize';
import 'intl-pluralrules'

import ar from "v2modules/root/locales/lang/ar";
import en from "v2modules/root/locales/lang/en";
import { I18nManager } from 'react-native';

const isRTL = () => {
    return getLocale() === 'ar';
}
export {isRTL as isRTL}

const getLocale = () => {
    return I18nManager.getConstants().isRTL? 'ar': 'en';
}
export { getLocale as getLocale };


export function initLocale(withLocale) {
    return i18next
        .use(intervalPlural)
        .init({
            lng: withLocale,
            fallbackLng: 'en',
            keySeparator: false,
            resources: {
                en: {
                    translation: en,
                },
                ar: {
                    translation: ar,
                },
            }});
}


export default i18next;
