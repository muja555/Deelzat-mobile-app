import React, { useState, useEffect } from 'react';
import {View, Text, Image, SafeAreaView, ActivityIndicator, ScrollView} from 'react-native';

import { productSubmitStyle as style } from './product-submit.component.style';
import {useDispatch, useSelector} from "react-redux";
import {productSelectors, productThunks} from "modules/product/stores/product/product.store";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import DoneOutlineSvg from "assets/icons/DoneOutline.svg";
import DeleteSvg from 'assets/icons/Delete.svg';
import {Colors, LocalizedLayout} from "deelzat/style";
import ProductStoreInput from "modules/product/inputs/product-store.input";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import {shopSelectors, shopThunks} from "modules/shop/stores/shop/shop.store";
import ProductApi from "modules/product/apis/product.api";
import * as Sentry from "@sentry/react-native";
import ProductImageUploadStatusConst from "modules/product/constants/product-image-upload-status.const";
import {trackPostProductComplete} from "modules/analytics/others/analytics.utils";
import I19n, {isRTL} from 'dz-I19n';
import {shareApiError} from "modules/main/others/main-utils";
import MyProfileService from "v2modules/shop/containers/my-profile/my-profile.container.service";
import {DzText} from "deelzat/v2-ui";
import * as Actions from 'modules/shop/stores/shop/shop.actions';

const ProductPostStatus = {}
ProductPostStatus.WAITING_BEFORE_SUBMIT = 'WAITING_BEFORE_SUBMIT'
ProductPostStatus.SUBMITTING = 'SUBMITTING'
ProductPostStatus.SUBMIT_SUCCESS = 'SUBMIT_SUCCESS'
ProductPostStatus.SUBMIT_FAIL = 'SUBMIT_FAIL'


const ProductSubmit = (props) => {

    const {
        onHide = () => {},
        onPressGoToShop = () => {},
    } = props;

    const dispatch = useDispatch();

    const allFields = useSelector(persistentDataSelectors.fieldsSelector);
    const productState = useSelector(productSelectors.productStateSelector);
    const uploadedImages = useSelector(productSelectors.uploadedImagesStateSelector);
    const shopState = useSelector(shopSelectors.shopStateSelector);

    const [postProductStatus, postProductStatusSet] = useState(ProductPostStatus.WAITING_BEFORE_SUBMIT)
    const [uploadImagesStatus, uploadImagesStatusSet] = useState(ProductImageUploadStatusConst.UPLOADING)

    const imagesContent = uploadedImages.map((uploadedImage) => {

        const imageUrl = productState.images.find(image => uploadedImage.id === image.id)?.data.uri;

        return (
            <View key={uploadedImage.id} style={style.imageView}>
                <View style={style.imageUploadStatus}>
                    {
                        (uploadedImage.status === ProductImageUploadStatusConst.UPLOADING) &&
                        <ActivityIndicator color={'#fff'}/>
                    }
                    {
                        (uploadedImage.status === ProductImageUploadStatusConst.UPLOAD_SUCCESS) &&
                        <DoneOutlineSvg fill={'#fff'} height={20} width={20}/>
                    }
                    {
                        (uploadedImage.status === ProductImageUploadStatusConst.UPLOAD_FAIL) &&
                        <DeleteSvg fill={Colors.ORANGE_PINK} stroke={2} strokeColor={'#fff'} height={15} width={15}/>
                    }
                </View>
                <Image style={[style.image]} source={{uri: imageUrl}}/>
            </View>
        );
    });

    const submitProduct = () => {

        if (postProductStatus === ProductPostStatus.SUBMITTING)
            return;

        (async () => {
            try {
                postProductStatusSet(ProductPostStatus.SUBMITTING)

                const inputs = new ProductStoreInput();
                inputs.uploadedImages = uploadedImages;
                inputs.productState = productState;
                inputs.allFields = allFields;
                inputs.shopId = shopState.shopId;
                inputs.shopName = shopState.shop?.name || shopState.shopId;

                let result;
                if (productState.id) {
                    inputs.productId = productState.id;
                    result = await ProductApi.update(inputs);
                }
                else {
                   result = await ProductApi.add(inputs);
                    dispatch(Actions.SetAddedProduct(result?.data));
                }

                try {
                    trackPostProductComplete(productState, shopState);
                } catch (w) {
                    console.log(w);
                    Sentry.captureMessage("[Analytics-ERROR] add product success")
                    Sentry.captureException(w);
                }

                postProductStatusSet(ProductPostStatus.SUBMIT_SUCCESS)

                dispatch(shopThunks.loadShop({id: shopState.shopId}));
            }
            catch (e) {

                shareApiError(e, "create product");

                try {
                    trackPostProductComplete(productState, shopState, e?.data?.full_messages?.length > 0? JSON.stringify(e?.data?.full_messages) : "")
                } catch (w) {
                    console.log(w);
                    Sentry.captureMessage("[Analytics-ERROR] add product fail")
                    Sentry.captureException(w);
                }

                postProductStatusSet(ProductPostStatus.SUBMIT_FAIL)

                console.warn("post product error:", JSON.stringify(e));
                try {Sentry.captureException(e)} catch (x){}
                try {
                    let errorString;
                    if (e?.data?.full_messages?.length > 0) {
                        errorString = e?.data?.full_messages;
                    }
                    else if (e?.data) {
                        errorString = JSON.stringify(e?.data);
                    }
                    else {
                        errorString = JSON.stringify(e);
                    }
                    Sentry.captureMessage("[api-error] add product error: " + errorString)
                } catch (y){

                }
            }
        })();
    };


    useEffect(() => {

        if (uploadedImages.length && uploadedImages.filter(uI => uI.status === ProductImageUploadStatusConst.UPLOAD_SUCCESS).length === productState.images.length) {
            uploadImagesStatusSet(ProductImageUploadStatusConst.UPLOAD_SUCCESS)
            submitProduct()
        }
        else if (!!uploadedImages.find(uI => uI.status === ProductImageUploadStatusConst.UPLOAD_FAIL)) {
            uploadImagesStatusSet(ProductImageUploadStatusConst.UPLOAD_FAIL)
        }
    }, [uploadedImages])

    const resetSubmission = () => {
        postProductStatusSet(ProductPostStatus.WAITING_BEFORE_SUBMIT);
        uploadImagesStatusSet(ProductImageUploadStatusConst.UPLOADING);
        dispatch(productThunks.uploadImages());
    }

    const navigateToMyShop = () => {
        MyProfileService.refreshMyProfileStatus({withTimeout: true});
        onPressGoToShop();
    }

    const onPressCancel = () => {
        onHide()
        if (uploadImagesStatus === ProductImageUploadStatusConst.UPLOAD_FAIL) {
            dispatch(productThunks.uploadImages())
        }
    }

    return (
        <SafeAreaView style={style.container}>
            <ScrollView contentContainerStyle={style.content}>
                <DzText style={style.title}>{I19n.t('إتمام إضافة منتج')}</DzText>
                <Space size={'lg'}  directions={'h'}/>

                <View style={style.section}>
                    {
                        (uploadImagesStatus === ProductImageUploadStatusConst.UPLOADING) &&
                        <ActivityIndicator size="small" color={Colors.MAIN_COLOR} />
                    }
                    {
                        (uploadImagesStatus === ProductImageUploadStatusConst.UPLOAD_SUCCESS) &&
                        <DoneOutlineSvg fill={Colors.MAIN_COLOR} height={20} width={20} />
                    }
                    {
                        (uploadImagesStatus === ProductImageUploadStatusConst.UPLOAD_FAIL) &&
                        <DeleteSvg fill={Colors.ORANGE_PINK} stroke={2} strokeColor={'#fff'} height={15} width={15} />
                    }

                    <Space/>
                    <DzText style={style.sectionTitle}>{I19n.t('إضافة الصور')}</DzText>
                </View>
                <Space directions={'h'}/>
                <View style={style.images}>
                    {imagesContent}
                </View>
                <Space size={'lg'}  directions={'h'}/>
                <Space size={'lg'}  directions={'h'}/>

                <View style={style.section}>
                    {
                        ((postProductStatus === ProductPostStatus.WAITING_BEFORE_SUBMIT || postProductStatus === ProductPostStatus.SUBMITTING)
                            && uploadImagesStatus !== ProductImageUploadStatusConst.UPLOAD_FAIL) &&
                        <ActivityIndicator size="small" color={Colors.MAIN_COLOR} />
                    }
                    {
                        (postProductStatus === ProductPostStatus.SUBMIT_SUCCESS) &&
                        <DoneOutlineSvg fill={Colors.MAIN_COLOR} height={20} width={20} />
                    }
                    {
                        (postProductStatus === ProductPostStatus.SUBMIT_FAIL || uploadImagesStatus === ProductImageUploadStatusConst.UPLOAD_FAIL) &&
                        <DeleteSvg fill={Colors.ORANGE_PINK} stroke={2} strokeColor={'#fff'} height={15} width={15} />
                    }

                    <Space/>
                    <DzText style={style.sectionTitle}>{I19n.t('إضافة معلومات المنتج')}</DzText>
                </View>
                <Space size={'lg'}  directions={'h'}/>
                <Space size={'lg'}  directions={'h'}/>

                {
                    postProductStatus === ProductPostStatus.SUBMIT_SUCCESS &&
                    <>
                        <View style={style.successSection}>
                            <DzText style={style.successIcon}>🎉</DzText>
                            <Space size={'md'}  directions={'h'}/>
                            <DzText style={style.successTitle}>{I19n.t("مبروك") + '. ' + I19n.t('منتجك جاهز للبيع') + '!'}</DzText>
                            <Space size={'sm'}  directions={'h'}/>
                            <DzText>{I19n.t('شكراً لاستخدامك ديلزات')}</DzText>
                            <Space size={'md'}  directions={'h'}/>
                            <Space size={'md'}  directions={'h'}/>
                        </View>
                        <Button
                            onPress={navigateToMyShop}
                            type={ButtonOptions.Type.PRIMARY_OUTLINE}
                            text={I19n.t('الذهاب للمتجر')}
                        />
                    </>
                }
                {
                    (uploadImagesStatus === ProductImageUploadStatusConst.UPLOAD_FAIL || postProductStatus === ProductPostStatus.SUBMIT_FAIL) &&
                    <>
                        <View style={style.successSection}>
                            <DzText style={style.successIcon}>❌</DzText>
                            <Space size={'md'}  directions={'h'}/>
                            <DzText style={style.successTitle}>{I19n.t('حصل خطأ ما')}</DzText>
                            <Space size={'sm'}  directions={'h'}/>
                            <DzText style={{textAlign: 'center'}}>{I19n.t('يرجى التحقق من إتصالك بشبكة الانترنت والمحاولة مرة')}</DzText>
                            <Space size={'md'}  directions={'h'}/>
                            <Space size={'md'}  directions={'h'}/>
                        </View>
                        <Button
                            onPress={resetSubmission}
                            type={ButtonOptions.Type.PRIMARY_OUTLINE}
                            text={I19n.t('المحاولة مرة أخرى')}
                        />
                    </>
                }

                {
                    (postProductStatus !== ProductPostStatus.SUBMITTING && postProductStatus !== ProductPostStatus.SUBMIT_SUCCESS) &&
                    <View style={[style.exitView, {[isRTL()? 'right': 'left']: 16}]}>
                        <Button
                            onPress={onPressCancel}
                            type={ButtonOptions.Type.MUTED}
                            text={I19n.t('إلغاء')}
                        />
                    </View>
                }

                <Space directions={'h'} size={'lg'} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProductSubmit;
