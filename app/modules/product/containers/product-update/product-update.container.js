import React, { useState, useEffect } from 'react';

import ProductAdd from "modules/product/components/product-add/product-add.component";
import { useRoute } from '@react-navigation/native';
import {useDispatch, useSelector} from "react-redux";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import {mapDataForUpdate} from "./product-update.container.utils";
import {productActions} from "modules/product/stores/product/product.store";
import WillShowToast from "deelzat/toast/will-show-toast";

const ProductUpdateContainer = () => {

    const route = useRoute();
    const dispatch = useDispatch();

    const categories = useSelector(persistentDataSelectors.categoriesSelector);
    const subCategories = useSelector(persistentDataSelectors.subCategoriesSelector);
    const fields = useSelector(persistentDataSelectors.fieldsSelector);

    const [productIsMapped, productIsMappedSet] = useState(false)

    const {
        product,
        trackSource,
    } = route.params;

    useEffect(() => {
        const data = mapDataForUpdate( {
            product,
            categories,
            subCategories,
            fields,
        });
        dispatch(productActions.SetProductData({...data}));
        productIsMappedSet(true);
    }, []);

    useEffect(() => {
        const data = mapDataForUpdate( {
            product,
            categories,
            subCategories,
            fields,
        });
        dispatch(productActions.SetProductData({...data}));
        productIsMappedSet(true);
    }, [categories, subCategories, fields]);

    return <>
        <WillShowToast id={'update-product'} />
        {
            productIsMapped &&
            <ProductAdd trackSource={trackSource}/>
        }
    </>
};

export default ProductUpdateContainer;
