import React, { useState } from 'react';
import {View, Text, Image} from 'react-native';

import { floatingAddProductButtonStyle as style } from './floating-add-product-button.component.style';
import {Touchable} from "deelzat/v2-ui";
import {trackClickOnFloatingAddProduct} from "modules/analytics/others/analytics.utils";
import MainStackNavsConst from "v2modules/main/constants/main-stack-navs.const";
import I19n from 'dz-I19n';
import AuthRequiredModalService from "modules/auth/modals/auth-required/auth-required.modal.service";
import SIGNUP_SOURCE from "modules/analytics/constants/analytics-signup-source.const";
import {authSelectors} from "modules/auth/stores/auth/auth.store";
import {useSelector} from "react-redux";
import * as RootNavigation from 'v2modules/root/utils/root-navigation.helper';

let FloatingAddProduct;
const FloatingAddProductButton = (props) => {

    const {
        trackingPageName
    } = props;

    const isAuthenticated = useSelector(authSelectors.isAuthenticatedSelector);

    if (!FloatingAddProduct) {
        FloatingAddProduct = require("assets/icons/FloatingAddProductButton.png");
    }


    const navigateToAddProduct = () => {
        RootNavigation.push(MainStackNavsConst.ADD_PRODUCT, {trackSource: {name: trackingPageName}});
    }


    const onPress = () => {
        trackClickOnFloatingAddProduct(trackingPageName);

        if (!isAuthenticated) {
            AuthRequiredModalService.setVisible({
                message: I19n.t('أنشئ حساب لتتمكن من البيع عبر التطبيق وزيادة أرباحك'),
                onAuthSuccess: () => setTimeout(navigateToAddProduct, 500),
                trackSource: {
                    name: SIGNUP_SOURCE.POST_PRODUCT,
                }
            });
        }
        else {
            navigateToAddProduct();
        }
    }

    return (
        <Touchable activeOpacity={0.85}
                   onPress={onPress}
                   style={style.container}>
            <Image style={style.image} source={FloatingAddProduct} />
        </Touchable>
    );
};

export default FloatingAddProductButton;
