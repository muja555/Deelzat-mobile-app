import FileApi from "modules/file/apis/file.api";
import ImageUploadInput from "modules/file/inputs/image-upload.input";
import RNFS from 'react-native-fs';
import * as Sentry from "@sentry/react-native";
import * as Actions from "./product.actions";
import ProductImageUploadStatusConst from "modules/product/constants/product-image-upload-status.const";
import {
    trackUploadImagesFailed,
    trackUploadImagesStarted,
    trackUploadImagesSuccess
} from "modules/analytics/others/analytics.utils";

export const productTest = (payload) => {
    return (dispatch, getState) => {
        return Promise.resolve();
    }
};


export const uploadImages = () => {
    return async (dispatch, getState) => {

        dispatch(Actions.setUploadedImages([]));

        const productImages = getState().product?.images
        const uploadedImages = productImages.map(image => {
            return {
                id: image.id,
                remoteUrl: image.remoteUrl,
                status: ProductImageUploadStatusConst.UPLOADING
            }
        })
        dispatch(Actions.setUploadedImages(uploadedImages))

        trackUploadImagesStarted(productImages.length)

        const dispatchUploadedImages = (image) => {
            dispatch(Actions.setUploadedImages(getState().product.uploadedImages.map(i => {
                if (i.id === image.id) {
                    i.status = image.status
                    i.remoteUrl = image.remoteUrl
                }
                return i
            })));
        }

        const promises = []
        productImages.forEach(image => {
            promises.push(new Promise(async (resolve, reject) => {
                try {
                    if (!image.remote) {
                        const signedUrlResult = await FileApi.imageSignedUrlGet();
                        const inputs = new ImageUploadInput();
                        inputs.signedUrl = signedUrlResult.url;
                        inputs.base64 = await RNFS.readFile(image.data.uri, 'base64')
                        await FileApi.imageUpload(inputs);
                        image.remoteUrl = inputs.getImageUrl();
                    } else {
                        image.remoteUrl = image.data.uri;
                    }

                    dispatchUploadedImages({...image, status: ProductImageUploadStatusConst.UPLOAD_SUCCESS})
                    resolve(image)
                } catch (e) {

                    dispatchUploadedImages({...image, status: ProductImageUploadStatusConst.UPLOAD_FAIL})
                    reject({imageSource: image.imageSource, errorMsg: e?.message + ""})
                }
            }))
        })

        return Promise.all(promises)
            .then((results) => {
                trackUploadImagesSuccess(results.length)
            })
            .catch(({imageSource, errorMsg}) => {
                trackUploadImagesFailed(imageSource, errorMsg)
                try {
                    console.log("upload image error", errorMsg);
                    Sentry.captureMessage("upload image error: " + errorMsg)
                } catch (w) {
                }
            })
    }
};



