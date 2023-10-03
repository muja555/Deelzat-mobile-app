import {isAndroid, requestPermission} from "./main-utils";
import {PERMISSIONS} from "react-native-permissions";
import ImagePicker from "react-native-image-crop-picker";
import {PermissionsAndroid, Platform} from "react-native";
import CameraRoll from "@react-native-community/cameraroll";
import RNFetchBlob from 'rn-fetch-blob';

const choseFromImageLibrary = (multipleSelection, imageQuality = 0.7) => {
    return (async () => {

        const granted = await requestPermission(
            isAndroid() ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE : PERMISSIONS.IOS.PHOTO_LIBRARY,
            'الوصول الى الوسائط',
            'ضروري من أجل الوصول الى الوسائط الخاصة بك لتتمكن من إضافة صور'
        ).catch(console.warn)

        if (!granted) {
            return Promise.reject();
        }

        let options = {
            mediaType: 'photo',
            multiple: multipleSelection,
            includeBase64: true,
            forceJpg: true,
            compressImageQuality: imageQuality,
        };

        return ImagePicker.openPicker(options);

    })();
};

export {choseFromImageLibrary as choseFromImageLibrary}


const MAX_IMAGE_WIDTH = 1280;
const IMAGE_QUALITY = 0.8;
const takeImage = async (cameraRef) => {

    const options = {base64: true, quality: IMAGE_QUALITY, width: MAX_IMAGE_WIDTH, fixOrientation: true, forceUpOrientation: true};

    return new Promise((resolve, reject) => {

        let permissionRequested = false
        const wait200 = new Promise((res) => setTimeout(res, Platform.OS === 'ios'? 200: 0));

        requestPermission(
            isAndroid() ? PERMISSIONS.ANDROID.CAMERA : PERMISSIONS.IOS.CAMERA,
            'الوصول الى الكاميرا',
            'نحتاج للأذونات من اجل تشغيل الكاميرا للالتقاط الصور'
        )
            .then(wait200)
            .then(requestPermission(
                isAndroid() ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE : PERMISSIONS.IOS.PHOTO_LIBRARY,
                'الوصول الى الكاميرا',
                'ضروري من أجل تخزين الصور الى الوسائط الخاصة بك لتتمكن من إضافة صور'
            ))
            .then(wait200)
            .then(() => cameraRef.current.takePictureAsync(options))
            .then(resolve)
            .catch(reject)
    });
}

export {takeImage as takeImage}


async function isAndroidHasPermissionToWrite() {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
        return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
}


const saveImageToGallery = (imageUrl) => {

    return (async () => {
        if (Platform.OS === "android" && !(await isAndroidHasPermissionToWrite())) {
            return Promise.reject();
        }

        const save = async (tag) => {
            await CameraRoll.save(tag, { type: "photo", album: "Deelzat" });
        }

        if (Platform.OS === "android") {

            RNFetchBlob.config({
                fileCache: true,
                appendExt: 'png',
            }).fetch('GET', imageUrl)
                .then(res => {
                    save(res.data)
                })
        }
        else {
            await save(imageUrl)
        }
    })();

}
export {saveImageToGallery as saveImageToGallery}
