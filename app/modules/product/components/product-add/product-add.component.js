import React, {useEffect, useState} from 'react';
import {BackHandler, Platform, SafeAreaView} from 'react-native';

import {productAddStyle as style} from './product-add.component.style';
import ProductImagesEdit from "modules/product/components/product-images-edit/product-images-edit.component";
import {useDispatch, useSelector} from "react-redux";
import {getProductAddSteps} from "./product-add.utils";
import ProductAddStepConst from "modules/product/constants/product-add-step.const";
import ProductSelectCategoryModal from "modules/product/modals/product-select-category/product-select-category.modal";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

import {productActions, productSelectors} from "modules/product/stores/product/product.store";
import ProductEditCategory from "modules/product/components/product-edit-category/product-edit-category.component";
import ProductEditMainInfo from "modules/product/components/product-edit-main-info/product-edit-main-info.component";
import ProductEditHeader from "modules/product/components/product-edit-header/product-edit-header.component";
import ProductEditVariants from "modules/product/components/product-edit-variants/product-edit-variants.component";
import ProductEditPrices from "modules/product/components/product-edit-prices/product-edit-prices.component";
import {appActions} from "modules/main/stores/app/app.store";
import ConfirmService from "modules/main/others/confirm.service";
import {ButtonOptions} from "deelzat/ui";
import {
    trackAddProductChangeStep,
    trackExitAddProduct,
    trackInitiateAddProduct,
} from "modules/analytics/others/analytics.utils";
import I19n from 'dz-I19n';

const ProductAddSteps = getProductAddSteps();

const ProductAdd = (props) => {

    const {
        trackSource,
    } = props;

    const dispatch = useDispatch();
    const productState = useSelector(productSelectors.productStateSelector);

    const [isVisibleSelectModal, isVisibleSelectModalSet] = useState(false);
    const [step, stepSet] = useState(ProductAddStepConst.SELECT_CATEGORY);

    useEffect(() => {
        return () => {
            dispatch(productActions.ResetData());
        }
    }, []);

    const onExit = () => {
        trackExitAddProduct();
        RootNavigation.goBack();
    };

    const onNext = (newStep) => {
        stepSet(newStep);
    };

    const onBack = () => {
        const newStep = ProductAddSteps[ProductAddSteps.indexOf(step) - 1];
        if (newStep && newStep !== ProductAddStepConst.SELECT_CATEGORY) {
            stepSet(ProductAddSteps[ProductAddSteps.indexOf(step) - 1]);
        }

    };

    const confirmExit = () => {

        const actions = [
            {
                label: I19n.t('البقاء ومتابعة التعديل'),
                type: ButtonOptions.Type.PRIMARY,
                callback: () => {

                }
            },
            {
                label: I19n.t('الخروج وإنهاء التعديل'),
                type: ButtonOptions.Type.DANGER_OUTLINE,
                callback: () => setTimeout(onExit, Platform.OS === 'ios'? 400 : 0)
            },
        ];

        ConfirmService.confirm({
            actions: actions,
            message: I19n.t('هل انت متأكد انك تريد الخروج ؟')
        })
    };

    useEffect(() => {

        const hardwareBackPressHandler = () => {
            if (step === ProductAddStepConst.IMAGES_EDIT) {
                confirmExit();
            }
            else {
                onBack();
            }
            return true;
        };

        dispatch(appActions.SetSwipeEnabled(false));
        BackHandler.addEventListener('hardwareBackPress', hardwareBackPressHandler);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', hardwareBackPressHandler);
        }

    }, [step]);


    useEffect(() => {

        if(!productState.category) {
            stepSet(ProductAddStepConst.SELECT_CATEGORY);
        }
        else if(productState.images.length === 0) {
            stepSet(ProductAddStepConst.IMAGES_EDIT);
        }

    }, [productState]);


    useEffect(() => {

        if (step === ProductAddStepConst.SELECT_CATEGORY)
            isVisibleSelectModalSet(true);
        else {
            isVisibleSelectModalSet(false)
        }

        trackAddProductChangeStep(!!productState.id, step)
    }, [step])


    useEffect(() => {
        trackInitiateAddProduct(!!productState.id, trackSource)
        dispatch(productActions.SetData({
            trackSource: trackSource
        }));
    }, [])

    if (!productState) {
        return <></>;
    }

    const shouldBackgroundColorBlack = (step ===  ProductAddStepConst.IMAGES_EDIT) || (step ===  ProductAddStepConst.SELECT_CATEGORY)

    return (
        <SafeAreaView style={[style.container, {backgroundColor: shouldBackgroundColorBlack? 'black': 'white'}]}>
            {
                !((step ===  ProductAddStepConst.SELECT_CATEGORY) || (step ===  ProductAddStepConst.IMAGES_EDIT)) &&
                <ProductEditHeader
                    onBack={onBack}
                    stepIndex={ProductAddSteps.indexOf(step) + 1}
                    stepsCount={ProductAddSteps.length}
                    step={step}
                />
            }

            {
                (step ===  ProductAddStepConst.SELECT_CATEGORY && !productState.category) &&
                <ProductSelectCategoryModal
                    onCancel={onExit}
                    isVisible={isVisibleSelectModal}/>
            }

            {
                (step ===  ProductAddStepConst.IMAGES_EDIT || (step ===  ProductAddStepConst.SELECT_CATEGORY && !!productState.category)) &&
                <ProductImagesEdit onNext={onNext} onCancel={confirmExit}/>
            }

            {
                (step ===  ProductAddStepConst.EDIT_SUB_CATEGORY) &&
                <ProductEditCategory onNext={onNext}/>
            }

            {
                (step ===  ProductAddStepConst.MAIN_INFO) &&
                <ProductEditMainInfo onNext={onNext}/>
            }

            {
                (step ===  ProductAddStepConst.VARIANTS) &&
                <ProductEditVariants onNext={onNext}/>
            }

            {
                (step ===  ProductAddStepConst.PRICES) &&
                <ProductEditPrices onNext={onNext}/>
            }

        </SafeAreaView>
    );
};

export default ProductAdd;
