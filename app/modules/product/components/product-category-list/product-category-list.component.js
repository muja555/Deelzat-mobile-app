import React, {useCallback, useEffect, useRef} from 'react';
import {FlatList, Platform} from 'react-native';

import { productCategoryListStyle as style } from './product-category-list.component.style';
import ProductCategoryItem from "modules/product/components/product-category-item/product-category-item.component";
import {useDispatch, useSelector} from "react-redux";
import {persistentDataSelectors} from "modules/main/stores/persistent-data/persistent-data.store";
import {productActions, productSelectors} from "modules/product/stores/product/product.store";
import {trackAddProductFieldFilled} from "modules/analytics/others/analytics.utils";
import {isRTL} from "dz-I19n";

const ProductCategoryList = (props) => {

    const {
        itemStyle = {},
        ...rest
    } = props;

    const dispatch = useDispatch();

    const categories = useSelector(persistentDataSelectors.categoriesSelector);
    const productCategory = useSelector(productSelectors.productCategorySelector);
    const categoriesListRef = useRef();

    const scrollToSelectedCategory = () => {

        const wait = new Promise((resolve) => setTimeout(resolve, 500));
        wait.then(()=> {
            if (productCategory) {
                let categoryIndex = categories.findIndex(
                    (obj) => obj.objectID === productCategory.objectID,
                );

                if (isRTL() && Platform.OS === 'ios') {
                    categoryIndex =  categories.length - 1 - categoryIndex;
                }

                if (categoryIndex >= 0) {
                    try {
                        categoriesListRef?.current?.scrollToIndex({
                            animated: false,
                            index:  categoryIndex,
                            viewPosition: 0.5,
                        });
                    } catch (e) {

                    }
                }
            }
        });
    }

    useEffect(() => {
        scrollToSelectedCategory()
    }, [])


    const renderItem = useCallback(({item, index}) => {

        const onCategorySelect = (category) => {
            dispatch(productActions.SetData({
                category: category,
                subCategory: null,
                target: null,
            }));
            trackAddProductFieldFilled('category', category.title)
        };

        return (
            <ProductCategoryItem  selected={productCategory}
                                  itemStyle={itemStyle}
                                  category={item}
                                  onPress={onCategorySelect} />
        )
    }, [productCategory]);


    return (
        <FlatList
            ref={categoriesListRef}
            style={style.container}
            data={categories}
            renderItem={renderItem}
            keyExtractor={item => item.objectID}
            showsHorizontalScrollIndicator={false}
            initialNumToRender={categories.length}
            { ...rest}
        />
    );
};

export default ProductCategoryList;
