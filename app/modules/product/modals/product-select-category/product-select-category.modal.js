import React, { useState } from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import Modal from "react-native-modal";

import { productSelectCategoryModalStyle as style } from './product-select-category.modal.style';
import ProductCategoryList from "modules/product/components/product-category-list/product-category-list.component";
import {Button, ButtonOptions, Space} from "deelzat/ui";
import I19n from 'dz-I19n';
import {DzText} from "deelzat/v2-ui";

const ProductSelectCategoryModal = (props) => {

    const {
        isVisible = false,
        onCancel = () => {}
    } = props;


    return (
        <Modal
            onBackButtonPress={onCancel}
            onBackdropPress={onCancel}
            useNativeDriver={true}
            isVisible={isVisible}
            style={style.container}>
            <SafeAreaView style={style.modalBody}>
                <View style={style.titleView}>
                    <DzText style={style.title}>{I19n.t('ضمن أي فئة منتجك؟')}</DzText>
                </View>
                <ProductCategoryList
                    itemStyle={{flex: 1, marginBottom: 20}}
                    numColumns={3}
                />
                <View style={style.btnView}>
                    <Button
                        onPress={onCancel}
                        type={ButtonOptions.Type.MUTED}
                        text={I19n.t('إلغاء')}
                    />
                </View>
                <Space directions={'h'}/>
            </SafeAreaView>
        </Modal>
    );
};

export default ProductSelectCategoryModal;
