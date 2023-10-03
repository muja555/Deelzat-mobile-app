import EndPoints from "environments/end-points";
import {openSettings, request as RNPermissionsRequest, RESULTS} from "react-native-permissions";
import {Alert, Dimensions, Linking, Platform, Share} from "react-native";
// import {ANALYTICS_PREFIX} from '@env';
import {getSelectedApiName} from "./app.localstore";
import RemoteConfigsConst from "modules/root/constants/remote-configs.const";
import I19n, { isRTL } from 'dz-I19n';
const url = require("url");
import branch from 'react-native-branch'
import { Colors } from 'deelzat/style';
import { remoteConfig } from 'modules/root/components/remote-configs/remote-configs.component';
import Keys from 'environments/keys';


export function isTestBuild() {
    return true;
}


const SCREEN_WIDTH = Dimensions.get('window').width;

export function getParameterByName(name, url) {
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function startChatOnWhatsapp(whatsAppNumber) {
    if (whatsAppNumber) {
        whatsAppNumber = whatsAppNumber.replace(/^00/,'').replace(/\D/g,'');
        const chatLink = `https://wa.me/${whatsAppNumber}`;
        (async () => {
            const supported = await Linking.canOpenURL(chatLink);
            if (supported) {
                return Linking.openURL(chatLink);
            }
        })();
    }
}


/**
 * Social tags {title, imageUrl, description}
 * @param type
 * @param id
 * @param socialTags
 * @returns {Promise<string>}
 */
export async function createDynamicLink(type, id, socialTags) {

    let linkProperties = {
        feature: 'share',
        channel: 'app'
    }

    const link = `${EndPoints.APP_LINK}?id=${id}&type=${type}`;
    let controlParams = {
        $og_title: socialTags.title,
        $og_description: '',
        $og_image_url: socialTags.imageUrl,
        $uri_redirect_mode: 1,
        $ios_uri_redirect_mode: 1,
        $android_uri_redirect_mode: 1
    }

    let branchUniversalObject = await branch.createBranchUniversalObject('canonicalIdentifier', {
        locallyIndex: true,
        title: socialTags.title,
        canonicalUrl: link,
        contentDescription: socialTags.title,
        contentImageUrl: socialTags.imageUrl,
    })

    let {url} = await branchUniversalObject.generateShortUrl(linkProperties, controlParams)

    return url;
}


export function requestPermission(permission, title, message) {
    return new Promise((resolve, reject) => {
        RNPermissionsRequest(
            permission,
            {
                title: title,
                message: message,
                buttonNeutral: I19n.t('إسألني لاحقاً'),
                buttonNegative: I19n.t('إلغاء'),
                buttonPositive: I19n.t('حسناً'),
            },
        ).then((results) => {
            if (results === RESULTS.GRANTED) {
                resolve(true);
            } else {
                showSettingsRequestDialog();
                reject();
            }
        }).catch(reject)
    });
}

export function showSettingsRequestDialog() {
    let buttons = [
        {
            text: I19n.t('لوقت آخر'),
            onPress: () => {}

        },
        {
            text: I19n.t('الذهاب إلى الإعدادات'),
            onPress: openSettings
        }
    ];
    if (Platform.OS === 'ios')
        buttons = buttons.reverse();

    Alert.alert('',I19n.t('الرجاء ضبط الإعدادات لتتمكن من إلتقاط/اختيار الصور'), buttons);
}

export function isAndroid() {
    return Platform.OS.toUpperCase() === 'ANDROID';
}


const shareText = (text, dialogTitle) => {
    return Share.share({
        url: text,
        message: Platform.OS !== 'ios' && text,
    }, {dialogTitle});
}
export {shareText as shareText}


const filterStringToNumbers = (input) => {
    if (input) {
        const filtered = input.replace(/[^0-9.]/g, '');
        const firstPointIndex = filtered.indexOf('.');
        return filtered.split('').map((char, index) => {
            if (((index === 0 && firstPointIndex === 0) || index > firstPointIndex)
                && char === '.')
                return '';
            else
                return char;
        }).join('');
    } else {
        return input;
    }
};

export {filterStringToNumbers as filterStringToNumbers};

/**
 *
 * @param imageUrl
 * @param containerWidth  0 => keep original image size
 * @returns {string|*}
 */
export function refactorImageUrl(imageUrl, containerWidth = 0) {
    if (!imageUrl) {
        return imageUrl;
    }

    const factorSize = containerWidth !== 1? Math.floor(containerWidth * 1.7): containerWidth;

    let postfix = '';
    //let postfix = 'tr=f-webp';
    if (containerWidth === 1) {
        postfix = `tr=w-1`;
    }
    else if (factorSize) {
        postfix = `tr=w-${factorSize}`;
       // postfix = `tr=w-${factorSize}`;
    }

    if (imageUrl?.includes('cdn.deelzat.com/users-images')) { // S3-Shop Images

        const urlPaths = imageUrl.split('/');
        const imageKey = urlPaths[urlPaths.length - 2] + '/' + urlPaths[urlPaths.length - 1];

        return `${EndPoints.IMAGE_KIT}/users-images/${imageKey}?${postfix}`;
    }
    else if (imageUrl.includes('deelzat.com')) { // S3-Products images

        const urlPaths = imageUrl.split('/');
        const imageKey = urlPaths[urlPaths.length - 1];

        const folder = containerWidth === SCREEN_WIDTH || !containerWidth? 'original':
            containerWidth === 1? 'avatar':
            (containerWidth > SCREEN_WIDTH / 3)? 'large': 'medium';

        return `${EndPoints.IMAGE_KIT}/${folder}/${imageKey}?${postfix}`;

    }
    else if (imageUrl?.includes('firebasestorage')) { // Firebase Groups images

        let imageKey = imageUrl
            .replace(':443', '')
            .replace(EndPoints.BASE_FIREBASE_STORAGE, '');

        return `${EndPoints.IMAGE_KIT}/firebasestorage/${imageKey}&${postfix}`;
    }
    else if (imageUrl.startsWith(EndPoints.SHOPIFY_CDN)) { // Shopify

        const urlSplit = imageUrl.split('?');
        let newUrl = urlSplit[0];

        return `${EndPoints.IMAGE_KIT}/shopify/${
            newUrl.replace(EndPoints.SHOPIFY_CDN, '')
        }?${postfix}`;
    }
    else if (imageUrl?.includes("fbsbx") && imageUrl?.includes("asid")) { // Facebook images

        const queryObject = url.parse(imageUrl, true).query;
        const fbId = queryObject.asid;
        return `https://graph.facebook.com/${fbId}/picture?width=${factorSize || 500}&access_token=${Keys.FB.appID}|${Keys.FB.clientAccessToken}`;
    }

    return imageUrl;
}


const compressString = (string) => {
    var LZUTF8 = require('lzutf8');
    return LZUTF8.compress(string, {outputEncoding: "StorageBinaryString"})
}

export {compressString as compressString}


const decompressString = (string) => {
    var LZUTF8 = require('lzutf8');
    return LZUTF8.decompress(string, {inputEncoding: "StorageBinaryString"})
}

export {decompressString as decompressString}

function isEmptyValues(value) {
    return value === undefined ||
        value === null ||
        value === NaN ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value?.trim().length === 0)
}

export {isEmptyValues as isEmptyValues}


export function isString(val) {
    return !!val && (typeof val === 'string' || val instanceof String)
}


export function isArraysEqual(arrayA, arrayB, keyBy) {
    return Array.isArray(arrayA) &&
        Array.isArray(arrayB) &&
        arrayA.length === arrayB.length &&
        arrayA.every((val, index) => {
            if (keyBy) {
                return val[keyBy] === arrayB[index][keyBy];
            }
            else {
                return val === arrayB[index];
            }
        });
}

export const wait = (millis) => new Promise((resolve) => setTimeout(resolve, millis));


export function shareApiError(e, title) {

    (async () => {
        try {
            if (isTestBuild() || await getSelectedApiName() === RemoteConfigsConst.API_DEV) {
                await shareText(JSON.stringify(e), title);
            }
        } catch (w) {

        }

    })();
}


function extendArabicLetters(string) {

    if (!isRTL()) {
        return string;
    }

    const isExtensionLetter = (letter) => {
        if (
            letter === 'ب' ||
            letter === 'ت' ||
            letter === 'ث' ||
            letter === 'ج' ||
            letter === 'ح' ||
            letter === 'خ' ||
            letter === 'س' ||
            letter === 'ش' ||
            letter === 'ص' ||
            letter === 'ض' ||
            letter === 'ط' ||
            letter === 'ع' ||
            letter === 'غ' ||
            letter === 'ف' ||
            letter === 'ق' ||
            letter === 'ك' ||
            letter === 'ل' ||
            letter === 'م' ||
            letter === 'ن' ||
            letter === 'ه' ||
            letter === 'ي')
        {
            return true;
        }
        return false;
    }

    let newString = '';
    for (let i = 0; i < string.length; i++) {

        const letter = string[i];
        newString = newString + letter;
        if (
            isExtensionLetter(letter) &&
            (i < string.length - 1 &&
                string[i + 1] !== ' ' &&
                (letter + string[i + 1]) !== 'لا' &&
                (letter + string[i + 1]) !== 'لأ' &&
                (letter + string[i + 1]) !== 'لإ'))
        {
            newString = newString + 'ــــــــ'
        }
    }

    return newString;
}
export {extendArabicLetters as extendArabicLetters}


function apprvNumbers (number) {
    try {
        const numberInt = parseInt(number);
        if (numberInt >= 1000) {
            const subNumber = Math.floor(number / 1000);
            return subNumber + 'k';
        }
    } catch (e) {

    }
    return number;
}
export {apprvNumbers as apprvNumbers}


export function getBtnStyleFrom(theme, isFilled = false) {
    if (theme) {
        return isFilled? {backgroundColor: theme.color2, borderColor: theme.color2}: {borderColor: theme?.color2};
    }
    else if (isFilled) {
        return {
            backgroundColor: Colors.MAIN_COLOR
        }
    }
}

export function getBtnTextStyleFrom(theme, isFilled = false) {
    if (theme) {
        return isFilled?
            {color: theme.color1 !== theme.color2? theme.color1: 'white'} :
            {color: theme.color2};
    }

    return {color: isFilled? 'white': Colors.MAIN_COLOR}
}


export function getThemeFromThemeId(themeId) {
    if (!themeId) {
        return ;
    }

    const themes = JSON.parse(remoteConfig.getValue(RemoteConfigsConst.PROFILE_THEMES).asString());
    return (themes || [])?.find(theme => theme.id === themeId);
}


/**
 * returns difference between dates in time units
 */
export function getDateDiff(date1, date2) {
    const result = {};
    const scale = {
        // year: 31536000,
        // month: 2592000,
        // week: 604800, // uncomment row to ignore
        // day: 86400,   // feel free to add your own row
        hour: 3600,
        minute: 60,
        second: 1
    };

    let d = Math.abs(date1 - date2) / 1000;
    Object.keys(scale).forEach(function(key){
        result[key] = Math.floor(d / scale[key]);
        d -= result[key] * scale[key];
    });

    return result;
}
