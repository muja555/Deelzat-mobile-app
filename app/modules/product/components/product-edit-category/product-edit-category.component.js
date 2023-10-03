import React, {useState, useEffect, useCallback} from 'react';
import {View, Text, Image} from 'react-native';

import { productEditCategoryStyle as style } from './product-edit-category.component.style';
import {useDispatch, useSelector} from "react-redux";
import {productActions, productSelectors} from "modules/product/stores/product/product.store";
import ProductImagesEditList from "modules/product/components/product-images-edit-list/product-images-edit-list.component";
import ProductAddStepConst from "modules/product/constants/product-add-step.const";
import {FormStyle, LayoutStyle, LocalizedLayout} from "deelzat/style";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import ProductCategoryList from "modules/product/components/product-category-list/product-category-list.component";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import { Select } from "deelzat/ui";
import BackSvg from "assets/icons/ArrowRight.svg";
import {getProductTargets} from "modules/product/components/product-add/product-add.utils";
import {trackAddProductFieldFilled} from "modules/analytics/others/analytics.utils";
import I19n, {getLocale} from 'dz-I19n';
import {DzText} from "deelzat/v2-ui";

const ProductEditCategory = (props) => {

    const {
        onNext = () => {},
    } = props;

    const dispatch = useDispatch();
    const ProductTargetsOptions  = getProductTargets();

    const productState = useSelector(productSelectors.productStateSelector);
    const allSubCategories = useSelector(persistentDataSelectors.subCategoriesSelector);

    const [disabled, disabledSet] = useState(false);
    const [subCategoriesOptions, subCategoriesOptionsSet] = useState([]);

    const setSubCategoriesOptions = () => {
        const children = (productState.category.children || []).filter((item) => item !== false);
        const _subCategoriesOptions = children.map((item) => allSubCategories[item]);
        subCategoriesOptionsSet(_subCategoriesOptions);
    };

    const onSubCategorySelect = (subCategory) => {
        dispatch(productActions.SetData({
            subCategory: subCategory
        }));
        trackAddProductFieldFilled('sub_category', subCategory.title)
    };

    const onProductTargetSelect = (target) => {
        dispatch(productActions.SetData({
            target: target
        }));
        trackAddProductFieldFilled('target', target.title)
    };

    useEffect(()  => {
        setSubCategoriesOptions();
    }, [productState.category]);

    useEffect(()  => {
        if (subCategoriesOptions.length && !productState.subCategory) {
            disabledSet(true);
        }
        else if (productState.referenceCategory && productState.referenceCategory.has_target  && !productState.target) {
            disabledSet(true);
        }
        else {
            disabledSet(false);
        }
    }, [productState, subCategoriesOptions]);

    return (
        <View style={style.container}>
            <View style={LayoutStyle.Flex}>
                <DzText style={FormStyle.label}>{I19n.t('صور')}</DzText>
                <Space directions={'h'}/>
                <View style={style.imagesView}>
                    <ProductImagesEditList
                        onItemPress={() => {
                            onNext(ProductAddStepConst.IMAGES_EDIT)
                        }}
                        images={productState.images}/>
                </View>
                <Space directions={'h'}/>
                <DzText style={FormStyle.label}>{I19n.t('فئة رئيسية')}</DzText>
                <Space size={'md'} directions={'h'}/>
                <View style={style.mainCategoryView}>
                    <ProductCategoryList
                        horizontal={true}
                    />
                </View>
                {
                    !!(subCategoriesOptions.length) &&
                    <>
                        <Space size={'lg'} directions={'h'}/>
                        <DzText style={FormStyle.label}>{I19n.t('فئة فرعية')}</DzText>
                        <Space directions={'h'}/>
                        <Select
                            keyBy={'objectID'}
                            labelBy={getLocale()}
                            options={subCategoriesOptions}
                            value={productState.subCategory}
                            onChange={onSubCategorySelect}
                        />
                    </>
                }

                {
                    !!(productState.referenceCategory && productState.referenceCategory.has_target) &&
                    <>
                        <Space size={'lg'} directions={'h'}/>
                        <DzText style={FormStyle.label}>{I19n.t('الفئة')}</DzText>
                        <Space directions={'h'}/>
                        <Select
                            options={ProductTargetsOptions}
                            value={productState.target}
                            labelBy={'nickName'}
                            onChange={onProductTargetSelect}
                        />
                    </>
                }
            </View>
            <Space directions={'h'} size={'md'}/>
            <Button
                onPress={() => onNext(ProductAddStepConst.MAIN_INFO)}
                disabled={disabled}
                type={ButtonOptions.Type.PRIMARY}
                separated={true}
                icon={
                    <View style={LocalizedLayout.ScaleX()}>
                        <BackSvg fill={'#fff'} width={15} height={15}/>
                    </View>
                }
                text={I19n.t('التالي')}
            />
            <Space directions={'h'} size={'lg'}/>
        </View>
    );
};

export default ProductEditCategory;
